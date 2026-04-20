-- =====================================================
-- DATABASE FOR THE PRIVATE CLUB SITE
-- Run this file in Supabase SQL Editor
-- =====================================================

-- 1. Registration questions: exactly 5 items for the quiz.
CREATE TABLE IF NOT EXISTS registration_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  order_priority INTEGER NOT NULL UNIQUE CHECK (order_priority BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Correct answers. One answer per question.
CREATE TABLE IF NOT EXISTS question_answers (
  question_id UUID PRIMARY KEY REFERENCES registration_questions(id) ON DELETE CASCADE,
  correct_answer TEXT NOT NULL
);

-- 3. Daily attempt tracking: 5 attempts per question per day.
CREATE TABLE IF NOT EXISTS daily_question_attempts (
  identifier TEXT NOT NULL,
  question_id UUID NOT NULL REFERENCES registration_questions(id) ON DELETE CASCADE,
  attempt_date DATE NOT NULL,
  attempts_count INTEGER NOT NULL DEFAULT 0 CHECK (attempts_count BETWEEN 0 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (identifier, question_id, attempt_date)
);

-- 4. Dashboard sections.
CREATE TABLE IF NOT EXISTS subgroups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_daily_question_attempts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_daily_question_attempts_updated_at ON daily_question_attempts;
CREATE TRIGGER trg_daily_question_attempts_updated_at
BEFORE UPDATE ON daily_question_attempts
FOR EACH ROW
EXECUTE FUNCTION update_daily_question_attempts_updated_at();

-- =====================================================
-- SECURITY (RLS)
-- =====================================================

ALTER TABLE registration_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subgroups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read questions" ON registration_questions;
CREATE POLICY "Public can read questions"
  ON registration_questions FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Service role reads answers" ON question_answers;
CREATE POLICY "Service role reads answers"
  ON question_answers FOR SELECT
  TO service_role
  USING (true);

DROP POLICY IF EXISTS "Service role manages attempts" ON daily_question_attempts;
CREATE POLICY "Service role manages attempts"
  ON daily_question_attempts FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users read subgroups" ON subgroups;
CREATE POLICY "Authenticated users read subgroups"
  ON subgroups FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- QUIZ DATA: STEP 1 - ADD EXACTLY 5 QUESTIONS
-- If you rerun the setup for a new quiz, clear old data first:
--
-- DELETE FROM question_answers;
-- DELETE FROM daily_question_attempts;
-- DELETE FROM registration_questions;
-- =====================================================

INSERT INTO registration_questions (question_text, order_priority) VALUES
  ('Вопрос 1: напиши здесь свой первый вопрос', 1),
  ('Вопрос 2: напиши здесь свой второй вопрос', 2),
  ('Вопрос 3: напиши здесь свой третий вопрос', 3),
  ('Вопрос 4: напиши здесь свой четвертый вопрос', 4),
  ('Вопрос 5: напиши здесь свой пятый вопрос', 5)
ON CONFLICT (order_priority) DO UPDATE
SET question_text = EXCLUDED.question_text;

-- =====================================================
-- QUIZ DATA: STEP 2 - GET THE 5 QUESTION IDS
-- Run this query after inserting the questions:
--
-- SELECT id, order_priority, question_text
-- FROM registration_questions
-- ORDER BY order_priority;
-- =====================================================

-- =====================================================
-- QUIZ DATA: STEP 3 - ADD THE 5 ANSWERS
-- Replace each uuid-question-X with the real UUID from the query above.
-- =====================================================

-- INSERT INTO question_answers (question_id, correct_answer) VALUES
--   ('uuid-question-1', 'Ответ на вопрос 1'),
--   ('uuid-question-2', 'Ответ на вопрос 2'),
--   ('uuid-question-3', 'Ответ на вопрос 3'),
--   ('uuid-question-4', 'Ответ на вопрос 4'),
--   ('uuid-question-5', 'Ответ на вопрос 5')
-- ON CONFLICT (question_id) DO UPDATE
-- SET correct_answer = EXCLUDED.correct_answer;

-- =====================================================
-- OPTIONAL: DEFAULT DASHBOARD SECTIONS
-- =====================================================

INSERT INTO subgroups (title, slug, description, icon) VALUES
  ('Общая информация', 'general', 'Правила, история и ценности клуба', '📜'),
  ('Мероприятия', 'events', 'Предстоящие встречи и события', '📅'),
  ('Участники', 'members', 'Список членов сообщества', '👥'),
  ('Архив', 'archive', 'Записи прошлых встреч и материалы', '🗂️')
ON CONFLICT (slug) DO NOTHING;
