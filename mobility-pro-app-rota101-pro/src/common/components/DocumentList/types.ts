import { ComponentType, ReactNode } from 'react';
import { DocumentsRepository, DocumentListItem } from '../../services/documents/types';

export interface DocumentListProps {
  repository: DocumentsRepository;
  Button: ComponentType<{ title: string; onPress: () => void; icon?: ReactNode }>;
  translate: (key: string, options?: any) => string;
  onSelectDocument: (item: DocumentListItem) => void;
  onGoBack: () => void;
  onContactSupport?: () => void;
}
