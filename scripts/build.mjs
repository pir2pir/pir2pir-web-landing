/*
 * Bootstraps the prerender. `src/prerender.tsx` imports the React components it renders, so it has
 * to be bundled for Node before it can run; this is the smallest thing that can do that, and it is
 * plain JavaScript so nothing has to compile it first.
 */

import {rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';

const OUTFILE = '.build/prerender.mjs';

await build({
  entryPoints: ['src/prerender.tsx'],
  outfile: OUTFILE,
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node20',
  jsx: 'automatic',
  // react, react-dom and esbuild itself resolve from node_modules at run time.
  packages: 'external',
  logLevel: 'error',
});

await import(pathToFileURL(OUTFILE).href);
await rm('.build', {recursive: true, force: true});
