from PIL import Image
import numpy as np

# Load logo-transparent.png
img = Image.open("mobility-pro-app-rota101-pro/assets/logo-transparent.png").convert("RGBA")
arr = np.array(img)

# Width is 512, height is 512
# The icon is on the left: roughly x in [40, 200]
# The text 'Movy' is on the right: roughly x in [210, 480]

# Let's inspect x coordinates of non-transparent pixels
alpha = arr[:, :, 3]
y_indices, x_indices = np.where(alpha > 10)
print(f"X bounds: min={x_indices.min()}, max={x_indices.max()}")
print(f"Y bounds: min={y_indices.min()}, max={y_indices.max()}")

# Separate icon and text based on X threshold (around x=200)
# Between icon (orange arrow right tip is around x=190) and Movy 'M' (starts around x=220)
# Let's find the exact gap
row_alpha = alpha[y_indices.min():y_indices.max(), :]
col_sums = row_alpha.sum(axis=0)

# Find minimum between x=170 and x=230
split_x = 170 + np.argmin(col_sums[170:230])
print(f"Optimal split_x between icon and text: {split_x}")

# 1. Icon only
icon_arr = arr.copy()
icon_arr[:, split_x:, 3] = 0 # zero alpha for text
icon_img = Image.fromarray(icon_arr)
# Crop icon tightly with padding
icon_box = icon_img.getbbox()
icon_cropped = icon_img.crop(icon_box)
icon_cropped.save("mobility-pro-app-rota101-pro/assets/splash_icon_movy.png")
print(f"Saved splash_icon_movy.png: {icon_cropped.size}")

# 2. Text only - and convert dark blue text to pure white (#FFFFFF)
text_arr = arr.copy()
text_arr[:, :split_x, 3] = 0 # zero alpha for icon

# All pixels with alpha > 0 in text should be pure white
text_alpha = text_arr[:, :, 3]
text_mask = text_alpha > 0
text_arr[text_mask, 0] = 255 # R
text_arr[text_mask, 1] = 255 # G
text_arr[text_mask, 2] = 255 # B

text_img = Image.fromarray(text_arr)
text_box = text_img.getbbox()
text_cropped = text_img.crop(text_box)
text_cropped.save("mobility-pro-app-rota101-pro/assets/splash_text_movy_white.png")
print(f"Saved splash_text_movy_white.png: {text_cropped.size}")

# 3. Combined logo with white text
combined_arr = arr.copy()
# replace text part with white
combined_text_mask = (text_mask) & (np.arange(512)[None, :] >= split_x)
combined_arr[combined_text_mask, 0] = 255
combined_arr[combined_text_mask, 1] = 255
combined_arr[combined_text_mask, 2] = 255
combined_img = Image.fromarray(combined_arr)
combined_box = combined_img.getbbox()
combined_cropped = combined_img.crop(combined_box)
combined_cropped.save("mobility-pro-app-rota101-pro/assets/logo_movy_white_text.png")
print(f"Saved logo_movy_white_text.png: {combined_cropped.size}")
