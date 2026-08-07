import type {Copy} from './types';

export const en: Copy = {
  brand: 'Pir2Pir',
  meta: {
    title: 'Find a peer at School 21 to review your project — Pir2Pir',
    description:
      'Pir2Pir is a peer-review platform for School 21 participants. Name the project: it asks likely peers itself and opens a chat as soon as one of them agrees.',
    ogTitle: 'Pir2Pir — find a peer to review your project',
    ogDescription:
      'The platform asks likely School 21 students itself and stops at the first yes. Names are disclosed only at the match.',
  },
  skipLink: 'Skip to content',
  nav: {
    docs: 'Documentation',
    signIn: 'Sign in',
    how: 'How it works',
    shots: 'Screens',
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
    lead: 'One app — in a browser, in Telegram and in MAX. Tap a screen to open it whole.',
    close: 'Close',
    screens: {
      home: {
        title: 'Everything on one screen',
        line: 'Reviews, chats, the school’s news and invitations, from a single menu.',
        alt: "The app's home screen: community figures and the list of sections",
      },
      find: {
        title: 'The asking is done for you',
        line: 'Name the project; the platform asks likely peers and stops at the first yes.',
        alt: 'The “How to find a peer” screen, in three steps',
      },
      chats: {
        title: 'A quick chat',
        line: 'Once you match, a chat opens and the two of you settle on a time.',
        alt: 'The chat list',
      },
      news: {
        title: "The school's news",
        line: 'It arrives in the app instead of scrolling past in a group chat.',
        alt: "The school's announcements, grouped by channel",
      },
      guard: {
        title: 'Only people who belong',
        line: 'The bot checks that whoever asks to join a chat has a School 21 account.',
        alt: 'Pir2Pir ID Chat Guard: vetting whoever asks to join a chat',
      },
      faq: {
        title: 'Answers to hand',
        line: 'Four common questions and short answers to them, inside the app.',
        alt: 'FAQ: short answers to the common questions',
      },
      permission: {
        title: 'Asked first',
        line: 'Channels are switched on one at a time and only with consent. The school chat stays off until it is turned on.',
        alt: 'The profile screen with notification settings and the browser asking permission to show notifications',
      },
      push: {
        title: 'Arrives in time',
        line: '"A review is starting soon" — before the meeting rather than after it.',
        alt: 'A push notification reading "A review is starting soon" over the profile screen',
      },
      alert: {
        title: 'Says what it is about',
        line: 'Project, peer and time. No need to open the app to find out.',
        alt: 'An opened notification showing the project, the peer and the time with the campus',
      },
    },
    cards: {
      brand: {line: 'A platform for finding peers at School 21'},
      reach: {
        title: 'Where you already are',
        line: 'The same account and the same conversations.',
        web: 'Web',
      },
      languages: {
        title: 'In three languages',
        line: 'Russian, English and Uzbek — in the app and in the documents.',
      },
      channels: {
        title: 'Per channel, not one switch',
        line: 'Every kind of event set on its own: bot, app, device.',
      },
      record: {
        title: 'Silence is not amnesia',
        line: 'A notification switched off does not arrive, but the event stays in the app.',
      },
    },
  },
  voices: {
    title: 'What peers say',
    lead: 'Reviews from people who have looked for a peer here. Tap a card to read the whole thing.',
    placeholders: [
      'Your review could be here.',
      'Used Pir2Pir? Say how it went.',
      'Leave a review in the app and it appears here.',
    ],
    more: 'Read in full',
    close: 'Close',
    by: 'Peer',
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
        title: 'A request to one particular peer',
        body: 'Know who you want? Send them a request by their exact login, with a line about the project. They accept or decline, and a chat exists only in the first case.',
      },
      {
        title: 'Reach somebody who is not here yet',
        body: 'One short introduction, by student email or in the school chat. You never see the address, and one click refuses further contact for good.',
      },
      {
        title: 'A team for a group project',
        body: 'Some projects cannot be started alone — three people have to be on the roster. Say what you are looking for and peers who took the same project in your region see it. You choose who joins, and when the school reports the start the post takes itself down.',
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
      {
        title: 'A code to bring your own in',
        body: 'Everybody has a short code and two links — one into the app, one into the bot. Whoever registers holding it is recorded against you. A leaderboard counts them; you can take your name off it and keep your place.',
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
    tagline: 'A peer-review platform for School 21 participants.',
    storesSoon: 'The app is coming to the stores soon',
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
