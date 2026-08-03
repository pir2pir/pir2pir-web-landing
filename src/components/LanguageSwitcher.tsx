import {LOCALES, LOCALE_LABEL, LOCALE_NATIVE_NAME, pathForLocale, type Locale} from '../i18n';

type LanguageSwitcherProps = {
  locale: Locale;
  /** Accessible name for the menu, in the current language. */
  label: string;
};

/**
 * Three plain links to the three prerendered documents, behind a `<details>` that shows the current
 * one and opens the rest.
 *
 * `<details>` rather than a scripted menu, for the reason this switcher has always had: a language is
 * a real URL here, so switching must work with no JavaScript at all — and a disclosure is the one
 * menu the platform gives away for free. It opens on click and on Enter, closes on Escape, and is
 * announced as expandable without a single aria attribute.
 *
 * The compact form is the point. Three pills cost about 110px of a header that also has to hold a
 * wordmark, a call to action and, past a tablet, the section links; the summary costs about 55px at
 * every width. Those 55px are what let the navigation appear on a narrower screen than it used to.
 */
export function LanguageSwitcher({locale, label}: LanguageSwitcherProps) {
  return (
    <details className="lang">
      {/*
        The summary is the control, so it carries the name of the menu rather than of the language:
        "Язык: RU" is what a screen reader should hear on a button that opens a list of languages.
      */}
      <summary className="lang__current" aria-label={`${label}: ${LOCALE_NATIVE_NAME[locale]}`}>
        <span aria-hidden="true">{LOCALE_LABEL[locale]}</span>
        <svg
          className="lang__caret"
          viewBox="0 0 10 6"
          width="10"
          height="6"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>

      <nav className="lang__menu" aria-label={label}>
        {LOCALES.map((option) => (
          <a
            key={option}
            className="lang__item"
            href={pathForLocale(option)}
            hrefLang={option}
            lang={option}
            aria-current={option === locale ? 'true' : undefined}
          >
            <span className="lang__code" aria-hidden="true">
              {LOCALE_LABEL[option]}
            </span>
            {LOCALE_NATIVE_NAME[option]}
          </a>
        ))}
      </nav>
    </details>
  );
}
