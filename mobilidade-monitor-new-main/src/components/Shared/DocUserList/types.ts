export interface DocUserListItem {
  id: number;
  label: string;
  description?: string;
  image?: string;
  pdf?: string;
  docStatus: string;
}

export interface DocUserStatusOption {
  id: number;
  name: string;
}

export interface DocUserListProps {
  documents: DocUserListItem[] | undefined;
  statusList: DocUserStatusOption[] | undefined;
  onDocumentsChanged: () => void;
  emptyMessage?: string;
}
