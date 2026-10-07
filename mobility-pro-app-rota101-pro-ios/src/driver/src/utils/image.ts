import * as ImageManipulator from 'expo-image-manipulator';

export async function resizeImage(uri: string, width: number, height: number) {
  const manipResult = await ImageManipulator.manipulateAsync(
    uri,
    [{resize: {width, height}}],
    {compress: 1, format: ImageManipulator.SaveFormat.PNG},
  );

  return manipResult;
}
