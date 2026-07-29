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
  const document = {
    readyState: 'loading',
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

// Detection at the root: ru stays, uz goes to /uz/, everything else to /en/.
assert.deepEqual(visit({path: '/', languages: ['ru-RU']}).redirects, []);
assert.deepEqual(visit({path: '/', languages: ['uz-UZ']}).redirects, ['/uz/']);
assert.deepEqual(visit({path: '/', languages: ['uz-Latn-UZ']}).redirects, ['/uz/']);
assert.deepEqual(visit({path: '/', languages: ['de-DE', 'fr']}).redirects, ['/en/']);
assert.deepEqual(visit({path: '/', languages: []}).redirects, ['/en/']);

// Preference order, not mere presence: an English-first browser is not Russian.
assert.deepEqual(visit({path: '/', languages: ['en-US', 'ru']}).redirects, ['/en/']);

// A stored choice outranks the browser, in both directions.
assert.deepEqual(visit({path: '/', stored: 'en', languages: ['ru-RU']}).redirects, ['/en/']);
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

// The header starts unmarked; the class is driven by scroll position, not by page load.
assert.equal(visit({path: '/', languages: ['ru-RU']}).headerScrolled, false);

console.log('boot script: all scenarios pass');
