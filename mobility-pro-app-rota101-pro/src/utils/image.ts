import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

export async function resizeImage(uri: string, width: number, height: number) {
  const imageCtx = ImageManipulator.manipulate(uri);
  const imageRef = await imageCtx.resize({ width, height }).renderAsync();

  return imageRef.saveAsync({
    compress: 0.5,
    format: SaveFormat.JPEG,
  });
}
