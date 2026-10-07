import {
  IConfigAppPartnersProps,
  IUserTypePartnerLinkedProps,
} from "../../Modal/TripType/types";

export interface TypeDriver {
  idUserType: number;
  name: string;
  vehicleType?: string | null;
}

export interface Driver {
  description: string;
  iconMapDriverId: number;
  acceptedText?: string;
  boardingText?: string;
  inProgressText?: string;
  cancellationText?: string;
  idUserType: number;
  isActive: number;
  isDeliveryMan: number;
  isDriver: number;
  name: string;
  picture: string;
  user_type_linked_app_partner?: IUserTypePartnerLinkedProps[];
  vehicleType?: string | null;
}

export interface Icon {
  id: number;
  link: string;
  statusId: number;
}

export interface ITypeDriverProps {
  optionsAppPartners: IConfigAppPartnersProps[];
}

export interface IDeleteDriverTypeResponse {
  message?: string;
  response?: string[];
}
