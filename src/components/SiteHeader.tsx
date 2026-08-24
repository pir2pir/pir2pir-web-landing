import {COPY, ROOT_LOCALE, pathForLocale, type Locale} from '../i18n';
import {FAQ_COPY} from '../i18n/copy/faq';
import {ARTICLES, articlePath} from '../articles';
import {APP_URL} from '../links';
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

          {/*
            Four anchors behind one disclosure, and the pages beside it at the top level.
            
            The row used to be the other way round: four fragments of the landing spent the width,
            and the only link to a page went to /documentation/ — which carries noindex, so the one
            slot a crawler would have followed led somewhere we ask it not to look. Anchors are for
            somebody already reading; a header's top level is where the other pages on the site are
            announced, and those are the ones that can be found on their own.

            `<details>` rather than a scripted menu, exactly as the language switcher does it: it
            opens on click and on Enter, closes on Escape, is announced as expandable with no aria
            at all, and works with the script blocked. It also gives back about half the row.
          */}
          <nav className="site-nav" aria-label={copy.nav.sections}>
            <details className="nav-menu">
              <summary className="nav-menu__current">
                <span>{copy.nav.sections}</span>
                <svg
                  className="nav-menu__caret"
                  viewBox="0 0 10 6"
                  width="10"
                  height="6"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M1 1l4 4 4-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </summary>

              <div className="nav-menu__list">
                <a href={`${home}#how`}>{copy.nav.how}</a>
                <a href={`${home}#shots`}>{copy.nav.shots}</a>
                <a href={`${home}#inside`}>{copy.nav.inside}</a>
                <a href={`${home}#about`}>{copy.nav.about}</a>
              </div>
            </details>

            {/* The pages, at the top level where a crawler and a reader both find them first. */}
            <a href={`${home}faq/`}>{FAQ_COPY[locale].navTitle}</a>
            {/*
              The written pages, at the top level. /documentation/ is not among them any more: it
              carries noindex, so a header slot spent on it is one a crawler is asked not to follow,
              and the footer already lists it for whoever is looking for it on purpose.

              Russian only — the written pages have no translation; see articles.ts.
            */}
            {locale === ROOT_LOCALE
              ? ARTICLES.map((article) => (
                  <a href={articlePath(article)} key={article.slug}>
                    {article.navTitle}
                  </a>
                ))
              : null}
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
