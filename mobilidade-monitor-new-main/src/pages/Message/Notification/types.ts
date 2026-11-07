import { AlertProps } from "../../../@types";

export interface NotificationUserTypesProps {
  id?: number;
  idUserType?: number;
  userTypeId?: number;
  notificationId?: number;
  userType?: string;
  name?: string;
}

export interface NotificationListProps {
  idNotification: number;
  title: string;
  message: string;
  link?: string | null;
  image?: string | null;
  cityId?: string | number | null;
  identifyUserInLink?: number;
  created_at?: string | Date;
  date?: string;
  dateSend?: string;
  notification_user_types?: NotificationUserTypesProps[];
  city?: {
    id?: number;
    nome?: string;
    shortName?: string;
    estado?: number;
  };
  [key: string]: any;
}

export interface TypesDriversProps {
  idUserType: number;
  name: string;
  isDriver?: number;
  picture?: string;
}

export interface NotificationTableProps {
  notificationList: NotificationListProps[];
  alertValues: (message: string, type: AlertProps) => void;
  setLoading: (val: boolean) => void;
  currentPage: number;
  totalItems: number;
  pageSize: number;
  getAllNotification: (val: number) => void;
  onOpenCreateModal: () => void;
}
