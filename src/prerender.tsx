/*
 * Writes dist/: one static document per locale, plus the fingerprinted stylesheet and boot script
 * they reference. Nothing is rendered in the browser, so a crawler, a link preview and a visitor
 * with JavaScript off all get the finished page.
 *
 * Run through `scripts/build.mjs`, which bundles this file for Node first.
 */

import {execFileSync} from 'node:child_process';
import {cp, mkdir, rm, writeFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {build, type BuildOptions} from 'esbuild';
import {LOCALES, ROOT_LOCALE, pathForLocale, type Locale} from './i18n/locale';
import {manifests} from './manifest';
import {renderPage} from './render';
import {renderSitemap} from './sitemap';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const ASSETS = join(DIST, 'assets');

/** Long-cached under nginx's immutable rule, so the name has to change whenever the bytes do. */
const FINGERPRINTED: BuildOptions = {
  bundle: true,
  minify: true,
  outdir: ASSETS,
  entryNames: '[name]-[hash]',
  metafile: true,
  logLevel: 'error',
};

/** The public href of the single file an esbuild run emitted. */
async function bundleAsset(options: BuildOptions): Promise<string> {
  const result = await build({...FINGERPRINTED, ...options});
  const outputs = Object.keys(result.metafile?.outputs ?? {});
  const file = outputs.find((path) => !path.endsWith('.map'));

  if (!file) throw new Error(`no output emitted for ${options.entryPoints}`);

  return `/${file.slice(file.indexOf('assets/'))}`;
}

/**
 * The day the site itself last changed, as `sitemap.xml` reports it — the last commit touching what
 * gets served, so a README edit or a CI tweak does not tell every crawler to come back.
 *
 * Nothing when git cannot answer: a shallow clone, a tarball, a directory that was never a
 * repository. A date invented at build time would be wrong every time the site did not change, and a
 * `lastmod` that is wrong that often is one a crawler learns to skip.
 */
function lastContentChange(): string | undefined {
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', 'src', 'public'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();

    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined;
  } catch {
    return undefined;
  }
}

async function prerender(): Promise<void> {
  await rm(DIST, {recursive: true, force: true});
  await mkdir(ASSETS, {recursive: true});

  // Everything in public/ is served verbatim: icons, the preview card, robots.txt. The manifests
  // and sitemap.xml are written below instead — both are derived from the locale list, and a copy
  // kept by hand is a copy that eventually disagrees with it.
  await cp(join(ROOT, 'public'), DIST, {recursive: true});

  const [stylesheet, script, metricsScript] = await Promise.all([
    bundleAsset({entryPoints: [join(ROOT, 'src/styles.css')]}),
    bundleAsset({
      entryPoints: [join(ROOT, 'src/boot.ts')],
      // Classic script, not a module: modules are deferred, and the locale redirect has to decide
      // before the browser paints a page it may be about to leave.
      format: 'iife',
      target: ['es2019'],
    }),
    bundleAsset({
      entryPoints: [join(ROOT, 'src/metrics.ts')],
      // Separate from the boot script rather than folded into it: this one is deferred, and putting
      // a chart in front of first paint to save a request would be the wrong trade twice over.
      format: 'iife',
      target: ['es2020'],
    }),
  ]);

  await Promise.all(
    LOCALES.map(async (locale: Locale) => {
      const file = join(DIST, pathForLocale(locale), 'index.html');
      if (locale !== ROOT_LOCALE) await mkdir(dirname(file), {recursive: true});
      await writeFile(file, renderPage(locale, {stylesheet, script, metricsScript}), 'utf8');
    }),
  );

  // After the documents, so the locale directories they created are already there to write into.
  const lastmod = lastContentChange();
  await Promise.all([
    writeFile(join(DIST, 'sitemap.xml'), renderSitemap(lastmod), 'utf8'),
    ...manifests().map(([path, body]) => writeFile(join(DIST, path), body, 'utf8')),
  ]);

  console.log(`prerendered ${LOCALES.length} locales -> dist/`);
  console.log(`  ${stylesheet}\n  ${script}\n  ${metricsScript}`);
  console.log(`  sitemap.xml${lastmod ? ` (lastmod ${lastmod})` : ' (no lastmod: git unavailable)'}`);
}

await prerender();
