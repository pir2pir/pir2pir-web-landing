/*
 * The app, photographed. Nine portrait screens, shown after "how it works": that section says what
 * happens, these show what it looks like while it does.
 *
 * They are laid out as a mosaic on a wide page and as a plain swipeable strip on a phone, so the
 * order here is the reading order of the strip — a route through the app rather than the order they
 * were taken.
 */

export const SCREENSHOTS = [
  'home',
  'chats',
  'find',
  'guard',
  'faq',
  'news',
  // The notification row: asked for, delivered, and then read.
  'permission',
  'push',
  'alert',
] as const;

export type Screenshot = (typeof SCREENSHOTS)[number];

/** Filenames under `public/app/`, which ships them verbatim. */
export const SCREENSHOT_FILE: Record<Screenshot, string> = {
  home: 'home.jpg',
  find: 'find-a-peer.jpg',
  chats: 'chats.jpg',
  news: 'news.jpg',
  guard: 'chat-guard.jpg',
  faq: 'faq.jpg',
  permission: 'notify-permission.jpg',
  push: 'notify-push.jpg',
  alert: 'notify-alert.jpg',
};

/**
 * The box each screen is drawn in. The sources are all 1280 tall and between 647 and 661 wide — a
 * phone held the same way nine times — so one ratio covers them and `object-fit: cover` takes the
 * ≤1.7% difference off the edges. A declared ratio is also what stops six lazy-loaded images from
 * shifting the page under whoever is reading it as they arrive.
 */
export const SCREENSHOT_WIDTH = 658;
export const SCREENSHOT_HEIGHT = 1280;
