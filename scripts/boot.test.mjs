/*
 * Exercises the built boot script — the one piece of behaviour that is not settled at build time,
 * and the one place a mistake sends a visitor to the wrong language. It runs the real bundle from
 * dist/ against a stubbed page rather than importing the source, so what is asserted is what ships.
 *
 * Run with `npm test`, after `npm run build`.
 */

import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';

const ASSETS = join(process.cwd(), 'dist/assets');
const bundle = readdirSync(ASSETS).find((name) => name.startsWith('boot-') && name.endsWith('.js'));

if (!bundle) throw new Error('no boot bundle in dist/assets — run `npm run build` first');

const source = readFileSync(join(ASSETS, bundle), 'utf8');

/** Node has no DOM, and the script narrows an event target with `instanceof Element`. */
class Element {}

/** Runs the shipped script against a stubbed page and reports what it did to it. */
function visit({path, stored, languages = []}) {
  const store = new Map(stored ? [['pir2pir.locale', stored]] : []);
  const redirects = [];
  let onSwitcherClick = null;
  let headerScrolled = null;

  const window = {
    location: {pathname: path, search: '', hash: '', replace: (to) => redirects.push(to)},
    localStorage: {getItem: (key) => store.get(key) ?? null, setItem: (k, v) => store.set(k, v)},
    scrollY: 0,
    addEventListener: () => {},
    requestAnimationFrame: (fn) => fn(),
  };

  const listeners = {};
  const documentClasses = new Set();
  const document = {
    readyState: 'loading',
    documentElement: {classList: {add: (name) => documentClasses.add(name)}},
    addEventListener: (name, fn) => (listeners[name] = fn),
    querySelector: (selector) => {
      if (selector === '.lang') return {addEventListener: (_, fn) => (onSwitcherClick = fn)};
      if (selector === '.site-header') return {classList: {toggle: (_, on) => (headerScrolled = on)}};
      return null;
    },
  };

  const globals = {window, document, navigator: {languages, language: languages[0]}, Element};

  new Function(...Object.keys(globals), source)(...Object.values(globals));
  listeners.DOMContentLoaded?.();

  return {
    redirects,
    stored: () => store.get('pir2pir.locale') ?? null,
    headerScrolled,
    scriptable: documentClasses.has('js'),
    /** Clicks a language in the switcher, as a visitor would. */
    choose(locale) {
      assert.ok(onSwitcherClick, 'the switcher has no click handler, so no choice can be recorded');

      const target = Object.assign(Object.create(Element.prototype), {
        closest: () => ({getAttribute: (name) => (name === 'lang' ? locale : null)}),
      });
      onSwitcherClick({target});
      return store.get('pir2pir.locale') ?? null;
    },
  };
}

// The root is Russian and stays Russian, whatever the browser asks for. It is the canonical URL, and
// a canonical URL that bounces the moment a script runs is one a search engine has to decide about.
assert.deepEqual(visit({path: '/', languages: ['ru-RU']}).redirects, []);
assert.deepEqual(visit({path: '/', languages: ['uz-UZ']}).redirects, []);
assert.deepEqual(visit({path: '/', languages: ['de-DE', 'fr']}).redirects, []);
assert.deepEqual(visit({path: '/', languages: ['en-US', 'ru']}).redirects, []);
assert.deepEqual(visit({path: '/', languages: []}).redirects, []);

// A stored choice still moves you: that is a decision this visitor made here, not a guess about them.
assert.deepEqual(visit({path: '/', stored: 'en', languages: ['ru-RU']}).redirects, ['/en/']);
assert.deepEqual(visit({path: '/', stored: 'uz', languages: ['ru-RU']}).redirects, ['/uz/']);
assert.deepEqual(visit({path: '/', stored: 'ru', languages: ['de-DE']}).redirects, []);

// A language URL is a choice: honoured, remembered, never redirected away from.
const onEnglish = visit({path: '/en/', stored: 'ru', languages: ['ru-RU']});
assert.deepEqual(onEnglish.redirects, []);
assert.equal(onEnglish.stored(), 'en');

// /ru/ is not a document. nginx redirects it; this is the belt to that pair of braces.
assert.deepEqual(visit({path: '/ru/', languages: ['ru-RU']}).redirects, ['/']);

// Picking Russian from an English page must actually reach the Russian page. Russian lives at the
// root, which is also the only URL that gets resolved — so without the click being recorded, the
// stored English preference bounces the visitor straight back to /en/.
const switching = visit({path: '/en/', stored: 'en', languages: ['en-US']});
assert.equal(switching.choose('ru'), 'ru', 'clicking RU must record the choice');
assert.deepEqual(
  visit({path: '/', stored: 'ru', languages: ['en-US']}).redirects,
  [],
  'after picking RU, the root must stop redirecting',
);

// Any page that is not the root is a page somebody asked for by name, and a stored preference must
// not move it. /documentation/ is the case that made this matter: it is Russian-only, so a visitor
// carrying a stored `en` would have been thrown onto the English landing and never seen the file.
for (const path of ['/documentation/', '/documentation/index.html', '/anything/else/']) {
  for (const stored of ['en', 'uz', 'ru', null]) {
    assert.deepEqual(
      visit({path, stored, languages: ['en-US']}).redirects,
      [],
      `${path} must not redirect (stored: ${stored})`,
    );
  }
}

// ...and the switcher still works there, so leaving in another language remains one click.
assert.equal(visit({path: '/documentation/', languages: ['ru-RU']}).choose('en'), 'en');

// The header starts unmarked; the class is driven by scroll position, not by page load.
assert.equal(visit({path: '/', languages: ['ru-RU']}).headerScrolled, false);

// The metrics panel takes its column from this class, so it has to be set before the page paints —
// on the page that stays, and on one that is only passing through on its way to another language.
assert.equal(visit({path: '/', languages: ['ru-RU']}).scriptable, true);
assert.equal(visit({path: '/', languages: ['de-DE']}).scriptable, true);

console.log('boot script: all scenarios pass');
