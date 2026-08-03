/*
 * The app, photographed, arranged as the three ways into it.
 *
 * The screenshots are not a gallery — they are evidence under a door. Each doorway is one place the
 * platform can be opened (a browser, Telegram, MAX) with two screens of what it looks like once you
 * are through it. That is the thing the section has to say: one product, three front doors. Six loose
 * thumbnails in a row never said it, whatever size they were drawn at.
 */

export const DOORWAYS = ['web', 'telegram', 'max'] as const;

export type Doorway = (typeof DOORWAYS)[number];

/** Two screens per doorway: the one above the card, and the one below it. */
export const DOORWAY_SHOTS: Record<Doorway, readonly [string, string]> = {
  web: ['home.jpg', 'find-a-peer.jpg'],
  telegram: ['chats.jpg', 'news.jpg'],
  max: ['invite.jpg', 'chat-guard.jpg'],
};

/**
 * The box each screen is drawn in. The sources are all 1280 tall and between 650 and 661 wide — a
 * phone held the same way six times — so one ratio covers them and `object-fit: cover` takes the
 * ≤1.7% difference off the edges. A declared ratio is also what stops six lazy-loaded images from
 * shifting the page under whoever is reading it as they arrive.
 */
export const SCREENSHOT_WIDTH = 658;
export const SCREENSHOT_HEIGHT = 1280;
