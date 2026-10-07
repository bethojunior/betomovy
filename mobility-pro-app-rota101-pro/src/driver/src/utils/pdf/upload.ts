import * as DocumentPicker from 'expo-document-picker';

export async function uploadDocument(typeDocument: string) {
  const result = await DocumentPicker.getDocumentAsync({
    type: typeDocument,
  });

  return result;
}

export async function uploadImage() {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'image/*',
  });

  return result;
}
