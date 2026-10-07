FROM php:7.3-fpm

# Arguments defined in docker-compose.yml
#ARG user
#ARG uid

ENV ACCEPT_EULA=Y

WORKDIR /var/www

# Fix debconf warnings upon build
ARG DEBIAN_FRONTEND=noninteractive

# setup node js source will be used later to install node js
RUN curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
RUN ["sh",  "./nodesource_setup.sh"]

# Install selected extensions and other stuff
RUN apt-get update \
    && apt-get -y --no-install-recommends install apt-utils nginx supervisor libxml2-dev gnupg apt-transport-https zlib1g-dev libicu-dev g++ libpng-dev libjpeg-dev libzip-dev zip unzip libpq-dev curl git libsodium-dev libcurl4-openssl-dev libssl-dev nodejs\
    && apt-get clean; rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*

# Configure extensions
RUN docker-php-ext-configure intl

# Install required extensions
RUN docker-php-ext-install intl sodium mysqli pdo pdo_mysql gd zip bcmath

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Add user for laravel application
RUN groupadd -g 1001 www
RUN useradd -u 1001 -ms /bin/bash -g www www

COPY --chown=www:www-data . /var/www

# Install dependencies
RUN composer install --optimize-autoloader --no-dev

RUN npm install

RUN npm rebuild node-sass

RUN NODE_OPTIONS='--openssl-legacy-provider' npm run production-docker

RUN mkdir -p /var/www/storage

RUN chmod -R ug+w /var/www/storage

# Copy nginx/php/supervisor configs
RUN cp docker/supervisor.conf /etc/supervisord.conf
RUN cp docker/php.ini /usr/local/etc/php/conf.d/app.ini
RUN cp docker/nginx.conf /etc/nginx/sites-enabled/default

# PHP Error Log Files
RUN mkdir /var/log/php
RUN touch /var/log/php/errors.log && chmod 777 /var/log/php/errors.log

# Deployment steps
RUN chmod +x /var/www/docker/run.sh

EXPOSE 80
ENTRYPOINT ["/var/www/docker/run.sh"]
