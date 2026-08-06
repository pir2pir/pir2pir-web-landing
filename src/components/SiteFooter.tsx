import {useId} from 'react';
import {COPY, ROOT_LOCALE, type Locale} from '../i18n';
import {DOCUMENTS_COPY} from '../i18n/copy/documents';
import {
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
import {MaxMark} from './MaxMark';
import {TelegramMark} from './TelegramMark';

/** The footer, shared by every document on this site. It is also where the operator is named. */
export function SiteFooter({locale}: {locale: Locale}) {
  const copy = COPY[locale];
  const docs = (path?: string) => docsUrl(locale, path);
  const portfolioTooltipId = `portfolio-tip-${useId()}`;

  return (
    <footer className="site-footer">
      <div className="shell">
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
                  <a href={`${DOCUMENTS_PATH}/`} rel="nofollow">{DOCUMENTS_COPY.nav}</a>
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
          <div>
            <h2 className="footer__heading">{copy.footer.contacts}</h2>
            <ul className="footer__list">
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
            </ul>
          </div>
        </div>

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
          <br />© {new Date().getFullYear()} Pir2Pir
        </p>

        <p className="footer__cookie">
          {copy.footer.cookieNotice.before}
          <a href={docs(LEGAL_PATHS.cookies)}>{copy.footer.cookieNotice.link}</a>
          {copy.footer.cookieNotice.after}
        </p>
      </div>
    </footer>
  );
}
