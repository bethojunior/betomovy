import { Data } from "../../../../pages/Client/Legal/type";

export interface LegalCardProps {
  data: Data;
  menu: (res: Data) => JSX.Element;
  whatsAppMessageProps: string;
}

export interface UserInformationData {
  profileImage: string;
  name: string;
  document: string;
  email: string;
  gender: string;
  phone: string;
  rg: string;
  status: string;
  quantityTripsFinished: number;
  voucherBalance: number;
  city: string;
}
