-- 1. Создаем таблицу events для сбора метрик
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  event_type TEXT NOT NULL CHECK (event_type IN ('auth_login','auth_signup','vacancy_created','resume_created','application_created')),
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Включаем RLS для events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Политика для вставки: authenticated и anon могут писать события
CREATE POLICY "events_insert_all" ON public.events
  FOR INSERT TO anon, authenticated 
  WITH CHECK (true);

-- Политика для чтения: только владелец событий или админы
CREATE POLICY "events_select_own" ON public.events
  FOR SELECT TO authenticated 
  USING (user_id = auth.uid());

-- 2. Добавляем поле raw_text для импорта резюме
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS raw_text TEXT;

-- 3. Создаем таблицу apply_audit для антиспама
CREATE TABLE IF NOT EXISTS public.apply_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vacancy_id UUID NOT NULL,
  user_id UUID,
  ip_hash TEXT, -- sha256(IP + SECRET_SALT)
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Добавляем внешний ключ для vacancy_id
ALTER TABLE public.apply_audit ADD CONSTRAINT apply_audit_vacancy_id_fkey 
  FOREIGN KEY (vacancy_id) REFERENCES public.vacancies(id) ON DELETE CASCADE;

-- Создаем индекс для быстрой проверки rate limiting
CREATE INDEX IF NOT EXISTS idx_apply_audit_rate_limit ON public.apply_audit(vacancy_id, ip_hash, created_at);

-- Включаем RLS для apply_audit
ALTER TABLE public.apply_audit ENABLE ROW LEVEL SECURITY;

-- Политика для вставки: только аутентифицированные пользователи могут писать
CREATE POLICY "apply_audit_insert" ON public.apply_audit
  FOR INSERT TO authenticated, anon
  WITH CHECK (true);

-- 4. Создаем таблицу outbox_webhooks для будущих вебхуков
CREATE TABLE IF NOT EXISTS public.outbox_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','failed')),
  try_count INT NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Включаем RLS для outbox_webhooks
ALTER TABLE public.outbox_webhooks ENABLE ROW LEVEL SECURITY;

-- Политика: только service_role может работать с вебхуками
CREATE POLICY "outbox_webhooks_service_only" ON public.outbox_webhooks
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Создаем индексы для производительности
CREATE INDEX IF NOT EXISTS idx_outbox_webhooks_status ON public.outbox_webhooks(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON public.events(event_type);

-- 5. Обновляем функцию для updated_at в outbox_webhooks
CREATE TRIGGER update_outbox_webhooks_updated_at
  BEFORE UPDATE ON public.outbox_webhooks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Создаем уникальные индексы для applications (антиспам)
CREATE UNIQUE INDEX IF NOT EXISTS applications_candidate_unique 
  ON public.applications(vacancy_id, candidate_id) 
  WHERE candidate_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS applications_guest_unique 
  ON public.applications(vacancy_id, lower(guest_email)) 
  WHERE guest_email IS NOT NULL;