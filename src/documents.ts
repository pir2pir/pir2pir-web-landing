/*
 * The documents published on /documentation/, read from `public/documentation` at build time.
 *
 * The files keep the names they were written with, punctuation and all. They are the names the
 * registry paperwork refers to, and one of them ends in a truncated `д….docx` — so this file never
 * spells a filename out. It matches each one by a distinctive fragment and takes the rest from disk,
 * which also means a name can be corrected in the folder without touching any code.
 *
 * Sizes are read rather than written down for the same reason the screenshots declare their box: a
 * number kept by hand is a number that eventually disagrees with the file it describes, and here the
 * disagreement would be visible to somebody deciding whether to start a 5 MB download.
 */

import {readdirSync, statSync} from 'node:fs';
import {join} from 'node:path';
import {DOCUMENTS_PATH} from './links';

/** Where the files live. The path they are served from is in `links.ts` — `public/` ships verbatim. */
const DIRECTORY = 'public/documentation';

/**
 * What is published, in the order it is listed: the four documents the registry asks for, then the
 * two that describe the copy handed to an expert, then that copy itself.
 *
 * `match` is a fragment that appears in exactly one filename. Distinctive rather than short — the
 * build fails below if a fragment matches two files or none, which is what keeps this list honest
 * when the folder changes.
 */
const CATALOGUE: ReadonlyArray<{match: string; title: string; summary: string}> = [
  {
    match: 'Функциональные характеристики',
    title: 'Функциональные характеристики',
    summary: 'Назначение платформы и перечень того, что она умеет.',
  },
  {
    match: 'Пир2Пир-Установка',
    title: 'Установка',
    summary:
      'Системные требования и порядок получения доступа. Установка на устройство не требуется — платформа работает в браузере.',
  },
  {
    match: 'Пир2Пир-Эксплуатация',
    title: 'Эксплуатация',
    summary: 'Запуск, работа и завершение: порядок пользования платформой.',
  },
  {
    match: 'Процессы жизненного цикла',
    title: 'Процессы жизненного цикла',
    summary:
      'Поддержание, устранение неисправностей и обновление. Построены с учётом ГОСТ Р ИСО/МЭК 12207-2010.',
  },
  {
    match: 'необходимую для установки',
    title: 'Установка экземпляра для экспертной проверки',
    summary: 'Порядок развёртывания экземпляра, передаваемого на экспертизу.',
  },
  {
    match: 'необходимую для эксплуатации',
    title: 'Эксплуатация экземпляра для экспертной проверки',
    summary: 'Порядок работы с экземпляром, передаваемым на экспертизу.',
  },
  {
    match: 'expertise',
    title: 'Экземпляр программного обеспечения',
    summary:
      'Исходный текст серверной части и веб-приложения. Архив защищён паролем; пароль передаётся эксперту отдельно, в порядке, описанном в документации по установке экземпляра.',
  },
];

export type DocumentEntry = {
  /** The name on disk, unchanged — and the name the browser saves it under. */
  file: string;
  /** Percent-encoded, because these names carry spaces, commas and Cyrillic. */
  href: string;
  title: string;
  summary: string;
  /** Extension in capitals, for the badge: DOCX, 7Z. */
  kind: string;
  bytes: number;
};

/**
 * Every published document, with the size the server will actually send.
 *
 * Throws rather than skipping when the folder and the list above disagree. A missing entry would
 * publish a file nobody described, and a stale one would print a download link to a 404 — both are
 * the kind of thing that renders perfectly and is only discovered by whoever clicked.
 */
export function documents(): DocumentEntry[] {
  const present = readdirSync(DIRECTORY).filter((name) => !name.startsWith('.'));
  const claimed = new Set<string>();

  const entries = CATALOGUE.map(({match, title, summary}) => {
    const found = present.filter((name) => name.includes(match));

    if (found.length !== 1) {
      throw new Error(
        `"${match}" matches ${found.length} files in ${DIRECTORY}; it has to match exactly one`,
      );
    }

    const file = found[0]!;
    claimed.add(file);

    return {
      file,
      href: `${DOCUMENTS_PATH}/${encodeURIComponent(file)}`,
      title,
      summary,
      kind: (file.split('.').pop() ?? '').toUpperCase(),
      bytes: statSync(join(DIRECTORY, file)).size,
    };
  });

  const undescribed = present.filter((name) => !claimed.has(name));
  if (undescribed.length > 0) {
    throw new Error(
      `${DIRECTORY} has files no catalogue entry describes: ${undescribed.join(', ')}`,
    );
  }

  return entries;
}

/**
 * A size somebody can act on, in Russian: "316 КБ", "5,0 МБ". Powers of 1024 with the units they
 * are conventionally printed in — the point is a reader's sense of how long a download takes, not a
 * unit-pedantic figure.
 */
export function formatBytes(bytes: number): string {
  const mb = bytes / 1024 / 1024;

  if (mb >= 1) {
    return `${mb.toLocaleString('ru-RU', {maximumFractionDigits: 1})} МБ`;
  }

  return `${Math.round(bytes / 1024).toLocaleString('ru-RU')} КБ`;
}
