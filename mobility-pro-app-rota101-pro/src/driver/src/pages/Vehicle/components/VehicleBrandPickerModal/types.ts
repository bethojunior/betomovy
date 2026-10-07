import { VehicleBrandIcon } from '../../../../constants/vehicleBrands';

export interface VehicleBrandPickerModalProps {
  visible: boolean;
  onSelect: (brand: string) => void;
  onSelectOther: () => void;
  onClose: () => void;
}

export interface BrandListItem {
  key: string;
  label: string;
  icon: VehicleBrandIcon | null;
  isOtherOption: boolean;
}
