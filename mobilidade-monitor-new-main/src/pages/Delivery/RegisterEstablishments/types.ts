export interface EstablishmentsProps {
  id: number;
  companyId: number;
  releaseMenu: number;
  releaseDelivery: number;
  picture: string;
  enableNotificationEmailDelivery: number;
  monthlyValue: number;
  chargeFixedValue: number;
  chargePercentageValue: number;
  deliveryRating: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  company: {
    id: number;
    name: string;
    fantasyName: string;
    address: string;
    document: string;
    cityId: number;
    email: string;
    phone: string;
    voucherLimit: number;
    latitude: string;
    longitude: string;
    site: string;
    instagram: string;
    billingDay: number;
    facebook: string;
    logo_picture: string;
    balanceId: number;
    companyRegisterStatusId: number;
    created_at: string;
    updated_at: string;
    establishmentCollectionManagementId: number;
    registration: string;
    observation: string;
    establishmentCollectionManagement: string;
  };
}

export interface PerfilProps {
  created_at: Date;
  fixedValue: number;
  id: number;
  label: string;
  orderPercentage: number;
  orderValue: number;
  statusId: number;
  updated_at: Date;
}

export interface FantasyNameProps {
  id: number;
  name: string;
  fantasyName: string;
  address: string;
  document: string;
  cityId: number;
  email: string;
  phone: string;
  voucherLimit: number;
  latitude: string;
  longitude: string;
  site: string;
  instagram: string;
  billingDay: number;
  facebook: string;
  logo_picture: string;
  balanceId: number;
  companyRegisterStatusId: number;
  created_at: string;
  updated_at: string;
  establishmentCollectionManagementId: number;
  registration: string;
  observation: string;
  company_register_status: {
    id: number;
    name: string;
  };
  balance: {
    idBalance: number;
    tripBalance: number;
  };
}

export interface SelectProps {
  value: number;
  label: string;
}

export interface OnSaveProps {
  companyId: string;
  releaseDelivery: boolean;
  releaseMenu: boolean;
  perfil: string;
  picture: {
    file: Blob;
    fileList: Blob[];
  };
}

export interface Listlocals {
  companyId: number;
  id: number;
  isDefault: number;
  address: string;
  latitude: string;
  longitude: string;
  created_at: Date;
  deleted_at: Date;
  updated_at: Date;
}
