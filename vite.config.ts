import {defineConfig, type Plugin} from 'vite';
import {ROOT_LOCALE, localeFromPath} from './src/i18n/locale';
import {DOCUMENTS_PATH, METRICS_DEV_PATH, METRICS_URL} from './src/links';
import {renderManifest} from './src/manifest';

/**
 * Structural rather than imported: pulling a .tsx module into this config would drag JSX and the DOM
 * library into the Node half of the type project for one function signature.
 */
type DevAssets = {
  stylesheet?: string;
  script: string;
  scriptAsModule?: boolean;
  metricsEndpoint?: string;
};

type RenderModule = {
  renderPage: (locale: string, assets: DevAssets) => string;
  renderDocumentationPage: (assets: DevAssets) => string;
};

/** Structural, like `RenderModule` above: one response, one content type, no Node types dragged in. */
type ResponseLike = {
  setHeader: (name: string, value: string) => void;
  end: (body: string) => void;
};

function send(res: ResponseLike, type: string, body: string): void {
  res.setHeader('Content-Type', `${type}; charset=utf-8`);
  res.end(body);
}

/** A document request is one for a path with no file extension — Vite has already had its turn. */
function isDocumentRequest(url: string, accept: string | undefined): boolean {
  if (accept?.includes('text/html')) return true;
  const lastSegment = url.slice(url.lastIndexOf('/') + 1);
  return !lastSegment.includes('.');
}

/**
 * Vite is a development tool here and nothing else — `npm run build` prerenders the site with
 * esbuild and never calls Vite. This plugin makes the dev server return the same document the build
 * writes, so what you look at while editing is what ships.
 */
function prerenderDevServer(): Plugin {
  return {
    name: 'pir2pir-prerender-dev',
    apply: 'serve',

    configureServer(server) {
      // Registered after Vite's own middlewares so asset requests are served before this sees them.
      return () => {
        server.middlewares.use(async (req, res, next) => {
          const url = (req.url ?? '/').split('?')[0] ?? '/';

          // The one file in the head that public/ cannot answer for, since the build writes one per
          // locale. Rendered here too, or the link that can least be checked by reading the page
          // would also be the one that 404s here and nowhere else.
          if (url.endsWith('/site.webmanifest')) {
            const manifest = renderManifest(localeFromPath(url) ?? ROOT_LOCALE);
            return send(res, 'application/manifest+json', manifest);
          }

          if (!isDocumentRequest(url, req.headers.accept)) return next();

          const locale = localeFromPath(url) ?? ROOT_LOCALE;

          try {
            const module = (await server.ssrLoadModule('/src/render.tsx')) as RenderModule;

            // One module entry, so Vite owns the stylesheet and can hot-reload it. It is deferred,
            // unlike the classic script the build emits — a dev-only difference, and only visible
            // as a beat before the locale redirect fires.
            const assets = {
              script: '/src/dev-entry.ts',
              scriptAsModule: true,
              // Through the proxy below rather than straight at the API: localhost is not an allowed
              // origin there, and adding it would widen a policy that also governs signed-in calls.
              metricsEndpoint: METRICS_DEV_PATH,
            };

            // The documents page is its own document, so the dev server has to route to it the way
            // the build writes it — otherwise /documentation/ would render the landing here and the
            // one page that cannot be checked by reading the landing would be unviewable.
            const html = url.startsWith(`${DOCUMENTS_PATH}/`)
              ? module.renderDocumentationPage(assets)
              : module.renderPage(locale, assets);

            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(await server.transformIndexHtml(url, html));
          } catch (error) {
            server.ssrFixStacktrace(error as Error);
            next(error);
          }
        });
      };
    },
  };
}

export default defineConfig({
  // Vite serves no index.html of its own; every document comes from the plugin above.
  appType: 'custom',
  plugins: [prerenderDevServer()],
  esbuild: {jsx: 'automatic'},

  server: {
    /*
     * Development reads the same figures the built page does, through this server rather than from
     * the browser: the API grants CORS to `https://pir2pir.ru` and to nothing else, so the request
     * has to be made by something that is not a browser on localhost. Adding localhost to that
     * allowlist would widen a policy that also governs signed-in calls.
     */
    proxy: {
      [METRICS_DEV_PATH]: {
        target: new URL(METRICS_URL).origin,
        changeOrigin: true,
        // Only the prefix moves; the query the page asked with is the query the API is asked with.
        rewrite: (path) => path.replace(METRICS_DEV_PATH, new URL(METRICS_URL).pathname),
      },
    },
  },
});
