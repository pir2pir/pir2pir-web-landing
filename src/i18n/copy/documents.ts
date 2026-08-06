/*
 * The documentation page, in Russian and only in Russian.
 *
 * Deliberately outside the `Copy` type the rest of the site is held to. That type exists so a key
 * missing from one language fails the build — which is exactly the right rule for a page that ships
 * in three languages, and the wrong one for a page that ships in one. Putting these strings there
 * would mean inventing English and Uzbek for a page neither will ever render, and inventing copy to
 * satisfy a type is how a site ends up with translations nobody wrote.
 */

/**
 * The copyright holder, named the way the documents themselves name them: surname first, which is
 * the order the registry paperwork and every file on this page uses.
 *
 * The footer writes the same person the other way round — `ИП Айгиз Искужин` — because that is the
 * order a name is spoken in. Both are correct and they are not interchangeable here: this line is
 * read against the documents it sits above, so it matches those.
 */
export const COPYRIGHT_HOLDER = 'ИП Искужин Айгиз';

export const DOCUMENTS_COPY = {
  /** Header link. Nothing else in the header is called this, so the short word is unambiguous there. */
  nav: 'Документация',
  /**
   * Footer link. Longer on purpose: the footer already has a "Документация" two columns to the left,
   * pointing at docs.pir2pir.ru — the guide for using the platform. This is the registry paperwork,
   * and two links with one label is the reader's problem rather than the writer's shortcut.
   */
  footerNav: 'Эксплуатационная документация',
  title: 'Документация',
  description:
    'Документация платформы «Пир2Пир»: функциональные характеристики, установка, эксплуатация и процессы жизненного цикла. Правообладатель — ИП Искужин Айгиз.',
  lead: 'Документы о платформе: что она делает, как получить к ней доступ, как ей пользоваться и как поддерживается её жизненный цикл.',
  holderLabel: 'Правообладатель:',
  /** On the link, after the format and the size. */
  download: 'Скачать',
  note: 'Экземпляр программного обеспечения передаётся архивом под паролем. Пароль сообщается эксперту отдельно — в порядке, описанном в документации по установке экземпляра.',
} as const;
