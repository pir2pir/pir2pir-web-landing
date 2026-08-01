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
      Лендинг <b><a href="https://pir2pir.ru">pir2pir.ru</a></b> — три статических документа, по
      одному на язык, собранных из React на этапе сборки.
    </td>
  </tr>
</table>

**Русский** · [English](README.en.md) · [Oʻzbekcha](README.uz.md)

[![CI](https://github.com/pir2pir/pir2pir-web-landing/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/pir2pir/pir2pir-web-landing/actions/workflows/ci.yml)
![Node](https://img.shields.io/badge/node-%E2%89%A520-informational)
![Зависимостей в рантайме нет](https://img.shields.io/badge/runtime%20deps-none-informational)
![Языки](https://img.shields.io/badge/%D1%8F%D0%B7%D1%8B%D0%BA%D0%B8-ru%20%C2%B7%20en%20%C2%B7%20uz-informational)

Pir2Pir находит участника Школы 21, который проверит ваш проект, и даёт место, где об этом
договориться. В этом репозитории только лендинг — приложение, бот и API живут отдельно.

### Ссылки

**[Сайт](https://pir2pir.ru)** · [Веб-приложение](https://app.pir2pir.ru) ·
[Документация](https://docs.pir2pir.ru)

**Telegram** — [бот](https://t.me/pir2pirbot) · [новости](https://t.me/pir2pirnews) ·
[чат](https://t.me/pir2pircommunity)

**MAX** — [бот](https://max.ru/id024803896842_3_bot) · [канал](https://max.ru/id24803896842_biz6)

### Разработка

Нужен только Node ≥ 20. В браузер отсюда не уезжает ничего: React, Vite и esbuild работают на сборке,
а наружу идут готовые HTML, CSS и два маленьких скрипта.

```bash
npm ci
npm run dev        # отдаёт те же документы, что пишет сборка
npm run typecheck
npm run build      # -> dist/
npm test           # проверяет собранный бандл, поэтому запускать после build
```

### Дальше

| | |
| --- | --- |
| [docs/architecture.md](docs/architecture.md) | как это устроено: пререндер, языки, метрики в hero, SEO, манифесты |
| [docs/product-overview.md](docs/product-overview.md) | что такое Pir2Pir и что о нём можно утверждать |
