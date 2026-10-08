#!/bin/bash
# Runner robusto para DigitalOcean App Platform

start() {
  echo "[INFO] Preparando diretórios..."
  mkdir -p /run/php-fpm
  mkdir -p /var/log/php-fpm
  mkdir -p /var/log/nginx
  mkdir -p /var/lib/php/session
  mkdir -p /var/lib/php/wsdlcache
  mkdir -p /var/www/html/storage/temp

  chown -R nginx:nginx /run/php-fpm 2>/dev/null || true
  chmod 777 /run/php-fpm 2>/dev/null || true
  chown -R nginx:nginx /var/log/nginx 2>/dev/null || true

  # Ajustar permissões nos diretórios da aplicação
  if [ -d /var/www/html/storage ]; then
    chown -R nginx:nginx /var/www/html/storage 2>/dev/null || true
  fi
  if [ -d /var/www/html/bootstrap/cache ]; then
    chown -R nginx:nginx /var/www/html/bootstrap/cache 2>/dev/null || true
  fi

  chown -R nginx:nginx /var/lib/php/session 2>/dev/null || true
  chmod 1733 /var/lib/php/session 2>/dev/null || true

  echo "[INFO] Iniciando cron..."
  crond 2>/dev/null || true

  echo "[INFO] Iniciando queue worker em background..."
  if [ -f /var/www/html/bootstrap/queue-worker.php ]; then
    php /var/www/html/bootstrap/queue-worker.php > /dev/null 2>&1 &
  fi

  echo "[INFO] Iniciando Nginx..."
  nginx -g 'daemon on; master_process on;'

  echo "[INFO] Iniciando PHP-FPM..."
  exec /usr/sbin/php-fpm -F -y /etc/php-fpm.conf -c /etc/php.ini --nodaemonize
}

stop() {
  echo "[INFO] Parando serviços..."
  pkill nginx 2>/dev/null || true
  pkill php-fpm 2>/dev/null || true
  pkill -f queue-worker 2>/dev/null || true
  pkill crond 2>/dev/null || true
}

restart() {
  stop
  start
}

case "${1:-}" in
  start)   start   ;;
  stop)    stop    ;;
  restart) restart ;;
  *)
    echo "Uso: $0 {start|stop|restart}"
    exit 1
    ;;
esac
