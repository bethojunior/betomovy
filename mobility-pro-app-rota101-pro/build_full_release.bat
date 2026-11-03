@echo off
set "JAVA_HOME=C:\Users\alexm\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2"
set "PATH=%JAVA_HOME%\bin;%PATH%"

cd /d "D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro\android"
call gradlew.bat bundleRelease
if errorlevel 1 exit /b 1

cd /d "D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro"
node build_and_sign.js
if errorlevel 1 exit /b 1

echo Build and packaging completed successfully!
exit /b 0
