/*
 * The written pages: one shape, three articles, one renderer.
 *
 * They exist to be found. Each answers a question somebody types before they have heard of this
 * platform, and each is Russian only for the reason the first of them was — the search volume they
 * catch is Russian, and translating them would produce pages written for nobody.
 *
 * A list rather than three components and three render functions, because the third of anything is
 * where copies start to disagree: a head that gained a tag on two pages and not the third is the
 * failure this shape makes impossible.
 */

import {CHAT_GUARD} from './i18n/copy/chat-guard';
import {PEER_TO_PEER} from './i18n/copy/peer-to-peer';
import {TEAM_PROJECTS} from './i18n/copy/team-projects';

export type Section = {heading: string; paragraphs: string[]};

export type Article = {
  /** Last path segment, and the directory it is written to. */
  slug: string;
  /** Header label. Short — the page title names the topic in full, a nav row has no space for it. */
  navTitle: string;
  metaTitle: string;
  metaDescription: string;
  title: string;
  lead: string;
  /** ISO date, a literal: when the piece was written, not when the site was last deployed. */
  published: string;
  sections: Section[];
  /** Heading over the links out. */
  ctaTitle: string;
  links: Array<{href: string; label: string}>;
};

export const ARTICLES: readonly Article[] = [PEER_TO_PEER, TEAM_PROJECTS, CHAT_GUARD];

export function articlePath(article: Article): string {
  return `/${article.slug}/`;
}
