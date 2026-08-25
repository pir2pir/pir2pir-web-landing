import {HeroMetrics} from './components/HeroMetrics';
import {SiteFooter} from './components/SiteFooter';
import {SiteHeader} from './components/SiteHeader';
import {MaxMark} from './components/MaxMark';
import {TelegramMark} from './components/TelegramMark';
import {Logo} from './components/Logo';
import {COPY, LOCALES, LOCALE_LABEL, pathForLocale, type Locale} from './i18n';
import {FAQ_COPY} from './i18n/copy/faq';

/**
 * How many questions the landing answers before handing over to /faq/.
 *
 * It used to be all of them, and Yandex removed /faq/, /en/faq/ and /uz/faq/ from its index for it:
 * every answer on those pages appeared word for word on the landing, so they were duplicates of a
 * stronger page and it kept the stronger page. Four is enough for the section to be worth reading
 * and leaves the rest as a reason for the other page to exist.
 */
const FAQ_ON_LANDING = 4;
import {SCREENSHOTS, SCREENSHOT_FILE, SCREENSHOT_HEIGHT, SCREENSHOT_WIDTH} from './screenshots';
import {
  APP_URL,
  AUTHOR_LOGIN,
  BOT_URL,
  CONTACT_EMAIL,
  LEGAL_PATHS,
  SCHOOL_URL,
  docsUrl,
} from './links';

export function App({
  locale,
  metricsEndpoint,
  testimonialsEndpoint,
}: {
  locale: Locale;
  metricsEndpoint: string;
  testimonialsEndpoint: string;
}) {
  const copy = COPY[locale];
  const docs = (path?: string) => docsUrl(locale, path);

  return (
    <>
      <SiteHeader locale={locale} />

      <main id="main">
        <section className="hero">
          <div className="shell hero__grid">
            <div className="hero__content">
              <Logo height={64} className="hero__logo" />
              <h1 className="hero__title">
                {copy.hero.titleBefore}
                <span className="hero__accent">{copy.hero.titleAccent}</span>
                {copy.hero.titleAfter}
              </h1>
              <p className="hero__lead">{copy.hero.lead}</p>
              <div className="hero__actions">
                <a className="button button--primary" href={APP_URL}>
                  {copy.hero.app}
                </a>
                <a className="button button--secondary" href={BOT_URL}>
                  {copy.hero.bot}
                </a>
                <a className="button button--ghost" href="#how">
                  {copy.hero.how}
                </a>
                <a className="button button--ghost" href={docs()}>
                  {copy.nav.docs}
                </a>
              </div>
            </div>

            <HeroMetrics copy={copy.metrics} endpoint={metricsEndpoint} />
          </div>
        </section>

        <section className="section" id="how">
          <div className="shell">
            <h2 className="section__title">{copy.how.title}</h2>
            <p className="section__lead">{copy.how.lead}</p>
            <ol className="steps">
              {copy.how.steps.map((step, index) => (
                <li className="step" key={step.title}>
                  <span className="step__number" aria-hidden="true">
                    {index + 1}
                  </span>
                  <h3 className="step__title">{step.title}</h3>
                  <p className="step__body">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section showcase" id="shots">
          <div className="shell">
            <div className="showcase__text">
              <h2 className="section__title">{copy.shots.title}</h2>
              <p className="section__lead">{copy.shots.lead}</p>
            </div>

            {/*
              One shape, repeated: a card is a cropped screen, a title and a line. Two of them carry
              no screen — the grid needs somewhere to say what a picture cannot — but they are the
              same card, so this reads as a set of features rather than as pictures with text between
              them. The screen cards are links to the full image; the two text cards are not.
            */}
            <div className="bento">
              {SCREENSHOTS.map((shot) => {
                const screen = copy.shots.screens[shot];
                return (
                  <a
                    className="bento__cell card"
                    key={shot}
                    href={`/app/${SCREENSHOT_FILE[shot]}`}
                    data-shot
                    data-alt={screen.alt}
                    data-title={screen.title}
                    data-line={screen.line}
                  >
                    <span className="card__frame">
                      <img
                        src={`/app/${SCREENSHOT_FILE[shot]}`}
                        alt={screen.alt}
                        width={SCREENSHOT_WIDTH}
                        height={SCREENSHOT_HEIGHT}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <span className="card__body">
                      <span className="card__title">{screen.title}</span>
                      <span className="card__line">{screen.line}</span>
                    </span>
                  </a>
                );
              })}

              {/*
                The brand card. No screen, no link — the mark and the name in the middle of the
                evidence, saying what all the other cells are screenshots of.
              */}
              <div className="bento__cell card card--brand">
                <Logo height={34} decorative solid />
                <span className="card__title">{copy.brand}</span>
                <span className="card__line">{copy.shots.cards.brand.line}</span>
              </div>

              {/*
                Where it runs, as three rows rather than a sentence with three names in it. Each
                platform gets its own mark and its own line, so the card is scanned rather than read —
                which is the difference between a card that shows three places and one that lists them.
              */}
              <div className="bento__cell card card--text">
                <span className="card__title">{copy.shots.cards.reach.title}</span>
                <ul className="reach">
                  <li>
                    <span className="reach__mark">
                      <Logo height={15} decorative />
                    </span>
                    {copy.shots.cards.reach.web}
                  </li>
                  <li>
                    <span className="reach__mark">
                      <TelegramMark size={15} />
                    </span>
                    Telegram
                  </li>
                  <li>
                    <span className="reach__mark">
                      <MaxMark size={15} />
                    </span>
                    MAX
                  </li>
                </ul>
                <span className="card__line">{copy.shots.cards.reach.line}</span>
              </div>

              <div className="bento__cell card card--text card--quiet">
                <span className="card__title">{copy.shots.cards.languages.title}</span>
                <span className="card__line">{copy.shots.cards.languages.line}</span>
                {/* The three the page itself is written in, which is the proof of the claim above. */}
                <span className="card__codes" aria-hidden="true">
                  {LOCALES.map((option) => (
                    <span className="card__code" key={option}>
                      {LOCALE_LABEL[option]}
                    </span>
                  ))}
                </span>
              </div>

              {/* The two beside the notification screens. Same shell as the languages card, so the
                  new row reads as part of the same set rather than as an appendix to it. */}
              <div className="bento__cell card card--text card--quiet">
                <span className="card__title">{copy.shots.cards.channels.title}</span>
                <span className="card__line">{copy.shots.cards.channels.line}</span>
              </div>

              <div className="bento__cell card card--text card--quiet">
                <span className="card__title">{copy.shots.cards.record.title}</span>
                <span className="card__line">{copy.shots.cards.record.line}</span>
              </div>
            </div>
          </div>
        </section>

        {/*
          Empty until a screen is clicked — the script fills it and calls showModal(), which is what
          buys the focus trap, Escape, and a backdrop the page underneath cannot be reached through.
        */}
        <dialog className="lightbox" data-lightbox aria-label={copy.shots.title}>
          <form method="dialog">
            <button className="lightbox__close" aria-label={copy.shots.close}>
              <span aria-hidden="true">×</span>
            </button>
          </form>
          <figure className="lightbox__figure">
            <img alt="" data-lightbox-image />
            <figcaption className="lightbox__caption">
              <span className="lightbox__title" data-lightbox-title />
              <span className="lightbox__line" data-lightbox-line />
            </figcaption>
          </figure>
        </dialog>

        <section className="section" id="inside">
          <div className="shell">
            <h2 className="section__title">{copy.inside.title}</h2>
            <ul className="features">
              {copy.inside.features.map((feature) => (
                <li key={feature.title}>
                  <h3 className="feature__title">{feature.title}</h3>
                  <p className="feature__body">{feature.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/*
          What peers said. Prerendered full of placeholders and refilled by the deferred script —
          so the section is honest with no JavaScript, honest while the request is in flight, and
          honest if it fails: it says a review could be here, which is true in all three cases.

          The strings the script needs travel as data attributes, like the metrics panel's do, and
          the placeholders go as JSON because there is a list of them.
        */}
        <section className="section section--sunk voices" id="voices">
          <div className="shell">
            <h2 className="section__title">{copy.voices.title}</h2>
            <p className="section__lead">{copy.voices.lead}</p>

            <div
              className="quotes"
              data-quotes
              data-endpoint={testimonialsEndpoint}
              data-more={copy.voices.more}
              data-placeholders={JSON.stringify(copy.voices.placeholders)}
            >
              {[0, 1, 2].map((column) => (
                <div className="quotes__column" data-quotes-column key={column}>
                  <div className="quotes__track">
                    {/* One placeholder per column before the script runs. It replaces the lot. */}
                    <div className="quote quote--empty">
                      <p className="quote__body">
                        {copy.voices.placeholders[column % copy.voices.placeholders.length]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Empty until a quote is clicked, like the screenshot lightbox above and for the same
            reasons: showModal() is what buys the focus trap, Escape, and a backdrop. */}
        <dialog className="quote-dialog" data-quote-dialog aria-label={copy.voices.title}>
          <form method="dialog">
            <button className="quote-dialog__close" aria-label={copy.voices.close}>
              <span aria-hidden="true">×</span>
            </button>
          </form>
          <blockquote className="quote-dialog__body" data-quote-body />
          <p className="quote-dialog__author" data-quote-author />
        </dialog>

        <section className="section" id="about">
          <div className="shell">
            <h2 className="section__title">{copy.about.title}</h2>

            <figure className="quote">
              <blockquote className="quote__text">{copy.about.quote.text}</blockquote>
              <figcaption className="quote__by">
                <Logo height={20} className="quote__mark" decorative />
                <span className="quote__name">{AUTHOR_LOGIN}</span>
                <span className="quote__role">{copy.about.quote.role}</span>
              </figcaption>
            </figure>

            <p className="section__lead">
              {copy.about.independence.before}
              <a href={SCHOOL_URL} target="_blank" rel="noopener noreferrer">
                {copy.about.independence.link}
              </a>
              {copy.about.independence.after}
            </p>
            <p className="note">
              {copy.about.note.before}
              <a href={docs(LEGAL_PATHS.consent)}>{copy.about.note.consent}</a>
              {copy.about.note.middle}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              {copy.about.note.after}
            </p>
          </div>
        </section>
        {/*
          The same questions as /faq/, from the same module — one list, so the page and the page
          about the page cannot answer differently. The FAQPage markup stays on /faq/ alone: two
          URLs claiming the same rich result is two claims a search engine has to choose between.

          Closed here and open there, which is the one difference between the two. Eleven expanded
          answers is a wall of text to scroll past on the way to the footer, and nothing is hidden
          from a crawler by it: the page is written at build time, so every answer is in the markup
          whether or not a triangle has been clicked. On /faq/ the reader arrived for exactly this,
          so it opens.
        */}
        <section className="section faq faq--inline" id="faq">
          <div className="shell">
            <h2 className="section__title">{FAQ_COPY[locale].title}</h2>
            <p className="section__lead">{FAQ_COPY[locale].lead}</p>

            <div className="faq__list">
              {FAQ_COPY[locale].entries.slice(0, FAQ_ON_LANDING).map((entry) => (
                <details className="faq__item" key={entry.question}>
                  <summary className="faq__question">
                    <h3>{entry.question}</h3>
                  </summary>
                  <p className="faq__answer">{entry.answer}</p>
                </details>
              ))}
            </div>

            <p className="faq__cta">
              <a href={`${pathForLocale(locale)}faq/`}>{FAQ_COPY[locale].standalone}</a>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
