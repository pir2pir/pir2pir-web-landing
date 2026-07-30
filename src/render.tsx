import {renderToStaticMarkup} from 'react-dom/server';
import {App} from './App';
import {COPY, LOCALES, OG_LOCALE, pathForLocale, type Locale} from './i18n';
import {SITE_URL} from './links';

export type PageAssets = {
  /**
   * Href of the fingerprinted stylesheet. Absent in the dev server, where the entry module pulls
   * the CSS in itself so that Vite can hot-reload it.
   */
  stylesheet?: string;
  script: string;
  /**
   * The hero metrics, deferred. Nothing it does has to happen before paint, and holding the page for
   * it would trade the whole first render against a panel that fades in on its own. Absent in the
   * dev server, where the entry module imports it.
   */
  metricsScript?: string;
  /**
   * The build ships a classic script so it blocks paint — the locale redirect has to run before the
   * page is visible. The dev server needs a module, because that is how Vite serves TypeScript.
   */
  scriptAsModule?: boolean;
};

/** `"` and `&` would end an attribute early or start an entity; `<` is escaped for text nodes. */
function escape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function alternateLinks(): string {
  const links = LOCALES.map(
    (locale) =>
      `<link rel="alternate" hreflang="${locale}" href="${SITE_URL}${pathForLocale(locale)}" />`,
  );
  links.push(`<link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />`);
  return links.join('\n    ');
}

/**
 * One complete document per locale. The whole page is here rather than in a shared index.html: the
 * head differs by language in every field that matters to a crawler or a shared link, and a template
 * that only gets patched afterwards is a template that eventually gets patched incompletely.
 */
export function renderPage(locale: Locale, assets: PageAssets): string {
  const copy = COPY[locale];
  const canonical = `${SITE_URL}${pathForLocale(locale)}`;
  const scriptType = assets.scriptAsModule ? ' type="module"' : '';

  const alternateOgLocales = LOCALES.filter((other) => other !== locale)
    .map((other) => `<meta property="og:locale:alternate" content="${OG_LOCALE[other]}" />`)
    .join('\n    ');

  return `<!doctype html>
<html lang="${locale}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escape(copy.meta.title)}</title>
    <meta name="description" content="${escape(copy.meta.description)}" />
    <meta name="theme-color" content="#e11d48" />
    <link rel="canonical" href="${canonical}" />
    ${alternateLinks()}

    <!-- Four declarations cover every consumer: .ico for browsers that still ask for it, the SVG
         tile for the ones that prefer it at any size, a 180px PNG for iOS, and the manifest for
         Android. The SVG is the rounded tile rather than the bare mark, so a 16px tab and a home
         screen show the same icon. -->
    <link rel="icon" href="/favicon.ico" sizes="32x32" />
    <link rel="icon" href="/icon-512.svg" type="image/svg+xml" sizes="any" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Pir2Pir" />
    <meta property="og:title" content="${escape(copy.meta.ogTitle)}" />
    <meta property="og:description" content="${escape(copy.meta.ogDescription)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:locale" content="${OG_LOCALE[locale]}" />
    ${alternateOgLocales}
    <meta name="twitter:card" content="summary" />

    ${assets.stylesheet ? `<link rel="stylesheet" href="${assets.stylesheet}" />` : ''}
    <script${scriptType} src="${assets.script}"></script>
    ${assets.metricsScript ? `<script defer src="${assets.metricsScript}"></script>` : ''}
  </head>
  <body>
${renderToStaticMarkup(<App locale={locale} />)}
  </body>
</html>
`;
}
