/*
 * Fills the quote columns from `/testimonials/public`. Deferred, like the metrics script and for the
 * same reasons: the section is well below the fold, nothing here has to happen before first paint,
 * and the columns hold their own space either way.
 *
 * The section is prerendered full of placeholders, so it is never empty — not while the request is
 * in flight, not if it fails, and not for a visitor with no JavaScript at all. This script replaces
 * them with what came back and keeps enough placeholders to fill the columns out. A section that
 * says "your review could be here" is an honest thing to show somebody; an empty box is not.
 *
 * Every failure therefore ends the same way, quietly: the placeholders that were already on the page
 * stay on the page.
 */

type Testimonial = {
  id: string;
  author_login: string;
  body: string;
};

type Payload = {items?: Testimonial[]};

/**
 * How many cards each column wants. Three columns of four is enough to look like a wall without
 * asking the API for more than the section can show — paging exists on the endpoint and is not used
 * here, because there is nothing yet to page through.
 */
const QUOTES_PER_COLUMN = 4;
const QUOTE_COLUMNS = 3;

/**
 * How many cards the wall holds — and therefore exactly how many the API is asked for.
 *
 * One number for both, because they are the same number: asking for more would download reviews
 * there is nowhere to put, and asking for fewer would leave a placeholder standing next to a review
 * that exists. There is one accepted review today and eleven invitations beside it; the day there
 * are twelve, this fills with all twelve and no placeholder is rendered at all. Nothing to change
 * when that happens, which is the point of deriving it rather than writing it down.
 */
const QUOTE_SLOTS = QUOTE_COLUMNS * QUOTES_PER_COLUMN;

/**
 * Characters past which a card is clipped and gets its "read in full" affordance. The clamp itself
 * is done in CSS, which knows the real width; this only decides which cards are worth opening, and
 * it errs low — a dialog that adds nothing is a smaller disappointment than a quote cut off with no
 * way to finish it.
 */
const QUOTE_CLIP_AT = 180;

const quotesReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Text, never markup: a review is written by somebody else and is inserted as a text node. */
function quoteCard(quote: string, author: string | null, strings: DOMStringMap): HTMLElement {
  const item = document.createElement(author ? 'button' : 'div');
  item.className = author ? 'quote quote--real' : 'quote quote--empty';

  if (author) {
    (item as HTMLButtonElement).type = 'button';
    item.dataset.quote = quote;
    item.dataset.author = author;
  }

  const body = document.createElement('p');
  body.className = 'quote__body';
  body.textContent = quote;
  item.append(body);

  if (author) {
    const foot = document.createElement('p');
    foot.className = 'quote__foot';

    const who = document.createElement('span');
    who.className = 'quote__author';
    who.textContent = `@${author}`;
    foot.append(who);

    // Only where there is more to read, so the affordance means something wherever it appears.
    if (quote.length > QUOTE_CLIP_AT) {
      const more = document.createElement('span');
      more.className = 'quote__more';
      more.textContent = strings.more ?? '';
      foot.append(more);
    }

    item.append(foot);
  }

  return item;
}

/**
 * Real quotes first, then placeholders repeated until the columns are full, then dealt across the
 * columns one at a time. Round-robin rather than a block per column: with one real quote and eight
 * placeholders, filling column by column would put the only review anybody wrote at the top of the
 * left column and leave two columns of invitations beside it.
 */
function layoutQuotes(items: Testimonial[], placeholders: string[]): Array<Testimonial | string> {
  // Real ones first, and never more of them than there are slots — the API is asked for exactly
  // QUOTE_SLOTS, but a server is free to answer with more than it was asked for.
  const cards: Array<Testimonial | string> = items.slice(0, QUOTE_SLOTS);

  for (let i = 0; cards.length < QUOTE_SLOTS && placeholders.length > 0; i += 1) {
    cards.push(placeholders[i % placeholders.length]!);
  }

  return cards;
}

function fillQuotes(section: HTMLElement, items: Testimonial[]): void {
  const columns = [...section.querySelectorAll<HTMLElement>('[data-quotes-column]')];
  if (columns.length === 0) return;

  const strings = section.dataset;
  const placeholders: string[] = JSON.parse(strings.placeholders ?? '[]');
  const cards = layoutQuotes(items, placeholders);

  const built = cards.map((entry) =>
    typeof entry === 'string' ? quoteCard(entry, null, strings) : quoteCard(entry.body, entry.author_login, strings),
  );

  columns.forEach((column, index) => {
    const mine = built.filter((_, i) => i % columns.length === index);
    if (mine.length === 0) return;

    const track = document.createElement('div');
    track.className = 'quotes__track';

    mine.forEach((node) => track.append(node));

    /*
     * The loop is one list drawn twice and translated by exactly half its height, so the second copy
     * is under the first at the moment the animation restarts and the seam never lands on screen.
     * The duplicate is inert: `aria-hidden` and no tab stops, or every quote would be announced and
     * tabbed through a second time.
     */
    if (!quotesReducedMotion) {
      const echo = track.cloneNode(true) as HTMLElement;
      echo.setAttribute('aria-hidden', 'true');
      echo.querySelectorAll('button').forEach((node) => {
        node.tabIndex = -1;
      });
      track.classList.add('quotes__track--looping');
      echo.classList.add('quotes__track--looping', 'quotes__track--echo');
      column.replaceChildren(track, echo);
    } else {
      column.replaceChildren(track);
    }

    // Duration from the content rather than a constant: a short column and a long one moving for the
    // same number of seconds travel at visibly different speeds.
    column.style.setProperty('--quote-duration', `${mine.length * 9}s`);
  });
}

function openQuoteDialog(dialog: HTMLDialogElement, quote: string, author: string): void {
  const body = dialog.querySelector<HTMLElement>('[data-quote-body]');
  const who = dialog.querySelector<HTMLElement>('[data-quote-author]');
  if (body) body.textContent = quote;
  if (who) who.textContent = `@${author}`;
  dialog.showModal();
}

function wireQuotes(section: HTMLElement, dialog: HTMLDialogElement): void {
  section.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const quote = target.closest<HTMLElement>('.quote--real');
    if (!quote?.dataset.quote) return;

    openQuoteDialog(dialog, quote.dataset.quote, quote.dataset.author ?? '');
  });

  // The backdrop is part of the dialog element, so a click that lands on the dialog itself rather
  // than on anything inside it is a click outside the panel.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}

const quotesSection = document.querySelector<HTMLElement>('[data-quotes]');
const quotesDialog = document.querySelector<HTMLDialogElement>('[data-quote-dialog]');
const quotesEndpoint = quotesSection?.dataset.endpoint;

if (quotesSection && quotesDialog && quotesEndpoint) {
  wireQuotes(quotesSection, quotesDialog);

  /*
   * Resolved against the current document, so the same two lines serve both forms this endpoint
   * takes: the API's own origin in the build, and the path the dev server proxies. Asking for the
   * page size rather than taking the default means the wall fills itself as reviews arrive.
   */
  const quotesUrl = new URL(quotesEndpoint, window.location.href);
  quotesUrl.searchParams.set('page', '1');
  quotesUrl.searchParams.set('page_size', String(QUOTE_SLOTS));

  fetch(quotesUrl, {headers: {Accept: 'application/json'}})
    .then((response) => (response.ok ? (response.json() as Promise<Payload>) : null))
    .then((data) => {
      const items = (data?.items ?? []).filter((item) => item && item.body && item.author_login);
      // Nothing accepted yet is not a failure, and the placeholders already on the page say the
      // right thing about it — so only a non-empty answer is worth a rebuild.
      if (items.length > 0) fillQuotes(quotesSection, items);
    })
    .catch(() => {
      /* The prerendered placeholders stay. */
    });
}
