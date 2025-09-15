# Инфраструктурная документация

## Миграции Supabase

Все изменения в базе данных должны выполняться через миграции в папке `supabase/migrations/`.

### Применение миграций (если используется Supabase CLI):
```bash
supabase db push
```

⚠️ **ВАЖНО**: Все изменения в БД делаем только через миграции!

## Платный доступ к базе резюме

### Настройка доступа:
1. Перейдите в Supabase Studio → Table Editor → `resume_access`
2. Добавьте запись или обновите существующую:
   ```sql
   INSERT INTO public.resume_access (user_id, has_access) 
   VALUES ('USER_UUID', true)
   ON CONFLICT (user_id) 
   DO UPDATE SET has_access = true, updated_at = now();
   ```

### Проверка доступа:
- При `has_access=false` → раздел "База резюме" недоступен (disabled + tooltip "SOON")
- При `has_access=true` → полный доступ к базе резюме

## Сбор событий (Analytics)

Система автоматически логирует следующие события в таблицу `public.events`:

- `auth_login` - Вход в систему
- `auth_signup` - Регистрация
- `vacancy_created` - Создание вакансии
- `resume_created` - Создание резюме
- `application_created` - Отправка отклика

### Просмотр событий:
```sql
SELECT * FROM public.events 
WHERE user_id = 'USER_UUID' 
ORDER BY created_at DESC;
```

## Антиспам система

### Защита от дубликатов:
- Уникальные индексы предотвращают дублирование заявок
- `applications_candidate_unique` - для зарегистрированных пользователей
- `applications_guest_unique` - для гостевых заявок

### Rate Limiting:
- Не более 1 заявки с одного IP на вакансию за 10 минут
- Аудит записывается в таблицу `apply_audit`
- Honeypot поле для защиты от ботов
- Блокировка кнопки на 10 секунд после отправки

## Импорт резюме

### Подготовка:
- Добавлено поле `raw_text` в таблицу `resumes`
- В будущем: парсинг PDF/DOCX файлов
- Сохранение файлов в Supabase Storage bucket `resumes/`

**TODO**: Добавить автозаполнение из PDF/LinkedIn

## Вебхуки (Outbox Pattern)

### Система уведомлений:
- Таблица `outbox_webhooks` для надежной доставки
- Edge Function `webhook-dispatcher` для обработки
- Статусы: `pending` → `sent`/`failed`
- Автоматические повторы (до 3 попыток)

### События для вебхуков:
- `vacancy_created` - Новая вакансия
- `application_created` - Новая заявка

### Запуск диспетчера:
```bash
curl -X POST https://usmwwkltvjyjzaxsdyhz.supabase.co/functions/v1/webhook-dispatcher
```

**TODO**: 
- Подключить реальные вебхуки Slack/Telegram
- Добавить секреты для API ключей
- Настроить cron-job для автоматического запуска

## Безопасность

### Row Level Security (RLS):
- ✅ Все таблицы защищены RLS политиками
- ✅ Пользователи видят только свои данные
- ✅ Гостевые заявки разрешены только для таблицы `applications`

### Секреты:
- Все чувствительные данные в Supabase Secrets
- Никаких секретов в клиентском коде
- Edge Functions используют `SUPABASE_SERVICE_ROLE_KEY`

## Мониторинг

### Логи ошибок:
- Console логи в Edge Functions
- События типа `error` в таблице `events`
- Ошибки вебхуков в поле `last_error`

### Производительность:
- Индексы для быстрых запросов
- Лимиты на количество обрабатываемых записей
- Пагинация для больших выборок

## Инструкции для разработчиков

1. **Добавление новых событий**: Обновить enum в миграции и добавить логирование в код
2. **Новые вебхуки**: Добавить тип события в `outbox_webhooks` и обработчик в диспетчер
3. **Изменения схемы**: Только через миграции в `supabase/migrations/`
4. **Тестирование**: Проверять RLS политики на каждое изменение