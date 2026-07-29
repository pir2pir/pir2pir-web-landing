import {asLocale, type Locale} from './locale';

/** What the browser actually offers, narrowed to the shape `detectLocale` wants. */
export function browserLanguages(): readonly string[] {
  if (navigator.languages?.length) return navigator.languages;
  return navigator.language ? [navigator.language] : [];
}

const STORAGE_KEY = 'pir2pir.locale';

/** A choice the visitor made themselves. Storage throws in Safari's private mode, hence the guard. */
export function readStoredLocale(): Locale | null {
  try {
    return asLocale(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function storeLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // A visitor who blocks storage still gets detection on every visit; nothing else to do.
  }
}
