# pir2pir-web-landing

Landing page for **https://pir2pir.ru**. Three static documents — one per language — prerendered
from React at build time and served by nginx.

## Local development

```bash
npm ci
npm run dev        # http://localhost:5173 — serves the same documents the build writes
npm run typecheck
npm run build      # -> dist/
npm test           # runs the built boot script against a stubbed page
npm run preview    # serves dist/
docker build -t landing . && docker run --rm -p 8098:8080 landing   # needs dist/ to exist
```

## Nothing is rendered in the browser

React is a build-time template here and never reaches a visitor. `npm run build` writes finished
HTML for `/`, `/en/` and `/uz/`, so a crawler, a link preview and a visitor with JavaScript off all
get the whole page — including a `<head>` that is genuinely in the page's own language.

The site ships two scripts. `src/boot.ts` (~1.5 kB) does the three things static HTML cannot: send a
first-time visitor to the language they read, tell the sticky header when the page has scrolled, and
mark the document scriptable so the hero can lay out for a panel that only exists with JavaScript. It
is a classic, render-blocking script rather than a module, because a deferred redirect is a flash of
the wrong language.

`src/metrics.ts` (~3.5 kB) is deferred, and fills in the hero panel — see below. Nothing it does has
to happen before paint, so nothing waits for it.

The pipeline is small enough to read in one sitting:

| Step | File | Output |
| --- | --- | --- |
| bootstrap | `scripts/build.mjs` | bundles the prerender for Node |
| prerender | `src/prerender.tsx` | `dist/` — documents, fingerprinted CSS and both scripts |
| document | `src/render.tsx` | one complete `<html>` per locale |
| structured data | `src/structured-data.ts` | the JSON-LD inside each of them |
| manifest | `src/manifest.ts` | one `site.webmanifest` per locale |
| dev server | `vite.config.ts` | the same document, rendered per request |

Vite is a development dependency in the literal sense: `npm run build` never calls it. It exists so
`npm run dev` can render the page per request and hot-reload the stylesheet.

## Design

The palette comes from the mark: rose `#E11D48` to amber `#EA580C`. Those two stops are used for the
gradient, accents and surfaces — **not** for body text. `#E11D48` on white is 4.1:1, which passes for
large text but not for running copy, so text uses darkened neutrals instead.

Plain CSS with custom properties, no framework: the page is one screen of content and a build-time
CSS toolchain would outweigh it.

The header is sticky and, at rest, carries the hero's tint with a transparent border — the top of the
page reads as a single surface. Past 8px of scroll the boot script adds `.site-header--scrolled` and
it becomes a translucent blurred bar. The border is transparent rather than absent so that gaining it
costs no layout shift.

## The hero metrics

The one figure on the page that is not written into it. `src/metrics.ts` reads `/metrics/public`
after paint and fills the card beside the headline: how many peers there are, how many of them
arrived this week, and a curve of the same growth behind the numbers.

**The call is cross-origin**, straight to `api.pir2pir.ru`, so the API has to allow `pir2pir.ru` to
read it — the figures are anonymous and aggregate, but a browser will not hand the page a response
from another origin without being told to. The API caches them for five minutes in its own headers,
so a second visit inside that window costs no request at all.

The URL is written into the document (`data-metrics` on the panel) rather than compiled into the
bundle, which is what lets `npm run dev` point the same script at a path it proxies instead:
localhost is not an allowed origin, and it should not become one.

Every failure removes the panel: a bad status, a body that is not the API's, or no peers registered
yet. The hero then falls back to the single column it uses without JavaScript, which is also what
`:has(.metrics)` in the stylesheet is for — the second column exists only while the panel does.

What the panel will not do:

- **Show a zero.** A total nobody has moved yet is dropped, and the row of tiles with it. "0 reviews"
  is true and argues against the page saying it.
- **Show live counts that the API withheld.** They come back `null` under a floor of five, because an
  exact "two people searching" beside a small community identifies those two. Null is not zero.
- **Draw a chart on a truncated axis.** The curve is cumulative registrations *within its window*, so
  it starts at zero and only climbs. Anchoring it to the running total instead would put the baseline
  two thirds of the way up the card and overstate every shape it drew.

The window is picked from the data rather than fixed: the shortest of 7, 14, 30 and 90 days with
three days of joining in it, failing that the shortest with any. The caption names whichever it
chose. Smoothing is a cubic per step with horizontal tangents, which cannot overshoot — a curve that
bulges above the day it is heading for is drawing growth that did not happen.

## Languages

Russian, English and Uzbek, laid out the way `docs.pir2pir.ru` is — Russian at the root, the others
under a prefix:

| Locale | URL | Legal documents |
| --- | --- | --- |
| `ru` | `/` | `docs.pir2pir.ru/legal/…` |
| `en` | `/en/` | `docs.pir2pir.ru/en/legal/…` |
| `uz` | `/uz/` | `docs.pir2pir.ru/uz/legal/…` |

Each is a real document, so the switcher is three plain links and switching needs no JavaScript.
Only the root is ambiguous, and only there does `boot.ts` decide: **stored choice → browser**. The
first of `navigator.languages` that is `ru` or `uz` wins, anything else falls back to `en`.
Preference order matters — a browser set to `['en-US', 'ru']` gets English, not Russian. Arriving on
`/en/` or `/uz/` is itself a choice, and is remembered.

nginx redirects `/ru/` to `/` permanently: two URLs with the same content is the one thing `hreflang`
cannot repair.

Copy lives in `src/i18n/copy/{ru,en,uz}.ts` behind one `Copy` type, so a missing or misspelled key
fails `npm run typecheck` rather than rendering blank. Registry numbers are **not** in the copy —
they are single-sourced from `src/links.ts`, since they read the same in every language.
`src/i18n/locale.ts` holds the pure half (locales, URL shapes, detection) and `detect.ts` the
browser-only half, so the build and the dev config can import the first without dragging in the DOM.

## Icons

Four declarations cover every consumer, per the current favicon consensus: `favicon.ico` (16/32/48)
for browsers that still ask for it, `icon-512.svg` for the ones that prefer SVG at any size,
`apple-touch-icon.png` at 180px for iOS, and `site.webmanifest` for Android. The SVG icon is the
rounded gradient tile rather than the bare mark, so a 16px tab and a home screen show the same thing.
`icon-512-square.svg` is the unrounded raster source — iOS and Android apply their own corner mask,
and baking one in would round the corners twice.

`public/og.svg` is the same kind of thing for `og.png`, the 1200×630 card every link preview shows.
It is rendered once, by hand, and committed — there is no rasteriser in the toolchain and adding one
for a file that changes when the logo does would cost more than it saves:

```bash
chrome --headless --window-size=1200,630 --screenshot=public/og.png <a page embedding og.svg>
```

The card carries the mark, the name and the domain, and no tagline. `og:title` and `og:description`
are already written per language; a fourth copy inside a PNG is the one that goes stale, because
nothing typechecks an image.

## Search engines and shared links

Everything a crawler reads is written by the build, per locale, and none of it is visible on the
page — so CI greps for all of it rather than trusting a refactor to keep it.

| What | Where | Why it is there |
| --- | --- | --- |
| `canonical` + `hreflang` | `src/render.tsx` | three URLs, one page each, and the set they belong to |
| `robots` | `src/render.tsx` | the permissive default said out loud, with `max-image-preview:large` so the card above is not shrunk to a favicon |
| `yandex-verification` | `src/links.ts` | ownership proof for Yandex Webmaster, on all three documents |
| `og:*` + `twitter:card` | `src/render.tsx` | the preview: localised title and description, one shared image |
| JSON-LD | `src/structured-data.ts` | `WebSite`, `WebPage`, `WebApplication` and the operator, as data |
| `robots.txt` | `public/robots.txt` | one wildcard group, nothing disallowed |
| `sitemap.xml` | `public/sitemap.xml` | all three URLs, each naming every alternate |

The JSON-LD says nothing the page does not: the platform, the languages it is written in, and the
operator the footer already names with the same registry numbers. Markup that claims more than the
document supports is markup a search engine eventually learns to discount.

`sitemap.xml` is a static file, edited by hand and copied out of `public/` verbatim — three URLs on a
site that gains one about as often as it gains a language. It carries no `lastmod`: a date nobody
remembers to move is worse than no date at all, because a crawler that finds `lastmod` stale learns
to ignore the field everywhere on the site.

What it does have is a guard. Adding a language means adding an entry, and nothing about writing
`uz.ts` reminds you of that — so CI compares the file against the documents that were actually built,
in both directions: every `index.html` in `dist/` must appear as a `<loc>`, and every `<loc>` must
resolve to one. Neither list is written down in the check.

**Yandex needs no `Host` directive.** It retired that in 2018 and reads the canonical link instead —
one origin is declared by `<link rel="canonical">` and by the `www` → apex redirect in
`deploy/nginx/`, not in `robots.txt`. `robots.txt` also has exactly one `User-agent: *` group on
purpose: a named group *replaces* the wildcard one for that crawler rather than adding to it, so a
`User-agent: Yandex` block written today is a block that silently misses whatever is added to `*`
tomorrow.

## The web app manifest

One per locale — `/site.webmanifest`, `/en/site.webmanifest`, `/uz/site.webmanifest` — for the same
reason the `<head>` is prerendered per locale: a shared manifest is an install prompt, a home screen
label and a splash screen in a language the visitor did not choose.

Each declares its own `lang`, its own `name` and `description` from that locale's copy, and its own
`id` and `start_url`, so the three install as three apps and the English icon opens the English page
instead of landing on Russian and waiting for `boot.ts` to correct itself. `scope` stays `/` for all
three: the language switcher is three plain links, and a scope narrowed to `/en/` would send anyone
who used it out of the installed app and into a browser tab.

The icons are declared twice on purpose. The rounded tile is `purpose: "any"`, for platforms that
show an icon as it was drawn; the square source is `purpose: "maskable"`, for the ones that apply
their own mask — the mark stays inside the 80% safe circle, so a launcher cropping to a circle takes
the padding and not the artwork.

## Pipeline

| Trigger | What happens |
| --- | --- |
| push to `develop` | CI typechecks, builds `dist/`, verifies it, pushes image `sha-<commit>` and `latest` |
| push to `production` | CI runs, then Deploy ships `sha-<commit>` over SSH |

**CI builds the site; the image only serves it.** `Dockerfile` has no build stage — it copies the
`dist/` that CI produced and verified, so the bytes in the image are the bytes that passed the
checks rather than the output of a second compile that merely ought to match. Building locally
therefore means running `npm run build` before `docker build`.

**Promotion is free.** A fast-forward merge from `develop` to `production` keeps the same commit sha,
so the deploy resolves `sha-<commit>` to the image CI already built — the artifact reaching the
server is byte-identical to the one tested on develop.

CI fails if a document is missing, is not prerendered, declares the wrong language, links another
language's legal documents, or drops the operator registry number. That footer is a compliance
requirement rather than decoration, and a refactor could quietly lose it.

It fails on the invisible half too: a missing canonical, Yandex verification tag, preview image or
JSON-LD block; a locale without its own manifest, or one declaring the wrong language; a document
missing from `sitemap.xml` or listed there without existing; or a `Disallow` appearing in
`robots.txt`. None of that shows up by looking at the page, which is the whole reason it is checked
here.

`npm test` runs `scripts/boot.test.mjs` against the bundle in `dist/`, not against the source, so it
asserts what ships. It covers the routing table the rest of the build cannot check: who gets
redirected where, whose stored choice outranks their browser, and that picking Russian from an
English page actually reaches the Russian page.

## Runtime

`nginx-unprivileged` serves as uid 101 on port 8080. On the server, `docker-compose` publishes to
`127.0.0.1:8082` and the host nginx terminates TLS for `pir2pir.ru`.

Fingerprinted `/assets/` are immutable for a year; icons and the manifests get a week; documents,
`robots.txt` and `sitemap.xml` are `must-revalidate`, so a deploy reaches browsers and crawlers
holding a cached copy. There is no SPA fallback — an unknown path is a real 404, because there is no
longer a client-side router to hand it to. `absolute_redirect off` keeps the container from naming
`127.0.0.1:8080` in a `Location` header, and `site.webmanifest` needs an explicit `default_type`
because nginx's `mime.types` does not know the extension — matched by suffix rather than exact path,
since every locale ships one.

`deploy/nginx/pir2pir.ru.conf` claims the apex from the server's catch-all and redirects `www` to it.

## Required repository configuration

| Kind | Name | Purpose |
| --- | --- | --- |
| Environment `production` secret | `SSH_KEY` | deploy key for the server |
| Environment `production` variable | `SSH_HOST`, `SSH_PORT`, `SSH_USER` | deploy target |
| Environment `production` variable | `ENV_PROD` | written to `/opt/pir2pir-web-landing/.env` |
