interface CustomerAppsProps {
  id: number;
  customer_id: number;
  app_type: string;
  title: string;
  main_color: string;
  secondary_color: string;
  text_color: string;
  logo_url: string;
}

declare type InformationsCustomerProps = {
  id: number;
  name: string;
  project_name: string;
  customer_apps: CustomerAppsProps[];
};
