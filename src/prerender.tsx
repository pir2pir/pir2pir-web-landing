/*
 * Writes dist/: one static document per locale, plus the fingerprinted stylesheet and boot script
 * they reference. Nothing is rendered in the browser, so a crawler, a link preview and a visitor
 * with JavaScript off all get the finished page.
 *
 * Run through `scripts/build.mjs`, which bundles this file for Node first.
 */

import {cp, mkdir, rm, writeFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {build, type BuildOptions} from 'esbuild';
import {LOCALES, ROOT_LOCALE, pathForLocale, type Locale} from './i18n/locale';
import {renderPage} from './render';

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

async function prerender(): Promise<void> {
  await rm(DIST, {recursive: true, force: true});
  await mkdir(ASSETS, {recursive: true});

  // Everything in public/ is served verbatim: icons, manifest, robots.txt, sitemap.xml.
  await cp(join(ROOT, 'public'), DIST, {recursive: true});

  const [stylesheet, script] = await Promise.all([
    bundleAsset({entryPoints: [join(ROOT, 'src/styles.css')]}),
    bundleAsset({
      entryPoints: [join(ROOT, 'src/boot.ts')],
      // Classic script, not a module: modules are deferred, and the locale redirect has to decide
      // before the browser paints a page it may be about to leave.
      format: 'iife',
      target: ['es2019'],
    }),
  ]);

  await Promise.all(
    LOCALES.map(async (locale: Locale) => {
      const file = join(DIST, pathForLocale(locale), 'index.html');
      if (locale !== ROOT_LOCALE) await mkdir(dirname(file), {recursive: true});
      await writeFile(file, renderPage(locale, {stylesheet, script}), 'utf8');
    }),
  );

  console.log(`prerendered ${LOCALES.length} locales -> dist/`);
  console.log(`  ${stylesheet}\n  ${script}`);
}

await prerender();
