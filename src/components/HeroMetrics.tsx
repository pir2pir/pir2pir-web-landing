import type {Copy} from '../i18n';

/**
 * The only part of the page whose content is not settled at build time: the shell is prerendered
 * like everything else, and `src/metrics.ts` fills in the figures from `/metrics/public` after
 * first paint.
 *
 * Every string the script needs travels with the panel as a data attribute. The alternative —
 * importing the copy into the browser bundle — would ship all three languages to every visitor to
 * use one of them, and this page already knows which one it is.
 *
 * It renders invisible and reserves its space, rather than appearing when the data lands. A panel
 * that pops into an empty column moves the page; one that fades into a space already held does not.
 * If the request fails the script removes the element outright, and the hero falls back to the
 * single column it has without JavaScript.
 */
export function HeroMetrics({copy}: {copy: Copy['metrics']}) {
  return (
    <aside
      className="metrics"
      aria-label={copy.title}
      data-metrics
      data-change={copy.change}
      data-chart={copy.chart}
      data-searching={copy.searching}
      data-open-chats={copy.openChats}
      /* Absent forms are simply absent attributes: Uzbek has one, English two, Russian four. */
      data-day-one={copy.days.one}
      data-day-few={copy.days.few}
      data-day-many={copy.days.many}
      data-day-other={copy.days.other}
    >
      <p className="metrics__eyebrow">
        <span>{copy.title}</span>
        <span className="metrics__live" data-metrics-live hidden>
          <span className="metrics__pulse" aria-hidden="true" />
          <span data-metrics-live-text />
        </span>
      </p>

      <p className="metrics__figure">
        {/* An em dash rather than a zero: the figure is unknown until the fetch lands, and a zero
            is a claim. Nobody sees it — the panel is invisible until there is something to show. */}
        <span className="metrics__value" data-metric="peers">
          —
        </span>
        <span className="metrics__change" data-change hidden />
      </p>
      <p className="metrics__label">{copy.peers}</p>

      {/* Each tile is dropped by the script when its total is zero, and the row with it when they
          all are. "0 reviews" is a fact about a service nobody has used yet, and a hero that
          volunteers it is arguing against itself; the figures that are real still stand. */}
      <ul className="metrics__tiles" data-metrics-tiles>
        {(
          [
            ['reviews', copy.reviews],
            ['messages', copy.messages],
            ['campuses', copy.campuses],
          ] as const
        ).map(([key, label]) => (
          <li className="metrics__tile" key={key}>
            <p className="metrics__tile-value">
              <span data-metric={key}>—</span>
              <span className="metrics__delta" data-delta={key} hidden />
            </p>
            <p className="metrics__tile-label">{label}</p>
          </li>
        ))}
      </ul>

      {/* Bleeds to the card's edges, so the curve reads as the surface the figures sit on rather
          than as a fourth tile. Hidden until there is growth to draw — a flat line at zero says
          less than no line at all. */}
      <div className="metrics__chart" data-metrics-chart hidden>
        <p className="metrics__caption" data-metrics-caption />
      </div>
    </aside>
  );
}
