/*
 * The app, photographed. Ten portrait screenshots of the same product the hero links to, shown after
 * "how it works" — the section says what happens, and this shows what it looks like while it does.
 *
 * The order is a route through the app rather than the order they were taken: arrive, find somebody,
 * talk, read the school's news, invite, and the rest.
 */

export const SCREENSHOTS = [
  'home',
  'find',
  'chats',
  'news',
  'newsPost',
  'invite',
  'guard',
  'faq',
  'testimonial',
  'profile',
] as const;

export type Screenshot = (typeof SCREENSHOTS)[number];

/** Filenames under `public/app/`, which ships them verbatim. */
export const SCREENSHOT_FILE: Record<Screenshot, string> = {
  home: 'home.jpg',
  find: 'find-a-peer.jpg',
  chats: 'chats.jpg',
  news: 'news.jpg',
  newsPost: 'news-post.jpg',
  invite: 'invite.jpg',
  guard: 'chat-guard.jpg',
  faq: 'faq.jpg',
  testimonial: 'testimonial.jpg',
  profile: 'profile.jpg',
};

/**
 * The box each one is drawn in. The sources are all 1280 tall and between 650 and 661 wide — a phone,
 * held the same way ten times — so one ratio covers them and `object-fit: cover` takes the ≤1.7%
 * difference off the edges. Cropping a hair beats scaling each one to a slightly different width, and
 * a declared ratio is what stops ten lazy-loaded images from shifting the page as they arrive.
 */
export const SCREENSHOT_WIDTH = 658;
export const SCREENSHOT_HEIGHT = 1280;
