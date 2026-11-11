import os
import subprocess
import shutil

env = os.environ.copy()
env['JAVA_HOME'] = r'C:\Users\alexm\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2'
env['PATH'] = env['JAVA_HOME'] + r'\bin;' + env['PATH']

bt = r'C:\Users\alexm\AppData\Local\Android\Sdk\build-tools\37.0.0'
apksigner = os.path.join(bt, 'apksigner.bat')
keystore = r'D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro\android\app\movy_upload_keystore.jks'
release_dir = r'D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro\android\app\release'

src_apk = os.path.join(release_dir, 'universal.apk')
out_apk = os.path.join(release_dir, 'movy-app-universal.apk')

print("[1] Signing universal.apk with v1, v2, v3...")
sign_cmd = [
    apksigner, 'sign',
    '--ks', keystore,
    '--ks-key-alias', 'movy',
    '--ks-pass', 'pass:MovyMob2026@',
    '--key-pass', 'pass:MovyMob2026@',
    '--v1-signing-enabled', 'true',
    '--v2-signing-enabled', 'true',
    '--v3-signing-enabled', 'true',
    '--out', out_apk,
    src_apk
]

p = subprocess.run(sign_cmd, env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
if p.returncode != 0:
    print("apksigner sign error:", p.stderr)
    exit(1)
print("apksigner sign succeeded!")

print("[2] Verifying output APK...")
verify_cmd = [apksigner, 'verify', '--verbose', out_apk]
pv = subprocess.run(verify_cmd, env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
print(pv.stdout)

print("[3] Copying to app-movy-universal.apk and root movy-app-universal.apk...")
shutil.copy2(out_apk, os.path.join(release_dir, 'app-movy-universal.apk'))
shutil.copy2(out_apk, r'D:\APLICATIVO MOVY\movy-app-universal.apk')

print(f"DONE! Final APK size: {os.path.getsize(out_apk) / (1024*1024):.2f} MB")
