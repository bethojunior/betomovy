export interface AdminNotificationProps {
  adminNotificationTypeId: number;
  cityId: string | number | null;
  conversation: any;
  created_at: string;
  driver: {
    idDriver: number;
    last_lat: string;
    last_lon: string;
    status: string;
    userId: number;
  };
  emergencyMonitoringTypeId: string | number | null;
  emergency_monitoring_type: any;
  id: number;
  ip: string;
  lat: any;
  lng: any;
  message: string;
  offendedTypeId: string | number | null;
  picture: any;
  read: number;
  readById: string | number | null;
  tagTypeId: string | number | null;
  title: string;
  tripReference: string | null;
  updated_at: string;
  user: {
    email: string;
    idUser: number;
    name: string;
    phone: string;
    profileImage: string;
  };
  userGroupId: number;
  userId: number;
  user_group: {
    created_at: string;
    id: number;
    name: string;
    statusId: number;
    updated_at: string;
  };
  views: any;
}

export interface TypesNotificationsProps {
  defaultMessage: string;
  id: number;
  name: string;
  notifiable: number;
}
