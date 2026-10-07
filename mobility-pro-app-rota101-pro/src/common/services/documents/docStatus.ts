import { DocStatusId } from './types';
import { StatusVariant } from '../../theme/statusVariantColors';

interface DocStatusInfo {
  variant: StatusVariant;
  icon: string;
  labelKey: string;
  descriptionKey: string;
}

export const DOC_STATUS_MAP: Record<DocStatusId, DocStatusInfo> = {
  '0': {
    variant: 'primary',
    icon: 'file-plus-outline',
    labelKey: 'documents.status_not_sent',
    descriptionKey: 'documents.description_not_sent',
  },
  '1': {
    variant: 'success',
    icon: 'file-check-outline',
    labelKey: 'documents.status_approved',
    descriptionKey: 'documents.description_approved',
  },
  '2': {
    variant: 'warning',
    icon: 'file-clock-outline',
    labelKey: 'documents.status_in_review',
    descriptionKey: 'documents.description_in_review',
  },
  '3': {
    variant: 'error',
    icon: 'file-cancel-outline',
    labelKey: 'documents.status_rejected',
    descriptionKey: 'documents.description_rejected',
  },
  // status 4 não tem constante formal no backend (só existe hoje na UI do client) —
  // tratado como neutro até confirmação de semântica com produto/backend.
  '4': {
    variant: 'neutral',
    icon: 'file-search-outline',
    labelKey: 'documents.status_additional_review',
    descriptionKey: 'documents.description_additional_review',
  },
};

export function resolveDocStatusInfo(statusId: DocStatusId): DocStatusInfo {
  return DOC_STATUS_MAP[statusId] ?? DOC_STATUS_MAP['0'];
}
