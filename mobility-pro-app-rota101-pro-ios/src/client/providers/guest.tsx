import {LocalProvider} from '../contexts/local';
import {OrderServiceProvider} from '../contexts/orderService';

export const GuestProvider = ({children}: any) => (
  <LocalProvider>
    <OrderServiceProvider>{children}</OrderServiceProvider>
  </LocalProvider>
);
