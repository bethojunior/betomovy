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
