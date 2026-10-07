#!/bin/bash
set -euo pipefail

start() {
  echo "[INFO] Preparando diretórios..."
  mkdir -p /run/php-fpm
  
  # Ajustar permissões apenas nos diretórios que precisam (excluindo .env montado como read-only)
  if [ -d /var/www/html/storage ]; then
    chown -R nginx:nginx /var/www/html/storage
  fi
  if [ -d /var/www/html/bootstrap/cache ]; then
    chown -R nginx:nginx /var/www/html/bootstrap/cache
  fi

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