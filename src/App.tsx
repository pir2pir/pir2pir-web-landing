import {useId} from 'react';
import {GitHubMark} from './components/GitHubMark';
import {HeroMetrics} from './components/HeroMetrics';
import {LanguageSwitcher} from './components/LanguageSwitcher';
import {Logo} from './components/Logo';
import {MaxMark} from './components/MaxMark';
import {TelegramMark} from './components/TelegramMark';
import {COPY, pathForLocale, type Locale} from './i18n';
import {
  SCREENSHOTS,
  SCREENSHOT_FILE,
  SCREENSHOT_HEIGHT,
  SCREENSHOT_WIDTH,
} from './screenshots';
import {
  APP_URL,
  AUTHOR_LOGIN,
  BOT_URL,
  COMMUNITY_CHAT_URL,
  CONTACT_EMAIL,
  GITHUB_ORG_URL,
  LEGAL_PATHS,
  MAX_BOT_URL,
  MAX_CHANNEL_URL,
  NEWS_CHANNEL_URL,
  PORTFOLIO_URL,
  REGISTRATION_ID,
  RKN_REGISTRY_NUMBER,
  RKN_URL,
  TAX_ID,
  docsUrl,
} from './links';

export function App({locale, metricsEndpoint}: {locale: Locale; metricsEndpoint: string}) {
  const copy = COPY[locale];
  const docs = (path?: string) => docsUrl(locale, path);
  const portfolioTooltipId = `portfolio-tip-${useId()}`;

  return (
    <>
      <a className="skip-link" href="#main">
        {copy.skipLink}
      </a>

      <header className="site-header">
        <div className="shell site-header__inner">
          {/* Named on the element rather than by its text, because the text is clipped away on a
              narrow screen and the mark beside it is decorative — without this the link to home
              would be one a screen reader could only call "link". The two read identically where
              both are visible, which is what WCAG's Label in Name asks for. */}
          <a className="wordmark" href={pathForLocale(locale)} aria-label="Pir2Pir">
            <Logo height={22} decorative />
            <span>Pir2Pir</span>
          </a>
          <nav className="site-nav" aria-label={copy.nav.sections}>
            <a href="#how">{copy.nav.how}</a>
            <a href="#inside">{copy.nav.inside}</a>
            <a href="#about">{copy.nav.about}</a>
          </nav>

          {/* Two controls, never three: this row shares 320px with the wordmark and may not wrap.
              Documentation moved to the hero, where there is room for a fourth link and where it is
              a thing to read rather than a thing to do. */}
          <div className="site-header__actions">
            <LanguageSwitcher locale={locale} label={copy.nav.language} />
            <a className="button button--primary" href={APP_URL}>
              {copy.nav.signIn}
            </a>
          </div>
        </div>
      </header>

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

        {/*
          A scroll container is not reachable by keyboard unless something in it is focusable, and
          nothing here is — ten images and no links. `tabindex="0"` makes the strip itself the focus
          stop, which is what lets arrow keys scroll it; a region needs a name to be worth stopping
          on, so it takes the heading's.
        */}
        <section className="section section--sunk" id="shots">
          <div className="shell">
            <h2 className="section__title">{copy.shots.title}</h2>
            <p className="section__lead">{copy.shots.lead}</p>
          </div>
          <ul className="shots" tabIndex={0} role="region" aria-label={copy.shots.title}>
            {SCREENSHOTS.map((shot) => (
              <li key={shot}>
                <figure className="shot">
                  {/*
                    A plain link to the image. With the lightbox script it opens in a dialog; without
                    it the browser shows the file, which is the same thing one step plainer — nobody
                    is left with a picture that only enlarges if a script arrived.
                  */}
                  <a
                    className="shot__frame"
                    href={`/app/${SCREENSHOT_FILE[shot]}`}
                    data-shot
                    data-alt={copy.shots.alt[shot]}
                  >
                    <img
                      src={`/app/${SCREENSHOT_FILE[shot]}`}
                      alt={copy.shots.alt[shot]}
                      width={SCREENSHOT_WIDTH}
                      height={SCREENSHOT_HEIGHT}
                      /* Below the fold: not worth a byte until the page above has been read. */
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                  <figcaption className="shot__name">{copy.shots.name[shot]}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>

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
        {/*
          Empty until a screenshot is clicked — the script fills it and calls showModal(), which is
          what buys the focus trap, Escape, and a backdrop the page underneath cannot be reached
          through. Doing that by hand with a div is how a lightbox becomes a keyboard trap in the
          other direction. It renders in the document rather than being created on demand so the
          markup is there to read, and so the script stays a listener rather than a template.
        */}
        <dialog className="lightbox" data-lightbox aria-label={copy.shots.title}>
          <form method="dialog">
            <button className="lightbox__close" aria-label={copy.shots.close}>
              <span aria-hidden="true">×</span>
            </button>
          </form>
          <img alt="" data-lightbox-image />
        </dialog>
      </main>

      <footer className="site-footer">
        <div className="shell">
          <div className="footer__grid">
            <div>
              <h2 className="footer__heading">{copy.footer.platform}</h2>
              <ul className="footer__list">
                <li>
                  <a href={APP_URL}>{copy.footer.app}</a>
                </li>
                {/* The two messengers the platform is reachable through, marked so the pair reads as
                    a choice of the same thing rather than as two different things. */}
                <li>
                  <a href={BOT_URL}>
                    <TelegramMark />
                    {copy.footer.telegramBot}
                  </a>
                </li>
                <li>
                  <a href={MAX_BOT_URL}>
                    <MaxMark />
                    {copy.footer.maxBot}
                  </a>
                </li>
                <li>
                  <a href={docs()}>{copy.footer.docs}</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="footer__heading">{copy.footer.documents}</h2>
              <ul className="footer__list">
                <li>
                  <a href={docs(LEGAL_PATHS.consent)}>{copy.footer.consent}</a>
                </li>
                <li>
                  <a href={docs(LEGAL_PATHS.privacy)}>{copy.footer.privacy}</a>
                </li>
                <li>
                  <a href={docs(LEGAL_PATHS.terms)}>{copy.footer.terms}</a>
                </li>
                <li>
                  <a href={docs(LEGAL_PATHS.cookies)}>{copy.footer.cookies}</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="footer__heading">{copy.footer.community}</h2>
              <ul className="footer__list">
                <li>
                  <a href={NEWS_CHANNEL_URL}>
                    <TelegramMark />
                    {copy.footer.telegramChannel}
                  </a>
                </li>
                <li>
                  <a href={COMMUNITY_CHAT_URL}>
                    <TelegramMark />
                    {copy.footer.telegramChat}
                  </a>
                </li>
                <li>
                  <a href={MAX_CHANNEL_URL}>
                    <MaxMark />
                    {copy.footer.maxChannel}
                  </a>
                </li>
                {/* "GitHub" is the name of the place and reads the same in every language, so it is
                    here rather than in the copy — like the registry numbers in `links.ts`. */}
                <li>
                  <a href={GITHUB_ORG_URL}>
                    <GitHubMark />
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="footer__heading">{copy.footer.contacts}</h2>
              <ul className="footer__list">
                <li>
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                </li>
              </ul>
            </div>
          </div>

          <p className="footer__legal">
            <span className="tooltip">
              <a
                href={PORTFOLIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-describedby={portfolioTooltipId}
              >
                {copy.footer.legal.entity}
              </a>
              {/* Described, not labelled: the link already reads as the name, and the tooltip only
                  says where it goes. It stays in the accessibility tree at all times, which is why
                  it hides with opacity rather than display or visibility. */}
              <span className="tooltip__bubble" role="tooltip" id={portfolioTooltipId}>
                {copy.footer.legal.portfolio}
              </span>
            </span>{' '}
            · {copy.footer.legal.taxLabel} {TAX_ID} ·{' '}
            {copy.footer.legal.registrationLabel} {REGISTRATION_ID}
            <br />
            {copy.footer.legal.activity} · {copy.footer.legal.operator}{' '}
            <a href={RKN_URL} target="_blank" rel="noopener noreferrer">
              №{RKN_REGISTRY_NUMBER}
            </a>
            <br />© {new Date().getFullYear()} Pir2Pir
          </p>

          <p className="footer__cookie">
            {copy.footer.cookieNotice.before}
            <a href={docs(LEGAL_PATHS.cookies)}>{copy.footer.cookieNotice.link}</a>
            {copy.footer.cookieNotice.after}
          </p>
        </div>
      </footer>
    </>
  );
}
