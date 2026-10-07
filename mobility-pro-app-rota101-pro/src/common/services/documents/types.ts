export type DocStatusId = '0' | '1' | '2' | '3' | '4';

export interface DocTypeConfig {
  docId: string;
  label: string;
  description?: string | null;
  pdf: '0' | '1';
  text: '0' | '1';
  image: '0' | '1';
}

export interface UserDocSubmission {
  docId: string;
  docStatusId?: string;
  docStatus?: string;
  image?: string | null;
  text?: string | null;
  pdf?: string | null;
}

export interface UploadFile {
  uri: string;
  type: string;
  name: string;
}

export interface DocumentListItem {
  docId: string;
  label: string;
  description?: string | null;
  docStatusId: DocStatusId;
  docStatus: string;
  hasDocument: boolean;
  image: string | null;
  text: string | null;
  pdf: string | null;
  config: Pick<DocTypeConfig, 'pdf' | 'text' | 'image'>;
}

export interface SendDocumentPayload {
  docId: string;
  text?: string | null;
  image?: UploadFile | null;
  pdf?: (UploadFile & { size?: string }) | null;
}

/**
 * Contrato único: getDocuments() SEMPRE retorna array (nunca false/undefined).
 * sendDocument() SEMPRE rejeita a Promise em qualquer falha (validação,
 * rede ou negócio) — nunca resolve silenciosamente em erro.
 */
export interface DocumentsRepository {
  getDocuments(): Promise<DocumentListItem[]>;
  sendDocument(payload: SendDocumentPayload): Promise<void>;
}
