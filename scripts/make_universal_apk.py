import os
import shutil
import subprocess
import zipfile

APP_DIR = r"D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro"
JAVA = r"C:\Users\alexm\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2\bin\java.exe"
BUNDLETOOL = os.path.join(APP_DIR, "bundletool-all.jar")
KEYSTORE = os.path.join(APP_DIR, r"android\app\movy_upload_keystore.jks")

SRC_AAB = os.path.join(APP_DIR, r"android\app\build\outputs\bundle\release\app-release.aab")
RELEASE_DIR = os.path.join(APP_DIR, r"android\app\release")
TARGET_AAB = os.path.join(RELEASE_DIR, "app-release.aab")
OUTPUT_APKS = os.path.join(RELEASE_DIR, "app-release.apks")
UNIVERSAL_APK = os.path.join(RELEASE_DIR, "movy-app-universal.apk")
ROOT_APK = r"D:\APLICATIVO MOVY\movy-app-universal.apk"

os.makedirs(RELEASE_DIR, exist_ok=True)

print(f"[1/3] Copying signed AAB from {SRC_AAB} to {TARGET_AAB}...")
shutil.copy2(SRC_AAB, TARGET_AAB)
aab_size = os.path.getsize(TARGET_AAB) / (1024 * 1024)
print(f"Target AAB copied successfully ({aab_size:.2f} MB)")

print("[2/3] Building universal APK bundle with bundletool...")
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

proc = subprocess.run(cmd, capture_output=True, text=True)
if proc.returncode != 0:
    print("Bundletool error:")
    print(proc.stderr)
    exit(1)
print("Bundletool completed successfully.")

print("[3/3] Extracting and finalizing movy-app-universal.apk...")
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
    print("\n================ SUCCESS ================")
    print(f"AAB Path: {TARGET_AAB} ({aab_size:.2f} MB)")
    print(f"APK Path: {UNIVERSAL_APK} ({apk_size:.2f} MB)")
    print(f"Root APK: {ROOT_APK} ({apk_size:.2f} MB)")
    print("=========================================\n")
else:
    print("universal.apk not found in zip archive!")
    exit(1)
