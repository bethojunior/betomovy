import Resizer from "react-image-file-resizer";

export const resizeLogo = (
  file: File,
  widthImage: number,
  heightImage: number,
  extensionImage: "JPEG" | "PNG" | "JPG",
  typeImage: "blob" | "base64"
) => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      widthImage,
      heightImage,
      extensionImage,
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      typeImage
    );
  });
};
