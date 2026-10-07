import { UploadFile } from '../../services/documents/types';

export interface DocumentUploadZoneProps {
  file: UploadFile | null;
  onOpenCamera?: () => void;
  onOpenGallery?: () => void;
  onOpenFilePicker?: () => void;
  onRemove: () => void;
  loading?: boolean;
  translate: (key: string, options?: any) => string;
  /** Sobrescreve o título padrão — usado quando o documento tem mais de uma zona de upload (ex.: PDF e foto separados). */
  title?: string;
}
