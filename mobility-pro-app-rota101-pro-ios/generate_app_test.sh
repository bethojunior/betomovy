#!/bin/bash

# Verificar se o nome do projeto foi fornecido
if [ -z "$1" ]; then
    echo "Por favor, forneça o nome do projeto."
    exit 1
fi

project=$1
ENDPOINT="https://mobilidade-api-php-${project}.prod.704apps.com.br/City/GetConfig"
PROJECT_CONCAT_PRO="${project}Pro"
# Mudar para o diretório do projeto cartrip e atualizar a branch
cd ~/Project704/cartrip || exit 2
git remote set-branches --add origin $project
git fetch origin $project
git checkout $project || exit 3

# Verificar se os arquivos necessários existem
if [ ! -f ./google-services.json ] || [ ! -f ./res/icon/android/logo.png ]; then
    echo "Arquivos necessários não encontrados no projeto de retorno."
    exit 4
fi

# Copiar o arquivo google-services.json e a imagem logo.png para o novoApp
cp ./google-services.json ~/Project704/novoApp/
cp ./res/icon/android/logo.png ~/Project704/novoApp/assets/

# Navegar até o diretório do arquivo CSS
cd ~/Project704/cartrip/www/webfiles/css || exit 1

# Extrair cores do arquivo CSS
MAIN_COLOR=$(grep -- '--main-color:' ~/Project704/cartrip/www/webfiles/css/default.css | tail -1 | awk -F': *' '{print $2}' | tr -d ';')
TEXT_COLOR_MAIN=$(grep -- '--text-color-main:' ~/Project704/cartrip/www/webfiles/css/default.css | tail -1 | awk -F': *' '{print $2}' | tr -d ';')


# Verificar se as cores foram extraídas com sucesso
if [[ -z "$MAIN_COLOR" || -z "$TEXT_COLOR_MAIN" ]]; then
    echo "Erro: Não foi possível extrair as cores do arquivo CSS. $MAIN_COLOR  $TEXT_COLOR_MAIN"
    exit 1
fi

# Função para substituir as cores no arquivo theme.ts
replace_colors() {
    local path=$1
    cd "$path" || return 1
    sed -i.bak "s/primary: '.*',/primary: '$MAIN_COLOR',/; s/background_global: '.*',/background_global: '$TEXT_COLOR_MAIN',/" theme.ts
    rm theme.ts.bak
    echo "Cores substituídas com sucesso em $path/theme.ts!"
}

# Substituir as cores nos arquivos theme.ts
replace_colors "~/Project704/novoApp/src/client/styles/"
replace_colors "~/Project704/novoApp/src/driver/src/styles/"

# Mudar para o diretório do novoApp e criar ou mudar para a branch do projeto
cd ~/Project704/novoApp || exit 5
git checkout -b "$project-pro" || exit 6

# Substituir os valores das chaves "name", "scheme", e "slug" em app.json
jq --arg proj "$PROJECT_CONCAT_PRO" '.expo.name = $proj | .expo.scheme = $proj | .expo.scheme |= ascii_downcase | .expo.slug = $proj' app.json > app_temp.json && mv app_temp.json app.json

# Substituir @projectnameapp@ por $project em src/constantBuild/config.ts
sed -i.bak "s/@projectnameapp@/$project/g" src/constantBuild/config.ts
rm src/constantBuild/config.ts.bak  # remove the backup file created by sed

# Extrair o package_name do google-services.json
PACKAGE_NAME=$(jq -r '.client[0].client_info.android_client_info.package_name' google-services.json)

# Se o PACKAGE_NAME estiver vazio, saia com erro
if [ -z "$PACKAGE_NAME" ]; then
    echo "Erro: Não foi possível extrair o package_name de google-services.json"
    exit 7
fi

# Atualizar o app.json com o PACKAGE_NAME para expo.android.package e expo.ios.bundleIdentifier
jq --arg pkg "$PACKAGE_NAME" '.expo.android.package = $pkg | .expo.ios.bundleIdentifier = $pkg' app.json > app_temp.json && mv app_temp.json app.json

# Substituir os arquivos de imagem no novoApp
cp ~/Project704/cartrip/res/icon/android/logo.png ./assets/
cp ~/Project704/cartrip/res/icon/android/logo.png ./assets/logo.png
cp ~/Project704/cartrip/res/icon/android/logo.png ./assets/splashPhoto.png
cp ~/Project704/cartrip/res/icon/android/logo.png ./assets/splash.png

echo "Arquivos copiados com sucesso!"

# Remover firebaseConfig.json, se existir
rm -f ~/Project704/novoApp/firebaseConfig.json

# Requisição POST enviando "cityConfig"
curl -s -X POST -H "Content-Type: application/json" -d '{"cityId":756}' "$ENDPOINT" | jq '.data.firebase_config' > ~/Project704/novoApp/firebaseConfig.json

# Verificar se a operação foi bem-sucedida
if [ $? -eq 0 ]; then
    echo "Configuração do Firebase salva com sucesso em ~/Project704/novoApp/firebaseConfig.json"
else
    echo "Houve um erro ao salvar a configuração do Firebase."
    exit 1
fi

yarn android-build:prod
yarn android-build:aab

git add . 
git commit -m "create $project-pro"
git push origin "$project-pro"


