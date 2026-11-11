import os
from PIL import Image

PINK_BG = (207, 34, 123, 255) # #CF227B Rosa Escuro
DARK_BLUE = (0, 52, 154, 255) # #00349A Azul Escuro

base_app = "mobility-pro-app-rota101-pro"
base_ios = "mobility-pro-app-rota101-pro-ios"

# Load source elements
icon_path = os.path.join(base_app, "assets", "splash_icon_movy.png")
text_path = os.path.join(base_app, "assets", "splash_text_movy_dark_blue.png")

icon = Image.open(icon_path).convert("RGBA")
text = Image.open(text_path).convert("RGBA")

# Ensure text is pure dark blue #00349A
text_pixels = text.load()
for y in range(text.height):
    for x in range(text.width):
        r, g, b, a = text_pixels[x, y]
        if a > 0:
            text_pixels[x, y] = (0, 52, 154, a)

# Create composite stacked logo: Mark on top, "Movy" text on bottom
spacing = 18
total_w = max(icon.width, text.width)
total_h = icon.height + spacing + text.height

stacked_logo = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
icon_x = (total_w - icon.width) // 2
stacked_logo.paste(icon, (icon_x, 0), icon)
text_x = (total_w - text.width) // 2
stacked_logo.paste(text, (text_x, icon.height + spacing), text)

stacked_logo.save(os.path.join(base_app, "assets", "logo_movy_stacked_dark_blue.png"))
print(f"Stacked logo created: {stacked_logo.size}")

# 1. Generate Full Splash 1080x1920
W, H = 1080, 1920
splash_full = Image.new("RGBA", (W, H), PINK_BG)

# Scale stacked logo for splash: width ~ 460px
target_logo_w = 460
aspect = stacked_logo.height / stacked_logo.width
target_logo_h = int(target_logo_w * aspect)
splash_logo = stacked_logo.resize((target_logo_w, target_logo_h), Image.Resampling.LANCZOS)

pos_x = (W - target_logo_w) // 2
pos_y = (H - target_logo_h) // 2 - 40 # slightly optical center
splash_full.alpha_composite(splash_logo, (pos_x, pos_y))

# Save full splash screens
splash_targets = [
    os.path.join(base_app, "assets", "splash.png"),
    os.path.join(base_app, "assets", "splashPhoto.png"),
    os.path.join(base_app, "assets", "logo-on-dark.png"),
    os.path.join(base_ios, "assets", "splash.png"),
    os.path.join(base_ios, "assets", "splashPhoto.png"),
    os.path.join(base_ios, "assets", "logo-on-dark.png"),
]

for st in splash_targets:
    os.makedirs(os.path.dirname(st), exist_ok=True)
    splash_full.save(st, format="PNG")
    print(f"Saved splash: {st}")

# Save user artifact preview
preview_path = r"C:\Users\alexm\.gemini\antigravity\brain\b5c48609-de62-4b27-b047-f5ff8096c8c7\preview_splash_pink_dark_blue_v2.png"
splash_full.resize((360, 640), Image.Resampling.LANCZOS).save(preview_path, format="PNG")
print(f"Saved user preview: {preview_path}")

# 2. Android 12 Splash Screen Drawables (Square canvas, transparent background, safe inner circle 65%)
densities = {
    "drawable-mdpi": 192,
    "drawable-hdpi": 288,
    "drawable-xhdpi": 384,
    "drawable-xxhdpi": 576,
    "drawable-xxxhdpi": 768,
}

res_path = os.path.join(base_app, "android", "app", "src", "main", "res")

for folder, canvas_size in densities.items():
    folder_dir = os.path.join(res_path, folder)
    os.makedirs(folder_dir, exist_ok=True)

    # Square transparent canvas
    canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))

    # Inner size inside safe circle
    max_inner = int(canvas_size * 0.62)
    aspect = stacked_logo.height / stacked_logo.width
    if aspect >= 1:
        ih = max_inner
        iw = int(ih / aspect)
    else:
        iw = max_inner
        ih = int(iw * aspect)

    resized_icon = stacked_logo.resize((iw, ih), Image.Resampling.LANCZOS)
    ox = (canvas_size - iw) // 2
    oy = (canvas_size - ih) // 2
    canvas.paste(resized_icon, (ox, oy), resized_icon)

    out_file = os.path.join(folder_dir, "splashscreen_logo.png")
    canvas.save(out_file, format="PNG")
    print(f"Saved Android drawable: {out_file} ({canvas_size}x{canvas_size}, inner {iw}x{ih})")

# 3. iOS Assets
ios_xcassets = [
    os.path.join(base_ios, "ios", "VouteHomologar", "Images.xcassets", "SplashScreenLegacy.imageset"),
    os.path.join(base_ios, "ios", "Route95Pro", "Images.xcassets", "SplashScreen.imageset"),
]

for xc in ios_xcassets:
    if os.path.exists(xc):
        # 1x: 200w
        w1 = 200
        h1 = int(w1 * aspect)
        stacked_logo.resize((w1, h1), Image.Resampling.LANCZOS).save(os.path.join(xc, "image.png"))
        
        # 2x: 400w
        w2 = 400
        h2 = int(w2 * aspect)
        stacked_logo.resize((w2, h2), Image.Resampling.LANCZOS).save(os.path.join(xc, "image@2x.png"))

        # 3x: 600w
        w3 = 600
        h3 = int(w3 * aspect)
        stacked_logo.resize((w3, h3), Image.Resampling.LANCZOS).save(os.path.join(xc, "image@3x.png"))
        print(f"Saved iOS imageset: {xc}")

# Solid pink background for iOS imageset
ios_bg_set = os.path.join(base_ios, "ios", "Route95Pro", "Images.xcassets", "SplashScreenBackground.imageset")
if os.path.exists(ios_bg_set):
    solid_bg = Image.new("RGBA", (100, 100), PINK_BG)
    solid_bg.save(os.path.join(ios_bg_set, "image.png"))
    print(f"Saved iOS solid background: {ios_bg_set}")

print("ALL SPLASH SCREENS PERFECTLY GENERATED!")
