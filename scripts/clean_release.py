import os
import shutil

rel = r"D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro\android\app\release"
src = os.path.join(rel, "universal.apk")
dest = os.path.join(rel, "movy-app-universal.apk")
root_dest = r"D:\APLICATIVO MOVY\movy-app-universal.apk"

# Ensure we have the full 73MB APK
if os.path.exists(src):
    shutil.copy2(src, dest)
    shutil.copy2(src, root_dest)
elif os.path.exists(root_dest) and os.path.getsize(root_dest) > 50 * 1024 * 1024:
    shutil.copy2(root_dest, dest)

# Delete junk intermediate files from release folder
for junk in ["universal.apk", "app-movy-universal.apk", "app-release.apks", "test_signed.apk"]:
    p = os.path.join(rel, junk)
    if os.path.exists(p):
        try:
            os.remove(p)
            print(f"Removed {junk}")
        except Exception as e:
            print(f"Could not remove {junk}: {e}")

# Remove old unused APK at root
old_apk = r"D:\APLICATIVO MOVY\movy-universal-release.apk"
if os.path.exists(old_apk):
    try:
        os.remove(old_apk)
        print("Removed movy-universal-release.apk")
    except Exception as e:
        print(f"Could not remove {old_apk}: {e}")

print("Clean finished!")
