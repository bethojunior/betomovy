export interface PublicityProps {
  advertisingAppSiteId: number;
  amountOfTime: number;
  advertising_app_site: {
    id: number;
    name: string;
  };
  app: {
    idApp: number;
    name: string;
  };
  appId: number;
  banner: string;
  city: {
    cityName: string;
    id: number;
  };
  cityId: number;
  company: {
    document: string;
    fantasyName: string;
    id: number;
    name: string;
  };
  companyId: number;
  created_at: Date;
  dateEnd: string;
  dateStart: string;
  description: number;
  displayOrder?: number;
  emailInformation: string;
  emailRedirect: string;
  gender: {
    id: number;
    name: string;
  };
  genderId: number;
  id: number;
  link: string;
  statusId: number;
  thumbnail: string;
  updated_at: string;
}
