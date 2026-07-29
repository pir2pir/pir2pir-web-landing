import type {Locale} from './i18n/locale';

export const SITE_URL = 'https://pir2pir.ru';
export const BOT_URL = 'https://t.me/pir2pirbot';
export const APP_URL = 'https://app.pir2pir.ru';
export const CONTACT_EMAIL = 'legal@pir2pir.ru';

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

export const LEGAL_PATHS = {
  consent: '/legal/consent/',
  privacy: '/legal/privacy_policy/',
  terms: '/legal/terms/',
} as const;
