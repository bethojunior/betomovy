declare type CompanyProps = {
  address: string;
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
  created_at: string;
  document: string;
  email: string | null;
  establishmentCollectionManagementId: number | string | null;
  facebook: string | null;
  fantasyName: string;
  id: number;
  instagram: any;
  latitude: any;
  logo_picture: any;
  longitude: any;
  name: string;
  observation: string;
  phone: string;
  registration: string;
  site: string;
  updated_at: string;
  voucherLimit: number;
};
