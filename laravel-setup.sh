#!/usr/bin/env bash
set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required but not found. Install Docker and try again."
  exit 1
fi

docker compose up -d php_fpm backend

if [ ! -f backend/artisan ]; then
  echo "Creating Laravel project..."
  docker compose exec php_fpm composer create-project laravel/laravel . "${LARAVEL_VERSION:-^10}"
fi

if [ ! -d backend/vendor/laravel/breeze ]; then
  echo "Installing Laravel Breeze (API stack)..."
  docker compose exec php_fpm composer require laravel/breeze --dev
  docker compose exec php_fpm php artisan breeze:install api
fi

# Copy templates
mkdir -p backend/app/Enums backend/database/seeders

cp -f templates/backend/app/Enums/Role.php backend/app/Enums/Role.php
cp -f templates/backend/app/Models/User.php backend/app/Models/User.php
cp -f templates/backend/database/seeders/UserSeeder.php backend/database/seeders/UserSeeder.php
cp -f templates/backend/database/seeders/DatabaseSeeder.php backend/database/seeders/DatabaseSeeder.php
cp -f templates/backend/routes/api.php backend/routes/api.php
cp -f templates/backend/config/cors.php backend/config/cors.php
cp -f templates/backend/.env.supabase.example backend/.env.supabase.example
cp -f templates/backend/.env.local.example backend/.env.local.example

# Ensure writable dirs for Laravel (especially on Windows bind mounts)
mkdir -p backend/storage/logs \
  backend/storage/framework/cache/data \
  backend/storage/framework/sessions \
  backend/storage/framework/views \
  backend/bootstrap/cache
chmod -R 777 backend/storage backend/bootstrap/cache || true

# Create migration for role column if missing
if ! ls backend/database/migrations/*_add_role_to_users_table.php >/dev/null 2>&1; then
  ts=$(date +%Y_%m_%d_%H%M%S)
  cat <<'PHP' > "backend/database/migrations/${ts}_add_role_to_users_table.php"
<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('frontend')->after('password');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};
PHP
fi

# Update .env for local SPA usage
if [ ! -f backend/.env ] && [ -f backend/.env.local.example ]; then
  cp -f backend/.env.local.example backend/.env
fi

if [ -f backend/.env ]; then
  sed -i.bak \
    -e 's|^APP_URL=.*|APP_URL=http://localhost:8201|' \
    -e 's|^SANCTUM_STATEFUL_DOMAINS=.*|SANCTUM_STATEFUL_DOMAINS=localhost:8200,localhost|' \
    -e 's|^SESSION_DOMAIN=.*|SESSION_DOMAIN=localhost|' \
    -e 's|^FRONTEND_URL=.*|FRONTEND_URL=http://localhost:8200|' \
    -e 's|^DB_CONNECTION=.*|DB_CONNECTION=pgsql|' \
    -e 's|^DB_HOST=.*|DB_HOST=postgres|' \
    -e 's|^DB_PORT=.*|DB_PORT=5432|' \
    -e 's|^DB_DATABASE=.*|DB_DATABASE=vibecode|' \
    -e 's|^DB_USERNAME=.*|DB_USERNAME=vibecode|' \
    -e 's|^DB_PASSWORD=.*|DB_PASSWORD=vibecode|' \
    -e 's|^REDIS_HOST=.*|REDIS_HOST=redis|' \
    -e 's|^MAIL_HOST=.*|MAIL_HOST=mailpit|' \
    backend/.env || true
fi

# Refresh autoload
if [ -f backend/composer.json ]; then
  if [ ! -f backend/vendor/autoload.php ]; then
    docker compose exec php_fpm composer install
  fi
  docker compose exec php_fpm composer dump-autoload
fi

# Ensure APP_KEY exists
if [ -f backend/.env ] && ! grep -q '^APP_KEY=base64:' backend/.env; then
  docker compose exec php_fpm php artisan key:generate
fi

echo "Laravel setup complete. Configure local DB or Supabase in backend/.env and run migrations."
