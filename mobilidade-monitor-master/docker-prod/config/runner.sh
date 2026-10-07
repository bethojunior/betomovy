#!/bin/bash

start() {
mkdir -p /run/php-fpm
chown -R nginx:nginx /var/www/html
rm -rf /var/www/html/public/webfiles/js/utils/Host.js
rm -rf /var/www/html/public/config/host.css
rm -rf /var/www/html/public/config/host.js
nginx -g 'daemon on; master_process on;'
/usr/sbin/php-fpm -F -c /etc/php.ini -y /etc/php-fpm.conf --nodaemonize
}

stop() {
    pkill nginx
    pkill php-fpm
    pkill -f nginx -9
    pkill -f php-fpm -9
}

restart() {
  stop
  start
}      
                                                                                                                                                                                                                                                                                                                                  
case "$1" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  restart)
    restart
    ;;
  *)
    echo $"Usage: $0 {start|stop|restart}"
    exit 1
esac

exit $?
