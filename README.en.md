<table>
  <tr>
    <td rowspan="2" width="120" align="center" valign="middle">
      <img src="public/icon-512.png" width="96" alt="">
    </td>
    <td valign="bottom">
      <h1>pir2pir-web-landing</h1>
    </td>
  </tr>
  <tr>
    <td valign="top">
      Landing page for <b><a href="https://pir2pir.ru">pir2pir.ru</a></b> — three static documents,
      one per language, prerendered from React at build time.
    </td>
  </tr>
</table>

[Русский](README.md) · **English** · [Oʻzbekcha](README.uz.md)

[![CI](https://github.com/pir2pir/pir2pir-web-landing/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/pir2pir/pir2pir-web-landing/actions/workflows/ci.yml)
![Node](https://img.shields.io/badge/node-%E2%89%A520-informational)
![No runtime dependencies](https://img.shields.io/badge/runtime%20deps-none-informational)
![Languages](https://img.shields.io/badge/languages-ru%20%C2%B7%20en%20%C2%B7%20uz-informational)

Pir2Pir finds a School 21 student to review your project and gives the two of them a place to arrange
it. This repository is only the landing page — the app, the bot and the API live elsewhere.

### Links

**[Site](https://pir2pir.ru)** · [Web app](https://app.pir2pir.ru) ·
[Docs](https://docs.pir2pir.ru)

<img src="docs/assets/telegram.svg" width="14" align="top" alt="Telegram">
[Bot](https://t.me/pir2pirbot) ·
[News](https://t.me/pir2pirnews) ·
[Chat](https://t.me/pir2pirchat)

<img src="docs/assets/max.svg" width="14" align="top" alt="MAX">
[Bot](https://max.ru/id024803896842_3_bot) ·
[Channel](https://max.ru/id24803896842_biz6)

### Development

Node ≥ 20 and nothing else. Nothing here reaches the browser: React, Vite and esbuild are build-time
only, and what ships is finished HTML, CSS and two small scripts.

```bash
npm ci
npm run dev        # serves the same documents the build writes
npm run typecheck
npm run build      # -> dist/
npm test           # checks the built bundle, so run it after build
```

### Further

| | |
| --- | --- |
| [docs/architecture.md](docs/architecture.md) | how it works: prerender, languages, hero metrics, SEO, manifests |
| [docs/product-overview.md](docs/product-overview.md) | what Pir2Pir is, and what may be claimed about it |
