import { createContext, useState } from "react";
import { ChildrenTypeProps } from "../@types";
import { NotificationData } from "../@types/context";

const NotificationContext = createContext<NotificationData>(
  {} as NotificationData
);

export const NotificationContextProvider = ({
  children,
}: ChildrenTypeProps) => {
  const [showNotification, setShowNotification] = useState(false);

  function handleShowNotifications(active: boolean) {
    setShowNotification(active);
  }

  return (
    <NotificationContext.Provider
      value={{ active: showNotification, handleShowNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
