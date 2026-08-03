/*
 * The page restated in schema.org terms, for the readers that want it as data rather than as prose:
 * Google, Yandex and the link unfurlers that have learned to read JSON-LD.
 *
 * Everything here is already on the page in words — the platform, its languages, who operates it and
 * under which registry numbers. That is the rule this file is held to: it describes the document it
 * ships with, and never asserts anything a visitor could not read for themselves. Markup that says
 * more than the page does is the kind a search engine eventually stops trusting.
 */

import {COPY, LOCALES, pathForLocale, type Locale} from './i18n';
import {
  APP_URL,
  BOT_URL,
  COMMUNITY_CHAT_URL,
  CONTACT_EMAIL,
  NEWS_CHANNEL_URL,
  OG_IMAGE,
  PORTFOLIO_URL,
  REGISTRATION_ID,
  SITE_URL,
  TAX_ID,
} from './links';

/**
 * Both spellings, always: the one this page is written in as the name, the other as `alternateName`.
 * That is what the field is for — the same thing under a second name — and it is how a search engine
 * is told that a Cyrillic query and a Latin one are asking about one product rather than two.
 */
const BRAND = {latin: 'Pir2Pir', cyrillic: 'Пир2Пир'} as const;

/*
 * Fragment ids, not URLs: the three locales describe one site, one platform and one operator, so each
 * node needs a name that stays the same whichever document is doing the describing. Only the WebPage
 * node is per-locale, and it gets the canonical URL it belongs to.
 */
const WEBSITE_ID = `${SITE_URL}/#website`;
const PUBLISHER_ID = `${SITE_URL}/#publisher`;
const APPLICATION_ID = `${SITE_URL}/#application`;

/**
 * JSON-LD for one locale, ready to drop inside a `<script>`. `<` is escaped because a `</script>`
 * appearing anywhere in the data would end the block early — the escape is still valid JSON, so the
 * parser on the other side never notices.
 */
export function structuredData(locale: Locale): string {
  const copy = COPY[locale];
  const canonical = `${SITE_URL}${pathForLocale(locale)}`;
  const otherName = copy.brand === BRAND.cyrillic ? BRAND.latin : BRAND.cyrillic;

  const graph = [
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: `${SITE_URL}/`,
      name: copy.brand,
      alternateName: otherName,
      inLanguage: [...LOCALES],
      publisher: {'@id': PUBLISHER_ID},
    },
    {
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: copy.meta.title,
      description: copy.meta.description,
      inLanguage: locale,
      isPartOf: {'@id': WEBSITE_ID},
      about: {'@id': APPLICATION_ID},
      primaryImageOfPage: {'@id': `${SITE_URL}/#og-image`},
    },
    {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#og-image`,
      url: `${SITE_URL}${OG_IMAGE.path}`,
      contentUrl: `${SITE_URL}${OG_IMAGE.path}`,
      width: OG_IMAGE.width,
      height: OG_IMAGE.height,
    },
    {
      '@type': 'WebApplication',
      '@id': APPLICATION_ID,
      name: copy.brand,
      alternateName: otherName,
      url: APP_URL,
      description: copy.meta.ogDescription,
      // The closest category schema.org has: it is a tool for students of one school, not a social
      // network and not a marketplace.
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Any',
      inLanguage: [...LOCALES],
      // Free, and saying so is not a claim about the future: it is what the platform costs today, and
      // an offer with no price at all reads as "unknown" rather than as "nothing".
      offers: {'@type': 'Offer', price: '0', priceCurrency: 'RUB'},
      publisher: {'@id': PUBLISHER_ID},
    },
    {
      '@type': 'Organization',
      '@id': PUBLISHER_ID,
      // Localised: the same legal person, named the way the footer of this document names them.
      name: copy.footer.legal.entity,
      url: `${SITE_URL}/`,
      email: CONTACT_EMAIL,
      taxID: TAX_ID,
      // The registration number has no schema.org property of its own, so it travels as the labelled
      // pair the footer prints.
      identifier: {
        '@type': 'PropertyValue',
        name: copy.footer.legal.registrationLabel,
        value: REGISTRATION_ID,
      },
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon-512.png`,
        width: 512,
        height: 512,
      },
      sameAs: [BOT_URL, NEWS_CHANNEL_URL, COMMUNITY_CHAT_URL, PORTFOLIO_URL],
    },
  ];

  return JSON.stringify({'@context': 'https://schema.org', '@graph': graph}).replace(
    /</g,
    '\\u003c',
  );
}
