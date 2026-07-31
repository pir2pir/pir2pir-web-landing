/*
 * One web app manifest per locale, written next to the document that links it: `/site.webmanifest`
 * for Russian, `/en/site.webmanifest`, `/uz/site.webmanifest` for the rest.
 *
 * A single shared manifest would be the same bug the `<head>` is prerendered to avoid — an install
 * prompt, a home screen label and a splash screen in a language the visitor did not choose. It also
 * has to open where it was installed from: `start_url` is the locale's own document, so launching
 * the English icon does not land on Russian and wait for the boot script to correct itself.
 */

import {COPY, LOCALES, pathForLocale, type Locale} from './i18n';

/** Where each locale's manifest is written, relative to dist/ — and the href the document links. */
export function manifestPath(locale: Locale): string {
  return `${pathForLocale(locale)}site.webmanifest`;
}

export function renderManifest(locale: Locale): string {
  const copy = COPY[locale];
  const home = pathForLocale(locale);

  const manifest = {
    /*
     * The identity a browser keys an installed app by. It is the locale's own start URL, so the
     * three languages install as three apps rather than overwriting each other — and it is written
     * down rather than inferred, because a browser left to infer it from `start_url` would silently
     * change identity the day that URL moves.
     */
    id: home,
    /** Shown in the install dialog, where there is room to say what the thing is. */
    name: copy.meta.ogTitle,
    /** Shown under the icon, where there is not. */
    short_name: 'Pir2Pir',
    description: copy.meta.description,
    lang: locale,
    dir: 'ltr',
    start_url: home,
    /*
     * The whole site, not just this locale's corner of it. The language switcher is three plain
     * links, and a scope narrowed to `/en/` would send anyone who used it out of the installed app
     * and into a browser tab.
     */
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#e11d48',
    categories: ['education', 'productivity', 'social'],
    icons: [
      // The rounded tile, for the platforms that show an icon as it was drawn.
      {src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any'},
      {src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any'},
      // The square source, for the platforms that apply their own mask. The mark stays inside the
      // 80% safe circle, so a launcher cropping to a circle takes the padding and not the artwork.
      {src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable'},
      {src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable'},
    ],
  };

  return `${JSON.stringify(manifest, null, 2)}\n`;
}

/** Every locale's manifest, as `[path relative to dist/, contents]`. */
export function manifests(): Array<[string, string]> {
  return LOCALES.map((locale) => [manifestPath(locale).slice(1), renderManifest(locale)]);
}
