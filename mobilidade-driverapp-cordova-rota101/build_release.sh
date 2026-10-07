#!/bin/bash

PASSWORD_FILE="./keystore/password.txt"
KEYSTORE_FILE="keystore.jks"
LOG_FILE="build.log"

echo "🔎 Validando credenciais..."

if [ ! -f "$PASSWORD_FILE" ]; then
  echo "❌ Arquivo keystore/password.txt não encontrado!"
  exit 1
fi

alias=$(grep '^alias' "$PASSWORD_FILE" | head -n1 | sed 's/.*=//; s/^[[:space:]]*//; s/[[:space:]]*$//')
password=$(grep '^password' "$PASSWORD_FILE" | head -n1 | sed 's/.*=//; s/^[[:space:]]*//; s/[[:space:]]*$//')

if [ -z "$alias" ] || [ -z "$password" ]; then
  echo "❌ alias ou password não encontrados"
  exit 1
fi

if [ "$alias" = "demo" ] || [ "$password" = "Demo704" ]; then
  echo "❌ Credenciais DEMO detectadas. Build cancelado."
  exit 1
fi

if [ ! -f "$KEYSTORE_FILE" ]; then
  echo "❌ Arquivo $KEYSTORE_FILE não encontrado!"
  exit 1
fi

VERSION=$(grep '<widget' config.xml | sed -E 's/.*version="([^"]+)".*/\1/')
APP_NAME=$(grep '<name>' config.xml | sed -E 's/.*<name>(.*)<\/name>.*/\1/')
APP_NAME_FORMATTED=$(echo "$APP_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' )

mkdir -p test

echo "🚀 Gerando AAB..."

cordova build android --release -- \
--keystore="$KEYSTORE_FILE" \
--storePassword="$password" \
--alias="$alias" \
--password="$password" > "$LOG_FILE" 2>&1

BUNDLE_DIR="./platforms/android/app/build/outputs/bundle/release"
ORIGIN="$BUNDLE_DIR/app-release.aab"

NEW_NAME="$APP_NAME_FORMATTED-v$VERSION-release.aab"

if [ ! -f "$ORIGIN" ]; then

  if grep -q "failed to compile" "$LOG_FILE"; then
    echo "❌ Erro em imagens PNG."
    echo "Verifique se os arquivos .png são PNG reais."
  else
    echo "❌ Falha no build."
  fi

  echo "📄 Verifique o log: $LOG_FILE"
  exit 1
fi

rm -f "./test/$NEW_NAME"
mv "$ORIGIN" "./test/$NEW_NAME"

echo ""
echo "✅ AAB gerada com sucesso:"
echo "📦 test/$NEW_NAME"
echo ""
