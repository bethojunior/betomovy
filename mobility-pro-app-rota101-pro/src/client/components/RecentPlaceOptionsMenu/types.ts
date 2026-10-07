export interface RecentPlaceOptionsMenuProps {
  visible: boolean;
  address: string | null;
  isFavorite?: boolean;
  onRequestClose: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
}
