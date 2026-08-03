import type {Screenshot} from '../../screenshots';

/** A sentence with one link inside it, kept in three pieces so word order stays translatable. */
export type LinkedText = {
  before: string;
  link: string;
  after: string;
};

/**
 * Plural forms of one word, keyed the way `Intl.PluralRules` names them. Only `other` is required —
 * Uzbek has no other category, English adds `one`, Russian adds `one`, `few` and `many`. A template
 * that interpolates a count picks the form for that count rather than guessing from the number.
 */
export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & {other: string};

export type Copy = {
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  skipLink: string;
  nav: {
    docs: string;
    /**
     * The header's one call to action, so it is a verb and it is short: it shares a row with the
     * wordmark and the language switcher on a 320px screen, and that row may not become two.
     */
    signIn: string;
    /** In-page links. Shorter than the headings they point at — a navbar is not a table of contents. */
    how: string;
    inside: string;
    about: string;
    /** Accessible names for the two navigations in the header. */
    sections: string;
    language: string;
  };
  hero: {
    /**
     * The headline in three parts: the gradient accent sits mid-sentence in Uzbek and at the end in
     * Russian and English, so it cannot be a suffix.
     */
    titleBefore: string;
    titleAccent: string;
    titleAfter: string;
    lead: string;
    /** In hero order: the web app is the primary action, the bot the alternative way in. */
    app: string;
    bot: string;
    how: string;
  };
  /**
   * The one panel filled in by the browser rather than by the build, so every string it needs at run
   * time is here and travels to the script as data attributes on the panel. Templates interpolate
   * `{count}`, `{days}` and `{unit}` — named rather than positional, because the order they appear
   * in differs by language.
   */
  metrics: {
    /** Eyebrow above the figures, and the panel's accessible name. */
    title: string;
    /**
     * Labels for the figures. Nominative plural in every language: they name the metric rather than
     * describing the number above them, which is what keeps "1" and "10" under the same word.
     */
    peers: string;
    reviews: string;
    messages: string;
    campuses: string;
    /** The "+N" beside the headline figure, spelled out: how much of the total arrived recently. */
    change: string;
    /** Caption on the chart, which plots the same window the API reported growth over. */
    chart: string;
    /** Declined by the count, so "+4 за 7 дней" and "+1 за 1 день" both read correctly. */
    days: PluralForms;
    /**
     * Live counts, shown only when the API returns them — it withholds anything under five. Written
     * label-first so no verb or noun has to agree with a number that changes: "В поиске · 7".
     */
    searching: string;
    openChats: string;
  };
  how: {
    title: string;
    lead: string;
    steps: Array<{title: string; body: string}>;
  };
  /**
   * The carousel of app screenshots. `alt` is keyed by the same names the screenshot list uses, so a
   * language missing one — or an image added without a description — fails `npm run typecheck` rather
   * than shipping a picture no screen reader can read.
   */
  shots: {
    title: string;
    lead: string;
    alt: Record<Screenshot, string>;
  };
  inside: {
    title: string;
    features: Array<{title: string; body: string}>;
  };
  about: {
    title: string;
    /** Why the platform exists, in the author's words. The login itself lives in `links.ts`. */
    quote: {text: string; role: string};
    independence: string;
    /** Two links mid-sentence: the Consent document, then the contact address. */
    note: {before: string; consent: string; middle: string; after: string};
  };
  footer: {
    /** Heading over the column of links into the platform itself: the app, the bots, the docs. */
    platform: string;
    app: string;
    docs: string;
    documents: string;
    /** Heading over the links to the rooms the platform keeps rather than the ones it runs. */
    community: string;

    /*
     * Every place the platform can be reached, named the same way: the thing, then the messenger it
     * is in — "Бот в Telegram", "Канал в MAX". One shape for all five, because the only thing that
     * distinguishes two of these links from each other is which messenger they are in, and a label
     * that buries that ("Канал новостей" beside "Канал в MAX") makes the reader work out from two
     * different sentence shapes what one word would have told them.
     *
     * The messenger is in the text even though a mark sits beside it: the mark is decorative and a
     * screen reader never reaches it, so a bare "Канал" would be one of two links called the same
     * thing. It also keeps "chat" away from the bare word this page uses a dozen times for the
     * private room two peers get after a match — this one is neither private nor that.
     */
    telegramBot: string;
    telegramChannel: string;
    telegramChat: string;
    maxBot: string;
    maxChannel: string;

    consent: string;
    privacy: string;
    terms: string;
    /** Label for the cookie document in the list; `cookieNotice` below is the sentence about it. */
    cookies: string;
    contacts: string;
    /**
     * Registry numbers live in `links.ts` — they are the same in every language, so only the entity
     * name and the labels around them are translated.
     */
    legal: {
      entity: string;
      /** Tooltip on the entity name, which links to the owner's own site. */
      portfolio: string;
      taxLabel: string;
      registrationLabel: string;
      activity: string;
      operator: string;
    };
    cookieNotice: LinkedText;
  };
};
