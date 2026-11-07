import { AlertProps, SessionCitiesProps } from "../../../@types";

export interface driverTypeListProps {
  id: string | number;
  name: string;
}

export interface FilesProps {
  file: File;
  fileList: File[];
}

export interface FormProps {
  title: string;
  message: string;
  cityId: string | string[];
  link?: string;
  identifyUserInLink?: boolean;
  image?: FilesProps;
  userTypes: string[];
}

export interface NotificationModalProps {
  cities: SessionCitiesProps[];
  showModal: boolean;
  setShowModal: (res: boolean) => void;
  driverTypeList: driverTypeListProps[];
  setLoading: (val: boolean) => void;
  alertValues: (message: string, type: AlertProps) => void;
  getAllNotification: () => void;
}
