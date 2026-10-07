#!/bin/bash
set -euo pipefail

fix_permissions() {
  echo "[INFO] Ajustando permissões do Laravel..."

  cd /var/www/html

  mkdir -p \
    /run/php-fpm \
    storage/logs \
    storage/framework/sessions \
    storage/framework/views \
    storage/framework/cache \
    bootstrap/cache

  chown -R nginx:nginx storage bootstrap/cache /run/php-fpm || true
  chmod -R 775 storage bootstrap/cache || true
  chmod 700 storage/framework/sessions || true
  touch "storage/logs/laravel-$(date +%F).log" || true
  chown nginx:nginx "storage/logs/laravel-$(date +%F).log" || true
  chmod 664 "storage/logs/laravel-$(date +%F).log" || true
}

start() {
  echo "[INFO] Preparando diretórios..."
  mkdir -p /run/php-fpm

  fix_permissions

  echo "[INFO] Rodando migrations/indexes..."
  php -d error_reporting="E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED & ~E_NOTICE" \
      -d display_errors=0 \
      -d log_errors=0 \
      artisan mongodb:cache:index >/dev/null 2>&1 || true

  echo "[INFO] Iniciando cron..."
  crond

  echo "[INFO] Iniciando Nginx..."
  nginx -g 'daemon on; master_process on;'

  echo "[INFO] Iniciando PHP-FPM..."
  exec /usr/sbin/php-fpm -F -c /etc/php.ini -y /etc/php-fpm.conf --nodaemonize
}

stop() {
  echo "[INFO] Parando serviços..."
  pkill -TERM -x nginx 2>/dev/null || true
  pkill -TERM -x php-fpm 2>/dev/null || true
  pkill -TERM -x crond 2>/dev/null || true
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
