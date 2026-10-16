import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export async function resizeImage(uri: string, width: number, height: number) {
  try {
    return await manipulateAsync(
      uri,
      [{ resize: { width, height } }],
      { compress: 0.7, format: SaveFormat.JPEG }
    );
  } catch (error) {
    console.warn('resizeImage error, falling back to original uri:', error);
    return { uri, width, height };
  }
}

