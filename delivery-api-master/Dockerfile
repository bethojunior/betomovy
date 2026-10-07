FROM php:7.3-fpm

# Arguments defined in docker-compose.yml
ARG user
ARG uid

ENV ACCEPT_EULA=Y

# Fix debconf warnings upon build
ARG DEBIAN_FRONTEND=noninteractive

# Install selected extensions and other stuff
RUN apt-get update \
    && apt-get -y --no-install-recommends install apt-utils libxml2-dev gnupg apt-transport-https zlib1g-dev libicu-dev g++ libpng-dev libjpeg-dev libzip-dev zip unzip libpq-dev curl git libsodium-dev libcurl4-openssl-dev libssl-dev\
    && apt-get clean; rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*

# Extensions by PECL
RUN pecl install mongodb
RUN docker-php-ext-enable mongodb

RUN pecl install grpc
RUN docker-php-ext-enable grpc

# Configure extensions
RUN docker-php-ext-configure intl

# Install required extensions
RUN docker-php-ext-install intl sodium mysqli pdo pdo_mysql gd zip bcmath

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create system user to run Composer and Artisan Commands
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user \

# Set working directory
WORKDIR /var/www

USER $user
