import os
import subprocess

java = r"C:\Users\alexm\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2\bin\java.exe"
apksigner = r"C:\Users\alexm\AppData\Local\Android\Sdk\build-tools\37.0.0\lib\apksigner.jar"
keystore = r"D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro\android\app\movy_upload_keystore.jks"
release_dir = r"D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro\android\app\release"

src_apk = os.path.join(release_dir, "universal.apk")
out_apk = os.path.join(release_dir, "test_signed.apk")

cmd = [
    java,
    "-jar",
    apksigner,
    "sign",
    "--ks", keystore,
    "--ks-key-alias", "movy",
    "--ks-pass", "pass:MovyMob2026@",
    "--key-pass", "pass:MovyMob2026@",
    "--v1-signing-enabled", "true",
    "--v2-signing-enabled", "true",
    "--v3-signing-enabled", "true",
    "--out", out_apk,
    src_apk
]

print("Executing apksigner sign...")
p = subprocess.run(cmd, capture_output=True, text=True)
print("Return code:", p.returncode)
print("Stdout:", p.stdout)
print("Stderr:", p.stderr)

if p.returncode == 0:
    ver_cmd = [java, "-jar", apksigner, "verify", "--verbose", out_apk]
    pv = subprocess.run(ver_cmd, capture_output=True, text=True)
    print("Verify code:", pv.returncode)
    print("Verify output:\n", pv.stdout)
