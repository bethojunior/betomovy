import numpy as np
from PIL import Image

W, H = 1080, 1920
cx, cy = W / 2.0, H / 2.0

# Generate coordinate grids
y, x = np.ogrid[:H, :W]
# Distance from center
dist = np.sqrt((x - cx)**2 + (y - cy)**2)

# Wave frequency: wavelength ~ 120 pixels
wave = np.sin(dist * (2 * np.pi / 130.0)) # range [-1, 1]

# Base color #CD2379: (205, 35, 121)
# Wave peak color #D73087: (215, 48, 135)
base_r, base_g, base_b = 205.0, 35.0, 121.0
peak_r, peak_g, peak_b = 218.0, 52.0, 138.0

factor = (wave + 1.0) / 2.0 # range [0, 1]
# S-curve to make rings smooth
factor = factor ** 1.5

r = (base_r + (peak_r - base_r) * factor).astype(np.uint8)
g = (base_g + (peak_g - base_g) * factor).astype(np.uint8)
b = (base_b + (peak_b - base_b) * factor).astype(np.uint8)
a = np.full((H, W), 255, dtype=np.uint8)

bg_arr = np.dstack((r, g, b, a))
splash_bg = Image.fromarray(bg_arr, "RGBA")

# Load logo with white text
logo = Image.open("mobility-pro-app-rota101-pro/assets/logo_movy_white_text.png").convert("RGBA")
target_logo_w = 660
aspect = logo.height / logo.width
target_logo_h = int(target_logo_w * aspect)
logo_resized = logo.resize((target_logo_w, target_logo_h), Image.Resampling.LANCZOS)

logo_x = (W - target_logo_w) // 2
logo_y = (H - target_logo_h) // 2

splash_full = splash_bg.copy()
splash_full.alpha_composite(logo_resized, (logo_x, logo_y))

# Save for preview and assets
splash_full.save("C:/Users/alexm/.gemini/antigravity/brain/a3ce338e-513a-45ae-911d-488b3b3656e7/splash_preview_smooth.png")
splash_full.save("mobility-pro-app-rota101-pro/assets/splash.png")
splash_full.save("mobility-pro-app-rota101-pro/assets/splashPhoto.png")
splash_full.save("mobility-pro-app-rota101-pro-ios/assets/splash.png")
splash_full.save("mobility-pro-app-rota101-pro-ios/assets/splashPhoto.png")

splash_bg.save("mobility-pro-app-rota101-pro/assets/splash_rings_bg.png")
splash_bg.save("mobility-pro-app-rota101-pro-ios/assets/splash_rings_bg.png")

print("Created smooth realistic wave rings splash successfully")
