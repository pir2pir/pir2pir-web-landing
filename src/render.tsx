import {renderToStaticMarkup} from 'react-dom/server';
import {App} from './App';
import {DocumentationPage} from './DocumentationPage';
import {FaqPage} from './FaqPage';
import {PeerToPeerPage} from './PeerToPeerPage';
import {documents} from './documents';
import {COPY, LOCALES, OG_LOCALE, ROOT_LOCALE, pathForLocale, type Locale} from './i18n';
import {DOCUMENTS_COPY} from './i18n/copy/documents';
import {FAQ_COPY} from './i18n/copy/faq';
import {PEER_TO_PEER_COPY, PEER_TO_PEER_PUBLISHED} from './i18n/copy/peer-to-peer';
import {
  DOCUMENTS_PATH,
  METRICS_URL,
  OG_IMAGE,
  SITE_URL,
  TESTIMONIALS_URL,
  YANDEX_VERIFICATION,
} from './links';
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
  /** Where the quote columns read from. Same arrangement as `metricsEndpoint`, same reasons. */
  testimonialsEndpoint?: string;
  /** Fills the quote columns. Deferred, and the section is prerendered with placeholders. */
  testimonialsScript?: string;
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

/**
 * The three translations of one page, plus the default. `suffix` is what follows the locale prefix —
 * empty for the landing, `faq/` for the questions — so a second translated page cannot end up
 * pointing its alternates at the first, which is the failure this used to be one edit away from.
 */
function alternateLinks(suffix = ''): string {
  const links = LOCALES.map(
    (locale) =>
      `<link rel="alternate" hreflang="${locale}" href="${SITE_URL}${pathForLocale(locale)}${suffix}" />`,
  );
  links.push(`<link rel="alternate" hreflang="x-default" href="${SITE_URL}/${suffix}" />`);
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
  const testimonialsEndpoint = assets.testimonialsEndpoint ?? TESTIMONIALS_URL;

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
    ${assets.testimonialsScript ? `<script defer src="${assets.testimonialsScript}"></script>` : ''}
  </head>
  <body>
${renderToStaticMarkup(
  <App
    locale={locale}
    metricsEndpoint={metricsEndpoint}
    testimonialsEndpoint={testimonialsEndpoint}
  />,
)}
  </body>
</html>
`;
}

/**
 * /documentation/ — the registry documents, as a page to download them from.
 *
 * Kept out of the search index on purpose, which is most of what makes this head different from the
 * landing's. Two declarations do it, and they are not redundant:
 *
 *   - `noindex, nofollow` here, for a crawler that fetches the page anyway. Plenty do, and a robots
 *     rule is a request rather than a control.
 *   - `Disallow: /documentation/` in robots.txt, which is what actually stops the fetch.
 *
 * Worth knowing that those two pull against each other, and deliberately: a crawler obeying the
 * Disallow never reads the noindex, so the pair only makes sense as belt and braces. The page also
 * stays out of sitemap.xml, and the links to it carry `rel="nofollow"` — with no path in and no
 * invitation, there is nothing left to consolidate.
 *
 * No JSON-LD, for the same reason: structured data exists to describe a page to a search engine that
 * is indexing it, and nothing here is. Open Graph stays, because that is not crawling — it is the
 * card somebody gets when they paste this link into a chat, which is exactly how an expert will be
 * sent it.
 *
 * No boot script either. It resolves the root to a stored language, and this page has one language;
 * it now leaves every other URL alone (see boot.ts), but shipping a redirect to a page that must not
 * be redirected is a risk with nothing on the other side of it.
 */
export function renderDocumentationPage(assets: PageAssets): string {
  const canonical = `${SITE_URL}${DOCUMENTS_PATH}/`;

  return `<!doctype html>
<html lang="${ROOT_LOCALE}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escape(DOCUMENTS_COPY.title)} — ${escape(COPY[ROOT_LOCALE].brand)}</title>
    <meta name="description" content="${escape(DOCUMENTS_COPY.description)}" />

    <meta name="robots" content="noindex, nofollow" />

    <meta name="theme-color" content="#e11d48" />
    <meta name="color-scheme" content="light" />

    <!-- Still named, even unindexed: it is the address to share, and it is the one this page is at.
         There are no hreflang alternates because there are no translations of it. -->
    <link rel="canonical" href="${canonical}" />

    <link rel="icon" href="/favicon.ico" sizes="32x32" />
    <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
    <link rel="icon" href="/icon-512.svg" type="image/svg+xml" sizes="any" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="${manifestPath(ROOT_LOCALE)}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escape(COPY[ROOT_LOCALE].brand)}" />
    <meta property="og:title" content="${escape(DOCUMENTS_COPY.title)}" />
    <meta property="og:description" content="${escape(DOCUMENTS_COPY.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:locale" content="${OG_LOCALE[ROOT_LOCALE]}" />
    <meta property="og:image" content="${SITE_URL}${OG_IMAGE.path}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="${OG_IMAGE.width}" />
    <meta property="og:image:height" content="${OG_IMAGE.height}" />
    <meta property="og:image:alt" content="Pir2Pir" />
    <meta name="twitter:card" content="summary_large_image" />

    ${assets.stylesheet ? `<link rel="stylesheet" href="${assets.stylesheet}" />` : ''}
  </head>
  <body>
${renderToStaticMarkup(<DocumentationPage documents={documents()} />)}
  </body>
</html>
`;
}

/** Where the questions live, under each locale's own prefix: /faq/, /en/faq/, /uz/faq/. */
export const FAQ_SUFFIX = 'faq/';

export function faqPath(locale: Locale): string {
  return `${pathForLocale(locale)}${FAQ_SUFFIX}`;
}

/**
 * /faq/ — the questions somebody searches before they know the product's name.
 *
 * Indexed, unlike /documentation/: the whole reason it exists is to be found. It gets the same head
 * as the landing minus the things that belong only there, and one thing the landing cannot have —
 * FAQPage markup, which is the type Yandex renders as a expandable block under a result. The markup
 * is generated from the same array the page renders, so the two cannot describe different questions.
 */
export function renderFaqPage(locale: Locale, assets: PageAssets): string {
  const copy = COPY[locale];
  const faq = FAQ_COPY[locale];
  const canonical = `${SITE_URL}${faqPath(locale)}`;
  const scriptType = assets.scriptAsModule ? ' type="module"' : '';

  const alternateOgLocales = LOCALES.filter((other) => other !== locale)
    .map((other) => `<meta property="og:locale:alternate" content="${OG_LOCALE[other]}" />`)
    .join('\n    ');

  const structured = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        url: canonical,
        name: faq.title,
        description: faq.metaDescription,
        inLanguage: locale,
        isPartOf: {'@id': `${SITE_URL}/#website`},
        mainEntity: faq.entries.map((entry) => ({
          '@type': 'Question',
          name: entry.question,
          acceptedAnswer: {'@type': 'Answer', text: entry.answer},
        })),
      },
    ],
  }).replace(/</g, '\\u003c');

  return `<!doctype html>
<html lang="${locale}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escape(faq.metaTitle)}</title>
    <meta name="description" content="${escape(faq.metaDescription)}" />

    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

    ${YANDEX_VERIFICATION.map(
      (token) => `<meta name="yandex-verification" content="${token}" />`,
    ).join('\n    ')}

    <meta name="theme-color" content="#e11d48" />
    <meta name="color-scheme" content="light" />

    <link rel="canonical" href="${canonical}" />
    ${alternateLinks(FAQ_SUFFIX)}

    <link rel="icon" href="/favicon.ico" sizes="32x32" />
    <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
    <link rel="icon" href="/icon-512.svg" type="image/svg+xml" sizes="any" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="${manifestPath(locale)}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escape(copy.brand)}" />
    <meta property="og:title" content="${escape(faq.metaTitle)}" />
    <meta property="og:description" content="${escape(faq.metaDescription)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:locale" content="${OG_LOCALE[locale]}" />
    ${alternateOgLocales}
    <meta property="og:image" content="${SITE_URL}${OG_IMAGE.path}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="${OG_IMAGE.width}" />
    <meta property="og:image:height" content="${OG_IMAGE.height}" />
    <meta property="og:image:alt" content="Pir2Pir" />
    <meta name="twitter:card" content="summary_large_image" />

    <script type="application/ld+json">${structured}</script>

    ${assets.stylesheet ? `<link rel="stylesheet" href="${assets.stylesheet}" />` : ''}
    <script${scriptType} src="${assets.script}"></script>
  </head>
  <body>
${renderToStaticMarkup(<FaqPage locale={locale} />)}
  </body>
</html>
`;
}

/** Where the explainer lives. Russian only, so no locale prefix — it is the only version there is. */
export const PEER_TO_PEER_PATH = '/peer-to-peer';

/**
 * /peer-to-peer/ — an explainer written to be found by people who have not heard of this platform.
 *
 * Indexed, and the only page here whose reason for existing is search: "p2p обучение" and
 * "peer-to-peer обучение" are asked constantly and answered by companies that do not run one of
 * these. No hreflang alternates, because there are no translations — the volume it exists to catch
 * is Russian, and an English copy of it would be a page written for nobody.
 *
 * Article markup rather than WebPage: it is authored prose with a publication date, and that date
 * is a literal in the copy module rather than the build's clock, so it says when the piece was
 * written instead of when it was last deployed.
 */
export function renderPeerToPeerPage(assets: PageAssets): string {
  const copy = PEER_TO_PEER_COPY;
  const canonical = `${SITE_URL}${PEER_TO_PEER_PATH}/`;
  const scriptType = assets.scriptAsModule ? ' type="module"' : '';

  const structured = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${canonical}#article`,
        headline: copy.title,
        description: copy.metaDescription,
        inLanguage: ROOT_LOCALE,
        datePublished: PEER_TO_PEER_PUBLISHED,
        mainEntityOfPage: canonical,
        image: `${SITE_URL}${OG_IMAGE.path}`,
        // Corporate authorship, which is what it is — the operator wrote it, and inventing a person
        // to fill the field would be the one thing this file has never done.
        author: {'@id': `${SITE_URL}/#publisher`},
        publisher: {'@id': `${SITE_URL}/#publisher`},
        isPartOf: {'@id': `${SITE_URL}/#website`},
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#publisher`,
        name: COPY[ROOT_LOCALE].footer.legal.entity,
        url: `${SITE_URL}/`,
      },
    ],
  }).replace(/</g, '\\u003c');

  return `<!doctype html>
<html lang="${ROOT_LOCALE}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escape(copy.metaTitle)}</title>
    <meta name="description" content="${escape(copy.metaDescription)}" />

    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

    ${YANDEX_VERIFICATION.map(
      (token) => `<meta name="yandex-verification" content="${token}" />`,
    ).join('\n    ')}

    <meta name="theme-color" content="#e11d48" />
    <meta name="color-scheme" content="light" />

    <link rel="canonical" href="${canonical}" />

    <link rel="icon" href="/favicon.ico" sizes="32x32" />
    <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
    <link rel="icon" href="/icon-512.svg" type="image/svg+xml" sizes="any" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="${manifestPath(ROOT_LOCALE)}" />

    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="${escape(COPY[ROOT_LOCALE].brand)}" />
    <meta property="og:title" content="${escape(copy.metaTitle)}" />
    <meta property="og:description" content="${escape(copy.metaDescription)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:locale" content="${OG_LOCALE[ROOT_LOCALE]}" />
    <meta property="og:image" content="${SITE_URL}${OG_IMAGE.path}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="${OG_IMAGE.width}" />
    <meta property="og:image:height" content="${OG_IMAGE.height}" />
    <meta property="og:image:alt" content="Pir2Pir" />
    <meta name="twitter:card" content="summary_large_image" />

    <script type="application/ld+json">${structured}</script>

    ${assets.stylesheet ? `<link rel="stylesheet" href="${assets.stylesheet}" />` : ''}
    <script${scriptType} src="${assets.script}"></script>
  </head>
  <body>
${renderToStaticMarkup(<PeerToPeerPage />)}
  </body>
</html>
`;
}
