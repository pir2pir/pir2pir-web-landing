import type {Copy} from './types';

export const en: Copy = {
  meta: {
    title: 'Pir2Pir — find a peer to review your School 21 project',
    description:
      'Pir2Pir helps School 21 students find each other for peer reviews of their study projects. Search by login, right inside Telegram.',
    ogTitle: 'Pir2Pir — find a peer to review your project',
    ogDescription:
      'Find a School 21 student for a peer review — by login, right inside Telegram.',
  },
  skipLink: 'Skip to content',
  nav: {
    docs: 'Documentation',
    how: 'How it works',
    inside: 'Features',
    about: 'About',
    sections: 'Sections',
    language: 'Language',
  },
  hero: {
    titleBefore: 'Find a peer to ',
    titleAccent: 'review your project',
    titleAfter: '',
    lead: 'Pir2Pir helps School 21 students find each other for peer reviews of their study projects — by login, in a couple of seconds.',
    app: 'Open the web app',
    bot: 'Telegram bot',
    how: 'How it works',
  },
  how: {
    title: 'How it works',
    lead: 'Three steps, all inside Telegram.',
    steps: [
      {
        title: 'Connect your account',
        body: 'Open the bot and enter your School 21 login.',
      },
      {
        title: 'Confirm it is yours',
        body: 'Enter the code sent to your student email.',
      },
      {
        title: 'Find a peer',
        body: 'Search by login in the bot, or in any chat via @pir2pirbot.',
      },
    ],
  },
  inside: {
    title: "What's inside",
    features: [
      {
        title: 'Search by login',
        body: 'A student card with level, wave and Telegram contact — no more asking around in group chats.',
      },
      {
        title: 'Right inside any chat',
        body: 'Inline mode: type @pir2pirbot and a login without leaving the conversation.',
      },
      {
        title: 'Confirmed students only',
        body: 'Search shows only those who confirmed their account with a code from their student email.',
      },
      {
        title: 'Data from School 21',
        body: 'Level, experience, wave and projects come from the public API and refresh on every sync.',
      },
    ],
  },
  about: {
    title: 'About the service',
    quote: {
      text: 'Finding a peer to review with was always a quest of its own: the group chat, the posts, the waiting. I wanted it to take a couple of seconds — so Pir2Pir happened.',
      role: 'creator of Pir2Pir',
    },
    independence:
      'Pir2Pir is a project by a member of the community. The service is not ANO “School 21”, is not affiliated with it and does not act on its behalf.',
    note: {
      before: 'Data is processed on the basis of a separate ',
      consent: 'Consent',
      middle:
        ' that you give when connecting your account. You can withdraw it at any time — in the bot, or by writing to ',
      after: '.',
    },
  },
  footer: {
    service: 'Service',
    bot: 'Telegram bot',
    app: 'Web app',
    docs: 'Documentation',
    documents: 'Documents',
    consent: 'Consent to personal data processing',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use',
    contacts: 'Contacts',
    legal: {
      entity: 'Sole proprietor Aigiz Iskuzhin',
      portfolio: 'Personal portfolio',
      taxLabel: 'INN',
      registrationLabel: 'OGRNIP',
      activity: 'OKVED 62.01 Computer software development',
      operator: 'Personal data operator in the Roskomnadzor register',
    },
    cookie: {
      before:
        'By continuing to use our site, you consent to the processing of cookies and other user data in accordance with the ',
      link: 'Privacy Policy',
      after: '.',
    },
  },
};
