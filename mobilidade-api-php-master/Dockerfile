# DEPRECATED - OLDACCOUNT - FROM 931373685066.dkr.ecr.us-east-1.amazonaws.com/mobilidade-php-base-image:2
FROM 471044102763.dkr.ecr.us-east-1.amazonaws.com/mobilidade-php-base-image:d5e491c

## install datadog
RUN curl -LO https://github.com/DataDog/dd-trace-php/releases/latest/download/datadog-setup.php
RUN php datadog-setup.php --php-bin=all --enable-appsec --enable-profiling

## install Redis
RUN pecl install --force redis \
&& rm -rf /tmp/pear \
&& docker-php-ext-enable redis

COPY --chown=www-data:www-data . /var/www

RUN sed -i 's/;\(slowlog = log\/\$pool\.log\.slow\)/slowlog = \/tmp\/slowlog/' /usr/local/etc/php-fpm.d/www.conf
RUN sed -i 's/;\(request_slowlog_timeout = 0\)/request_slowlog_timeout = 1s/' /usr/local/etc/php-fpm.d/www.conf

RUN mkdir -p /var/www/storage/temp/

RUN chmod -R ug+w /var/www/storage
RUN chown www-data:www-data -R /var/www/
RUN chmod 774 -R /var/www/

# Copy nginx/php/supervisor configs
RUN cp docker/supervisor.conf /etc/supervisord.conf
RUN cp docker/php.ini /usr/local/etc/php/conf.d/app.ini
RUN cp docker/nginx.conf /etc/nginx/sites-enabled/default

# PHP Error Log Files
# RUN mkdir -p /var/log/php /var/www/app/utils
# RUN touch /var/log/php/errors.log && chmod 777 /var/log/php/errors.log

# Deployment steps
RUN composer update && composer install --optimize-autoloader --no-dev
RUN chmod +x /var/www/docker/run.sh

RUN chown www-data:www-data -R /var/www/

#USER $user

EXPOSE 80
CMD ["sh", "-c", "sleep 5; /usr/local/bin/start-cronjob.sh; /var/www/docker/run.sh"]

