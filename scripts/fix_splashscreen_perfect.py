from PIL import Image, ImageOps
import os

# Dimensões padrão para Android Splash Screen API (quadrado 1:1)
# Safe circle zone: central 66% do canvas
densities = {
    "drawable-mdpi": 192,
    "drawable-hdpi": 288,
    "drawable-xhdpi": 384,
    "drawable-xxhdpi": 576,
    "drawable-xxxhdpi": 768,
}

base_dir = r"D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro"
res_path = os.path.join(base_dir, "android", "app", "src", "main", "res")

# Carregar o logo transparente oficial ou logo-icon
icon_candidates = [
    os.path.join(base_dir, "assets", "logo-transparent.png"),
    os.path.join(base_dir, "assets", "logo-icon.png"),
    os.path.join(base_dir, "assets", "icon.png"),
]

src_path = None
for p in icon_candidates:
    if os.path.exists(p):
        src_path = p
        break

print(f"Using source icon: {src_path}")
src_img = Image.open(src_path).convert("RGBA")

# Se tiver bordas transparentes vazias, recortar para a bounding box real
bbox = src_img.getbbox()
if bbox:
    cropped = src_img.crop(bbox)
else:
    cropped = src_img

print(f"Cropped icon size: {cropped.size}")

for folder, canvas_size in densities.items():
    folder_path = os.path.join(res_path, folder)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path, exist_ok=True)

    # Criar canvas quadrado transparente
    canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))

    # O conteúdo deve ocupar no máximo 65% do canvas para garantir que caiba
    # perfeitamente dentro da máscara circular do Android 12+ sem cortar!
    target_inner_size = int(canvas_size * 0.65)
    aspect = cropped.width / cropped.height

    if aspect >= 1:
        w = target_inner_size
        h = max(1, int(target_inner_size / aspect))
    else:
        h = target_inner_size
        w = max(1, int(target_inner_size * aspect))

    resized_icon = cropped.resize((w, h), Image.Resampling.LANCZOS)

    # Centralizar no canvas
    offset_x = (canvas_size - w) // 2
    offset_y = (canvas_size - h) // 2
    canvas.paste(resized_icon, (offset_x, offset_y), resized_icon)

    target_file = os.path.join(folder_path, "splashscreen_logo.png")
    canvas.save(target_file, format="PNG")
    print(f"Saved: {target_file} ({canvas_size}x{canvas_size}, inner {w}x{h})")

print("All splashscreen_logo drawables generated with perfect circular safe zone!")
