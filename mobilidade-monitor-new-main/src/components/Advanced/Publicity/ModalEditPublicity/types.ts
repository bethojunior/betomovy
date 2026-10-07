export interface ModalEditPublicityProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  publicityId: number | null;
  onSuccess: () => void;
}

export interface CompaniesProps {
  address: string | null;
  balance: {
    idBalance: number;
    tripBalance: number;
  };
  balanceId: number;
  billingDay: number;
  cityId: number;
  companyRegisterStatusId: number;
  company_register_status: {
    id: number;
    name: string;
  };
  created_at: Date;
  document: string;
  email: string;
  establishmentCollectionManagementId: null | string | number;
  facebook: string | null;
  fantasyName: string;
  id: number;
  instagram: string | null;
  latitude: number | null;
  logo_picture: string | null;
  longitude: number | null;
  name: string;
  observation: string | null;
  phone: string;
  registration: string | null;
  site: string | null;
  updated_at: Date;
  voucherLimit: number | null;
}

export interface GenderProps {
  id: number;
  name: string;
}

export interface AppProps {
  idApp: number;
  name: string;
}

export interface AdvertisingAppSiteProps {
  id: number;
  name: string;
}


