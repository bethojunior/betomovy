import { TripType } from '../../context/Trip/types';

export interface TripTypePickerModalProps {
  visible: boolean;
  tripTypes: TripType[];
  onSelect: (item: TripType) => void;
  onClose?: () => void;
}

export interface TripTypePickerContentProps {
  tripTypes: TripType[];
  selected: TripType | null;
  setSelected: (item: TripType) => void;
  tripTypeImageBaseUrl: string | null;
  onConfirm: () => void;
  onClose?: () => void;
}
