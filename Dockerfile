# syntax=docker/dockerfile:1
# Static build of the landing page, served by nginx. Reproducible from a commit sha: nothing is
# fetched at runtime and no environment is baked in.

# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app

# Restore first so the dependency layer caches independently of source changes.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- serve ----
# Unprivileged nginx: runs as uid 101 on port 8080, so the container needs no root.
FROM nginxinc/nginx-unprivileged:alpine AS runtime

COPY --chown=nginx:nginx nginx/site.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1
