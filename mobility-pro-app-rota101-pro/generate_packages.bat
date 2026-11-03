@echo off
set JAVA_HOME=C:\Users\alexm\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2
set JAVA_BIN=%JAVA_HOME%\bin\java.exe
set JAR_BIN=%JAVA_HOME%\bin\jar.exe
set JARSIGNER_BIN=%JAVA_HOME%\bin\jarsigner.exe

set APP_DIR=D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro
set BUNDLETOOL=%APP_DIR%\bundletool-all.jar
set KEYSTORE=%APP_DIR%\android\app\movy_upload_keystore.jks
set RELEASE_DIR=%APP_DIR%\android\app\release
set UNSIGNED_AAB=%RELEASE_DIR%\app-release-unsigned.aab
set SIGNED_AAB=%RELEASE_DIR%\app-release.aab
set APKS_OUTPUT=%RELEASE_DIR%\app-release.apks
set APK_OUTPUT=%RELEASE_DIR%\app-movy-universal-release.apk

echo ========================================================
echo [1/4] Copying unsigned AAB to final AAB...
copy /Y "%UNSIGNED_AAB%" "%SIGNED_AAB%"
if errorlevel 1 goto error

echo ========================================================
echo [2/4] Signing AAB with keystore...
"%JARSIGNER_BIN%" -sigalg SHA256withRSA -digestalg SHA-256 -keystore "%KEYSTORE%" -storepass MovyMob2026@ -keypass MovyMob2026@ "%SIGNED_AAB%" movy
if errorlevel 1 goto error

echo ========================================================
echo [3/4] Verifying AAB signature...
"%JARSIGNER_BIN%" -verify "%SIGNED_AAB%"
if errorlevel 1 goto error

echo ========================================================
echo [4/4] Generating Universal APK with Bundletool...
if exist "%APKS_OUTPUT%" del /F /Q "%APKS_OUTPUT%"
"%JAVA_BIN%" -jar "%BUNDLETOOL%" build-apks --bundle="%SIGNED_AAB%" --output="%APKS_OUTPUT%" --mode=universal --ks="%KEYSTORE%" --ks-pass=pass:MovyMob2026@ --ks-key-alias=movy --key-pass=pass:MovyMob2026@
if errorlevel 1 goto error

cd /d "%RELEASE_DIR%"
if exist universal.apk del /F /Q universal.apk
"%JAR_BIN%" -xf "%APKS_OUTPUT%" universal.apk
if exist universal.apk (
    copy /Y universal.apk "%APK_OUTPUT%"
    echo SUCCESS: Universal APK generated!
)

echo ========================================================
echo COMPLETE SUCCESS!
echo AAB: %SIGNED_AAB%
echo APK: %APK_OUTPUT%
echo ========================================================
exit /b 0

:error
echo ERROR: Failed at previous step with error level %errorlevel%
exit /b 1
