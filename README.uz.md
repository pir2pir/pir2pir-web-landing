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
      <b><a href="https://pir2pir.ru">pir2pir.ru</a></b> uchun landing — har bir tilga bittadan
      uchta statik hujjat, yigʻish bosqichida React'dan render qilinadi.
    </td>
  </tr>
</table>

[Русский](README.md) · [English](README.en.md) · **Oʻzbekcha**

[![CI](https://github.com/pir2pir/pir2pir-web-landing/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/pir2pir/pir2pir-web-landing/actions/workflows/ci.yml)
![Node](https://img.shields.io/badge/node-%E2%89%A520-informational)
![Runtime bogʻliqliklari yoʻq](https://img.shields.io/badge/runtime%20deps-none-informational)
![Tillar](https://img.shields.io/badge/tillar-ru%20%C2%B7%20en%20%C2%B7%20uz-informational)

Pir2Pir loyihangizni tekshiradigan School 21 ishtirokchisini topadi va ikkalasiga kelishib olish uchun
joy beradi. Bu repozitoriyda faqat landing bor — ilova, bot va API alohida yashaydi.

### Havolalar

**[Sayt](https://pir2pir.ru)** · [Veb-ilova](https://app.pir2pir.ru) ·
[Hujjatlar](https://docs.pir2pir.ru)

**Telegram** — [bot](https://t.me/pir2pirbot) · [yangiliklar](https://t.me/pir2pirnews) ·
[chat](https://t.me/pir2pirchat)

**MAX** — [bot](https://max.ru/id024803896842_3_bot) · [kanal](https://max.ru/id24803896842_biz6)

### Ishlab chiqish

Faqat Node ≥ 20 kerak. Bu yerdan brauzerga hech narsa ketmaydi: React, Vite va esbuild yigʻish
bosqichida ishlaydi, tashqariga esa tayyor HTML, CSS va ikkita kichik skript chiqadi.

```bash
npm ci
npm run dev        # yigʻish yozadigan hujjatlarning oʻzini beradi
npm run typecheck
npm run build      # -> dist/
npm test           # yigʻilgan bundle'ni tekshiradi, shuning uchun build'dan keyin
```

### Davomi

| | |
| --- | --- |
| [docs/architecture.md](docs/architecture.md) | qanday ishlaydi: prerender, tillar, hero metrikalari, SEO, manifestlar |
| [docs/product-overview.md](docs/product-overview.md) | Pir2Pir nima va u haqida nima deyish mumkin |
