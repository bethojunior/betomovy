declare type AppProps = {
  id: number;
  customer_id: number;
  app_type_id: number;
  title: string;
  description: string;
  reference: string;
  version: string;
  branch: string;
  link: string;
  redirect: number;
  link_ios: string;
  apk_file: string;
  logo_picture: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  limit_downloads: any;
  store_certificate_id: number;
  is_sync_store: number;
  pre_logo_picture: string | null;
  pre_title: string | null;
  pre_description: string | null;
  short_description: string | null;
  pre_short_description: string | null;
  google_play_link: string;
  customer: {
    id: number;
    name: string;
    email: string | null;
    project_name: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  app_type: {
    id: number;
    name: string;
    version: string;
    created_at: string;
    updated_at: string;
  };
};

declare type InformationsAppsProps = {
  status: true;
  response: AppProps[];
  message: string;
};
