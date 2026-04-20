# 🔒 Закрытый Клуб — Сайт

Сайт закрытого сообщества с системой квиза при регистрации.

## Стек

- **Next.js 14** — фронтенд + серверные API-роуты
- **Supabase** — база данных, авторизация, хранение
- **Tailwind CSS** — стили
- **Vercel** — деплой (бесплатно)

---

## Быстрый старт

### 1. Установи зависимости

```bash
npm install
```

### 2. Настрой Supabase

1. Зайди на [supabase.com](https://supabase.com) → создай новый проект
2. Перейди в **SQL Editor** и выполни файл `supabase/schema.sql`
3. В разделе **Authentication → URL Configuration** укажи:
   - **Site URL**: `http://localhost:3000` (для разработки)
   - **Redirect URLs**: `http://localhost:3000/welcome`
4. Скопируй ключи из **Settings → API**

### 3. Создай файл `.env.local`

```bash
cp .env.example .env.local
```

Заполни своими данными из Supabase Dashboard:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

> ⚠️ **ВАЖНО**: `SUPABASE_SERVICE_ROLE_KEY` — секретный ключ.
> Никогда не публикуй его и не добавляй в git.

### 4. Добавь вопросы и ответы

После выполнения `schema.sql` в SQL Editor добавь ответы:

```sql
-- Получи UUID вопросов
SELECT id, order_priority, question_text FROM registration_questions ORDER BY order_priority;

-- Вставь ответы (замени UUID на реальные из предыдущего запроса)
INSERT INTO question_answers (question_id, correct_answer) VALUES
  ('uuid-вопроса-1', 'Твой ответ 1'),
  ('uuid-вопроса-2', 'Твой ответ 2'),
  ('uuid-вопроса-3', 'Твой ответ 3');
```

### 5. Запусти проект

```bash
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000)

---

## Структура проекта

```
my-club/
├── app/
│   ├── page.tsx                  # Страница входа
│   ├── register/page.tsx         # Квиз + регистрация
│   ├── welcome/page.tsx          # После подтверждения email
│   ├── dashboard/
│   │   ├── layout.tsx            # Защита + шапка кабинета
│   │   ├── page.tsx              # Главная кабинета (разделы)
│   │   └── [subgroup]/page.tsx   # Страница раздела
│   └── api/
│       ├── check-answer/route.ts # Проверка ответа (сервер!)
│       └── logout/route.ts       # Выход из аккаунта
├── lib/supabase/
│   ├── client.ts                 # Supabase клиент (браузер)
│   └── server.ts                 # Supabase клиент (сервер)
├── middleware.ts                 # Защита роутов
├── supabase/schema.sql           # SQL для создания БД
└── .env.example                  # Пример переменных окружения
```

---

## Безопасность

| Механизм | Что защищает |
|---|---|
| Middleware | Блокирует доступ к `/dashboard` без авторизации |
| Service Role Key | Ответы квиза читает только сервер |
| RLS в Supabase | Таблица `question_answers` закрыта от фронтенда |
| API-роут `/api/check-answer` | Возвращает только `true/false`, не сам ответ |
| Лимит попыток | 3 попытки на вопрос, затем блокировка |
| `.gitignore` | `.env.local` никогда не попадёт в git |

---

## Деплой на Vercel (бесплатно)

1. Загрузи проект на [GitHub](https://github.com)
2. Зайди на [vercel.com](https://vercel.com) → **New Project** → выбери репозиторий
3. В разделе **Environment Variables** добавь все три переменные из `.env.local`
4. Нажми **Deploy**
5. После деплоя в Supabase обнови:
   - **Site URL**: `https://твой-сайт.vercel.app`
   - **Redirect URLs**: `https://твой-сайт.vercel.app/welcome`

---

## Кастомизация

### Изменить название клуба
Найди в коде текст `КЛУБ` и замени на своё название.

### Изменить дизайн (цвета)
Все цвета настраиваются в `tailwind.config.js`:
```js
gold: "#c9a84c",        // Основной акцентный цвет
obsidian: "#0a0a0a",    // Цвет фона
ivory: "#f5f0e8",       // Цвет текста
```

### Добавить разделы в кабинет
```sql
INSERT INTO subgroups (title, slug, description, icon) VALUES
  ('Новый раздел', 'new-section', 'Описание', '🔑');
```

### Добавить новые вопросы квиза
```sql
INSERT INTO registration_questions (question_text, order_priority) VALUES
  ('Новый вопрос?', 4);

-- Затем добавь ответ:
INSERT INTO question_answers (question_id, correct_answer) VALUES
  ('uuid-нового-вопроса', 'ответ');
```
