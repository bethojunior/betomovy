import cv2

video_path = "VIDEO PAGINA SPLASH/VIDEO PAGINA SPLASH IMPLEMENTAR.mov"
cap = cv2.VideoCapture(video_path)
fps = cap.get(cv2.CAP_PROP_FPS)

# Inspect frames at key timestamps: 0.0s, 0.5s, 1.0s, 1.5s, 2.0s, 2.5s, 3.0s, 3.5s, 4.0s, 5.0s, 6.0s
key_secs = [0.2, 0.5, 0.8, 1.2, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0]
for s in key_secs:
    frame_idx = int(s * fps)
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
    ret, frame = cap.read()
    if ret:
        cv2.imwrite(f"C:/Users/alexm/.gemini/antigravity/brain/a3ce338e-513a-45ae-911d-488b3b3656e7/key_sec_{s:.1f}.jpg", frame)

cap.release()
print("Saved key timestamp frames")
