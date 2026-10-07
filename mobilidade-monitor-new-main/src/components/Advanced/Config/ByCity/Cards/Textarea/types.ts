import { ConfigCitiesData } from "../../../../../../pages/Advanced/Configs/ConfigByCities/types";

export interface CardTextareaProps {
  item: ConfigCitiesData;
  onSearch: (value: string, attribute: string, inputType: string) => void;
}
