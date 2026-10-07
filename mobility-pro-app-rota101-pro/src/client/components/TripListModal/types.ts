import { TripProps } from "../../contexts/Trip/types";

export interface TripListModalProps {
  trips: TripProps[];
  visible: boolean;
  setVisible: (val: boolean) => void;
}