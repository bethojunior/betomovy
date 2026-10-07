#!/bin/bash

LOG_FILE="build.log"

echo "🔎 Lendo informações do config.xml..."

VERSION=$(sed -n 's/.*version="\([^"]*\)".*/\1/p' config.xml | head -n1)
APP_NAME=$(sed -n 's/.*<name>\(.*\)<\/name>.*/\1/p' config.xml | head -n1)

if [ -z "$VERSION" ] || [ -z "$APP_NAME" ]; then
  echo "❌ Não foi possível ler nome ou versão do config.xml"
  exit 1
fi

APP_NAME_FORMATTED=$(echo "$APP_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' )
BUILD_TYPE="debug"

mkdir -p test

echo "🚀 Gerando APK ($BUILD_TYPE)..."

cordova build android > "$LOG_FILE" 2>&1

APK_DIR="./platforms/android/app/build/outputs/apk/$BUILD_TYPE"
ORIGIN="$APK_DIR/app-$BUILD_TYPE.apk"

NEW_NAME="$APP_NAME_FORMATTED-v$VERSION-$BUILD_TYPE.apk"

if [ ! -f "$ORIGIN" ]; then
  echo ""
  echo "❌ BUILD FALHOU - APK não foi gerada"
  echo ""
  echo "📄 Últimas linhas do log:"
  tail -n 20 "$LOG_FILE"
  echo ""
  echo "Log completo:"
  echo "📄 $LOG_FILE"
  exit 1
fi

rm -f "./test/$NEW_NAME"
mv "$ORIGIN" "./test/$NEW_NAME"

echo ""
echo "✅ APK gerada com sucesso:"
echo "📦 test/$NEW_NAME"
echo ""