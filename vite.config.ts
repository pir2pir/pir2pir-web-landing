import {defineConfig, type Plugin} from 'vite';
import {ROOT_LOCALE, localeFromPath} from './src/i18n/locale';

/**
 * Structural rather than imported: pulling a .tsx module into this config would drag JSX and the DOM
 * library into the Node half of the type project for one function signature.
 */
type RenderModule = {
  renderPage: (
    locale: string,
    assets: {stylesheet?: string; script: string; scriptAsModule?: boolean},
  ) => string;
};

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
          if (!isDocumentRequest(url, req.headers.accept)) return next();

          const locale = localeFromPath(url) ?? ROOT_LOCALE;

          try {
            const module = (await server.ssrLoadModule('/src/render.tsx')) as RenderModule;

            // One module entry, so Vite owns the stylesheet and can hot-reload it. It is deferred,
            // unlike the classic script the build emits — a dev-only difference, and only visible
            // as a beat before the locale redirect fires.
            const html = module.renderPage(locale, {
              script: '/src/dev-entry.ts',
              scriptAsModule: true,
            });

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
     * The same same-origin path nginx serves in production, so the hero panel needs no idea which
     * of the two it is talking to. Proxying here rather than calling api.pir2pir.ru from the page
     * is also what keeps localhost out of the API's CORS allow-list: the request is made by this
     * server, not by the browser.
     *
     * The rewrite pins the query, exactly as the production block does — the page asks for the
     * metrics, not for an arbitrary window of them.
     */
    proxy: {
      '/metrics/public': {
        target: 'https://api.pir2pir.ru',
        changeOrigin: true,
        rewrite: () => '/api/metrics/public?days=90',
      },
    },
  },
});
