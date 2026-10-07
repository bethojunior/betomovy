import { AlertType } from "../../../../pages/Delivery/Config/Establishments/types";
import { ListConfig } from "../../../../pages/Delivery/ConfigCall/types";

export interface CardProps {
  item: ListConfig;
  sendAlert: (message: string, type: AlertType) => void;
  setLoading: (val: boolean) => void;
}

export interface InputProps {
  width: string;
}
