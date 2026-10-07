export interface DocumentPreviewModalDocument {
  name: string;
  image?: string | null;
  text?: string | null;
  pdf?: string | null;
}

export interface DocumentPreviewModalProps {
  visible: boolean;
  onClose: () => void;
  document: DocumentPreviewModalDocument;
  onEdit: () => void;
}
