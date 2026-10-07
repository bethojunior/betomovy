export type ProfilePhotoEntityType = 'driver' | 'customer';

export interface ProfilePhotoEditModalProps {
  visible: boolean;
  onClose: () => void;
  entityType: ProfilePhotoEntityType;
  entityId: number;
  currentImageUrl?: string | null;
  onSuccess: () => void;
}

export interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}
