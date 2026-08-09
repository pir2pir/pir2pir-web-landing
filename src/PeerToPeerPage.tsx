import {SiteFooter} from './components/SiteFooter';
import {SiteHeader} from './components/SiteHeader';
import {ROOT_LOCALE, pathForLocale} from './i18n';
import {PEER_TO_PEER_COPY} from './i18n/copy/peer-to-peer';
import {APP_URL} from './links';

/**
 * The peer-to-peer explainer. Russian only — see the note at the top of the copy module.
 *
 * Plain prose in a single column at reading measure, because that is what it is. No cards, no grid
 * and no illustrations: this page exists to be read by somebody who arrived from a search for
 * "p2p обучение", and everything that would make it look like the rest of the site would also make
 * it slower to read.
 */
export function PeerToPeerPage() {
  const copy = PEER_TO_PEER_COPY;

  return (
    <>
      <SiteHeader locale={ROOT_LOCALE} />

      <main id="main">
        <article className="section article">
          <div className="shell">
            <h1 className="article__title">{copy.title}</h1>
            <p className="article__lead">{copy.lead}</p>

            {copy.sections.map((section) => (
              <section className="article__section" key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((text) => (
                  <p key={text.slice(0, 40)}>{text}</p>
                ))}
              </section>
            ))}

            {/* Where a reader who got this far should go, rather than back to a search page. */}
            <nav className="article__next" aria-label={copy.ctaTitle}>
              <h2>{copy.ctaTitle}</h2>
              <ul>
                <li>
                  <a href={`${pathForLocale(ROOT_LOCALE)}faq/`}>{copy.faqLink}</a>
                </li>
                <li>
                  <a href={APP_URL}>{copy.appLink}</a>
                </li>
              </ul>
            </nav>
          </div>
        </article>
      </main>

      <SiteFooter locale={ROOT_LOCALE} />
    </>
  );
}
