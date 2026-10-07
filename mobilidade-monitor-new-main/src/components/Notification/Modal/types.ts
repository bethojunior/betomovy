import { SetStateAction, Dispatch } from "react";
import { NotificationProps } from "../CitiesAndNotifications/types";

export interface RequestNotificationsProps {
  notificationRequestProps: () => Promise<void>;
  listNotificationsProps: NotificationProps[];
  setListNotificationsProps: Dispatch<SetStateAction<NotificationProps[]>>;
  currentPageProps: number;
  setCurrentPageProps: (res: number) => void;
  nextPageProps: null | "";
  setNextPageProps: (res: SetStateAction<null>) => void;
}
