export interface AppsPartnersProps {
  id: number;
  key: string;
  name_app: string;
  phone_support: string;
  logo_app: string;
  primary_color: string;
  secondary_color: string;
  text_color: string;
  created_at: string;
  updated_at: string;
}
export interface IRequestContactsProps {
  config_apps_partners_id: number;
  id_person: string;
  name_person: string;
  phone_person: string;
}

export interface ObjectThemeAppPartnerProps {
  primary_color: string;
  secondary_color: string;
  text_color: string;
  logo: string;
  key: string;
  name: string;
  id: string;
  phone_support: string | null;
}

export interface SelectAppPartnersProps {
  visibleAppPartners: boolean;
  appsPartners: AppsPartnersProps[];
  loading: boolean;
}
