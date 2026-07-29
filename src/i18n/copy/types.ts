/** A sentence with one link inside it, kept in three pieces so word order stays translatable. */
export type LinkedText = {
  before: string;
  link: string;
  after: string;
};

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
    /** Accessible name of the language switcher. */
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
  how: {
    title: string;
    lead: string;
    steps: Array<{title: string; body: string}>;
  };
  inside: {
    title: string;
    features: Array<{title: string; body: string}>;
  };
  independent: {
    title: string;
    body: string;
    /** Two links mid-sentence: the Consent document, then the contact address. */
    note: {before: string; consent: string; middle: string; after: string};
  };
  footer: {
    service: string;
    bot: string;
    app: string;
    docs: string;
    documents: string;
    consent: string;
    privacy: string;
    terms: string;
    contacts: string;
    /**
     * Registry numbers live in `links.ts` — they are the same in every language, so only the entity
     * name and the labels around them are translated.
     */
    legal: {
      entity: string;
      taxLabel: string;
      registrationLabel: string;
      activity: string;
      operator: string;
    };
    cookie: LinkedText;
  };
};
