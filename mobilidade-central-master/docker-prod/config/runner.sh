#!/bin/bash

start() {
  mkdir -p /var/log/php-fpm
  mkdir -p /var/lib/php/session
  mkdir -p /var/lib/php/wsdlcache
  chown -R nginx:nginx /var/lib/php/session 2>/dev/null || true
  chmod 1733 /var/lib/php/session 2>/dev/null || true
  chown -R nginx:nginx /var/www/html 2>/dev/null || true
  rm -rf /var/www/html/public/webfiles/js/utils/Host.js 2>/dev/null || true
  rm -rf /var/www/html/public/config/host.css 2>/dev/null || true
  rm -rf /var/www/html/public/config/host.js 2>/dev/null || true
  nginx -g 'daemon on; master_process on;'
  exec /usr/sbin/php-fpm -F -c /etc/php.ini -y /etc/php-fpm.conf --nodaemonize
}

stop() {
  pkill nginx 2>/dev/null || true
  pkill php-fpm 2>/dev/null || true
  pkill -f nginx -9 2>/dev/null || true
  pkill -f php-fpm -9 2>/dev/null || true
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
    echo "Usage: $0 {start|stop|restart}"
    exit 1
esac

exit $?
