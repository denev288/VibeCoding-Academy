FROM php:8.2-fpm-alpine

# System deps
RUN apk add --no-cache bash git unzip icu-dev oniguruma-dev libzip-dev postgresql-dev

# PHP extensions
RUN docker-php-ext-install pdo pdo_mysql pdo_pgsql intl zip

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
