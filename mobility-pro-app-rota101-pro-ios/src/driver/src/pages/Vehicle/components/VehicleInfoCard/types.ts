import { VehicleProps } from '../../../../context/Vehicle/types';

export interface VehicleInfoCardProps {
  car: VehicleProps;
  editable: boolean;
  onChangeField: (field: keyof VehicleProps, value: string) => void;
  scrollToRow: (rowRef: React.RefObject<any>) => void;
}

export type VehicleFieldKey = Exclude<keyof VehicleProps, 'driverId'>;
