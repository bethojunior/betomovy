interface AdvertisingCustomersProps {
  advertising_id: number;
  created_at: string;
  customer_id: number;
  id: number;
  updated_at: string;
}

interface AdvertisingVideosProps {
  advertising_id: 11;
  created_at: string;
  id: number;
  link: string;
  updated_at: string;
}

declare type PublicityProps = {
  advertising_customers: AdvertisingCustomersProps[];
  advertising_videos: AdvertisingVideosProps[];
  banner_link: string;
  created_at: string;
  description: string;
  enabled: number;
  id: number;
  link: string;
  phone: string;
  title: string;
  updated_at: string;
};
