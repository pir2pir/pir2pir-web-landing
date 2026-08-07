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
import {manifests} from './manifest';
import {renderDocumentationPage, renderFaqPage, renderPage} from './render';

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

  // Everything in public/ is served verbatim: icons, the preview card, robots.txt, sitemap.xml.
  // The manifests are the exception, written below — there is one per locale, and their contents
  // are the locale's own copy.
  await cp(join(ROOT, 'public'), DIST, {recursive: true});

  const [stylesheet, script, metricsScript, lightboxScript] = await Promise.all([
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
    bundleAsset({
      // Deferred like the metrics script and for the same reason: the section it enhances is well
      // below the fold, and the cards work as plain links until it arrives.
      entryPoints: [join(ROOT, 'src/lightbox.ts')],
      format: 'iife',
      target: ['es2020'],
    }),
  ]);

  await Promise.all(
    LOCALES.map(async (locale: Locale) => {
      const file = join(DIST, pathForLocale(locale), 'index.html');
      if (locale !== ROOT_LOCALE) await mkdir(dirname(file), {recursive: true});
      await writeFile(file, renderPage(locale, {stylesheet, script, metricsScript, lightboxScript}), 'utf8');
    }),
  );

  // The questions, one document per locale under that locale's own prefix. Indexed, unlike the
  // documents page: being found is the whole reason it exists.
  await Promise.all(
    LOCALES.map(async (locale: Locale) => {
      const dir = join(DIST, pathForLocale(locale), 'faq');
      await mkdir(dir, {recursive: true});
      await writeFile(
        join(dir, 'index.html'),
        renderFaqPage(locale, {stylesheet, script, metricsScript, lightboxScript}),
        'utf8',
      );
    }),
  );

  // The documents page. One document, Russian only, and kept out of the index — see render.tsx.
  await mkdir(join(DIST, 'documentation'), {recursive: true});
  await writeFile(
    join(DIST, 'documentation/index.html'),
    renderDocumentationPage({stylesheet, script, metricsScript, lightboxScript}),
    'utf8',
  );

  // After the documents, so the locale directories they created are already there to write into.
  await Promise.all(
    manifests().map(([path, body]) => writeFile(join(DIST, path), body, 'utf8')),
  );

  console.log(`prerendered ${LOCALES.length} locales + faq + documentation -> dist/`);
  console.log(`  ${stylesheet}\n  ${script}\n  ${metricsScript}\n  ${lightboxScript}`);
}

await prerender();
