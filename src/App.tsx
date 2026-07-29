import {Logo} from './components/Logo';

const BOT_URL = 'https://t.me/pir2pirbot';
const DOCS_URL = 'https://docs.pir2pir.ru';
const RKN_URL = 'https://pd.rkn.gov.ru/operators-registry/operators-list/?id=2-26-056967';

const STEPS = [
  {
    title: 'Подключите аккаунт',
    body: 'Откройте бота и укажите логин Школы 21.',
  },
  {
    title: 'Подтвердите владение',
    body: 'Введите код, который придёт на студенческую почту.',
  },
  {
    title: 'Найдите пира',
    body: 'Ищите участника по логину в боте или в любом чате через @pir2pirbot.',
  },
];

const FEATURES = [
  {
    title: 'Поиск по логину',
    body: 'Карточка участника с уровнем, потоком и контактом в Telegram — без переписки в общих чатах.',
  },
  {
    title: 'Прямо в любом чате',
    body: 'Inline-режим: наберите @pir2pirbot и логин, не покидая диалог.',
  },
  {
    title: 'Только подтверждённые',
    body: 'В поиске видны те, кто подтвердил владение учётной записью кодом со студенческой почты.',
  },
  {
    title: 'Данные из Школы 21',
    body: 'Уровень, опыт, поток и проекты подтягиваются из публичного API и обновляются при синхронизации.',
  },
];

export function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Перейти к содержимому
      </a>

      <header className="site-header">
        <div className="shell site-header__inner">
          <a className="wordmark" href="/">
            <Logo height={26} />
            <span>Pir2Pir</span>
          </a>
          <a className="button button--secondary" href={DOCS_URL}>
            Документация
          </a>
        </div>
      </header>

      <main id="main">
        <section className="hero">
          <div className="shell">
            <Logo height={64} className="hero__logo" />
            <h1 className="hero__title">
              Найдите пира для <span className="hero__accent">проверки проекта</span>
            </h1>
            <p className="hero__lead">
              Pir2Pir помогает участникам Школы 21 находить друг друга для взаимных проверок учебных
              проектов — по логину, за пару секунд.
            </p>
            <div className="hero__actions">
              <a className="button button--primary" href={BOT_URL}>
                Открыть в Telegram
              </a>
              <a className="button button--secondary" href="#how">
                Как это работает
              </a>
            </div>
          </div>
        </section>

        <section className="section" id="how">
          <div className="shell">
            <h2 className="section__title">Как это работает</h2>
            <p className="section__lead">Три шага, всё внутри Telegram.</p>
            <ol className="steps">
              {STEPS.map((step, index) => (
                <li className="step" key={step.title}>
                  <span className="step__number" aria-hidden="true">
                    {index + 1}
                  </span>
                  <h3 className="step__title">{step.title}</h3>
                  <p className="step__body">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section section--sunk">
          <div className="shell">
            <h2 className="section__title">Что внутри</h2>
            <ul className="features">
              {FEATURES.map((feature) => (
                <li key={feature.title}>
                  <h3 className="feature__title">{feature.title}</h3>
                  <p className="feature__body">{feature.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section">
          <div className="shell">
            <h2 className="section__title">Независимый сервис</h2>
            <p className="section__lead">
              Pir2Pir — проект участника сообщества. Сервис не является АНО «Школа 21», не
              аффилирован с ней и не действует от её имени.
            </p>
            <p className="note">
              Данные обрабатываются на основании отдельного{' '}
              <a href={`${DOCS_URL}/legal/consent/`}>Согласия</a>, которое вы даёте при подключении
              аккаунта. Отозвать его можно в любой момент — в боте или письмом на legal@pir2pir.ru.
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell">
          <div className="footer__grid">
            <div>
              <h2 className="footer__heading">Сервис</h2>
              <ul className="footer__list">
                <li>
                  <a href={BOT_URL}>Telegram-бот</a>
                </li>
                <li>
                  <a href={DOCS_URL}>Документация</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="footer__heading">Документы</h2>
              <ul className="footer__list">
                <li>
                  <a href={`${DOCS_URL}/legal/consent/`}>Согласие на обработку ПД</a>
                </li>
                <li>
                  <a href={`${DOCS_URL}/legal/privacy_policy/`}>Политика конфиденциальности</a>
                </li>
                <li>
                  <a href={`${DOCS_URL}/legal/terms/`}>Пользовательское соглашение</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="footer__heading">Контакты</h2>
              <ul className="footer__list">
                <li>
                  <a href="mailto:legal@pir2pir.ru">legal@pir2pir.ru</a>
                </li>
              </ul>
            </div>
          </div>

          <p className="footer__legal">
            ИП Искужин Айгиз · ИНН 024803896842 · ОГРНИП 326028000044859
            <br />
            Оператор персональных данных в реестре РКН{' '}
            <a href={RKN_URL} target="_blank" rel="noopener noreferrer">
              № 2-26-056967
            </a>
            <br />© {new Date().getFullYear()} Pir2Pir
          </p>
        </div>
      </footer>
    </>
  );
}
