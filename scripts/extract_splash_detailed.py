import cv2
import os

video_path = "VIDEO PAGINA SPLASH/VIDEO PAGINA SPLASH IMPLEMENTAR.mov"
output_dir = "C:/Users/alexm/.gemini/antigravity/brain/a3ce338e-513a-45ae-911d-488b3b3656e7"

cap = cv2.VideoCapture(video_path)
fps = cap.get(cv2.CAP_PROP_FPS)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
print(f"FPS: {fps}, Total Frames: {total_frames}")

# Save the last 15 frames
for i in range(total_frames):
    ret, frame = cap.read()
    if not ret:
        break
    # Save every 5th frame and all of the last 20 frames
    if i % 10 == 0 or i >= total_frames - 20:
        cv2.imwrite(f"{output_dir}/anim_frame_{i:03d}.jpg", frame)

cap.release()
print("Done extracting detailed frames")
