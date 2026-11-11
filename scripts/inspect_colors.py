import cv2
import numpy as np

img = cv2.imread("C:/Users/alexm/.gemini/antigravity/brain/a3ce338e-513a-45ae-911d-488b3b3656e7/anim_frame_200.jpg")
h, w, _ = img.shape

# Background color (top left corner)
bg_bgr = img[50, 50]
bg_hex = f"#{bg_bgr[2]:02X}{bg_bgr[1]:02X}{bg_bgr[0]:02X}"
print(f"Background color: {bg_hex} (RGB: {bg_bgr[2]}, {bg_bgr[1]}, {bg_bgr[0]})")

# Center area colors
print(f"Image dimensions: {w}x{h}")
