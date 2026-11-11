import cv2
import os

video_path = "VIDEO PAGINA SPLASH/VIDEO PAGINA SPLASH IMPLEMENTAR.mov"
output_dir = "scripts/splash_frames"
os.makedirs(output_dir, exist_ok=True)

cap = cv2.VideoCapture(video_path)
fps = cap.get(cv2.CAP_PROP_FPS)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
duration = total_frames / fps if fps > 0 else 0

print(f"FPS: {fps}, Total Frames: {total_frames}, Duration: {duration:.2f}s")

# Extract 1 frame every 0.3 seconds or ~10-15 frames total
step = max(1, int(fps * 0.3))
frame_idx = 0
saved_count = 0

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    if frame_idx % step == 0:
        sec = frame_idx / fps
        out_file = os.path.join(output_dir, f"frame_{saved_count:02d}_{sec:.2f}s.jpg")
        cv2.imwrite(out_file, frame)
        saved_count += 1
    frame_idx += 1

cap.release()
print(f"Saved {saved_count} frames to {output_dir}")
