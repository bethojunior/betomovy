@echo off

echo iniciando projeto

cordova prepare android

echo instalando plugin

cordova plugin add https://github.com/EddyVerbruggen/Insomnia-PhoneGap-Plugin.git

cordova plugin add https://github.com/phonegap/phonegap-mobile-accessibility.git