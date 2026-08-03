import type {Locale} from './i18n/locale';

export const SITE_URL = 'https://pir2pir.ru';
export const BOT_URL = 'https://t.me/pir2pirbot';
export const APP_URL = 'https://app.pir2pir.ru';
export const CONTACT_EMAIL = 'legal@pir2pir.ru';

/**
 * The platform's two Telegram presences, which are not the bot: announcements go out on the channel,
 * and the chat is where they get discussed. Both are public, so they are also what `sameAs` in the
 * structured data points at — an account anyone can open is how a search engine ties the three
 * places Pir2Pir exists to one another.
 */
export const NEWS_CHANNEL_URL = 'https://t.me/pir2pirnews';
export const COMMUNITY_CHAT_URL = 'https://t.me/pir2pircommunity';

/**
 * The same platform reached through MAX. The two ids differ by a leading zero and are not a typo —
 * they are separate accounts, and MAX issues them, so neither can be derived from the other.
 */
export const MAX_BOT_URL = 'https://max.ru/id024803896842_3_bot';
export const MAX_CHANNEL_URL = 'https://max.ru/id24803896842_biz6';

/**
 * The organisation, not any one repository: the landing's own source is there, so is the
 * documentation, and so are the issue trackers for the parts that are closed. One link covers all of
 * it, and stays right when the list of repositories changes.
 */
export const GITHUB_ORG_URL = 'https://github.com/pir2pir';

/**
 * The card a shared link shows, and the dimensions declared beside it — a preview that knows the
 * shape before the image lands reserves the right box instead of reflowing around it. `public/og.svg`
 * is what the PNG is rendered from.
 */
export const OG_IMAGE = {path: '/og.png', width: 1200, height: 630} as const;

/**
 * Proves ownership to Yandex Webmaster. Written into all three documents: which one answers
 * `https://pir2pir.ru/` is a decision the boot script makes in the visitor's browser, and a crawler
 * that follows a redirect to `/en/` should find the tag there too.
 *
 * A list rather than one string, because Webmaster treats `http://` and `https://` as two sites and
 * issues a token per site. Yandex reads every `yandex-verification` tag on the page, so both can sit
 * there at once — which means adding a mirror is never a moment where the old one is unverified and
 * the new one is not yet. Drop a token when its site is gone from Webmaster, not before.
 */
export const YANDEX_VERIFICATION: readonly string[] = ['af22318b9978eee5'];

/**
 * The hero's figures, read by the browser from another origin — so the API has to name this one:
 * it answers `Access-Control-Allow-Origin: https://pir2pir.ru` and no header at all to anybody else.
 * The figures are anonymous and aggregate, but the grant is not, which is why a page on a host we do
 * not run cannot read them from a browser and has to go through a server of its own.
 *
 * The dev server therefore proxies the path below rather than calling this directly. `localhost` is
 * not on that list and should not be added to it — the policy that would let it read a public counter
 * is the same policy that governs signed-in calls.
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
