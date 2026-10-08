#!/bin/bash
set -euo pipefail

start() {
  echo "[INFO] Preparando diretórios..."
  mkdir -p /var/log/php-fpm
  mkdir -p /var/lib/php/session
  mkdir -p /var/www/html/storage/temp

  # Ajustar permissões nos diretórios da aplicação
  if [ -d /var/www/html/storage ]; then
    chown -R nginx:nginx /var/www/html/storage 2>/dev/null || true
  fi
  if [ -d /var/www/html/bootstrap/cache ]; then
    chown -R nginx:nginx /var/www/html/bootstrap/cache 2>/dev/null || true
  fi

  chown -R nginx:nginx /var/lib/php/session 2>/dev/null || true
  chmod 1733 /var/lib/php/session 2>/dev/null || true

  echo "[INFO] Iniciando supervisor..."
  exec /usr/bin/supervisord -c /etc/supervisord.conf
}

stop() {
  echo "[INFO] Parando serviços..."
  pkill -TERM -x supervisord 2>/dev/null || true
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
