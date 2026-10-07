#!/bin/bash

# Inserir branch do após o nome do script
# Exemplo: ./fix-plugins.sh return

# error if does not exist params
if [ -z "$1" ]; then
    echo "Erro: Parâmetros inválidos"
    exit 1
fi

projectname=$1

sed -i "s/compile/implementation/g" platforms/android/cordova-plugin-qrscanner/"$projectname"-qrscanner.gradle