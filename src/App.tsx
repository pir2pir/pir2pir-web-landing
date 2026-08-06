import {HeroMetrics} from './components/HeroMetrics';
import {SiteFooter} from './components/SiteFooter';
import {SiteHeader} from './components/SiteHeader';
import {MaxMark} from './components/MaxMark';
import {TelegramMark} from './components/TelegramMark';
import {Logo} from './components/Logo';
import {COPY, LOCALES, LOCALE_LABEL, type Locale} from './i18n';
import {SCREENSHOTS, SCREENSHOT_FILE, SCREENSHOT_HEIGHT, SCREENSHOT_WIDTH} from './screenshots';
import {
  APP_URL,
  AUTHOR_LOGIN,
  BOT_URL,
  CONTACT_EMAIL,
  LEGAL_PATHS,
  docsUrl,
} from './links';

export function App({locale, metricsEndpoint}: {locale: Locale; metricsEndpoint: string}) {
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

            <p className="section__lead">{copy.about.independence}</p>
            <p className="note">
              {copy.about.note.before}
              <a href={docs(LEGAL_PATHS.consent)}>{copy.about.note.consent}</a>
              {copy.about.note.middle}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              {copy.about.note.after}
            </p>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
