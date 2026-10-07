#!/bin/bash

echo "Digite o alias da keystore"
read _alias
echo "Digite a senha da keystore"
read _password

if [ ${#_password} -lt 6 ]
then
  echo "senha deve ter pelo menos 6 caracteres"
  exit
fi

mkdir backup

keytool -genkey -v -noprompt \
 -alias $_alias \
 -dname  "CN=fb704, OU=fb704, O=fb704, L=Fortaleza, S=Ceara, C=BR" \
 -keystore keystore.jks \
 -keyalg RSA \
 -keysize 2048 \
 -validity 10000 \
 -storepass $_password \
  -keypass $_password

cp -f keystore.jks ./backup/keystore.jks.$(date +%H:%M-%d%m%Y)

echo "keystore criada com sucesso !"


echo "" > build_release.sh

chmod +x build_release.sh

echo "cordova build android --release -- --keystore=./keystore.jks --storePassword=$_password --alias=$_alias --password=$_password --packageType=bundle" > build_release.sh

echo "gerador de release criado com sucesso !"

echo "mkdir release" >> build_release.sh

echo "cp -f ./platforms/android/app/build/outputs/bundle/release/app-release.aab ./release/app-release.aab" >> build_release.sh
