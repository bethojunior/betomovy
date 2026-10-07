#!/bin/bash

# Verifica se jq está instalado
if ! command -v jq &> /dev/null; then
  echo "Instale o jq para rodar este script: brew install jq"
  exit 1
fi

# Caminho do credentials.json
CREDENTIALS_FILE="./credentials.json"

# Verifica se o arquivo existe
if [ ! -f "$CREDENTIALS_FILE" ]; then
  echo "Arquivo $CREDENTIALS_FILE não encontrado!"
  exit 1
fi

# Lê os dados do JSON
KEYSTORE_PATH=$(jq -r '.android.keystore.keystorePath' "$CREDENTIALS_FILE")
KEYSTORE_PASSWORD=$(jq -r '.android.keystore.keystorePassword' "$CREDENTIALS_FILE")
KEY_ALIAS=$(jq -r '.android.keystore.keyAlias' "$CREDENTIALS_FILE")
KEY_PASSWORD=$(jq -r '.android.keystore.keyPassword' "$CREDENTIALS_FILE")

# Cria pasta backup
mkdir -p backup

# Gera o keystore (se ainda não existir)
if [ ! -f "$KEYSTORE_PATH" ]; then
  echo "Criando keystore em $KEYSTORE_PATH..."
  keytool -genkeypair -v -noprompt \
    -alias "$KEY_ALIAS" \
    -dname  "CN=fb704, OU=fb704, O=fb704, L=Fortaleza, S=Ceara, C=BR" \
    -keystore "$KEYSTORE_PATH" \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass "$KEYSTORE_PASSWORD" \
    -keypass "$KEY_PASSWORD"

  # Faz backup com timestamp
  cp -f "$KEYSTORE_PATH" "./backup/$(basename $KEYSTORE_PATH).$(date +%H-%M-%d%m%Y)"
  echo "Keystore criada com sucesso!"
else
  echo "Keystore já existe em $KEYSTORE_PATH. Pulando criação."
fi

# Cria o script build_release.sh
cat > build_release.sh <<EOL
#!/bin/bash
cordova build android --release -- --keystore=$KEYSTORE_PATH --storePassword=$KEYSTORE_PASSWORD --alias=$KEY_ALIAS --password=$KEY_PASSWORD --packageType=bundle
mkdir -p release
cp -f ./platforms/android/app/build/outputs/bundle/release/app-release.aab ./release/app-release.aab
EOL

chmod +x build_release.sh
echo "Gerador de release criado com sucesso!"
