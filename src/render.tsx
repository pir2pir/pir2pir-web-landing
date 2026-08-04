import {renderToStaticMarkup} from 'react-dom/server';
import {App} from './App';
import {COPY, LOCALES, OG_LOCALE, pathForLocale, type Locale} from './i18n';
import {METRICS_URL, OG_IMAGE, SITE_URL, YANDEX_VERIFICATION} from './links';
import {manifestPath} from './manifest';
import {structuredData} from './structured-data';

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
   * Opens a screenshot full size. Deferred, and the section works without it — every card is a link
   * to the image. Absent in the dev server, where the entry module imports it.
   */
  lightboxScript?: string;
  /**
   * Where that script reads its figures from. The build writes the API's own origin; the dev server
   * overrides it with a path it proxies, since localhost has no CORS grant and should not need one.
   * It is written into the document rather than compiled into the bundle so the page says out loud
   * which host it is about to call.
   */
  metricsEndpoint?: string;
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
 * Opens the connection to the metrics API while the page is still parsing, so the deferred script
 * does not pay for DNS, TCP and TLS once it finally runs. `crossorigin` is required and not optional
 * decoration: a preconnect without it warms a different, credential-less pool than a `fetch` uses,
 * and the handshake happens twice.
 *
 * Nothing is emitted when the endpoint is a path — the dev server proxies it through the origin the
 * page already has open.
 */
function preconnect(endpoint: string): string {
  if (!endpoint.startsWith('https://')) return '';
  return `<link rel="preconnect" href="${new URL(endpoint).origin}" crossorigin />`;
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
  const metricsEndpoint = assets.metricsEndpoint ?? METRICS_URL;

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

    <!-- The default for a page nobody has told otherwise, said out loud. The size limits are the
         part that earns its keep: without them a search engine may clip the snippet and shrink the
         thumbnail to a favicon, and this page has one image worth showing. -->
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

    ${YANDEX_VERIFICATION.map(
      (token) => `<meta name="yandex-verification" content="${token}" />`,
    ).join('\n    ')}

    <meta name="theme-color" content="#e11d48" />
    <!-- The stylesheet has one palette and it is a light one. Declaring that stops a browser in dark
         mode from inverting the form controls and scrollbars around it. -->
    <meta name="color-scheme" content="light" />

    <link rel="canonical" href="${canonical}" />
    ${alternateLinks()}
    ${preconnect(metricsEndpoint)}

    <!-- Five declarations cover every consumer: .ico for browsers that still ask for it, a 192px
         PNG, the SVG tile for the ones that prefer it at any size, a 180px PNG for iOS, and the
         manifest for Android. The SVG is the rounded tile rather than the bare mark, so a 16px tab
         and a home screen show the same icon. The manifest is this locale's own — see manifest.ts.

         The PNG is here for Yandex, which asks for a raster of at least 120x120 and reported it
         could not process what it found. Nothing was unreachable — its favicon crawler fetched the
         .ico, the SVG and the touch icon and got 200 on all three — so what it could not use was
         the size: the largest image inside the .ico is 48px, and the only thing above 120 was the
         SVG. A browser still prefers the SVG, which advertises "any"; this is the fallback for
         everything that wants pixels, and it is the file the manifest already ships. -->
    <link rel="icon" href="/favicon.ico" sizes="32x32" />
    <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
    <link rel="icon" href="/icon-512.svg" type="image/svg+xml" sizes="any" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="${manifestPath(locale)}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escape(copy.brand)}" />
    <meta property="og:title" content="${escape(copy.meta.ogTitle)}" />
    <meta property="og:description" content="${escape(copy.meta.ogDescription)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:locale" content="${OG_LOCALE[locale]}" />
    ${alternateOgLocales}
    <!-- Absolute, because the consumer is another server: a preview is fetched by Telegram or VK
         from wherever they run, and a root-relative path means nothing to them. -->
    <meta property="og:image" content="${SITE_URL}${OG_IMAGE.path}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="${OG_IMAGE.width}" />
    <meta property="og:image:height" content="${OG_IMAGE.height}" />
    <meta property="og:image:alt" content="Pir2Pir" />
    <meta name="twitter:card" content="summary_large_image" />

    <script type="application/ld+json">${structuredData(locale)}</script>

    ${assets.stylesheet ? `<link rel="stylesheet" href="${assets.stylesheet}" />` : ''}
    <script${scriptType} src="${assets.script}"></script>
    ${assets.metricsScript ? `<script defer src="${assets.metricsScript}"></script>` : ''}
    ${assets.lightboxScript ? `<script defer src="${assets.lightboxScript}"></script>` : ''}
  </head>
  <body>
${renderToStaticMarkup(<App locale={locale} metricsEndpoint={metricsEndpoint} />)}
  </body>
</html>
`;
}
