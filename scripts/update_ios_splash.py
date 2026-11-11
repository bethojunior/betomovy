from PIL import Image

logo = Image.open("mobility-pro-app-rota101-pro/assets/logo_movy_white_text.png").convert("RGBA")

# iOS sizes: 1x (200w), 2x (400w), 3x (600w)
ios_targets = [
    "mobility-pro-app-rota101-pro/ios/VouteHomologar/Images.xcassets/SplashScreenLegacy.imageset",
    "mobility-pro-app-rota101-pro-ios/ios/VouteHomologar/Images.xcassets/SplashScreenLegacy.imageset",
]

for base_dir in ios_targets:
    aspect = logo.height / logo.width
    # 1x
    w1 = 200
    h1 = int(w1 * aspect)
    logo.resize((w1, h1), Image.Resampling.LANCZOS).save(f"{base_dir}/image.png")

    # 2x
    w2 = 400
    h2 = int(w2 * aspect)
    logo.resize((w2, h2), Image.Resampling.LANCZOS).save(f"{base_dir}/image@2x.png")

    # 3x
    w3 = 600
    h3 = int(w3 * aspect)
    logo.resize((w3, h3), Image.Resampling.LANCZOS).save(f"{base_dir}/image@3x.png")

print("iOS splash legacy images updated successfully")
