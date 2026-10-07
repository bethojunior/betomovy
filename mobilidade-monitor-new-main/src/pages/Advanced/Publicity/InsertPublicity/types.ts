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
  facebook: any;
  fantasyName: string;
  id: number;
  instagram: any;
  latitude: any;
  logo_picture: any;
  longitude: any;
  name: string;
  observation: any;
  phone: string;
  registration: any;
  site: any;
  updated_at: Date;
  voucherLimit: any;
}

export interface GenderProps {
  id: number;
  name: string;
}

export interface AppProps {
  idApp: number;
  name: string;
}

export interface AdvertsingAppSiteProps {
  id: number;
  name: string;
}
