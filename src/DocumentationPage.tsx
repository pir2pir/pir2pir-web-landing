import {SiteFooter} from './components/SiteFooter';
import {SiteHeader} from './components/SiteHeader';
import {formatBytes, type DocumentEntry} from './documents';
import {COPYRIGHT_HOLDER, DOCUMENTS_COPY} from './i18n/copy/documents';
import {ROOT_LOCALE} from './i18n';

/**
 * The documents a Russian software registry asks an author to publish, as a page somebody can
 * actually download from.
 *
 * Russian only, and that is the content rather than an omission: these are Russian-language legal
 * documents, and a translated shell around an untranslated file would promise something it cannot
 * deliver. `ROOT_LOCALE` is therefore hard-wired here rather than taken as a prop — the page has one
 * language, and a parameter would imply it has three.
 */
export function DocumentationPage({documents}: {documents: DocumentEntry[]}) {
  return (
    <>
      <SiteHeader locale={ROOT_LOCALE} />

      <main id="main">
        <section className="section documents">
          <div className="shell">
            <h1 className="documents__title">{DOCUMENTS_COPY.title}</h1>
            <p className="documents__lead">{DOCUMENTS_COPY.lead}</p>
            <p className="documents__holder">
              {DOCUMENTS_COPY.holderLabel} <strong>{COPYRIGHT_HOLDER}</strong>
            </p>

            {/*
              A list, because that is what it is — and the count is announced before the first item
              rather than discovered at the last. Each entry is one link wrapping the whole card, so
              the target is the card and there is one stop per document instead of three.
            */}
            <ul className="documents__list">
              {documents.map((document) => (
                <li key={document.file}>
                  <a
                    className="documents__item"
                    href={document.href}
                    /*
                     * Names the saved file explicitly. Without it a browser is free to open a .docx
                     * in a viewer instead of saving it, and the name it saves under comes from the
                     * URL — which here is percent-encoded, so the reader would get the escaped form
                     * rather than the name the document is filed under.
                     */
                    download={document.file}
                    type={document.kind === '7Z' ? 'application/x-7z-compressed' : undefined}
                  >
                    <span className="documents__kind" aria-hidden="true">
                      {document.kind}
                    </span>
                    <span className="documents__body">
                      <span className="documents__name">{document.title}</span>
                      <span className="documents__summary">{document.summary}</span>
                    </span>
                    {/*
                      The format is in the badge as well, which a screen reader never reaches — so
                      the size line carries both, and the link reads as "… DOCX, 316 КБ, скачать".
                    */}
                    <span className="documents__meta">
                      {document.kind}, {formatBytes(document.bytes)}
                      <span className="documents__action">{DOCUMENTS_COPY.download}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <p className="documents__note">{DOCUMENTS_COPY.note}</p>
          </div>
        </section>
      </main>

      <SiteFooter locale={ROOT_LOCALE} />
    </>
  );
}
