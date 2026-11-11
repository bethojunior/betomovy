from PIL import Image
import os

# Logo with white text
logo = Image.open("mobility-pro-app-rota101-pro/assets/logo_movy_white_text.png").convert("RGBA")

# Android drawable densities for splashscreen_logo.png
# mdpi: ~200px width, hdpi: ~300px, xhdpi: ~400px, xxhdpi: ~600px, xxxhdpi: ~800px
densities = {
    "drawable-mdpi": 220,
    "drawable-hdpi": 330,
    "drawable-xhdpi": 440,
    "drawable-xxhdpi": 660,
    "drawable-xxxhdpi": 880,
}

res_path = "mobility-pro-app-rota101-pro/android/app/src/main/res"

for folder, w in densities.items():
    folder_path = os.path.join(res_path, folder)
    os.makedirs(folder_path, exist_ok=True)
    aspect = logo.height / logo.width
    h = int(w * aspect)
    resized = logo.resize((w, h), Image.Resampling.LANCZOS)
    target_file = os.path.join(folder_path, "splashscreen_logo.png")
    resized.save(target_file)
    print(f"Saved {target_file} ({w}x{h})")

# Also copy splash.png as assets_splash.png
splash_img = Image.open("mobility-pro-app-rota101-pro/assets/splash.png")
splash_img.resize((1080, 1920), Image.Resampling.LANCZOS).save(os.path.join(res_path, "drawable-mdpi", "assets_splash.png"))

print("Android splash drawables updated successfully")
