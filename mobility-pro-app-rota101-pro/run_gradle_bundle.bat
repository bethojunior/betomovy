@echo off
set "JAVA_HOME=C:\Users\alexm\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2"
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd /d "D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro\android"
call gradlew.bat bundleRelease --no-daemon
