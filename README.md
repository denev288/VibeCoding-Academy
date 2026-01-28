# VibeCoding Full Stack Starter

## Quick start

MffTvwyJeQmswn14

```bash
./start.sh
```

- Frontend: http://localhost:8200
- Backend: http://localhost:8201
- API Status: http://localhost:8201/api/status

Stop:

```bash
./stop.sh
```

## Supabase setup (Laravel)

1. Copy `backend/.env.supabase.example` to `backend/.env` and fill in your Supabase credentials.
2. Run migrations + seed:

```bash
docker compose exec php_fpm php artisan migrate --seed
```

## Seeded users

| Name | Role | Email | Password |
| --- | --- | --- | --- |
| Иван Иванов | owner | ivan@admin.local | password |
| Елена Петрова | frontend | elena@frontend.local | password |
| Петър Георгиев | backend | petar@backend.local | password |
| Мария Стоянова | pm | maria@pm.local | password |
| Георги Николов | qa | georgi@qa.local | password |
| Анна Димитрова | designer | anna@design.local | password |

## Login check (manual)

1. Start containers: `./start.sh`
2. Migrate + seed: `docker compose exec php_fpm php artisan migrate --seed`
3. Open http://localhost:8200
4. Login with any seeded user and verify the role is shown.

## Smoke test (automated)

Run the script after `./start.sh` and migrations/seeds:

```bash
./smoke-test.sh
```

Override defaults if needed:

```bash
API_BASE=http://localhost:8201 EMAIL=ivan@admin.local PASSWORD=password ./smoke-test.sh
```

## Structure

```
backend/   # Laravel app
frontend/  # Next.js app
docker/    # Docker configs
templates/ # Post-install templates
```
