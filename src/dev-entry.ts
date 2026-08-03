/*
 * Development entry, never built. Vite serves CSS through the module graph, so importing the
 * stylesheet here is what makes edits hot-reload; the build has no equivalent, because it emits a
 * plain <link> and a classic boot script instead.
 */

import './styles.css';
import './boot';
import './metrics';
import './lightbox';
