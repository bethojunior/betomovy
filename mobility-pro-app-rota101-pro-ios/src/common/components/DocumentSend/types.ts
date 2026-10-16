import { ComponentType, ReactNode } from 'react';
import { Control } from 'react-hook-form';
import { AnyObjectSchema } from 'yup';
import { UploadFile, SendDocumentPayload } from '../../services/documents/types';

interface DocumentFormData {
  document: string;
}

export interface DocumentSendUiKit {
  Button: ComponentType<{ title: string; onPress: () => void; enabled?: boolean; loading?: boolean }>;
  Input: ComponentType<{ name: string; control: Control<DocumentFormData>; error?: string; placeholder: string }>;
  InputContainer: ComponentType<{ label: string; children: ReactNode }>;
  CapturePicture: ComponentType<{ savePicture: (photo: UploadFile) => void; setVisibleCamera: (visible: boolean) => void }>;
}

export interface DocumentSendFileHandlers {
  validateFileSize: (size: number, type: 'image' | 'pdf') => { isValid: boolean; limitMB?: number };
  sanitizeFilename: (filename: string, fallback?: string) => string;
  getMimeType: (filename: string, defaultType?: string) => string;
  resizeImage: (uri: string, width: number, height: number) => Promise<{ uri: string }>;
}

export interface DocumentSendProps {
  route: {
    params: {
      doc: { docId: string; label: string; text?: string | null; hasDocument?: boolean };
      docConfig: { text: string; pdf: string; image: string };
    };
  };
  uiKit: DocumentSendUiKit;
  fileHandlers: DocumentSendFileHandlers;
  schema: AnyObjectSchema;
  sendDocument: (payload: SendDocumentPayload) => Promise<void>;
  translate: (key: string, options?: any) => string;
  customToast: (message: string, type: 'success' | 'danger' | 'warning') => void;
  onDocumentSent?: () => void;
}
