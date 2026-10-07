export const resizeImageCanvas = (
  file: Blob,
  targetWidth: number,
  targetHeight: number,
  callback: (dataUrl: string) => void
) => {
  const reader = new FileReader();
  reader.onload = (event: ProgressEvent<FileReader>) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        const dataUrl = canvas.toDataURL("image/jpeg", 1);
        callback(dataUrl);
      }
    };
    if (event.target && event.target.result) {
      img.src = event.target.result as string;
    }
  };
  reader.readAsDataURL(file);
};
