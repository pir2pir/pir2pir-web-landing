# pir2pir-web-landing

Landing page for **https://pir2pir.ru**. React + TypeScript, built with Vite, served as static files
by nginx.

## Local development

```bash
npm ci
npm run dev        # http://localhost:5173
npm run typecheck
npm run build      # -> dist/
docker build -t landing . && docker run --rm -p 8098:8080 landing
```

## Design

The palette comes from the mark: rose `#E11D48` to amber `#EA580C`. Those two stops are used for the
gradient, accents and surfaces — **not** for body text. `#E11D48` on white is 4.1:1, which passes for
large text but not for running copy, so text uses darkened neutrals instead.

Plain CSS with custom properties, no framework: the page is one screen of content and a build-time
CSS toolchain would outweigh it.

## Pipeline

| Trigger | What happens |
| --- | --- |
| push to `develop` | CI typechecks, builds, pushes image `sha-<commit>` and `latest` |
| push to `production` | CI runs, then Deploy ships `sha-<commit>` over SSH |

**Promotion is free.** A fast-forward merge from `develop` to `production` keeps the same commit sha,
so the deploy resolves `sha-<commit>` to the image CI already built — the artifact reaching the
server is byte-identical to the one tested on develop.

CI fails the build if the operator registry number is missing from the bundle. That footer is a
compliance requirement rather than decoration, and a refactor could quietly drop it.

## Runtime

Multi-stage image: Node builds, `nginx-unprivileged` serves as uid 101 on port 8080. On the server,
`docker-compose` publishes to `127.0.0.1:8082` and the host nginx terminates TLS for `pir2pir.ru`.

Fingerprinted `/assets/` are immutable for a year; `index.html` is `must-revalidate`, so a deploy
reaches browsers holding a cached copy. Unknown paths fall back to the shell, but a missing file
under `/assets/` still 404s rather than silently returning HTML.

`deploy/nginx/pir2pir.ru.conf` claims the apex from the server's catch-all and redirects `www` to it.

## Required repository configuration

| Kind | Name | Purpose |
| --- | --- | --- |
| Environment `production` secret | `SSH_KEY` | deploy key for the server |
| Environment `production` variable | `SSH_HOST`, `SSH_PORT`, `SSH_USER` | deploy target |
| Environment `production` variable | `ENV_PROD` | written to `/opt/pir2pir-web-landing/.env` |
