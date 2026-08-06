import {COPY, ROOT_LOCALE, pathForLocale, type Locale} from '../i18n';
import {DOCUMENTS_COPY} from '../i18n/copy/documents';
import {APP_URL, DOCUMENTS_PATH} from '../links';
import {LanguageSwitcher} from './LanguageSwitcher';
import {Logo} from './Logo';

/**
 * The skip link and the header, shared by every document on this site.
 *
 * The section links carry the locale's own path rather than a bare `#how`. On the landing the two
 * behave identically — a browser treats `/#how` on `/` as the same-document anchor it is — but on
 * any other page a bare fragment points at a heading that is not there, and the difference is the
 * whole reason this is written the long way.
 */
export function SiteHeader({locale}: {locale: Locale}) {
  const copy = COPY[locale];
  const home = pathForLocale(locale);

  return (
    <>
      <a className="skip-link" href="#main">
        {copy.skipLink}
      </a>

      <header className="site-header">
        <div className="shell site-header__inner">
          {/* Named on the element rather than by its text, because the text is clipped away on a
              narrow screen and the mark beside it is decorative — without this the link to home
              would be one a screen reader could only call "link". The two read identically where
              both are visible, which is what WCAG's Label in Name asks for. */}
          <a className="wordmark" href={home} aria-label={copy.brand}>
            <Logo height={22} decorative />
            <span>{copy.brand}</span>
          </a>
          <nav className="site-nav" aria-label={copy.nav.sections}>
            <a href={`${home}#how`}>{copy.nav.how}</a>
            <a href={`${home}#shots`}>{copy.nav.shots}</a>
            <a href={`${home}#inside`}>{copy.nav.inside}</a>
            <a href={`${home}#about`}>{copy.nav.about}</a>
            {/* Only where the page exists. The documents are the ones a Russian software registry
                asks for, written in Russian and published untranslated, so linking to them from the
                English or Uzbek header would promise a page in a language it is not written in. The
                label is translated anyway, ready for the day the page is. */}
            {locale === ROOT_LOCALE ? (
              <a href={`${DOCUMENTS_PATH}/`} rel="nofollow">{DOCUMENTS_COPY.nav}</a>
            ) : null}
          </nav>

          {/* Two controls, never three: this row shares 320px with the wordmark and may not wrap. */}
          <div className="site-header__actions">
            <LanguageSwitcher locale={locale} label={copy.nav.language} />
            <a className="button button--primary" href={APP_URL}>
              {copy.nav.signIn}
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
