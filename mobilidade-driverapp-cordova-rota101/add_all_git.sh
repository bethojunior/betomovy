#!/bin/bash

git add .
git reset HEAD res/icon/android/logo.png

echo "Digite a descrição do commit:"
read _description

git commit -am "$_description"

echo "Tudo pronto!"
