#!/bin/sh

cd /var/www

php artisan mongodb:cache:index

/usr/bin/supervisord -c /etc/supervisord.conf
