import {createContext, useContext, useMemo, useState} from 'react';
import {DeliveryOrderContextProps, OrderProps} from './types';

const DeliveryOrderContext = createContext({} as DeliveryOrderContextProps);
export const DeliveryOrderProvider = ({children}) => {
  const [orderTrip, setOrderTrip] = useState<OrderProps>({} as OrderProps);

  const [ordersActive, setOrdersActive] = useState<OrderProps[]>(
    [] as OrderProps[],
  );

  const value = useMemo(() => {
    return {
      orderTrip,
      setOrderTrip,
      ordersActive,
      setOrdersActive,
    };
  }, [orderTrip, ordersActive]);
  return (
    <DeliveryOrderContext.Provider value={value}>
      {children}
    </DeliveryOrderContext.Provider>
  );
};
export const useDeliveryOrder = () => {
  const context = useContext(DeliveryOrderContext);
  return context;
};
