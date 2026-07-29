import {LOCALES, LOCALE_LABEL, LOCALE_NATIVE_NAME, pathForLocale, type Locale} from '../i18n';

type LanguageSwitcherProps = {
  locale: Locale;
  /** Accessible name for the group, in the current language. */
  label: string;
};

/**
 * Plain links to the three prerendered documents. Each language is a real URL, so switching needs no
 * JavaScript and the result is copyable, crawlable and openable in a new tab.
 */
export function LanguageSwitcher({locale, label}: LanguageSwitcherProps) {
  return (
    <nav className="lang" aria-label={label}>
      {LOCALES.map((option) => (
        <a
          key={option}
          className="lang__item"
          href={pathForLocale(option)}
          hrefLang={option}
          lang={option}
          aria-label={LOCALE_NATIVE_NAME[option]}
          aria-current={option === locale ? 'true' : undefined}
        >
          {LOCALE_LABEL[option]}
        </a>
      ))}
    </nav>
  );
}
