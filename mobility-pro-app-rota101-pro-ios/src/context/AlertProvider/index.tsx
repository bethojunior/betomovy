import React, {createContext, useContext, useState, ReactNode} from 'react';
import {SwalAlert} from '../../client/components/SwalAlert';

interface AlertContextData {
  showAlert: (
    title: string,
    description: string,
    callBack?: () => void,
    textButton?: string,
    children?: ReactNode,
    closeButton?: boolean,
  ) => void;
}

const AlertContext = createContext<AlertContextData>({} as AlertContextData);

export const AlertProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [alertData, setAlertData] = useState<{
    title: string;
    description: string;
    callBack?: () => void;
    textButton?: string;
    children?: ReactNode;
    closeButton?: boolean;
  } | null>(null);

  const showAlert = (
    title: string,
    description: string,
    callBack?: () => void,
    textButton?: string,
    children?: ReactNode,
    closeButton?: boolean,
  ) => {
    setAlertData({
      title,
      description,
      callBack,
      textButton,
      children,
      closeButton,
    });
  };

  const handleClose = () => {
    setAlertData(null);
  };

  return (
    <AlertContext.Provider value={{showAlert}}>
      {children}
      {alertData && (
        <SwalAlert
          title={alertData.title}
          description={alertData.description}
          callBack={() => {
            handleClose();
            alertData.callBack && alertData.callBack();
          }}
          setVisible={handleClose}
          closeButton={alertData.closeButton}
          textButton={alertData.textButton}
          visible={!!alertData}
        >
          {alertData.children}
        </SwalAlert>
      )}
    </AlertContext.Provider>
  );
};

export function useAlert(): AlertContextData {
  return useContext(AlertContext);
}
