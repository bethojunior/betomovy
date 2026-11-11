from PIL import Image
import os

DARK_BLUE = (0, 34, 68) # #002244

# 1. Recolor splash_text_movy_white.png
text_img = Image.open('mobility-pro-app-rota101-pro/assets/splash_text_movy_white.png').convert('RGBA')
pixels_text = text_img.load()
for y in range(text_img.height):
    for x in range(text_img.width):
        r, g, b, a = pixels_text[x, y]
        if a > 0:
            pixels_text[x, y] = (DARK_BLUE[0], DARK_BLUE[1], DARK_BLUE[2], a)
text_img.save('mobility-pro-app-rota101-pro/assets/splash_text_movy_white.png')
print('splash_text_movy_white.png updated!')

# 2. Recolor logo_movy_white_text.png (text starts at x >= 165)
logo = Image.open('mobility-pro-app-rota101-pro/assets/logo_movy_white_text.png').convert('RGBA')
pixels_logo = logo.load()
for y in range(logo.height):
    for x in range(logo.width):
        if x >= 165:
            r, g, b, a = pixels_logo[x, y]
            if a > 0 and (r > 150 and g > 150 and b > 150):
                # Scale intensity based on brightness
                brightness = max(r, g, b) / 255.0
                new_r = int(DARK_BLUE[0] * brightness)
                new_g = int(DARK_BLUE[1] * brightness)
                new_b = int(DARK_BLUE[2] * brightness)
                pixels_logo[x, y] = (new_r, new_g, new_b, a)
logo.save('mobility-pro-app-rota101-pro/assets/logo_movy_white_text.png')
print('logo_movy_white_text.png updated with dark blue text!')

# 3. Update Android drawables
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
    if os.path.exists(folder_path):
        aspect = logo.height / logo.width
        h = int(w * aspect)
        resized = logo.resize((w, h), Image.Resampling.LANCZOS)
        target_file = os.path.join(folder_path, "splashscreen_logo.png")
        resized.save(target_file)
        
        # Also save assets_logo_movy_white_text.png if exists
        target_asset = os.path.join(folder_path, "assets_logo_movy_white_text.png")
        if os.path.exists(target_asset):
            resized.save(target_asset)
        
        # Also copy splash_text_movy_white to assets_splash_text_movy_white.png
        t_asset = os.path.join(folder_path, "assets_splash_text_movy_white.png")
        if os.path.exists(t_asset):
            text_img.save(t_asset)

print('All Android drawables updated successfully!')
