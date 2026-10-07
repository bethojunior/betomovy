import { ICallGroupProps } from "src/pages/Advanced/Configs/CallGroup/ListCallGroups/types";
export interface TripTypeCategoryVisibility {
  canShowCentralTripCategory: boolean;
  canShowServicosTripCategory: boolean;
}
export interface Gender {
  id: number;
  name: string;
}

export interface IConfigAppPartnersProps {
  created_at: string;
  id: number;
  key: string;
  logo_app: string;
  name_app: string;
  primary_color: string;
  secondary_color: string;
  text_color: string;
  updated_at: string;
}

export interface ITripTypePartnerLinkedProps {
  config_apps_partners_id: number;
  created_at: string;
  id: number;
  tripTypePartnerId: number;
  updated_at: string;
  config_app_partners: IConfigAppPartnersProps;
}

export interface IUserTypePartnerLinkedProps {
  config_apps_partners_id: number;
  created_at: string;
  id: number;
  updated_at: string;
  userTypeId: number;
  config_app_partners: IConfigAppPartnersProps;
}

export type CallGroupsTripTypeLinked = {
  call_group_id: number;
  call_groups: ICallGroupProps;
  created_at: string;
  id: number;
  tripTypeId: number;
  updated_at: string; 
}

export type TripTypeModalFormImageInput = {
  target: {
    files: FileList;
  };
};

export interface TripTypeModalFormValues {
  category: string[];
  description: string;
  gender: string | number;
  image: string | TripTypeModalFormImageInput;
  messageNoDriversFound: string;
  type: string;
}

export function isTripTypeModalFileImage(
  image: TripTypeModalFormValues["image"]
): image is TripTypeModalFormImageInput {
  return (
    typeof image === "object" &&
    image !== null &&
    "target" in image &&
    image.target.files instanceof FileList
  );
}

export interface TripTypeModalTripEntity {
  deliveryOption: number;
  description: string;
  freightOption: number;
  gender: {
    id: number;
    name: string;
  };
  gender_id: number;
  idTripType: number;
  messageNoDriversFound: string;
  onlyCentral: number;
  picture: string;
  returnOption: number;
  showType: number;
  type: string;
  openPrice: number;
  offerOption: number;
  serviceOption: number;
  loopingOption: number;
  scheduledOnlyOption: number;
  call_groups_trip_type_linked?: CallGroupsTripTypeLinked[];
  trip_type_partner_linked?: ITripTypePartnerLinkedProps[];
}

export interface FormValues {
  category: [boolean | string];
  description: string;
  gender: number;
  image: {
    target: {
      files: [Blob];
    };
  };
  messageNoDriversFound: string;
  type: string;
  appsPartners?: string[];
}

export type ApiErrorResponse = {
  response?: {
    data?: {
      message?: string;
      response?: string[];
    };
  };
};

export interface IEditTripTypeModalProps {
  visibility: boolean;
  setVisibility(visibility: boolean): void;
  loadInformations: () => void;
  titleModal: string;
  //tripTypeSelected: TripType | undefined;
  typeModal: string;
  gender: Gender[];
  optionsAppPartners: IConfigAppPartnersProps[];
  tripTypeSelected: TripTypeModalTripEntity | undefined;
  callGroups: ICallGroupProps[];
}
