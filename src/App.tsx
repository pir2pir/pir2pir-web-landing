import {useId} from 'react';
import {HeroMetrics} from './components/HeroMetrics';
import {LanguageSwitcher} from './components/LanguageSwitcher';
import {Logo} from './components/Logo';
import {COPY, pathForLocale, type Locale} from './i18n';
import {
  APP_URL,
  AUTHOR_LOGIN,
  BOT_URL,
  CONTACT_EMAIL,
  LEGAL_PATHS,
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
          <a className="wordmark" href={pathForLocale(locale)}>
            <Logo height={22} decorative />
            <span>Pir2Pir</span>
          </a>
          <nav className="site-nav" aria-label={copy.nav.sections}>
            <a href="#how">{copy.nav.how}</a>
            <a href="#inside">{copy.nav.inside}</a>
            <a href="#about">{copy.nav.about}</a>
          </nav>

          <div className="site-header__actions">
            <LanguageSwitcher locale={locale} label={copy.nav.language} />
            <a className="button button--secondary" href={docs()}>
              {copy.nav.docs}
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

        <section className="section section--sunk" id="inside">
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

      <footer className="site-footer">
        <div className="shell">
          <div className="footer__grid">
            <div>
              <h2 className="footer__heading">{copy.footer.service}</h2>
              <ul className="footer__list">
                <li>
                  <a href={APP_URL}>{copy.footer.app}</a>
                </li>
                <li>
                  <a href={BOT_URL}>{copy.footer.bot}</a>
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
