import {useId} from 'react';
import {COPY, ROOT_LOCALE, pathForLocale, type Locale} from '../i18n';
import {DOCUMENTS_COPY} from '../i18n/copy/documents';
import {
  APP_STORES,
  APP_URL,
  BOT_URL,
  COMMUNITY_CHAT_URL,
  CONTACT_EMAIL,
  DOCUMENTS_PATH,
  GITHUB_ORG_URL,
  LEGAL_PATHS,
  MAX_BOT_URL,
  MAX_CHANNEL_URL,
  NEWS_CHANNEL_URL,
  PORTFOLIO_URL,
  REGISTRATION_ID,
  RKN_REGISTRY_NUMBER,
  RKN_URL,
  TAX_ID,
  docsUrl,
} from '../links';
import {GitHubMark} from './GitHubMark';
import {Logo} from './Logo';
import {MaxMark} from './MaxMark';
import {TelegramMark} from './TelegramMark';

/** The footer, shared by every document on this site. It is also where the operator is named. */
export function SiteFooter({locale}: {locale: Locale}) {
  const copy = COPY[locale];
  const docs = (path?: string) => docsUrl(locale, path);
  const portfolioTooltipId = `portfolio-tip-${useId()}`;

  return (
    <footer className="site-footer">
      <div className="shell footer__inner">
        {/*
          The brand block. It carries the mark, the name, one line of what this is, the store tiles
          and the registration numbers — everything about the publisher, in the place a reader looks
          for the publisher, and out of the way of the four columns of links.
        */}
        <div className="footer__brand">
          <a className="footer__wordmark" href={pathForLocale(locale)} aria-label={copy.brand}>
            <Logo height={34} decorative />
            <span>{copy.brand}</span>
          </a>
          <p className="footer__tagline">{copy.footer.tagline}</p>

          {/* The one address the platform answers on. It sat in a column of its own with a heading
              over a single item, which is a heading doing no work — here it is next to the name it
              belongs to and needs no label to be recognised as an address. */}
          <a className="footer__email" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>

          {/*
            One tile per store. While none of them has a listing they are empty frames with the
            store's name under them, which is what a placeholder should look like — a QR code that
            scans to nothing would be worse than an obvious gap. `aria-hidden` on the frame keeps
            three decorative boxes out of the reading order; the note above already says it.
          */}
          <div className="footer__stores">
            <p className="footer__stores-note">{copy.footer.storesSoon}</p>
            <ul className="footer__store-list">
              {APP_STORES.map((store) => (
                <li key={store.id}>
                  {store.url && store.qr ? (
                    <a className="footer__store" href={store.url}>
                      <img
                        className="footer__qr"
                        src={store.qr}
                        alt=""
                        width="88"
                        height="88"
                        loading="lazy"
                      />
                      <span>{store.label}</span>
                    </a>
                  ) : (
                    <span className="footer__store footer__store--empty">
                      <span className="footer__qr footer__qr--empty" aria-hidden="true" />
                      <span>{store.label}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* The brand in this document's own script: Пир2Пир on the Russian page, Pir2Pir on the
              other two. It was hard-coded Latin, which made it the one place the Russian page
              called the product by the wrong name. */}
          <p className="footer__copyright">
            © {new Date().getFullYear()} {copy.brand}
          </p>
        </div>

        <div className="footer__grid">
          <div>
            <h2 className="footer__heading">{copy.footer.platform}</h2>
            <ul className="footer__list">
              <li>
                <a href={APP_URL}>{copy.footer.app}</a>
              </li>
              {/* The two messengers the platform is reachable through, marked so the pair reads as
                  a choice of the same thing rather than as two different things. */}
              <li>
                <a href={BOT_URL}>
                  <TelegramMark />
                  {copy.footer.telegramBot}
                </a>
              </li>
              <li>
                <a href={MAX_BOT_URL}>
                  <MaxMark />
                  {copy.footer.maxBot}
                </a>
              </li>
              <li>
                <a href={docs()}>{copy.footer.docs}</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="footer__heading">{copy.footer.documents}</h2>
            <ul className="footer__list">
              <li>
                <a href={docs(LEGAL_PATHS.consent)}>{copy.footer.consent}</a>
              </li>
              <li>
                <a href={docs(LEGAL_PATHS.privacy)}>{copy.footer.privacy}</a>
              </li>
              <li>
                <a href={docs(LEGAL_PATHS.terms)}>{copy.footer.terms}</a>
              </li>
              <li>
                <a href={docs(LEGAL_PATHS.cookies)}>{copy.footer.cookies}</a>
              </li>
              {/* Russian only, for the reason the header link is — see SiteHeader. */}
              {locale === ROOT_LOCALE ? (
                <li>
                  <a href={`${DOCUMENTS_PATH}/`} rel="nofollow">{DOCUMENTS_COPY.footerNav}</a>
                </li>
              ) : null}
            </ul>
          </div>
          <div>
            <h2 className="footer__heading">{copy.footer.community}</h2>
            <ul className="footer__list">
              <li>
                <a href={NEWS_CHANNEL_URL}>
                  <TelegramMark />
                  {copy.footer.telegramChannel}
                </a>
              </li>
              <li>
                <a href={COMMUNITY_CHAT_URL}>
                  <TelegramMark />
                  {copy.footer.telegramChat}
                </a>
              </li>
              <li>
                <a href={MAX_CHANNEL_URL}>
                  <MaxMark />
                  {copy.footer.maxChannel}
                </a>
              </li>
              {/* "GitHub" is the name of the place and reads the same in every language, so it is
                  here rather than in the copy — like the registry numbers in `links.ts`. */}
              <li>
                <a href={GITHUB_ORG_URL}>
                  <GitHubMark />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/*
        The registration numbers, on a row of their own: a legal disclosure that belongs to the whole
        document rather than to the brand column, and wide enough here to sit on two lines instead of
        five in a narrow column.
      */}
      <div className="shell footer__requisites">
<p className="footer__legal">
            <span className="tooltip">
              <a
                href={PORTFOLIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-describedby={portfolioTooltipId}
              >
                {copy.footer.legal.entity}
              </a>
              {/* Described, not labelled: the link already reads as the name, and the tooltip only
                  says where it goes. It stays in the accessibility tree at all times, which is why
                  it hides with opacity rather than display or visibility. */}
              <span className="tooltip__bubble" role="tooltip" id={portfolioTooltipId}>
                {copy.footer.legal.portfolio}
              </span>
            </span>{' '}
            · {copy.footer.legal.taxLabel} {TAX_ID} ·{' '}
            {copy.footer.legal.registrationLabel} {REGISTRATION_ID}
            <br />
            {copy.footer.legal.activity} · {copy.footer.legal.operator}{' '}
            <a href={RKN_URL} target="_blank" rel="noopener noreferrer">
              №{RKN_REGISTRY_NUMBER}
            </a>
          </p>
      </div>

      <div className="shell footer__baseline">
        <p className="footer__cookie">
          {copy.footer.cookieNotice.before}
          <a href={docs(LEGAL_PATHS.cookies)}>{copy.footer.cookieNotice.link}</a>
          {copy.footer.cookieNotice.after}
        </p>
      </div>
    </footer>
  );
}
