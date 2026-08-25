import type {Article} from './articles';
import {SiteFooter} from './components/SiteFooter';
import {SiteHeader} from './components/SiteHeader';
import {ROOT_LOCALE} from './i18n';

/**
 * Any of the written pages. Russian only — see the note in articles.ts.
 *
 * Plain prose in a single column at reading measure, because that is what these are. No cards, no
 * grid and no illustrations: somebody arrives here from a search and reads start to finish, and
 * everything that would make the page look like the rest of the site would also make it slower to
 * get through.
 */
export function ArticlePage({article}: {article: Article}) {
  return (
    <>
      <SiteHeader locale={ROOT_LOCALE} />

      <main id="main">
        <article className="section article">
          <div className="shell">
            <h1 className="article__title">{article.title}</h1>
            <p className="article__lead">{article.lead}</p>

            {article.sections.map((section) => (
              <section className="article__section" key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((text) => (
                  <p key={text.slice(0, 40)}>{text}</p>
                ))}
              </section>
            ))}

            {/* Where a reader who got this far should go, rather than back to a search page. */}
            <nav className="article__next" aria-label={article.ctaTitle}>
              <h2>{article.ctaTitle}</h2>
              <ul>
                {article.links.map((link) => {
                  // Off-site links open in a new tab and drop the opener, same as everywhere else
                  // here; the list mixes internal and external and the difference is the href.
                  const external = link.href.startsWith('http');
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </article>
      </main>

      <SiteFooter locale={ROOT_LOCALE} />
    </>
  );
}
