import os
import sys
import zipfile
import subprocess
import shutil

APP_DIR = r"D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro"
ORIGINAL_AAB = os.path.join(APP_DIR, r"android\app\release\app-release.aab.bak_rota101")
NEW_BUNDLE = os.path.join(APP_DIR, r"android\app\src\main\assets\index.android.bundle")
OUTPUT_AAB = os.path.join(APP_DIR, r"android\app\release\app-release.aab")
OUTPUT_APKS = os.path.join(APP_DIR, r"android\app\release\app-release.apks")
UNIVERSAL_APK = os.path.join(APP_DIR, r"android\app\release\movy-universal-release.apk")
KEYSTORE = os.path.join(APP_DIR, r"android\app\movy_upload_keystore.jks")

ROOT_AAB = r"D:\APLICATIVO MOVY\movy-release-playstore.aab"
ROOT_APK = r"D:\APLICATIVO MOVY\movy-universal-release.apk"

JAVA_BIN = r"C:\Users\alexm\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2\bin\java.exe"
JARSIGNER_BIN = r"C:\Users\alexm\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2\bin\jarsigner.exe"
BUNDLETOOL_JAR = os.path.join(APP_DIR, "bundletool-all.jar")

print("[1/5] Checking source files...")
assert os.path.exists(ORIGINAL_AAB), f"Original AAB not found: {ORIGINAL_AAB}"
assert os.path.exists(NEW_BUNDLE), f"New bundle not found: {NEW_BUNDLE}"
new_bundle_size = os.path.getsize(NEW_BUNDLE)
print(f"New bundle size: {new_bundle_size / (1024*1024):.2f} MB")

print("[2/5] Creating clean AAB with Hermes JS bundle AND Version 8.1.4 (versionCode 80104)...")
temp_aab = OUTPUT_AAB + ".tmp"
with zipfile.ZipFile(ORIGINAL_AAB, 'r') as zin, zipfile.ZipFile(temp_aab, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        # Skip old signature files and directory entries
        if item.filename.startswith("META-INF/"):
            continue
        if item.filename.endswith("/"):
            continue
        
        # Replace the main React Native JS bundle
        if item.filename == "base/assets/index.android.bundle":
            print(f"Replacing {item.filename} with new compiled Hermes bundle...")
            zout.write(NEW_BUNDLE, item.filename, compress_type=zipfile.ZIP_DEFLATED)
        elif item.filename == "base/manifest/AndroidManifest.xml":
            content = zin.read(item.filename)
            assert b'versionName\x1a\x058.1.0' in content, "versionName 8.1.0 pattern not found"
            content = content.replace(b'versionName\x1a\x058.1.0', b'versionName\x1a\x058.1.4')
            
            old_code = b'versionCode\x1a\x0580100"\x02\x08\x02(\x9b\x84\x84\x082\x06:\x040\xe4\xf1\x04'
            new_code = b'versionCode\x1a\x0580104"\x02\x08\x02(\x9b\x84\x84\x082\x06:\x040\xe8\xf1\x04'
            assert old_code in content, "versionCode 80100 pattern not found"
            content = content.replace(old_code, new_code)
            print("Successfully updated AndroidManifest.xml: versionCode=80104, versionName=8.1.4")
            zout.writestr(item, content)
        else:
            # Preserve original compression and file content
            content = zin.read(item.filename)
            zout.writestr(item, content)

if os.path.exists(OUTPUT_AAB):
    os.remove(OUTPUT_AAB)
os.rename(temp_aab, OUTPUT_AAB)
print(f"Clean unsigned AAB created: {os.path.getsize(OUTPUT_AAB) / (1024*1024):.2f} MB")

print("[2.5/5] Verifying Manifest Version via BundleTool Dump...")
dump_cmd = [JAVA_BIN, "-jar", BUNDLETOOL_JAR, "dump", "manifest", f"--bundle={OUTPUT_AAB}"]
pdump = subprocess.run(dump_cmd, capture_output=True, text=True)
manifest_header = pdump.stdout[:400]
print("Manifest Header:")
for line in manifest_header.splitlines()[:5]:
    if "version" in line or "manifest" in line:
        print("  ->", line.strip())

assert 'versionCode="80104"' in pdump.stdout, "FAIL: versionCode was not updated to 80104!"
assert 'versionName="8.1.4"' in pdump.stdout, "FAIL: versionName was not updated to 8.1.4!"
print(">>> VERSION 8.1.4 / 80104 100% VERIFIED IN AAB MANIFEST! <<<")

print("[3/5] Signing AAB with jarsigner...")
sign_cmd = [
    JARSIGNER_BIN,
    "-sigalg", "SHA256withRSA",
    "-digestalg", "SHA-256",
    "-keystore", KEYSTORE,
    "-storepass", "MovyMob2026@",
    "-keypass", "MovyMob2026@",
    OUTPUT_AAB,
    "movy"
]
p = subprocess.run(sign_cmd, capture_output=True, text=True)
if p.returncode != 0:
    print("Sign failed:", p.stderr)
    sys.exit(1)
print("Sign output:", p.stdout.strip())

print("Verifying signature...")
verify_cmd = [JARSIGNER_BIN, "-verify", OUTPUT_AAB]
pv = subprocess.run(verify_cmd, capture_output=True, text=True)
print("Verify result:", pv.stdout.strip())

print("[4/5] Running bundletool to generate APKS...")
if os.path.exists(OUTPUT_APKS):
    os.remove(OUTPUT_APKS)

bundle_cmd = [
    JAVA_BIN,
    "-jar", BUNDLETOOL_JAR,
    "build-apks",
    f"--bundle={OUTPUT_AAB}",
    f"--output={OUTPUT_APKS}",
    "--mode=universal",
    f"--ks={KEYSTORE}",
    "--ks-pass=pass:MovyMob2026@",
    "--ks-key-alias=movy",
    "--key-pass=pass:MovyMob2026@"
]
pb = subprocess.run(bundle_cmd, capture_output=True, text=True)
if pb.returncode != 0:
    print("Bundletool error:", pb.stderr)
    sys.exit(1)
print(f"APKS archive created: {os.path.getsize(OUTPUT_APKS) / (1024*1024):.2f} MB")

print("[5/5] Extracting universal APK...")
with zipfile.ZipFile(OUTPUT_APKS, 'r') as zapks:
    zapks.extract("universal.apk", os.path.dirname(OUTPUT_AAB))

extracted_apk = os.path.join(os.path.dirname(OUTPUT_AAB), "universal.apk")
if os.path.exists(extracted_apk):
    if os.path.exists(UNIVERSAL_APK):
        os.remove(UNIVERSAL_APK)
    shutil.move(extracted_apk, UNIVERSAL_APK)
    print(f"SUCCESS! Universal APK created at: {UNIVERSAL_APK}")
    print(f"APK Size: {os.path.getsize(UNIVERSAL_APK) / (1024*1024):.2f} MB")

# Copy to root
shutil.copyfile(OUTPUT_AAB, ROOT_AAB)
shutil.copyfile(UNIVERSAL_APK, ROOT_APK)

print("\n=======================================================")
print("ALL DONE SUCCESSFULLY - VERSION 8.1.4 (80104)!")
print(f"1. Play Store Release (AAB): {ROOT_AAB}")
print(f"2. Direct Test Install (APK): {ROOT_APK}")
print("=======================================================")
