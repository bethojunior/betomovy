import { DocumentListItem } from '../../services/documents/types';

export interface ItemDocumentProps
  extends Pick<DocumentListItem, 'label' | 'docStatusId' | 'docStatus' | 'hasDocument' | 'image' | 'text' | 'pdf'> {
  loading?: boolean;
  onPress: () => void;
  testID?: string;
  /** Esconde o divisor de baixo — usado no último item de uma lista dentro de um card. */
  isLast?: boolean;
}
