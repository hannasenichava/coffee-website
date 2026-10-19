# Quarta Coffee Website

## 🇷🇺 О проекте

Quarta — лендинг бренда по обжарке кофе, созданный на Next.js и размещённый на Netlify. Форма заявок подключена к Supabase, а уведомления о новых заявках отправляются в Telegram. Обе интеграции протестированы: заявки сохраняются в базе данных, уведомления приходят в Telegram.

### Возможности
- Адаптивный дизайн для мобильных устройств и компьютеров.
- Форма заявок с серверной обработкой.
- Supabase (PostgreSQL) для хранения заявок.
- Telegram Bot API для уведомлений о новых заявках.
- Отслеживание рекламных источников через UTM-параметры.

### Технологии
Next.js, React, TypeScript, CSS, Supabase, Telegram Bot API, Netlify.

### Переменные окружения

Настроены в Netlify:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Секретные ключи и токены хранятся в переменных окружения и не должны публиковаться в GitHub или использоваться в клиентском коде.

### Использование ИИ

Я использовала ИИ как помощника при написании и редактировании кода, устранении ошибок интеграции и подготовке документации. Я принимала решения по проекту, проверяла предложенные изменения, настраивала развёртывание и тестировала функциональность.

При подключении Supabase возникла ошибка `PGRST205`: API не находил таблицу `public.leads` в кэше схемы. Я проверила базу в SQL Editor, убедилась, что таблица существует, и обновила кэш схемы. После этого форма начала принимать заявки. Этот случай показал важность проверки рекомендаций ИИ по реальным логам и результатам тестирования.

В дальнейшем я бы провела аудит Lighthouse, улучшила доступность и мобильную производительность и добавила автоматизированные тесты.

### Конфиденциальность

Перед использованием сайта в production необходимо обеспечить информирование пользователей об обработке персональных данных, контроль доступа и подходящие сроки хранения и удаления заявок.

---

## 🇬🇧 About the Project

Quarta is a landing page for a coffee-roasting brand, built with Next.js and deployed on Netlify. The lead form is connected to Supabase, and new-lead notifications are sent to Telegram. Both integrations have been tested: submissions are stored in the database and notifications arrive in Telegram.

### Features
- Responsive design for mobile and desktop.
- Server-processed customer inquiry form.
- Supabase (PostgreSQL) for lead storage.
- Telegram Bot API for new-lead notifications.
- UTM tracking to identify marketing sources.

### Tech Stack
Next.js, React, TypeScript, CSS, Supabase, Telegram Bot API, Netlify.

### Environment Variables

The following variables are configured in Netlify:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Keep actual credentials in secret environment variables. Never publish them on GitHub or expose them in client-side code.

### AI-Assisted Development

I used AI as a coding assistant to write and revise code, troubleshoot integration issues, and prepare documentation. I made project decisions, reviewed suggestions, configured deployment, and tested the functionality.

During the Supabase integration, the API returned a `PGRST205` error because the `public.leads` table could not be found in the schema cache. I investigated the database in the SQL Editor, verified that the table existed, and refreshed the schema cache. The form subsequently accepted submissions. This highlighted the importance of validating AI-generated suggestions against actual logs and test results.

With more time, I would run a Lighthouse audit, improve accessibility and mobile performance, and add automated tests.

### Privacy

Before production use, appropriate privacy information, access controls, and data-retention and deletion rules should be in place.
