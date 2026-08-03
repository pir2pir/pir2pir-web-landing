/*
 * Pure locale data and URL helpers — no DOM. The build, the dev server and the browser bundle all
 * import this, so it has to stay free of anything that only exists in one of them; the browser-only
 * half lives in `detect.ts`.
 */

export const LOCALES = ['ru', 'en', 'uz'] as const;

export type Locale = (typeof LOCALES)[number];

/** Russian is served from the root, the rest live under a prefix — the layout docs.pir2pir.ru uses. */
export const ROOT_LOCALE: Locale = 'ru';

/** Switcher labels; the codes read the same in every language, so they are not part of the copy. */
export const LOCALE_LABEL: Record<Locale, string> = {
  ru: 'RU',
  en: 'EN',
  uz: 'UZ',
};

/** Endonyms — a reader looking for their language recognises it in its own words, not in ours. */
export const LOCALE_NATIVE_NAME: Record<Locale, string> = {
  ru: 'Русский',
  en: 'English',
  uz: 'Oʻzbekcha',
};

export const OG_LOCALE: Record<Locale, string> = {
  ru: 'ru_RU',
  en: 'en_US',
  uz: 'uz_UZ',
};

/** The canonical path for a locale. Root for Russian, `/en/` and `/uz/` for the others. */
export function pathForLocale(locale: Locale): string {
  return locale === ROOT_LOCALE ? '/' : `/${locale}/`;
}

/** Narrows an arbitrary string — a path segment, a stored value, an attribute — to a known locale. */
export function asLocale(value: string | null | undefined): Locale | null {
  return LOCALES.find((locale) => locale === value) ?? null;
}

/**
 * The locale a URL asks for, or null when it asks for none. `/ru/` resolves too, so a hand-typed or
 * stale link still lands somewhere sensible instead of falling through to the shell.
 */
export function localeFromPath(pathname: string): Locale | null {
  return asLocale(pathname.split('/')[1]?.toLowerCase());
}

