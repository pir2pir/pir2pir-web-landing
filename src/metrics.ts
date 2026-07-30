/*
 * Fills the hero panel from `/metrics/public`. The second and last script on the page, and unlike
 * `boot.ts` it is deferred: nothing here has to happen before first paint, and the panel holds its
 * space either way.
 *
 * The endpoint is same-origin — nginx proxies and caches it in front of the API (see
 * `deploy/nginx/pir2pir.ru.conf`). That is one fewer TLS handshake than calling api.pir2pir.ru
 * directly, it keeps the landing page out of the API's CORS allow-list, and it means a burst of
 * traffic here reaches the database once every five minutes rather than once per visitor.
 *
 * Every failure ends the same way: the panel is removed and the hero is the single column it is
 * without JavaScript. A hero that renders "—" because a fetch failed is worse than one that never
 * promised a number.
 */

type Totals = {peers: number; reviews: number; messages: number; campuses: number};

type PublicMetrics = {
  totals: Totals;
  /** How much of each total arrived in the last `period_days` — the "+N" beside the figure. */
  change: Totals & {period_days: number};
  /** Null below a floor of five: an exact live count in a community this small identifies people. */
  live: {open_chats: number | null; peers_searching: number | null};
  /** Gap-free, oldest first. Null only if the series was not asked for. */
  daily: Array<{registrations: number}> | null;
};

const ENDPOINT = '/metrics/public';

const METRICS = ['peers', 'reviews', 'messages', 'campuses'] as const;

/** The three under the headline figure, each of which can be dropped on its own. */
const TILES = ['reviews', 'messages', 'campuses'] as const;

/**
 * Candidate windows for the chart, shortest first. The API is asked for the longest of them and the
 * window is chosen from the data rather than fixed here: on a service this young the difference
 * between a week and a quarter is the difference between a curve and a flat line.
 */
const WINDOWS = [7, 14, 30, 90];

/** Days with a registration that make a window worth preferring over a longer one. */
const BUSY_ENOUGH = 3;

const VIEW_WIDTH = 100;
const VIEW_HEIGHT = 40;

/** Top margin in view units, so the peak of the curve is not flush against the card's edge. */
const HEADROOM = 6;

/**
 * Bottom margin, for the same reason at the other end — and a stronger one. Days before the first
 * registration are drawn flat at zero, and a zero sitting exactly on the card's bottom border reads
 * as a stray rule rather than as part of the curve. The fill still runs to the edge underneath it.
 */
const FLOOR = 5;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

async function fill(panel: HTMLElement): Promise<void> {
  try {
    const response = await fetch(`${ENDPOINT}?days=${WINDOWS[WINDOWS.length - 1]}`, {
      headers: {accept: 'application/json'},
    });

    if (!response.ok) throw new Error(`metrics: HTTP ${response.status}`);

    const metrics = (await response.json()) as PublicMetrics;

    // A proxy that answers with something other than the API — an error page, a login wall — parses
    // as JSON often enough to be worth one check before the panel is shown.
    if (typeof metrics?.totals?.peers !== 'number') throw new Error('metrics: unexpected shape');

    // Before anyone has signed up there is no community to point at, and a panel that says so is
    // worse than the hero without it.
    if (metrics.totals.peers === 0) throw new Error('metrics: nothing to show yet');

    render(panel, metrics);
  } catch {
    panel.remove();
  }
}

function render(panel: HTMLElement, metrics: PublicMetrics): void {
  const locale = document.documentElement.lang || 'ru';
  const format = new Intl.NumberFormat(locale).format;

  // A figure nobody has moved yet is dropped rather than shown as a zero. What is left keeps its
  // own shape: the tile row is a grid of equal columns however many of them survive.
  for (const key of TILES) {
    if (metrics.totals[key] === 0) panel.querySelector(`[data-metric="${key}"]`)?.closest('li')?.remove();
  }

  const tiles = panel.querySelector('[data-metrics-tiles]');
  if (tiles && tiles.children.length === 0) tiles.remove();

  for (const key of METRICS) {
    const value = panel.querySelector(`[data-metric="${key}"]`);
    if (value) countUp(value, metrics.totals[key], format);
  }

  const period = Math.max(metrics.change.period_days, 1);
  const unit = dayUnit(panel, period, locale);

  // Spelled out beside the headline figure, a bare "+N" on the smaller ones: the period is the same
  // for all four, and saying it once is what lets the others stay short.
  fillText(
    panel.querySelector('[data-change]'),
    metrics.change.peers > 0
      ? interpolate(panel.dataset.change, {count: format(metrics.change.peers), days: period, unit})
      : '',
  );

  for (const key of METRICS) {
    const delta = metrics.change[key];
    fillText(panel.querySelector(`[data-delta="${key}"]`), delta > 0 ? `+${format(delta)}` : '');
  }

  const live = metrics.live.peers_searching ?? metrics.live.open_chats;
  const template =
    metrics.live.peers_searching !== null ? panel.dataset.searching : panel.dataset.openChats;

  if (live !== null) {
    fillText(panel.querySelector('[data-metrics-live-text]'), interpolate(template, {count: format(live)}));
    reveal(panel.querySelector('[data-metrics-live]'));
  }

  drawChart(panel, metrics, {locale, format});

  // Last: the panel is invisible until it has something to say, and everything above is what it says.
  panel.dataset.state = 'ready';
}

/**
 * Cumulative registrations across the chosen window — how the community grew over it, which is the
 * one series the figure above the chart is about.
 *
 * It starts from zero on the day the window opens rather than from the total, so the curve begins at
 * the baseline and only climbs. Anchoring it to the total instead would mean a y-axis that starts
 * two thirds of the way up, and an area chart on a truncated axis overstates whatever it draws.
 */
function drawChart(
  panel: HTMLElement,
  metrics: PublicMetrics,
  text: {locale: string; format: (value: number) => string},
): void {
  const container = panel.querySelector<HTMLElement>('[data-metrics-chart]');
  const daily = metrics.daily;
  if (!container || !daily?.length) return;

  const chosen = chooseWindow(daily);
  if (chosen === null) return;

  const points = daily.slice(-chosen);

  let running = 0;
  const values = [0, ...points.map((point) => (running += Math.max(point.registrations, 0)))];
  if (running === 0) return;

  container.insertAdjacentHTML('beforeend', plot(values));

  // The window actually drawn, which is not the one asked for when the service is younger than it.
  const days = points.length;
  fillText(
    container.querySelector('[data-metrics-caption]'),
    interpolate(panel.dataset.chart, {days: text.format(days), unit: dayUnit(panel, days, text.locale)}),
  );

  reveal(container);
}

/** The shortest window with real movement in it; failing that, the shortest with any at all. */
function chooseWindow(daily: PublicMetrics['daily']): number | null {
  const active = (days: number) =>
    (daily ?? []).slice(-days).filter((point) => point.registrations > 0).length;

  return (
    WINDOWS.find((days) => active(days) >= BUSY_ENOUGH) ??
    WINDOWS.find((days) => active(days) >= 1) ??
    null
  );
}

/**
 * One series, so colour carries no meaning here and the brand ramp can be spent on the line itself:
 * rose and amber are eleven ΔE apart, which is too close to tell two series apart but is exactly
 * what a single gradient wants. The stops are read from the stylesheet rather than repeated, so the
 * palette stays in one file.
 *
 * The box is stretched to the card rather than measured — `preserveAspectRatio="none"` with a
 * non-scaling stroke keeps the line 2px whatever the panel's width, and saves a resize observer.
 */
function plot(values: number[]): string {
  const brand = getComputedStyle(document.documentElement);
  const rose = brand.getPropertyValue('--brand-rose').trim();
  const amber = brand.getPropertyValue('--brand-amber').trim();

  const peak = values[values.length - 1] ?? 0;
  const x = (index: number) => round((index / (values.length - 1)) * VIEW_WIDTH);
  const y = (value: number) =>
    round(VIEW_HEIGHT - FLOOR - (value / peak) * (VIEW_HEIGHT - HEADROOM - FLOOR));

  // A cubic per step whose control points sit halfway along it at the two end heights: the curve
  // leaves and arrives horizontally, so it eases between days without ever rising above the day it
  // is heading for. Smoothing that overshoots would draw growth that did not happen.
  let line = `M${x(0)},${y(values[0] ?? 0)}`;
  for (let index = 1; index < values.length; index += 1) {
    const middle = round((x(index - 1) + x(index)) / 2);
    line += `C${middle},${y(values[index - 1] ?? 0)} ${middle},${y(values[index] ?? 0)} ${x(index)},${y(values[index] ?? 0)}`;
  }

  const area = `${line}L${VIEW_WIDTH},${VIEW_HEIGHT}L0,${VIEW_HEIGHT}Z`;

  return `<svg class="metrics__plot" viewBox="0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}" preserveAspectRatio="none" aria-hidden="true" focusable="false">
<defs>
<linearGradient id="metrics-area" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${rose}" stop-opacity="0.24"/>
<stop offset="1" stop-color="${rose}" stop-opacity="0"/>
</linearGradient>
<linearGradient id="metrics-line" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="${rose}"/>
<stop offset="1" stop-color="${amber}"/>
</linearGradient>
</defs>
<path d="${area}" fill="url(#metrics-area)"/>
<path class="metrics__line" d="${line}" fill="none" stroke="url(#metrics-line)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" pathLength="1"/>
</svg>`;
}

/** Two decimals is under a tenth of a pixel at any width this panel reaches, and halves the path. */
function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Counts from zero to the figure. The numbers here are small enough to read every step of, which is
 * the point: a total that lands fully formed says the same thing as a total that arrives.
 */
function countUp(element: Element, value: number, format: (value: number) => string): void {
  if (reducedMotion || value <= 0) {
    element.textContent = format(value);
    return;
  }

  const DURATION = 700;
  const started = performance.now();

  const step = (now: number) => {
    const progress = Math.min((now - started) / DURATION, 1);
    element.textContent = format(Math.round(value * (1 - (1 - progress) ** 3)));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

/** `{count}` and friends by name, not by position: the order they appear in differs by language. */
function interpolate(template: string | undefined, values: Record<string, string | number>): string {
  return (template ?? '').replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
}

/** The plural form of "day" for this count, in the language the document is written in. */
function dayUnit(panel: HTMLElement, days: number, locale: string): string {
  const rule = new Intl.PluralRules(locale).select(days);
  const attribute = `day${rule.charAt(0).toUpperCase()}${rule.slice(1)}`;
  return panel.dataset[attribute] ?? panel.dataset.dayOther ?? '';
}

/** Empty text leaves the element hidden — a "+0" is not news, and an empty pill is a smudge. */
function fillText(element: Element | null, text: string): void {
  if (!element) return;
  element.textContent = text;
  if (text) reveal(element);
}

function reveal(element: Element | null): void {
  if (element instanceof HTMLElement) element.hidden = false;
}

const panel = document.querySelector<HTMLElement>('[data-metrics]');
if (panel) void fill(panel);
