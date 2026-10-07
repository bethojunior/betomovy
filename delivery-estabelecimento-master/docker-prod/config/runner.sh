#!/bin/bash
set -euo pipefail

start() {
  echo "[INFO] Preparando diretórios..."
  mkdir -p /run/php-fpm

  if [ -d /var/www/html/storage ]; then
    chown -R nginx:nginx /var/www/html/storage
  fi
  if [ -d /var/www/html/bootstrap/cache ]; then
    chown -R nginx:nginx /var/www/html/bootstrap/cache
  fi

  echo "[INFO] Iniciando cron..."
  crond

  echo "[INFO] Iniciando PHP-FPM..."
  /usr/sbin/php-fpm -D -c /etc/php.ini -y /etc/php-fpm.conf

  echo "[INFO] Aguardando socket php-fpm..."
  for _ in $(seq 1 100); do
    if [ -S /run/php-fpm/www.sock ]; then
      break
    fi
    sleep 0.1
  done
  if [ ! -S /run/php-fpm/www.sock ]; then
    echo "[ERROR] Socket /run/php-fpm/www.sock não encontrado — PHP-FPM não arrancou."
    exit 1
  fi

  echo "[INFO] Iniciando Nginx..."
  exec nginx -g 'daemon off;'
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
