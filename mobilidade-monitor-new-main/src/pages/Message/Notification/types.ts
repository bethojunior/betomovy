import { AlertProps } from "../../../@types";

export interface NotificationUserTypesProps {
    id: number;
    idUserType: number;
    notificationId: number;
    userType: string;
}

export interface NotificationListProps {
    city: {
        estado: number;
        id: number;
        nome: string;
        shortName: string;
      };
      cityId: number;
      created_at: Date;
      date: string;
      dateSend: string;
      idNotification: number;
      identifyUserInLink: number;
      image:string;
      link: string;
      message: string;
      notificationTypeId: number;
      notification_user_types: NotificationUserTypesProps[];
      statusId: number;
      title: string;
      userIdAdministrator: number;
      userTypeId: number;
      usersId: number;
}

export interface TypesDriversProps   {
    idUserType: number
    name: string;
    isDriver: number;
    picture:string;
}

export interface NotificationTableProps {
    notificationList: NotificationListProps[];
    alertValues: (message: string, type: AlertProps) => void;
    setLoading: (val: boolean) => void;
    currentPage: number;
    getAllNotification: (val: number) => void;
  }