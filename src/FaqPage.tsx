import {SiteFooter} from './components/SiteFooter';
import {SiteHeader} from './components/SiteHeader';
import {FAQ_COPY} from './i18n/copy/faq';
import {type Locale} from './i18n';
import {APP_URL} from './links';

/**
 * The questions, as a page a search engine can rank on its own.
 *
 * Open `<details>` rather than closed, and rather than headings with paragraphs under them. The
 * disclosure gives a reader something to collapse once they have their answer, and being open by
 * default means the answers are on the page rather than behind a click — which matters twice over
 * here: a crawler that renders nothing still sees them, and a reader who searched for one of these
 * questions lands on the answer instead of on a list of the questions they already asked.
 */
export function FaqPage({locale}: {locale: Locale}) {
  const copy = FAQ_COPY[locale];

  return (
    <>
      <SiteHeader locale={locale} />

      <main id="main">
        <section className="section faq">
          <div className="shell">
            <h1 className="faq__title">{copy.title}</h1>
            <p className="faq__lead">{copy.lead}</p>

            <div className="faq__list">
              {copy.entries.map((entry) => (
                <details className="faq__item" key={entry.question} open>
                  {/* h2 inside the summary, so the questions are a real outline a screen reader can
                      jump between — a page of eight disclosures with no headings is a page with one
                      landmark and no way through it. */}
                  <summary className="faq__question">
                    <h2>{entry.question}</h2>
                  </summary>
                  <p className="faq__answer">{entry.answer}</p>
                </details>
              ))}
            </div>

            <p className="faq__cta">
              {copy.ctaBefore} <a href={APP_URL}>{copy.ctaLink}</a>.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
