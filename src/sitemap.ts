/*
 * sitemap.xml, generated rather than kept by hand. The file is three near-identical blocks that all
 * have to list every language — exactly the shape that goes quietly wrong the first time a locale is
 * added, and the shape a loop over LOCALES cannot get wrong at all.
 */

import {LOCALES, ROOT_LOCALE, pathForLocale, type Locale} from './i18n';
import {SITE_URL} from './links';

/**
 * Every alternate, the page itself included: an entry has to name the whole set of translations,
 * not the rest of them.
 */
function alternates(): string {
  const links = LOCALES.map(
    (locale) =>
      `    <xhtml:link rel="alternate" hreflang="${locale}" href="${SITE_URL}${pathForLocale(locale)}" />`,
  );
  links.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />`);
  return links.join('\n');
}

function urlEntry(locale: Locale, lastmod?: string): string {
  return [
    '  <url>',
    `    <loc>${SITE_URL}${pathForLocale(locale)}</loc>`,
    ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
    alternates(),
    '    <changefreq>monthly</changefreq>',
    // The root outranks its translations only in the sense that it is what a language-less visitor
    // gets; all three are the same page.
    `    <priority>${locale === ROOT_LOCALE ? '1.0' : '0.8'}</priority>`,
    '  </url>',
  ].join('\n');
}

/**
 * @param lastmod A W3C date, or nothing. Omitted rather than guessed when the build cannot establish
 *   one: a `lastmod` that moves on every build teaches a crawler to ignore the field, which costs
 *   more than never having sent it.
 */
export function renderSitemap(lastmod?: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LOCALES.map((locale) => urlEntry(locale, lastmod)).join('\n')}
</urlset>
`;
}
