/*
 * Opens a screenshot full size. Deferred and entirely optional: every card is already a link to the
 * image file, so without this script a click still shows the picture — one step plainer, never
 * nothing. That is the whole reason the markup is a link rather than a button.
 *
 * `<dialog>.showModal()` rather than a div with a high z-index. It is not a shortcut, it is the
 * difference between a lightbox and a keyboard trap: the platform moves focus in, keeps Tab inside,
 * closes on Escape, makes the page behind inert, and paints a real ::backdrop. Reimplementing that
 * by hand is how a picture viewer ends up being the one thing on a page nobody can get out of.
 */

const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox]');
const image = dialog?.querySelector<HTMLImageElement>('[data-lightbox-image]');
const doors = document.querySelector('.doors');

/**
 * One listener on the row of doors rather than one per screen: they are written by the build and
 * never change, but a listener per image is six of them to say what one says.
 */
function open(event: Event): void {
  if (!dialog || !image) return;

  const target = event.target;
  if (!(target instanceof Element)) return;

  const link = target.closest<HTMLAnchorElement>('a[data-shot]');
  if (!link) return;

  // Let a modified click do what the visitor asked for — open in a tab, save, copy the address.
  const click = event as MouseEvent;
  if (click.metaKey || click.ctrlKey || click.shiftKey || click.altKey || click.button !== 0) return;

  event.preventDefault();
  image.src = link.href;
  // The description travels on the link, so the dialog never has to guess what it is showing.
  image.alt = link.dataset.alt ?? '';
  dialog.showModal();
}

/**
 * A click landing on the dialog itself is a click on the backdrop — the image and the close button
 * are children and would have been the target instead. Closing on it is what makes the greyed area
 * behave the way every other lightbox has taught people it behaves.
 */
function closeOnBackdrop(event: MouseEvent): void {
  if (event.target === dialog) dialog?.close();
}

/** Dropping the source on close stops a closed dialog from holding a full-size decode in memory. */
function clearOnClose(): void {
  if (image) image.removeAttribute('src');
}

if (dialog && image && doors) {
  doors.addEventListener('click', open);
  dialog.addEventListener('click', closeOnBackdrop);
  dialog.addEventListener('close', clearOnClose);
}
