import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {servicePayment} from './services';

interface PaymentContextData {
  cards?: any;
  listCards(): Promise<void>;
}

const PaymentContext = createContext({} as PaymentContextData);
export const PaymentProvider = ({children}: any) => {
  const [cards, setCards] = useState([]);

  const listCards = useCallback(async () => {
    const response = await servicePayment.list();
    setCards(response.data.data);
    return response.data.data;
  }, []);
  const value = useMemo(() => ({cards, listCards}), [cards, listCards]);
  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
};
export const usePayment = () => {
  const context = useContext(PaymentContext);
  return context;
};
