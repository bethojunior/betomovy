import type { SelectedMonitoringArea } from "src/@types";

export interface HelpersProps {
  created_at: string;
  id: number;
  title: string;
  updated_at: string;
  url_application: string;
  url_video: string;
  url_redirect: string;
}

export interface NotificationProps {
  adminNotificationTypeId: number;
  cityId: number;
  created_at: string;
  driver: {
    idDriver: number;
    last_lat: string;
    last_lon: string;
    status: string;
    userId: number;
  };
  emergencyMonitoringTypeId: null;
  emergency_monitoring_type: null | {
    id: number;
    name: string;
    statusId: number;
  };
  id: number;
  ip: string;
  lat: null;
  lng: null;
  message: string;
  picture: null;
  read: number;
  readById: null;
  title: string;
  tripReference: null;
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
  views: [];
}

export interface User {
  idUser: number;
  name: string;
  phone: string;
  email: string;
  profileImage: string;
}

export interface Driver {
  idDriver: number;
  userId: number;
  last_lat: string;
  last_lon: string;
  status: string;
}

export interface UserGroup {
  id: number;
  name: string;
  statusId: number;
  created_at: string;
  updated_at: string;
}

export interface EmergencyMonitoringType {
  id: number;
  name: string;
  statusId: number;
}

export interface PanicNotificationType {
  id: number;
  adminNotificationTypeId: number;
  userGroupId: number;
  title: string;
  message: string;
  picture: string;
  userId: number;
  ip: string;
  lat: string;
  lng: string;
  read: number;
  readById: number | null;
  tripReference: string | null;
  emergencyMonitoringTypeId: number;
  created_at: string;
  updated_at: string;
  cityId: number;
  user: User;
  driver: Driver;
  views: any[];
  user_group: UserGroup;
  emergency_monitoring_type: EmergencyMonitoringType;
}

export interface SelectAndButtonNotificationProps {
  selectedArea?: SelectedMonitoringArea | null;
  onClearArea?: () => void;
  /**
   * Layout em duas linhas para o grid do navbar mobile em Monitoring:
   * sino na 1ª linha; select de cidade em largura total na 2ª (nome longo com ellipsis).
   */
  monitoringMobileNavGrid?: boolean;
}
