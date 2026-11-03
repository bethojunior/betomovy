@echo off
set "JAVA_HOME=C:\Users\alexm\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2"
set "PATH=%JAVA_HOME%\bin;%PATH%"

set "BT=C:\Users\alexm\AppData\Local\Android\Sdk\build-tools\37.0.0"
set "KEYSTORE=D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro\android\app\movy_upload_keystore.jks"
set "RELEASE=D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro\android\app\release"

set "SRC=%RELEASE%\universal.apk"
set "ALIGNED=%RELEASE%\aligned.apk"
set "FINAL=%RELEASE%\movy-app-universal.apk"

echo [1/3] Aligning APK with zipalign...
if exist "%ALIGNED%" del /f /q "%ALIGNED%"
"%BT%\zipalign.exe" -p -f 4 "%SRC%" "%ALIGNED%"
if errorlevel 1 (
    echo Zipalign failed!
    exit /b 1
)

echo [2/3] Signing APK with v1, v2, v3, v4 schemes...
if exist "%FINAL%" del /f /q "%FINAL%"
call "%BT%\apksigner.bat" sign --ks "%KEYSTORE%" --ks-key-alias movy --ks-pass pass:MovyMob2026@ --key-pass pass:MovyMob2026@ --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true --out "%FINAL%" "%ALIGNED%"
if errorlevel 1 (
    echo apksigner failed!
    exit /b 1
)

if exist "%ALIGNED%" del /f /q "%ALIGNED%"

echo [3/3] Verifying signatures...
call "%BT%\apksigner.bat" verify --verbose "%FINAL%"

copy /y "%FINAL%" "%RELEASE%\app-movy-universal.apk"
echo ================= ALL DONE =================
exit /b 0
