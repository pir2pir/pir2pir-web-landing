/*
 * The questions somebody types into a search box before they know this platform exists, answered.
 *
 * Every answer here is something the landing already claims or the app already does — this page adds
 * a way in for a search, not a second version of the product. Where an answer would need a promise
 * the product has not made, the question is left out rather than answered vaguely: a FAQ that hedges
 * is one a reader stops trusting on the second entry.
 *
 * Kept as its own module rather than inside `Copy` because it is a page rather than a fragment of
 * one, and because the questions are chosen per language: the Russian set is the one that has search
 * volume behind it, and translating it word for word would be translating a keyword list.
 */

import type {Locale} from '../locale';

export type FaqEntry = {
  /** The heading, and the `name` in the FAQPage markup. Phrased the way it would be searched. */
  question: string;
  /**
   * One paragraph. Whole sentences and no cross-references — this is the text a search engine may
   * show on its own results page, where "see above" points at nothing.
   */
  answer: string;
};

export type FaqCopy = {
  /** Document title. The question form, so it does not compete with the landing for the same one. */
  metaTitle: string;
  metaDescription: string;
  title: string;
  lead: string;
  entries: FaqEntry[];
  /** Closing line under the list, with the link back to the app. */
  ctaBefore: string;
  ctaLink: string;
  /** On the landing, under the same questions: the link to this page's own URL. */
  standalone: string;
};

export const FAQ_COPY: Record<Locale, FaqCopy> = {
  ru: {
    metaTitle: 'Как найти пира в Школе 21 — частые вопросы о Пир2Пир',
    metaDescription:
      'Как найти пира для проверки проекта в Школе 21, как пригласить того, кого здесь ещё нет, и кто может пользоваться Пир2Пир. Короткие ответы на частые вопросы.',
    title: 'Частые вопросы',
    lead: 'Коротко о том, как Пир2Пир находит пира для проверки проекта в Школе 21.',
    entries: [
      {
        question: 'Как найти пира в Школе 21 для проверки проекта?',
        answer:
          'Укажите проект, по которому нужна проверка. Пир2Пир сам определяет, кто из участников Школы 21 может её провести, и спрашивает их по нескольку человек за раз, а не рассылает объявление всем. Поиск идёт в фоне и останавливается, как только кто-то согласился; после взаимного согласия открывается чат, где вы договариваетесь о времени.',
      },
      {
        question: 'Что такое Пир2Пир?',
        answer:
          'Пир2Пир — платформа взаимных проверок для участников Школы 21. Она решает одну задачу: найти собеседника, который проверит ваш проект, и дать место, где договориться о встрече. Сама проверка проходит на платформе школы, как обычно.',
      },
      {
        question: 'Кто может пользоваться Пир2Пир?',
        answer:
          'Участники Школы 21. Вход — по логину школьной учётной записи: одноразовый код приходит на студенческую почту или в чат школы, пароля нет. Базу школы никто не выгружал, поэтому здесь только те, кто вошёл сам, и списка участников для просмотра не существует.',
      },
      {
        question: 'Сколько стоит Пир2Пир?',
        answer:
          'Нисколько. Платформа бесплатна для участников Школы 21, оплаты и подписок в ней нет.',
      },
      {
        question: 'Как пригласить на Пир2Пир того, кого здесь ещё нет?',
        answer:
          'У каждого участника есть свой код и две ссылки, чтобы его отправить. Приглашение уходит один раз — по студенческой почте или в чат школы; адреса вы не увидите, а отказаться человек может в один клик и навсегда.',
      },
      {
        question: 'Увидят ли другие моё имя и мои контакты?',
        answer:
          'Пока идёт поиск, кандидат видит проект и кампус, но не того, кто просит: решение принимается по работе. Имена открываются при совпадении. Контакты платформа не выдаёт никогда — ни почту, ни Telegram; если захотите продолжить в другом месте, скажете об этом сами, в чате.',
      },
      {
        question: 'Как проверить, кто входит в мой чат в Telegram?',
        answer:
          'Для этого есть Chat Guard: бот проверяет, что у входящего есть учётная запись Школы 21, до того как впустить его в чат. Он работает в вашем чате и никого не добавляет — только не пускает тех, кто школу не подтвердил.',
      },
      {
        question: 'Где работает Пир2Пир?',
        answer:
          'В браузере на app.pir2pir.ru и в боте Telegram — это одна учётная запись и одни и те же разговоры. Устанавливать ничего не нужно. Уведомления приходят на те каналы, которые вы включили, и отключение одного не влияет на остальные.',
      },
    ],
    ctaBefore: 'Остальное быстрее увидеть, чем прочитать —',
    ctaLink: 'откройте приложение',
    standalone: 'Открыть отдельной страницей',
  },

  en: {
    metaTitle: 'How to find a peer at School 21 — Pir2Pir FAQ',
    metaDescription:
      'How to find a peer to review your School 21 project, how to invite somebody who is not here yet, and who can use Pir2Pir. Short answers to common questions.',
    title: 'Common questions',
    lead: 'Briefly, how Pir2Pir finds a peer to review a School 21 project.',
    entries: [
      {
        question: 'How do I find a peer at School 21 to review my project?',
        answer:
          'Name the project you need reviewed. Pir2Pir works out which School 21 participants can review it and asks them a few at a time rather than posting to everybody. The search runs in the background and stops as soon as somebody agrees; once both have agreed, a chat opens where you arrange a time.',
      },
      {
        question: 'What is Pir2Pir?',
        answer:
          'Pir2Pir is a peer-review platform for School 21 participants. It solves one problem: finding somebody to review your project, and giving you a place to arrange the meeting. The review itself happens on the school platform, as usual.',
      },
      {
        question: 'Who can use Pir2Pir?',
        answer:
          'School 21 participants. You sign in with your school account login: a one-time code goes to your student address or the school chat, and there is no password. Nobody exported the school roster, so only people who signed in themselves are here, and there is no list of members to browse.',
      },
      {
        question: 'What does Pir2Pir cost?',
        answer:
          'Nothing. The platform is free for School 21 participants; there are no payments and no subscriptions.',
      },
      {
        question: 'How do I invite somebody who is not on Pir2Pir yet?',
        answer:
          'Everybody has their own code and two links to send it with. The invitation goes out once — by student email or in the school chat; you never see the address, and the person can refuse in one click, permanently.',
      },
      {
        question: 'Will other people see my name and my contacts?',
        answer:
          'While the search is running a candidate sees the project and the campus, but not who is asking: the decision is made on the work. Names are disclosed at the match. The platform never hands out contacts — not email, not Telegram; if you want to carry on elsewhere, you say so yourself, in the chat.',
      },
      {
        question: 'How do I check who is joining my Telegram chat?',
        answer:
          'That is what Chat Guard does: the bot checks that whoever is joining has a School 21 account before letting them in. It works inside your chat and adds nobody — it only keeps out people who have not confirmed the school.',
      },
      {
        question: 'Where does Pir2Pir run?',
        answer:
          'In a browser at app.pir2pir.ru and in a Telegram bot — one account and the same conversations in both. Nothing to install. Notifications reach the channels you switched on, and turning one off does not affect the rest.',
      },
    ],
    ctaBefore: 'The rest is quicker to see than to read —',
    ctaLink: 'open the app',
    standalone: 'Open as its own page',
  },

  uz: {
    metaTitle: '21-maktabda pir qanday topiladi — Pir2Pir savollari',
    metaDescription:
      '21-maktab loyihasini tekshirish uchun pirni qanday topish, bu yerda hali boʻlmagan odamni qanday taklif qilish va Pir2Pirdan kim foydalana oladi. Qisqa javoblar.',
    title: 'Koʻp beriladigan savollar',
    lead: 'Pir2Pir 21-maktab loyihasini tekshirish uchun pirni qanday topishi haqida qisqacha.',
    entries: [
      {
        question: '21-maktabda loyihani tekshirish uchun pirni qanday topaman?',
        answer:
          'Tekshiruv kerak boʻlgan loyihani koʻrsating. Pir2Pir uni kim tekshira olishini oʻzi aniqlaydi va hammaga eʼlon yubormasdan, bir vaqtning oʻzida bir nechta ishtirokchidan soʻraydi. Qidiruv fonda davom etadi va kimdir rozi boʻlishi bilan toʻxtaydi; oʻzaro rozilikdan keyin vaqtni kelishish uchun chat ochiladi.',
      },
      {
        question: 'Pir2Pir nima?',
        answer:
          'Pir2Pir — 21-maktab ishtirokchilari uchun oʻzaro tekshiruv platformasi. U bitta vazifani hal qiladi: loyihangizni tekshiradigan odamni topish va uchrashuvni kelishish uchun joy berish. Tekshiruvning oʻzi odatdagidek maktab platformasida oʻtadi.',
      },
      {
        question: 'Pir2Pirdan kim foydalana oladi?',
        answer:
          '21-maktab ishtirokchilari. Kirish maktab hisobi logini orqali: bir martalik kod talaba pochtasiga yoki maktab chatiga keladi, parol yoʻq. Maktab bazasini hech kim yuklab olmagan, shuning uchun bu yerda faqat oʻzi kirganlar bor va koʻrib chiqiladigan ishtirokchilar roʻyxati mavjud emas.',
      },
      {
        question: 'Pir2Pir qancha turadi?',
        answer:
          'Hech qancha. Platforma 21-maktab ishtirokchilari uchun bepul; toʻlov ham, obuna ham yoʻq.',
      },
      {
        question: 'Pir2Pirda hali boʻlmagan odamni qanday taklif qilaman?',
        answer:
          'Har kimning oʻz kodi va uni yuborish uchun ikkita havolasi bor. Taklif bir marta yuboriladi — talaba pochtasiga yoki maktab chatiga; siz manzilni koʻrmaysiz, odam esa bir bosishda va butunlay rad eta oladi.',
      },
      {
        question: 'Boshqalar mening ismim va kontaktlarimni koʻradimi?',
        answer:
          'Qidiruv davom etayotganda nomzod loyiha va kampusni koʻradi, lekin kim soʻrayotganini koʻrmaydi: qaror ish boʻyicha qabul qilinadi. Ismlar moslik paytida ochiladi. Platforma kontaktlarni hech qachon bermaydi — na pochtani, na Telegramni; boshqa joyda davom etmoqchi boʻlsangiz, buni chatda oʻzingiz aytasiz.',
      },
      {
        question: 'Telegram chatimga kim kirayotganini qanday tekshiraman?',
        answer:
          'Buning uchun Chat Guard bor: bot kirayotgan odamda 21-maktab hisobi borligini uni kiritishdan oldin tekshiradi. U sizning chatingizda ishlaydi va hech kimni qoʻshmaydi — faqat maktabni tasdiqlamaganlarni kiritmaydi.',
      },
      {
        question: 'Pir2Pir qayerda ishlaydi?',
        answer:
          'Brauzerda app.pir2pir.ru manzilida va Telegram botida — bu bitta hisob va bir xil suhbatlar. Hech narsa oʻrnatish shart emas. Bildirishnomalar siz yoqqan kanallarga keladi va birini oʻchirish qolganlariga taʼsir qilmaydi.',
      },
    ],
    ctaBefore: 'Qolganini oʻqigandan koʻra koʻrgan tezroq —',
    ctaLink: 'ilovani oching',
    standalone: 'Alohida sahifa sifatida ochish',
  },
};
