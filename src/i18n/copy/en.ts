import type {Copy} from './types';

export const en: Copy = {
  meta: {
    title: 'Pir2Pir — find a peer to review your School 21 project',
    description:
      'Pir2Pir finds a School 21 student to review your project, and gives you a place to arrange it. Instead of posting in a group chat and waiting for an answer.',
    ogTitle: 'Pir2Pir — find a peer to review your project',
    ogDescription:
      'The platform asks likely School 21 students itself and stops at the first yes. Names are disclosed only at the match.',
  },
  skipLink: 'Skip to content',
  nav: {
    docs: 'Documentation',
    signIn: 'Sign in',
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
    lead: 'Pir2Pir finds a School 21 student to review your project, and gives you a place to arrange it. Instead of posting in a group chat and waiting for an answer.',
    app: 'Open the web app',
    bot: 'Bot in Telegram',
    how: 'How it works',
  },
  metrics: {
    title: 'Community',
    peers: 'Peers',
    reviews: 'Reviews',
    messages: 'Messages',
    campuses: 'Campuses',
    change: '+{count} in {days} {unit}',
    chart: 'New peers · {days} {unit}',
    days: {one: 'day', other: 'days'},
    searching: 'Searching · {count}',
    openChats: 'Open chats · {count}',
  },
  how: {
    title: 'How it works',
    lead: 'Three steps to a conversation with whoever will review your project — in the web app or in Telegram. The platform reviews nothing and grades nothing — the review itself is between you and your peer.',
    steps: [
      {
        title: 'Sign in with your login',
        body: 'A code arrives at your student email. There is no password, and nobody ends up here without signing in themselves.',
      },
      {
        title: 'Pick the project',
        body: 'Projects come from School 21 — choose the one waiting to be reviewed. Or ask one particular peer, by their exact login.',
      },
      {
        title: 'Wait for a yes',
        body: 'The platform does the asking and stops the moment somebody agrees. Then it is a chat, where the two of you settle on a time.',
      },
    ],
  },
  shots: {
    title: 'What it looks like',
    lead: 'The web app — and the same thing as a Mini App in Telegram and MAX. Tap one to see it whole.',
    close: 'Close',
    name: {
      home: 'Home',
      find: 'Finding a peer',
      chats: 'Chats',
      news: "The school's news",
      invite: 'Invitations',
      guard: 'ID Chat Guard',
    },
    alt: {
      home: "The app's home screen: community figures and the list of sections",
      find: 'The “How to find a peer” screen, in three steps',
      chats: 'The chat list',
      news: "The school's announcements, grouped by channel",
      invite: 'The invite screen: a personal code and the two links built from it',
      guard: 'Pir2Pir ID Chat Guard: vetting whoever asks to join a chat',
    },
  },
  inside: {
    title: "What's inside",
    features: [
      {
        title: 'Reciprocal matches',
        body: 'When two people are waiting on the same project, they are simply put together — there is nobody to ask, since both already want it.',
      },
      {
        title: 'No posting, no asking around',
        body: 'The platform asks likely peers a few at a time rather than everybody at once, and stops as soon as one of them says yes.',
      },
      {
        title: 'Reach somebody who is not here yet',
        body: 'One short introduction, by student email or in the school chat. You never see the address, and one click refuses further contact for good.',
      },
      {
        title: 'The school\u2019s announcements',
        body: 'They arrive in the app instead of scrolling past in a busy group chat. Announcements only — the replies under them stay where they were written.',
      },
      {
        title: 'Names only at the match',
        body: 'While a search is running, a candidate sees the project and the campus, not who is asking. The decision is made on the work.',
      },
      {
        title: 'Contacts stay yours',
        body: 'It never hands out contact details — not a Telegram, not an email, not anything else. To carry on elsewhere, you say so yourself, in the chat.',
      },
      {
        title: 'Conversations do not pile up',
        body: 'A chat lasts as long as it is being used, then expires and is deleted. One conversation per person, not a stack of them.',
      },
      {
        title: 'Nobody was added without asking',
        body: 'Everyone here signed in themselves; the school’s user base was never crawled. There is no member list and no browsing people.',
      },
    ],
  },
  about: {
    title: 'About the platform',
    quote: {
      text: 'Finding a peer to review with was always a quest of its own: the group chat, the posts, the waiting. I wanted the asking to be somebody else’s job — so Pir2Pir happened.',
      role: 'creator of Pir2Pir',
    },
    independence:
      'Pir2Pir is a project by a member of the community. The platform is not ANO “School 21”, is not affiliated with it and does not act on its behalf.',
    note: {
      before: 'Data is processed on the basis of a separate ',
      consent: 'Consent',
      middle:
        ' that you give when connecting your account. You can withdraw it at any time — in the bot, or by writing to ',
      after: '.',
    },
  },
  footer: {
    platform: 'Platform',
    app: 'Web app',
    docs: 'Documentation',
    documents: 'Documents',
    community: 'Community',
    telegramBot: 'Bot in Telegram',
    telegramChannel: 'Channel in Telegram',
    telegramChat: 'Chat in Telegram',
    maxBot: 'Bot in MAX',
    maxChannel: 'Channel in MAX',
    consent: 'Consent to personal data processing',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use',
    cookies: 'Cookies and recommendations',
    contacts: 'Contacts',
    legal: {
      entity: 'Sole proprietor Aigiz Iskuzhin',
      portfolio: 'Personal portfolio',
      taxLabel: 'INN',
      registrationLabel: 'OGRNIP',
      activity: 'OKVED 62.01 Computer software development',
      operator: 'Personal data operator in the Roskomnadzor register',
    },
    cookieNotice: {
      before:
        'By continuing to use our site, you consent to the processing of cookies and other user data in accordance with the ',
      link: 'Cookie Policy',
      after: '.',
    },
  },
};
