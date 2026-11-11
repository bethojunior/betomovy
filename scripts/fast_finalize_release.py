import os
import subprocess
import shutil
import zipfile
import time
import sys

APP_DIR = r"D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro"
ANDROID_DIR = os.path.join(APP_DIR, "android")
JAVA_HOME = r"C:\Users\alexm\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2"
JAVA = os.path.join(JAVA_HOME, r"bin\java.exe")
BUNDLETOOL = os.path.join(APP_DIR, "bundletool-all.jar")
KEYSTORE = os.path.join(ANDROID_DIR, r"app\movy_upload_keystore.jks")

SRC_AAB = os.path.join(ANDROID_DIR, r"app\build\outputs\bundle\release\app-release.aab")
RELEASE_DIR = os.path.join(ANDROID_DIR, r"app\release")
TARGET_AAB = os.path.join(RELEASE_DIR, "app-release.aab")
OUTPUT_APKS = os.path.join(RELEASE_DIR, "app-release.apks")
UNIVERSAL_APK = os.path.join(RELEASE_DIR, "movy-app-universal.apk")
ROOT_APK = r"D:\APLICATIVO MOVY\movy-app-universal.apk"
ROOT_AAB = r"D:\APLICATIVO MOVY\movy-release-playstore.aab"

env = os.environ.copy()
env['JAVA_HOME'] = JAVA_HOME
env['PATH'] = os.path.join(JAVA_HOME, 'bin') + ';' + env.get('PATH', '')

print("[1/4] Running gradlew bundleRelease (skipping already-bundled JS)...", flush=True)
t0 = time.time()
gradle_cmd = [os.path.join(ANDROID_DIR, "gradlew.bat"), "bundleRelease", "-x", "createBundleReleaseJsAndAssets"]

proc_gradle = subprocess.Popen(
    gradle_cmd,
    cwd=ANDROID_DIR,
    env=env,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    bufsize=1
)

for line in proc_gradle.stdout:
    line_clean = line.strip()
    if line_clean and ('> Task' in line_clean or 'BUILD' in line_clean or 'Bundled' in line_clean or 'error' in line_clean.lower() or 'failed' in line_clean.lower()):
        print(line_clean, flush=True)

proc_gradle.wait()

if proc_gradle.returncode != 0:
    print(f"Gradle build FAILED with code {proc_gradle.returncode}", flush=True)
    sys.exit(1)

print(f"Gradle bundleRelease finished in {time.time() - t0:.1f}s.", flush=True)

os.makedirs(RELEASE_DIR, exist_ok=True)

print(f"[2/4] Copying signed AAB from {SRC_AAB} to {TARGET_AAB}...", flush=True)
shutil.copy2(SRC_AAB, TARGET_AAB)
shutil.copy2(SRC_AAB, ROOT_AAB)
aab_size = os.path.getsize(TARGET_AAB) / (1024 * 1024)
print(f"Target AAB copied successfully ({aab_size:.2f} MB)", flush=True)

print("[3/4] Building universal APK bundle with bundletool...", flush=True)
cmd = [
    JAVA,
    "-jar",
    BUNDLETOOL,
    "build-apks",
    f"--bundle={TARGET_AAB}",
    f"--output={OUTPUT_APKS}",
    "--mode=universal",
    "--overwrite",
    f"--ks={KEYSTORE}",
    "--ks-pass=pass:MovyMob2026@",
    "--ks-key-alias=movy",
    "--key-pass=pass:MovyMob2026@",
]

proc = subprocess.run(cmd, env=env, capture_output=True, text=True)
if proc.returncode != 0:
    print("Bundletool error:", flush=True)
    print(proc.stderr, flush=True)
    sys.exit(1)
print("Bundletool completed successfully.", flush=True)

print("[4/4] Extracting and finalizing movy-app-universal.apk...", flush=True)
with zipfile.ZipFile(OUTPUT_APKS, "r") as z:
    z.extract("universal.apk", RELEASE_DIR)

extracted = os.path.join(RELEASE_DIR, "universal.apk")
if os.path.exists(extracted):
    shutil.copy2(extracted, UNIVERSAL_APK)
    shutil.copy2(extracted, ROOT_APK)
    os.remove(extracted)
    if os.path.exists(OUTPUT_APKS):
        os.remove(OUTPUT_APKS)
    apk_size = os.path.getsize(UNIVERSAL_APK) / (1024 * 1024)
    print("\n================ SUCCESS ================", flush=True)
    print(f"AAB Path: {TARGET_AAB} ({aab_size:.2f} MB)", flush=True)
    print(f"APK Path: {UNIVERSAL_APK} ({apk_size:.2f} MB)", flush=True)
    print(f"Root APK: {ROOT_APK} ({apk_size:.2f} MB)", flush=True)
    print("=========================================\n", flush=True)
else:
    print("universal.apk not found in zip archive!", flush=True)
    sys.exit(1)
