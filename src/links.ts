import type {Locale} from './i18n/locale';

export const SITE_URL = 'https://pir2pir.ru';
export const BOT_URL = 'https://t.me/pir2pirbot';
export const APP_URL = 'https://app.pir2pir.ru';
export const CONTACT_EMAIL = 'legal@pir2pir.ru';

/**
 * The hero's figures, read by the browser from another origin — so `https://pir2pir.ru` has to be in
 * the API's `Cors:AllowedOrigins`, or the request never leaves the page. Anonymous and cacheable;
 * nothing here is about the visitor.
 *
 * The dev server does not use this. It proxies the path below instead, because localhost is not in
 * that list and does not belong in it: the policy that would let it read a public counter is the
 * same policy that lets an origin make credentialed calls.
 */
export const METRICS_URL = 'https://api.pir2pir.ru/api/metrics/public';

/** What the dev server proxies to `METRICS_URL`. Same shape, so the page cannot tell them apart. */
export const METRICS_DEV_PATH = '/metrics/public';

/** School 21 login of the author, quoted in the About section. The same in every language. */
export const AUTHOR_LOGIN = 'elenipad';

export const PORTFOLIO_URL = 'https://ai-iskuzhin.is-a.dev';

export const TAX_ID = '024803896842';
export const REGISTRATION_ID = '326028000044859';

/** One literal, never assembled: CI greps the bundle for it, because losing it breaks compliance. */
export const RKN_REGISTRY_NUMBER = '2-26-056967';
export const RKN_URL = `https://pd.rkn.gov.ru/operators-registry/operators-list/?id=${RKN_REGISTRY_NUMBER}`;

const DOCS_URL = 'https://docs.pir2pir.ru';

/** docs.pir2pir.ru is laid out like this site: Russian at the root, the others under a prefix. */
export function docsUrl(locale: Locale, path = '/'): string {
  return locale === 'ru' ? `${DOCS_URL}${path}` : `${DOCS_URL}/${locale}${path}`;
}

/** Mirrors `registry/links.json` in pir2pir-docs; a route change there has to land here too. */
export const LEGAL_PATHS = {
  consent: '/legal/consent/',
  privacy: '/legal/privacy_policy/',
  terms: '/legal/terms/',
  cookies: '/legal/cookies/',
} as const;
