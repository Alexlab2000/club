export type GroupTopic = {
  id: number;
  title: string;
  description: string;
  tag: string;
};

export type TopicLinkItem = {
  id: number;
  title: string;
  href?: string;
};

export type GroupArticleBlock = {
  type: "paragraph" | "list";
  title?: string;
  text?: string;
  items?: string[];
};

export type GroupArticle = {
  eyebrow: string;
  title: string;
  intro: string;
  imageSrc?: string;
  imageAlt?: string;
  blocks: GroupArticleBlock[];
};

export type ClubGroup = {
  id: number;
  title: string;
  icon: string;
  slug: string;
  description: string;
  sectionId: number;
  sectionTitle: string;
};

export type ClubSection = {
  id: number;
  title: string;
  color: string;
  groups: ClubGroup[];
};

function buildSection(
  id: number,
  title: string,
  color: string,
  groups: Array<Omit<ClubGroup, "sectionId" | "sectionTitle">>
): ClubSection {
  return {
    id,
    title,
    color,
    groups: groups.map((group) => ({
      ...group,
      sectionId: id,
      sectionTitle: title,
    })),
  };
}

export const CLUB_SECTIONS: ClubSection[] = [
  buildSection(1, "Знания", "rgba(201,168,76,0.14)", [
    {
      id: 1,
      title: "Книги",
      icon: "📚",
      slug: "philosophy",
      description: "Ссылки и материалы по книгам, лекциям и глубокому чтению.",
    },
    {
      id: 2,
      title: "История",
      icon: "⚔️",
      slug: "history",
      description: "Империи, переломные эпохи и большие цивилизационные циклы.",
    },
    {
      id: 3,
      title: "Психология",
      icon: "🧠",
      slug: "psychology",
      description: "Когнитивные модели, поведение и внутренняя оптика.",
    },
    {
      id: 4,
      title: "Экономика",
      icon: "📊",
      slug: "economics",
      description: "Деньги, капитал, обмен и логика систем.",
    },
    {
      id: 5,
      title: "Стратегия",
      icon: "♟️",
      slug: "strategy",
      description: "Долгий горизонт, конкуренция и принятие решений.",
    },
    {
      id: 6,
      title: "Риторика",
      icon: "🎭",
      slug: "rhetoric",
      description: "Слово как инструмент влияния и структурирования мысли.",
    },
    {
      id: 7,
      title: "Наука",
      icon: "🔬",
      slug: "science",
      description: "Фундаментальные идеи, методы и интеллектуальная дисциплина.",
    },
  ]),
  buildSection(2, "Таро", "rgba(90,145,230,0.14)", [
    {
      id: 8,
      title: "Общая информация",
      icon: "🎓",
      slug: "info",
      description: "описание.",
    },
    {
      id: 9,
      title: "Инвесторы",
      icon: "💰",
      slug: "investors",
      description: "Круг людей капитала, сделок и тихих возможностей.",
    },
    {
      id: 10,
      title: "Технари",
      icon: "⚙️",
      slug: "techies",
      description: "Разработчики, инженеры и архитекторы сложных систем.",
    },
    {
      id: 11,
      title: "Юристы",
      icon: "⚖️",
      slug: "lawyers",
      description: "Правовая опора, структура договорённостей и защита рамок.",
    },
    {
      id: 12,
      title: "Медики",
      icon: "⚕️",
      slug: "medics",
      description: "Профессионалы здоровья, диагностики и устойчивости.",
    },
    {
      id: 13,
      title: "Медиа",
      icon: "📡",
      slug: "media",
      description: "Люди каналов, репутации и усиления смысла.",
    },
    {
      id: 14,
      title: "Аналитики",
      icon: "📐",
      slug: "analysts",
      description: "Те, кто умеет отделять сигнал от шума.",
    },
  ]),
  buildSection(3, "Практики", "rgba(168,96,222,0.14)", [
    {
      id: 15,
      title: "Медитация",
      icon: "🧘",
      slug: "meditation",
      description: "Тишина, внимание и настройка внутреннего ритма.",
    },
    {
      id: 16,
      title: "Тренировки",
      icon: "💪",
      slug: "fitness",
      description: "Сила, выносливость и дисциплина через тело.",
    },
    {
      id: 17,
      title: "Питание",
      icon: "🥗",
      slug: "nutrition",
      description: "Рацион как топливо для ясности и длинной дистанции.",
    },
    {
      id: 18,
      title: "Фокус",
      icon: "🎯",
      slug: "focus",
      description: "Методы глубокого внимания без распыления.",
    },
    {
      id: 19,
      title: "Сон",
      icon: "🌙",
      slug: "sleep",
      description: "Восстановление как стратегический ресурс.",
    },
    {
      id: 20,
      title: "Эмоции",
      icon: "🌊",
      slug: "emotions",
      description: "Управление состояниями и внутренняя экологичность.",
    },
    {
      id: 21,
      title: "Ритуалы",
      icon: "🌅",
      slug: "rituals",
      description: "Повторяющиеся действия, которые собирают жизнь в строй.",
    },
  ]),
  buildSection(4, "События", "rgba(220,116,62,0.14)", [
    {
      id: 22,
      title: "Ужины",
      icon: "🍷",
      slug: "dinners",
      description: "Живые беседы и внимательные встречи без суеты.",
    },
    {
      id: 23,
      title: "Лекции",
      icon: "🎤",
      slug: "lectures",
      description: "Интенсивные выступления и закрытые разборы.",
    },
    {
      id: 24,
      title: "Выезды",
      icon: "🚗",
      slug: "trips",
      description: "Поездки, ретриты и смена перспективы.",
    },
    {
      id: 25,
      title: "Кино-клуб",
      icon: "🎬",
      slug: "cinema",
      description: "Фильмы как способ смотреть на эпоху и человека.",
    },
    {
      id: 26,
      title: "Книги",
      icon: "📚",
      slug: "books",
      description: "Совместное чтение, обсуждение и фиксация смыслов.",
    },
    {
      id: 27,
      title: "Спорт",
      icon: "🏉",
      slug: "sport",
      description: "Телесная общность, энергия и соревновательная радость.",
    },
    {
      id: 28,
      title: "Онлайн",
      icon: "💻",
      slug: "online",
      description: "Дистанционные форматы для тех, кто в движении.",
    },
  ]),
  buildSection(5, "Проекты", "rgba(58,178,116,0.14)", [
    {
      id: 29,
      title: "Стартапы",
      icon: "💡",
      slug: "startups",
      description: "Идеи, команды и поиск формы для роста.",
    },
    {
      id: 30,
      title: "Исследования",
      icon: "🔍",
      slug: "research",
      description: "Совместные интеллектуальные экспедиции и разборы.",
    },
    {
      id: 31,
      title: "Образование",
      icon: "🏫",
      slug: "education",
      description: "Программы, школы и внутренние форматы обучения.",
    },
    {
      id: 32,
      title: "Культура",
      icon: "🎪",
      slug: "culture",
      description: "Эстетические и общественные инициативы участников.",
    },
    {
      id: 33,
      title: "Благотворительность",
      icon: "❤️",
      slug: "charity",
      description: "Проекты вклада и поддержки вне короткой выгоды.",
    },
    {
      id: 34,
      title: "Технологии",
      icon: "🤖",
      slug: "tech",
      description: "Прототипы, инструменты и инженерные инициативы.",
    },
    {
      id: 35,
      title: "Медиа-проекты",
      icon: "📺",
      slug: "mediaproj",
      description: "Каналы, подкасты и издательские формы клуба.",
    },
  ]),
];

export const CLUB_GROUPS = CLUB_SECTIONS.flatMap((section) => section.groups);

export const CLUB_GROUPS_BY_ID = Object.fromEntries(
  CLUB_GROUPS.map((group) => [group.id, group])
) as Record<number, ClubGroup>;

const REAL_GROUP_TOPICS: Partial<Record<number, GroupTopic[]>> = {
  1: [
    { id: 1, title: "Персона", description: "Художественный рассказ.", tag: "видео-книга" },
    { id: 2, title: "Сущность", description: "Художественный рассказ.", tag: "книга" },
    { id: 3, title: "Ассасины", description: "Художественный рассказ.", tag: "книга" },
    { id: 4, title: "Чернокнижник 🌗", description: "Художественный рассказ.", tag: "книга" },
    { id: 5, title: "800", description: "Художественный рассказ.", tag: "книга" },
    {
      id: 6,
      title: "Алхимия мысли и бытия 2025. Том 1",
      description: "Сборник тем о памяти, намерении и внутренней архитектуре.",
      tag: "алхимия",
    },
    {
      id: 7,
      title: "Алхимия. Том 2",
      description:
        "Продолжение цикла о сознании, реальности, резонансе и внутренней работе.",
      tag: "алхимия",
    },
    { id: 8, title: "Не заполнено", description: "Будущий раздел для материалов.", tag: "архив" },
    { id: 9, title: "Не заполнено", description: "Будущий раздел для материалов.", tag: "архив" },
    { id: 10, title: "Не заполнено", description: "Будущий раздел для материалов.", tag: "архив" },
    { id: 11, title: "Не заполнено", description: "Будущий раздел для материалов.", tag: "архив" },
    { id: 12, title: "Не заполнено", description: "Будущий раздел для материалов.", tag: "архив" },
    { id: 13, title: "Не заполнено", description: "Будущий раздел для материалов.", tag: "архив" },
    { id: 14, title: "Не заполнено", description: "Будущий раздел для материалов.", tag: "архив" },
    { id: 15, title: "Не заполнено", description: "Будущий раздел для материалов.", tag: "архив" },
  ],
  2: [
    { id: 1, title: "Рим: взлет и падение", description: "Сила институтов, дисциплины и перегрузки империи.", tag: "империи" },
    { id: 2, title: "Монгольская империя", description: "Как скорость и организация меняют карту мира.", tag: "завоевания" },
    { id: 3, title: "Промышленная революция", description: "Машина как поворотный момент цивилизации.", tag: "прогресс" },
    { id: 4, title: "Французская революция", description: "Цена идей, когда они становятся политикой.", tag: "политика" },
    { id: 5, title: "Холодная война", description: "Скрытая архитектура страха, технологий и блоков.", tag: "геополитика" },
    { id: 6, title: "История денег", description: "От редкости к доверию и абстрактным системам стоимости.", tag: "экономика" },
    { id: 7, title: "Великие открытия", description: "Море, торговля и новая география власти.", tag: "география" },
    { id: 8, title: "История письма", description: "Как фиксация мысли меняет общество.", tag: "культура" },
    { id: 9, title: "Религиозные войны", description: "Вера, власть и длительные конфликты идентичности.", tag: "конфликты" },
    { id: 10, title: "XX век по десятилетиям", description: "Сжатая карта столетия перемен и переломов.", tag: "хроника" },
  ],
  3: [
    { id: 1, title: "Когнитивные искажения", description: "Ловушки мышления, которые выглядят как здравый смысл.", tag: "база" },
    { id: 2, title: "Теория привязанности", description: "Как ранние связи влияют на взрослые отношения.", tag: "отношения" },
    { id: 3, title: "Поведенческая экономика", description: "Почему рациональность так часто оказывается мифом.", tag: "решения" },
    { id: 4, title: "Позитивная психология", description: "Благополучие как предмет системного исследования.", tag: "счастье" },
    { id: 5, title: "Архетипы Юнга", description: "Глубинные образы, через которые психика говорит сама с собой.", tag: "Юнг" },
    { id: 6, title: "Манипуляции", description: "Как распознавать давление, газлайтинг и скрытое управление.", tag: "защита" },
    { id: 7, title: "Харизма", description: "Личный магнетизм как навык, а не врожденная магия.", tag: "влияние" },
    { id: 8, title: "Психология масс", description: "Что происходит с человеком внутри толпы.", tag: "социум" },
    { id: 9, title: "Нейропластичность", description: "Мозг меняется дольше, чем нам казалось.", tag: "нейронаука" },
    { id: 10, title: "Тревога и стресс", description: "Механика напряжения и способы вернуть себе опору.", tag: "здоровье" },
  ],
};

function buildPlaceholderTopics(groupTitle: string, count: number): GroupTopic[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `${groupTitle} — тема ${index + 1}`,
    description: "Заглушка для будущего наполнения раздела.",
    tag: index < 3 ? "новое" : index < 7 ? "база" : "архив",
  }));
}

export function getGroupPageData(groupId: number) {
  const group = CLUB_GROUPS_BY_ID[groupId];

  if (!group) {
    return null;
  }

  const fallbackCount = groupId === 1 ? 15 : 10;
  const topics =
    REAL_GROUP_TOPICS[groupId] ?? buildPlaceholderTopics(group.title, fallbackCount);

  return {
    ...group,
    topics,
  };
}

const GROUP_ARTICLES: Partial<Record<number, GroupArticle>> = {
  8: {
    eyebrow: "����",
    title: "����� ����������",
    intro:
      "���� ����� ��������������� ��� ��������� �������������� � ������ �����: �� ��� ����� ������ ��� ����������� ��������, � ��� ������������� ������� ��� ��������� ��������� ��������, ������� � �������.",
    imageSrc: "/tarot-tree-of-life.jpg",
    imageAlt: "���������������� ����� �����",
    blocks: [
      {
        type: "paragraph",
        title: "����������� ����������: 10 ������",
        text:
          "��������� ����� ����� (�� ����) ��� ����������� ����������� �����. ������ � ��� �� ������ ������, ��� �������������� ���� ��� ����������, ������� �������� ���������� ������� ������������� ����� (��� ���) �� ������, ��� ������� ����� ������������ ���������� �������.",
      },
      {
        type: "list",
        title: "22 ���� � �������� �����",
        items: [
          "���� ������ � ��� �������, �� 22 ���� � ��� ��������� �������� ������. ������ ���� ������������� ����� ������ � ������������� ��������������� ���������.",
          "�������� ������ � ���� �������� �������� �� �������� �������� (������ ����) � ����������� (����� �����).",
          "���������: ���� �������� �� ����� � ������, ���������� � ��������� ��������.",
          "��������: �������� ��������� (��������) ����������� �� ������ � �����, �������� ���� �������������� ����������� � ��������� �������.",
        ],
      },
      {
        type: "list",
        title: "����: ��������� ������������",
        items: [
          "���� � ��� �� ��������� �����, � ����������� ��������� (GUI) ��� �������������� � ������ �����. ��� ��� ������� �������� ����������� �����������.",
          "22 ������� ������: ��� �� ����� 22 ����. ������ ����� � ����-���, ����������� �������� ������������� �� ����� ����� � ������. ��������, ���� ����� ����� � ���� � ��� ����� ������������.",
          "������� ������ ������������� 10 ������ � ������� �����. ���� � ��� ������� �����, ������� � �������� � ������.",
          "���������� ����� ��������� ���� ������������ ��� ���������� ��������, ����� ������� �������� �������.",
        ],
      },
      {
        type: "list",
        title: "��� ���������� ��������������?",
        items: [
          "����� �� ��������� � ���� � ��������� �����, �� ����������� ���������� �����������������.",
          "�����������: �� �����������, �� ����� ���� ��������� ����� �������.",
          "���������: ��������� ������ ����, �� ������������� ������� ��� ��������, ����� ��������������� �������.",
          "����� ����� � ����������� ������. ������ ����� �������� ������ ���� ��� ���� ��������� �����, � ��� �� �������������.",
          "�����: ������� �� ������ ����������. ��������� ����� ����� ��� ����� ���������������� ������ ����� � ��������� � ����.",
          "������ �� ��������� �� ����� �� �������. �� �� ������� �� �������. �� � � ��������.",
        ],
      },
      {
        type: "list",
        title: "������ ��������: ��������� ������������ � �������������� ����",
        items: [
          "������� �������������: �� � ���� �����. ���������� ����� ������������� ��� ����������, � ��������� ����� ��� �������� � ����� �������� � ������ ����.",
          "������ � ��� �� ������� �������, � ����������� ������ ��������. ����� �� ������ ������, �� ����������� ���������� ������� ����� �������.",
          "������ ���� � ����������������� ���������. ������ ����� ����� ������������� � �������������� �������� � ������� ����������� ���� ��� �����.",
          "����� �������� ������������ �� ������, ��������� ������ �����������: ��������� ��������� ������ � �������������� ����, � ����� ���������� ���������, ������������ �� ������� ��������.",
          "����������������� �������� ��� ������ ������������: ������ ������� ���������, � ��������� ����� ���������� ��������� ��������� � ���������� �����.",
          "����� ������ � ���������� ���������� ��� ������� ��������. ����� �������� ����� ���� ��� ����� ���������, �������� � �������� ���������.",
        ],
      },
      {
        type: "list",
        title: "�������� �����������",
        items: [
          "������: ���������� ������� � ������ ��������.",
          "����: �������� ������ � ������������ �������� ������ �������.",
          "��� � �����: ����������� ������� ����������� � ��������.",
          "�������: ����� ������, ��� ������������ �����, �������� �������� ��� ��������.",
        ],
      },
      {
        type: "paragraph",
        title: "������",
        text:
          "������� ����� � ���� ��, ������ ��� �� � ���������, ����� ������� ��������� ������� ���� ����. ����� ���� � ��� ������ ������� ���������� ���������� �� ������� �����, ����� �������� ���� ����� �� ���������.",
      },
      {
        type: "list",
        title: "���� ��� ��������� ������ �������",
        items: [
          "���� � ������� ����� ����� � ��� �� ������ ������������ �����, � ������������ ���, ������� ��������� ������� ��������.",
          "���� ������ � ��� hardware, � ���� � GUI, �� ���� � ��� CLI, ����� ������� �������� ����� ���.",
          "� ���� ���������� ���� �������� ���������: ������ ����� ������� ������������ � ���������� ��������, ����� � �����.",
          "������� �� 22 ����� ������������� ��������� ����. ��������� ����, �� ������� � �������� � ������������ ������� ����� �� �����.",
          "���� ��������� ������, ��������� ��� � ��������� ������ ����������� � �������.",
          "���� ���������� ����� ������ � ��� �����, �� ���� ����� ������������� ��� �������, ����������� ���������� ����������� ������.",
        ],
      },
    ],
  },
};

export function getGroupArticle(groupId: number) {
  return GROUP_ARTICLES[groupId] ?? null;
}

const TOPIC_LINKS_BY_GROUP_AND_TOPIC: Record<string, TopicLinkItem[]> = {
  "1-1": [
    { id: 1, title: "Главы 1-2", href: "https://t.me/c/1558317824/696" },
    { id: 2, title: "Главы 3-4", href: "https://t.me/c/1558317824/711" },
    { id: 3, title: "Главы 5-6", href: "https://t.me/c/1558317824/731" },
    { id: 4, title: "Главы 7-8", href: "https://t.me/c/1558317824/758" },
    { id: 5, title: "Главы 9-10", href: "https://t.me/c/1558317824/778" },
    { id: 6, title: "Главы 11-12", href: "https://t.me/c/1558317824/814" },
    { id: 7, title: "Главы 13-14", href: "https://t.me/c/1558317824/839" },
    { id: 8, title: "Главы 15-16", href: "https://t.me/c/1558317824/867" },
    { id: 9, title: "Глава 17", href: "https://t.me/c/1558317824/934" },
    { id: 10, title: "Глава 18", href: "https://t.me/c/1558317824/991" },
    { id: 11, title: "Глава 19", href: "https://t.me/c/1558317824/1026" },
    { id: 12, title: "Глава 20", href: "https://t.me/c/1558317824/1134" },
    { id: 13, title: "Глава 21", href: "https://t.me/c/1558317824/1291" },
    { id: 14, title: "Глава 22", href: "https://t.me/c/1558317824/1492" },
    { id: 15, title: "Глава 23", href: "https://t.me/c/1558317824/1650" },
    { id: 16, title: "Глава 24", href: "https://t.me/c/1558317824/1754" },
    { id: 17, title: "Глава 25", href: "https://t.me/c/1558317824/1902" },
    { id: 18, title: "Глава 26", href: "https://t.me/c/1558317824/3570" },
    { id: 19, title: "Глава 27", href: "https://t.me/c/1558317824/3613" },
  ],
  "1-2": [
    { id: 1, title: "Начало", href: "https://t.me/c/1558317824/734" },
    { id: 2, title: "Предисловие, главы 1 и 2", href: "https://t.me/c/1558317824/737" },
    { id: 3, title: "Главы 3-4", href: "https://t.me/c/1558317824/748" },
    { id: 4, title: "Главы 5-6", href: "https://t.me/c/1558317824/782" },
    { id: 5, title: "Главы 7-8", href: "https://t.me/c/1558317824/808" },
    { id: 6, title: "Главы 9-10", href: "https://t.me/c/1558317824/832" },
    { id: 7, title: "Главы 11-12", href: "https://t.me/c/1558317824/882" },
    { id: 8, title: "Глава 13", href: "https://t.me/c/1558317824/932" },
    { id: 9, title: "Глава 14", href: "https://t.me/c/1558317824/968" },
    { id: 10, title: "Глава 15", href: "https://t.me/c/1558317824/987" },
    { id: 11, title: "Глава 16", href: "https://t.me/c/1558317824/1020" },
    { id: 12, title: "Глава 17", href: "https://t.me/c/1558317824/1113" },
    { id: 13, title: "Глава 18", href: "https://t.me/c/1558317824/1281" },
    { id: 14, title: "Глава 19", href: "https://t.me/c/1558317824/1395" },
    { id: 15, title: "Глава 20", href: "https://t.me/c/1558317824/1513" },
    { id: 16, title: "Глава 21", href: "https://t.me/c/1558317824/1596" },
    { id: 17, title: "Глава 22", href: "https://t.me/c/1558317824/1812" },
    { id: 18, title: "Глава 23", href: "https://t.me/c/1558317824/2441" },
    { id: 19, title: "Глава 24", href: "https://t.me/c/1558317824/343" },
    { id: 20, title: "Глава 25", href: "https://t.me/c/1558317824/3468" },
    { id: 21, title: "Глава 26", href: "https://t.me/c/1558317824/3485" },
    { id: 22, title: "Глава 27", href: "https://t.me/c/1558317824/3498" },
    { id: 23, title: "Главы 47-48", href: "https://t.me/c/1558317824/683" },
    { id: 24, title: "Главы 49-50", href: "https://t.me/c/1558317824/690" },
  ],
  "1-3": [
    { id: 1, title: "Предисловие", href: "https://t.me/c/1558317824/723" },
    { id: 2, title: "Глава 1", href: "https://t.me/c/1558317824/760" },
    { id: 3, title: "Глава 2", href: "https://t.me/c/1558317824/761" },
    { id: 4, title: "Главы 3-4", href: "https://t.me/c/1558317824/825" },
    { id: 5, title: "Главы 5-6", href: "https://t.me/c/1558317824/827" },
    { id: 6, title: "Главы 7-8", href: "https://t.me/c/1558317824/851" },
    { id: 7, title: "Глава 9", href: "https://t.me/c/1558317824/973" },
    { id: 8, title: "Глава 10", href: "https://t.me/c/1558317824/1073" },
    { id: 9, title: "Глава 11", href: "https://t.me/c/1558317824/1151" },
    { id: 10, title: "Глава 12", href: "https://t.me/c/1558317824/1333" },
    { id: 11, title: "Глава 13", href: "https://t.me/c/1558317824/1531" },
  ],
  "1-4": [
    { id: 1, title: "Глава 1", href: "https://t.me/c/1558317824/961" },
    { id: 2, title: "Глава 2", href: "https://t.me/c/1558317824/1241" },
    { id: 3, title: "Глава 3", href: "https://t.me/c/1558317824/1449" },
    { id: 4, title: "Глава 4", href: "https://t.me/c/1558317824/1856" },
    { id: 5, title: "Глава 5", href: "https://t.me/c/1558317824/1912" },
  ],
  "1-5": [
    { id: 1, title: "Глава 1", href: "https://t.me/c/1558317824/1870" },
    { id: 2, title: "Глава 2", href: "https://t.me/c/1558317824/1896" },
    { id: 3, title: "Глава 2 (англ.)", href: "https://youtu.be/DcbZMPEnEXE?si=ngg1igZKpezRss2b" },
    { id: 4, title: "Глава 3", href: "https://t.me/c/1558317824/2022" },
    { id: 5, title: "Глава 4", href: "https://t.me/c/1558317824/2407" },
    { id: 6, title: "Глава 5", href: "https://t.me/c/1558317824/2411" },
    { id: 7, title: "Глава 6", href: "https://t.me/c/1558317824/2492" },
    { id: 8, title: "Глава 7", href: "https://t.me/c/1558317824/2614" },
    { id: 9, title: "Глава 8", href: "https://t.me/c/1558317824/3298" },
    { id: 10, title: "Глава 9", href: "https://t.me/c/1558317824/3301" },
    { id: 11, title: "Пролог в бездну", href: "https://t.me/c/1558317824/3512" },
    { id: 12, title: "Глава 10", href: "https://t.me/c/1558317824/3514" },
    { id: 13, title: "Глава 11", href: "https://t.me/c/1558317824/3535" },
    { id: 14, title: "Глава 12", href: "https://t.me/c/1558317824/3575" },
    { id: 15, title: "Глава 13", href: "https://t.me/c/1558317824/3605" },
  ],
  "1-7": [
    { id: 1, title: "Великолепный разум", href: "https://t.me/c/1558317824/794" },
    { id: 2, title: "Философия намерения", href: "https://t.me/c/1558317824/944" },
    { id: 3, title: "Сила терпения", href: "https://t.me/c/1558317824/958" },
    { id: 4, title: "Память и дети", href: "https://t.me/c/1558317824/978" },
  ],
  "1-6": [
    { id: 1, title: "Свет твоего бытия", href: "https://t.me/c/1558317824/2980" },
    { id: 2, title: "Рудольф Штайнер", href: "https://t.me/c/1558317824/2999" },
    { id: 3, title: "Великодушие", href: "https://t.me/c/1558317824/3019" },
    { id: 4, title: "Доброта", href: "https://t.me/c/1558317824/3023" },
    { id: 5, title: "Милосердие", href: "https://t.me/c/1558317824/3026" },
    { id: 6, title: "Архитектура биополя", href: "https://t.me/c/1558317824/3033" },
    { id: 7, title: "Пролей мои слезы", href: "https://t.me/c/1558317824/3040" },
    { id: 8, title: "Прикоснись ко мне", href: "https://t.me/c/1558317824/3044" },
    { id: 9, title: "Парадокс предвзятости", href: "https://t.me/c/1558317824/3070" },
    { id: 10, title: "Объятия Всевышнего", href: "https://t.me/c/1558317824/3073" },
    { id: 11, title: "Обратная сторона медали", href: "https://t.me/c/1558317824/3077" },
    { id: 12, title: "Парадокс ошибки", href: "https://t.me/c/1558317824/3131" },
    { id: 13, title: "Алхимия внутренних вод", href: "https://t.me/c/1558317824/3134" },
    { id: 14, title: "Архитектура тишины", href: "https://t.me/c/1558317824/3137" },
    { id: 15, title: "Теория темного леса", href: "https://t.me/c/1558317824/3160" },
    { id: 16, title: "Энергия и резонанс", href: "https://t.me/c/1558317824/3163" },
    { id: 17, title: "Квантовый двойник", href: "https://t.me/c/1558317824/3166" },
    { id: 18, title: "То, что мы не видим", href: "https://t.me/c/1558317824/3170" },
    { id: 19, title: "Переход состояний материи", href: "https://t.me/c/1558317824/3173" },
    { id: 20, title: "Coincidentia oppositorum", href: "https://t.me/c/1558317824/3238" },
    { id: 21, title: "Код доступа", href: "https://t.me/c/1558317824/3241" },
    { id: 22, title: "Выбор (синие чернила)", href: "https://t.me/c/1558317824/3286" },
    { id: 23, title: "Архит Тарентский", href: "https://t.me/c/1558317824/3290" },
    { id: 24, title: "Великое стирание", href: "https://t.me/c/1558317824/3293" },
    { id: 25, title: "Космический кодекс", href: "https://t.me/c/1558317824/3328" },
    { id: 26, title: "Тайная жизнь нашего тела", href: "https://t.me/c/1558317824/3332" },
    { id: 27, title: "Квантовая запутанность", href: "https://t.me/c/1558317824/3335" },
    { id: 28, title: "Метакогниция", href: "https://t.me/c/1558317824/3443" },
    { id: 29, title: "Архитектура реальности: принцип зеркала", href: "https://t.me/c/1558317824/3447" },
    { id: 30, title: "Пять истин", href: "https://t.me/c/1558317824/3451" },
    { id: 31, title: "Сила памяти", href: "https://t.me/c/1558317824/999" },
    { id: 32, title: "Сила мысли и осознанности", href: "https://t.me/c/1558317824/1078" },
    { id: 33, title: "Секрет памяти", href: "https://t.me/c/1558317824/1103" },
    { id: 34, title: "Человек творит реальность", href: "https://t.me/c/1558317824/1119" },
    { id: 35, title: "Сольфеджио", href: "https://t.me/c/1558317824/1137" },
    { id: 36, title: "Секрет пяти", href: "https://t.me/c/1558317824/1227" },
    { id: 37, title: "Симпатический резонанс", href: "https://t.me/c/1558317824/1232" },
    { id: 38, title: "Мудрость Рудры", href: "https://t.me/c/1558317824/1418" },
    { id: 39, title: "Сила чел. сердца", href: "https://t.me/c/1558317824/1436" },
    { id: 40, title: "Сила и свобода воли", href: "https://t.me/c/1558317824/1573" },
    { id: 41, title: "Многомерность пр-ва и времени. Инфополе. Природа реальности", href: "https://t.me/c/1558317824/1706" },
    { id: 42, title: "Квантовая физика и воля человека", href: "https://t.me/c/1558317824/1711" },
    { id: 43, title: "Как решить любую проблему", href: "https://t.me/c/1558317824/1732" },
    { id: 44, title: "Три оси времени и \"сбой матрицы\"", href: "https://t.me/c/1558317824/1764" },
    { id: 45, title: "За пределами матрицы", href: "https://t.me/c/1558317824/1934" },
    { id: 46, title: "Все вибрирует в этом мире на квантовом уровне", href: "https://t.me/c/1558317824/1981" },
    { id: 47, title: "Ключи Соломона", href: "https://t.me/c/1558317824/1999" },
    { id: 48, title: "Магия Соломона", href: "https://t.me/c/1558317824/2005" },
    { id: 49, title: "Lucid dreams", href: "https://t.me/c/1558317824/2059" },
    { id: 50, title: "Парадокс усилия", href: "https://t.me/c/1320629049/1196" },
    { id: 51, title: "Вдыхание звуков", href: "https://t.me/c/1320629049/1225" },
    { id: 52, title: "Жизненный опыт", href: "https://t.me/c/1558317824/2384" },
    { id: 53, title: "Жизненные обс-ва", href: "https://t.me/c/1558317824/2388" },
    { id: 54, title: "Дыхание через темноту", href: "https://t.me/c/1558317824/2411" },
    { id: 55, title: "Момент тишины (30-60 минут)", href: "https://t.me/c/1558317824/2238" },
    { id: 56, title: "Тайна 4 квантов", href: "https://t.me/c/1558317824/2433" },
    { id: 57, title: "Шепот сердца", href: "https://t.me/c/1558317824/2449" },
    { id: 58, title: "Гармония и вода", href: "https://t.me/c/1558317824/2445" },
    { id: 59, title: "Боль", href: "https://t.me/c/1558317824/2468" },
    { id: 60, title: "Триптофан", href: "https://t.me/c/1558317824/2488" },
    { id: 61, title: "Слово", href: "https://t.me/c/1558317824/2586" },
    { id: 62, title: "Лингвистическая атака и защита", href: "https://t.me/c/1558317824/2590" },
    { id: 63, title: "Ораторское искусство и словарный запас", href: "https://t.me/c/1558317824/2593" },
    { id: 64, title: "Суверенитет мыслей через общение", href: "https://t.me/c/1558317824/2596" },
    { id: 65, title: "Травы памяти", href: "https://t.me/c/1558317824/2611" },
    { id: 66, title: "Дух и Душа", href: "https://t.me/c/1558317824/2627" },
    { id: 67, title: "Алхимия желаний", href: "https://t.me/c/1558317824/2631" },
    { id: 68, title: "Алхимия намерения", href: "https://t.me/c/1558317824/2642" },
    { id: 69, title: "Алхимия цели", href: "https://t.me/c/1558317824/2645" },
    { id: 70, title: "Алхимия пути", href: "https://t.me/c/1558317824/2652" },
    { id: 71, title: "Алхимия внимания", href: "https://t.me/c/1558317824/2655" },
    { id: 72, title: "Камертон Канта", href: "https://t.me/c/1558317824/2679" },
    { id: 73, title: "Случайность и ее космические алгоритмы", href: "https://t.me/c/1864993756/3273544" },
    { id: 74, title: "Анамнезис потерянного мира", href: "https://t.me/c/1558317824/2783" },
    { id: 75, title: "Эликсир гениальности", href: "https://t.me/c/1558317824/2779" },
    { id: 76, title: "Алхимия сознания и квантовое поле", href: "https://t.me/c/1558317824/2802" },
    { id: 77, title: "Электрическое тело. Система напряжения человека", href: "https://t.me/c/1558317824/2798" },
    { id: 78, title: "Жизнь под землей", href: "https://t.me/c/1558317824/2892" },
    { id: 79, title: "Вера, надежда, любовь", href: "https://t.me/c/1558317824/2903" },
  ],
};

const alchemyTom1IntroLinks = TOPIC_LINKS_BY_GROUP_AND_TOPIC["1-7"];
const alchemyMixedLinks = TOPIC_LINKS_BY_GROUP_AND_TOPIC["1-6"];

TOPIC_LINKS_BY_GROUP_AND_TOPIC["1-6"] = [
  ...alchemyTom1IntroLinks.map((item, index) => ({
    ...item,
    id: index + 1,
  })),
  ...alchemyMixedLinks.slice(30).map((item, index) => ({
    ...item,
    id: index + 5,
  })),
];

TOPIC_LINKS_BY_GROUP_AND_TOPIC["1-7"] = [
  { id: 1, title: "Свет твоего бытия", href: "https://t.me/c/1558317824/2980" },
  { id: 2, title: "Рудольф Штайнер", href: "https://t.me/c/1558317824/2999" },
  { id: 3, title: "Великодушие", href: "https://t.me/c/1558317824/3019" },
  { id: 4, title: "Доброта", href: "https://t.me/c/1558317824/3023" },
  { id: 5, title: "Милосердие", href: "https://t.me/c/1558317824/3026" },
  { id: 6, title: "Архитектура биополя", href: "https://t.me/c/1558317824/3033" },
  { id: 7, title: "Пролей мои слезы", href: "https://t.me/c/1558317824/3040" },
  { id: 8, title: "Прикоснись ко мне", href: "https://t.me/c/1558317824/3044" },
  { id: 9, title: "Парадокс предвзятости", href: "https://t.me/c/1558317824/3070" },
  { id: 10, title: "Объятия Всевышнего", href: "https://t.me/c/1558317824/3073" },
  { id: 11, title: "Обратная сторона медали", href: "https://t.me/c/1558317824/3077" },
  { id: 12, title: "Парадокс ошибки", href: "https://t.me/c/1558317824/3131" },
  { id: 13, title: "Алхимия внутренних вод", href: "https://t.me/c/1558317824/3134" },
  { id: 14, title: "Архитектура тишины", href: "https://t.me/c/1558317824/3137" },
  { id: 15, title: "Теория темного леса", href: "https://t.me/c/1558317824/3160" },
  { id: 16, title: "Энергия и резонанс", href: "https://t.me/c/1558317824/3163" },
  { id: 17, title: "Квантовый двойник", href: "https://t.me/c/1558317824/3166" },
  { id: 18, title: "То, что мы не видим", href: "https://t.me/c/1558317824/3170" },
  { id: 19, title: "Переход состояний материи", href: "https://t.me/c/1558317824/3173" },
  { id: 20, title: "Код доступа", href: "https://t.me/c/1558317824/3241" },
  { id: 21, title: "Coincidentia oppositorum", href: "https://t.me/c/1558317824/3238" },
  { id: 22, title: "Выбор (синие чернила)", href: "https://t.me/c/1558317824/3286" },
  { id: 23, title: "Архит Тарентский", href: "https://t.me/c/1558317824/3290" },
  { id: 24, title: "Великое стирание", href: "https://t.me/c/1558317824/3293" },
  { id: 25, title: "Космический кодекс", href: "https://t.me/c/1558317824/3328" },
  { id: 26, title: "Тайная жизнь нашего тела", href: "https://t.me/c/1558317824/3332" },
  { id: 27, title: "Квантовая запутанность", href: "https://t.me/c/1558317824/3335" },
  { id: 28, title: "Метакогниция", href: "https://t.me/c/1558317824/3443" },
  { id: 29, title: "Архитектура реальности: принцип зеркала", href: "https://t.me/c/1558317824/3447" },
  { id: 30, title: "Пять истин", href: "https://t.me/c/1558317824/3451" },
];

function findDuplicateIds<T extends { id: number }>(items: T[]): number[] {
  const seen = new Set<number>();
  const duplicates = new Set<number>();

  items.forEach((item) => {
    if (seen.has(item.id)) {
      duplicates.add(item.id);
      return;
    }

    seen.add(item.id);
  });

  return Array.from(duplicates).sort((left, right) => left - right);
}

function validateClubContent() {
  const issues: string[] = [];

  Object.entries(REAL_GROUP_TOPICS).forEach(([groupId, topics]) => {
    if (!topics) {
      return;
    }

    const duplicateTopicIds = findDuplicateIds(topics);
    if (duplicateTopicIds.length > 0) {
      issues.push(
        `Group ${groupId} has duplicate topic ids: ${duplicateTopicIds.join(", ")}`
      );
    }

    topics.forEach((topic) => {
      const topicKey = `${groupId}-${topic.id}`;
      const links = TOPIC_LINKS_BY_GROUP_AND_TOPIC[topicKey];

      if (!links) {
        return;
      }

      const duplicateLinkIds = findDuplicateIds(links);
      if (duplicateLinkIds.length > 0) {
        issues.push(
          `Topic ${topicKey} has duplicate link ids: ${duplicateLinkIds.join(", ")}`
        );
      }
    });
  });

  Object.keys(TOPIC_LINKS_BY_GROUP_AND_TOPIC).forEach((topicKey) => {
    const [groupIdRaw, topicIdRaw] = topicKey.split("-");
    const groupId = Number.parseInt(groupIdRaw, 10);
    const topicId = Number.parseInt(topicIdRaw, 10);

    if (!Number.isFinite(groupId) || !Number.isFinite(topicId)) {
      issues.push(`Topic links key "${topicKey}" has an invalid format.`);
      return;
    }

    const topics = REAL_GROUP_TOPICS[groupId];
    const topicExists = topics?.some((topic) => topic.id === topicId);

    if (!topicExists) {
      issues.push(`Topic links key "${topicKey}" does not match an existing topic.`);
    }
  });

  if (issues.length > 0) {
    throw new Error(`Club content validation failed:\n${issues.join("\n")}`);
  }
}

validateClubContent();

export function getTopicPageData(groupId: number, topicId: number) {
  const group = getGroupPageData(groupId);

  if (!group) {
    return null;
  }

  const topic = group.topics.find((item) => item.id === topicId);

  if (!topic) {
    return null;
  }

  const links =
    TOPIC_LINKS_BY_GROUP_AND_TOPIC[`${groupId}-${topicId}`] ??
    Array.from({ length: 40 }, (_, index) => ({
      id: index + 1,
      title: `${topic.title} — ссылка ${index + 1}`,
    }));

  return {
    group,
    topic,
    links,
  };
}

