# syntax=docker/dockerfile:1
# Serves a dist/ that was already built and tested by CI. There is no build stage on purpose: the
# bytes shipped here are the exact bytes the pipeline verified, rather than the output of a second
# compile that merely ought to match.
#
# Requires `npm run build` to have run first — locally, or as the CI step that feeds this context.

FROM nginxinc/nginx-unprivileged:alpine

COPY --chown=nginx:nginx nginx/site.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1
