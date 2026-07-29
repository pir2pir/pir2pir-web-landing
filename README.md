# pir2pir-web-landing

Landing page for **https://pir2pir.ru**. Three static documents — one per language — prerendered
from React at build time and served by nginx.

## Local development

```bash
npm ci
npm run dev        # http://localhost:5173 — serves the same documents the build writes
npm run typecheck
npm run build      # -> dist/
npm run preview    # serves dist/
docker build -t landing . && docker run --rm -p 8098:8080 landing   # needs dist/ to exist
```

## Nothing is rendered in the browser

React is a build-time template here and never reaches a visitor. `npm run build` writes finished
HTML for `/`, `/en/` and `/uz/`, so a crawler, a link preview and a visitor with JavaScript off all
get the whole page — including a `<head>` that is genuinely in the page's own language.

The site ships exactly one script, `src/boot.ts` (~1.3 kB), which does the two things static HTML
cannot: send a first-time visitor to the language they read, and tell the sticky header when the page
has scrolled. It is a classic, render-blocking script rather than a module, because a deferred
redirect is a flash of the wrong language.

The pipeline is small enough to read in one sitting:

| Step | File | Output |
| --- | --- | --- |
| bootstrap | `scripts/build.mjs` | bundles the prerender for Node |
| prerender | `src/prerender.tsx` | `dist/` — documents, fingerprinted CSS and boot script |
| document | `src/render.tsx` | one complete `<html>` per locale |
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

## Runtime

`nginx-unprivileged` serves as uid 101 on port 8080. On the server, `docker-compose` publishes to
`127.0.0.1:8082` and the host nginx terminates TLS for `pir2pir.ru`.

Fingerprinted `/assets/` are immutable for a year; icons and the manifest get a week; documents are
`must-revalidate`, so a deploy reaches browsers holding a cached copy. There is no SPA fallback — an
unknown path is a real 404, because there is no longer a client-side router to hand it to.
`absolute_redirect off` keeps the container from naming `127.0.0.1:8080` in a `Location` header, and
`/site.webmanifest` needs an explicit `default_type` because nginx's `mime.types` does not know the
extension.

`deploy/nginx/pir2pir.ru.conf` claims the apex from the server's catch-all and redirects `www` to it.

## Required repository configuration

| Kind | Name | Purpose |
| --- | --- | --- |
| Environment `production` secret | `SSH_KEY` | deploy key for the server |
| Environment `production` variable | `SSH_HOST`, `SSH_PORT`, `SSH_USER` | deploy target |
| Environment `production` variable | `ENV_PROD` | written to `/opt/pir2pir-web-landing/.env` |
