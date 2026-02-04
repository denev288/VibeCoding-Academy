# VibeCoding Academy — Full‑Stack App

Laravel + Next.js приложение за управление на AI инструменти с роли, одобрение и audit логове.

## Tech stack

- Backend: Laravel 10+ (PHP 8.2), Nginx
- Frontend: Next.js (React + TS)
- DB: PostgreSQL (local Docker or Supabase)
- Cache: Redis
- Mail: Mailpit (локално)
- Auth: Laravel Sanctum (session cookie)

## Изисквания

- Docker + Docker Compose

## Инсталация (Docker)

```bash
./start.sh
```

Ще стартира всички контейнери и ще подготви backend/frontend.

Полезни адреси:

- Frontend: http://localhost:8200
- Backend: http://localhost:8201
- API status: http://localhost:8201/api/status
- Mailpit UI: http://localhost:8025
- Postgres: localhost:8202

Стоп:

```bash
./stop.sh
```

## Локална PostgreSQL (препоръчително за dev)

1) Копирай локалния env:

```bash
cp backend/.env.local.example backend/.env
```

Ако `backend/.env` липсва, `./start.sh` ще го създаде автоматично от локалния пример.

2) Пусни миграции + seed:

```bash
docker compose exec php_fpm php artisan migrate --seed
```

## Supabase (PostgreSQL) настройка

1) Копирай примерния env:

```bash
cp backend/.env.supabase.example backend/.env
```

2) Попълни:

- `DB_HOST`
- `DB_PORT`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`

3) Пусни миграции + seed:

```bash
docker compose exec php_fpm php artisan migrate --seed
```

## Redis

Redis контейнерът е включен. По подразбиране използваме:

```
CACHE_DRIVER=redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_CLIENT=predis
```

Ако `predis` не е инсталиран:

```bash
docker compose exec php_fpm composer require predis/predis
docker compose exec php_fpm php artisan config:clear
```

## Seed потребители

| Name | Role | Email | Password |
| --- | --- | --- | --- |
| Иван Иванов | owner | ivan@admin.local | ******** |
| Елена Петрова | frontend | elena@frontend.local | ******** |
| Петър Георгиев | backend | petar@backend.local | ******** |
| Мария Стоянова | pm | maria@pm.local | ******** |
| Георги Николов | qa | georgi@qa.local | ******** |
| Анна Димитрова | designer | anna@design.local | ******** |

## Как да стартираш локално

1) Стартирай:
```bash
./start.sh
```

2) Миграции + seed:
```bash
docker compose exec php_fpm php artisan migrate --seed
```

3) Отвори http://localhost:8200 и влез с някой seed потребител.

## Как се добавят инструменти

1) Влез в приложението.
2) Отиди на **Инструменти**.
3) Натисни **Добавяне на инструмент** и попълни полетата.
4) Инструментът се създава със статус **pending**.

### Статуси

- **pending** (Изчакване) – вижда се от създателя.
- **approved** (Одобрен) – вижда се от всички потребители с подходяща роля.
- **rejected** (Отказан) – вижда се от създателя.

## Ролева система и права

- Всеки потребител има една роля: `owner`, `backend`, `frontend`, `pm`, `qa`, `designer`.
- Достъп до инструменти:
  - Потребител вижда инструменти само за своята роля.
  - `owner` вижда всички инструменти.
  - Създателят вижда своите `pending` и `rejected`.
- Само създателят може да редактира/изтрива инструмента.
- Само `owner` има достъп до **Админ панела**.

## Админ панел

Достъпен само за `owner`:

- Списък на всички инструменти
- Одобрение/отказ на предложения
- Филтри по роля, категория, статус

URL: `/admin`

## Audit Logs

Одит логове за ключови действия:

- tool.created / tool.updated / tool.deleted
- tool.approved / tool.rejected
- category.created / tag.created

URL: `/admin/audit` (само owner)

## 2FA при изтриване

При изтриване на инструмент се изисква email код (2FA).
Локално кодовете се виждат в Mailpit:

http://localhost:8025

## Кеширане

Кеширани са:

- Категории (`categories.all`, 5 мин)
- Брой инструменти (`tools.count`, 5 мин)

## Smoke test (автоматичен)

```bash
./smoke-test.sh
```

Override:

```bash
API_BASE=http://localhost:8201 EMAIL=ivan@admin.local PASSWORD=password ./smoke-test.sh
```

## Документация: AI агенти

Този проект може да се използва като база за разработка с AI агенти (например за автоматизирани задачи, генериране на код, ревю и др.). По‑долу са минимални насоки за стартиране и работа.

### Какво е AI агент

AI агентът е помощник, който следва ясни инструкции, изпълнява конкретни задачи и пази контекст. Типични роли:

- **Dev Agent** – разработка на фичъри, интеграции, refactor.
- **QA Agent** – проверки, тестове, валидация на критерии.
- **Docs Agent** – документация, ръководства, README обновления.

### Начални промптове за Агент за разработка

Използвай тези промптове като стартови шаблони (адаптирай според конкретната задача):

**1) Инициализация на агент**

```
Ти си Senior Full‑Stack инженер. Работиш по Laravel + Next.js проект.
Фокус: коректност, чист код, кратки обяснения, безопасни промени.
Ако има нужда от уточнения – питай преди да променяш.
```

**2) Добавяне на нов feature**

```
Добави нова функционалност за [описание].
Използвай съществуващите структури в backend/ и frontend/.
Опиши нужните промени и къде са направени.
Не променяй други несвързани части.
```

**3) Диагностика на проблем**

```
Имаме проблем: [описание на грешка].
Провери конфигурации, логове и възможни причини.
Дай стъпки за отстраняване и предложи конкретни промени.
```

**4) API промени**

```
Добави/обнови API endpoint: [описание].
Осигури валидиране, роли и одит лог.
Актуализирай frontend заявките ако е нужно.
```

**5) UI промени**

```
Обнови UI на [страница/компонент] според: [описание].
Поддържай responsive изглед и theme стиловете.
Не нарушавай структурата на проекта.
```

### Примерен комбиниран промпт (край‑до‑край)

```
Добави нова секция "Ресурси" в Tools.
Backend: нови полета + миграция + API.
Frontend: форма, листинг, валидиране и тостове.
Пази ролите и одит лога.
```

## Структура на проекта

```
backend/   # Laravel app
frontend/  # Next.js app
docker/    # Docker configs
templates/ # Post-install templates
```

## Troubleshooting

- **Class "Predis\Client" not found**  
  Инсталирай `predis` и изчисти config:
  ```bash
  docker compose exec php_fpm composer require predis/predis
  docker compose exec php_fpm php artisan config:clear
  ```

- **Липсва колоната status**  
  Пусни миграции:
  ```bash
  docker compose exec php_fpm php artisan migrate
  ```

- **Permission denied за storage/**  
  Увери се, че директориите съществуват и са writable:
  ```bash
  docker compose exec php_fpm sh -lc "mkdir -p storage/logs storage/framework/cache/data storage/framework/sessions storage/framework/views && chmod -R 777 storage bootstrap/cache"
  ```
