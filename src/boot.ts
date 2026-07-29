/*
 * The only script the page ships. Everything else is rendered to static HTML at build time, so this
 * stays small enough to be render-blocking in <head>: it has to run before first paint, or a
 * redirected visitor sees a flash of the wrong language.
 */

import {browserLanguages, readStoredLocale, storeLocale} from './i18n/detect';
import {ROOT_LOCALE, detectLocale, localeFromPath, pathForLocale} from './i18n/locale';

/**
 * Only the root can be ambiguous: `/en/` and `/uz/` are real prerendered documents, so arriving on
 * one is a choice and is remembered rather than second-guessed.
 */
function routeToPreferredLocale(): void {
  const fromPath = localeFromPath(window.location.pathname);

  if (fromPath) {
    storeLocale(fromPath);
    // `/ru/` is not a document — nginx already redirects it, but a dev server or a proxy might not.
    if (fromPath === ROOT_LOCALE) window.location.replace(withQuery(pathForLocale(fromPath)));
    return;
  }

  const preferred = readStoredLocale() ?? detectLocale(browserLanguages());
  if (preferred !== ROOT_LOCALE) window.location.replace(withQuery(pathForLocale(preferred)));
}

function withQuery(path: string): string {
  return path + window.location.search + window.location.hash;
}

const SCROLLED_CLASS = 'site-header--scrolled';

/** Past this many pixels the header stops being part of the hero and becomes a bar over the page. */
const SCROLL_THRESHOLD = 8;

function trackHeader(): void {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let queued = false;

  const sync = () => {
    queued = false;
    header.classList.toggle(SCROLLED_CLASS, window.scrollY > SCROLL_THRESHOLD);
  };

  window.addEventListener(
    'scroll',
    () => {
      // Scroll fires far faster than the page can paint; one class write per frame is enough.
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(sync);
    },
    {passive: true},
  );

  // Browsers restore scroll position on reload, so the state is not always "at the top".
  sync();
}

routeToPreferredLocale();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', trackHeader);
} else {
  trackHeader();
}
