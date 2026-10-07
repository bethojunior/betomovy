import {createContext, useContext, useState} from 'react';
import {ModalsContextProps} from './types';

const ModalsContext = createContext({} as ModalsContextProps);

export const ModalsProvider = ({children}) => {
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [containerTaximeter, setContainerTaximeter] = useState(false);

  return (
    <ModalsContext.Provider
      value={{
        setVisibleMenu,
        visibleMenu,
        containerTaximeter,
        setContainerTaximeter,
      }}
    >
      {children}
    </ModalsContext.Provider>
  );
};

export const useModals = () => {
  const context = useContext(ModalsContext);
  if (context === undefined) {
    throw new Error('ModalsProvider not found');
  }
  return context;
};
