@echo off
set "JAVA_EXE=C:\Users\alexm\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2\bin\java.exe"
set "JAR_EXE=C:\Users\alexm\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2\bin\jar.exe"
set "APP_DIR=D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro"
set "BUNDLETOOL=%APP_DIR%\bundletool-all.jar"
set "KEYSTORE=%APP_DIR%\android\app\movy_upload_keystore.jks"
set "RELEASE_DIR=%APP_DIR%\android\app\release"
set "AAB=%RELEASE_DIR%\app-release.aab"
set "APKS=%RELEASE_DIR%\app-release.apks"
set "UNIVERSAL_APK=%RELEASE_DIR%\app-movy-universal.apk"

echo [1/3] Checking AAB...
if not exist "%AAB%" (
    echo AAB not found at %AAB%
    exit /b 1
)

echo [2/3] Generating APKS archive with bundletool...
if exist "%APKS%" del /f /q "%APKS%"
"%JAVA_EXE%" -jar "%BUNDLETOOL%" build-apks --bundle="%AAB%" --output="%APKS%" --mode=universal --overwrite --ks="%KEYSTORE%" --ks-pass=pass:MovyMob2026@ --ks-key-alias=movy --key-pass=pass:MovyMob2026@
if errorlevel 1 (
    echo Bundletool failed!
    exit /b 1
)

echo [3/3] Extracting universal.apk...
cd /d "%RELEASE_DIR%"
"%JAR_EXE%" -xf "%APKS%" universal.apk
if exist "universal.apk" (
    copy /y universal.apk "%UNIVERSAL_APK%"
    echo Universal APK created successfully!
    dir "%UNIVERSAL_APK%"
    exit /b 0
) else (
    echo universal.apk was not extracted!
    exit /b 1
)
