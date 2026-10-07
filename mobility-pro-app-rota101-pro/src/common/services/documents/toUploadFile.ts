import { UploadFile } from './types';

/** Normaliza uma URI local pra um arquivo de upload válido ({uri,type,name}) — nunca uma string crua. */
export function toUploadFile(uri: string, fallbackName: string, mimeType: string): UploadFile {
  const name = uri.split('/').pop() || fallbackName;
  return { uri, name, type: mimeType };
}
