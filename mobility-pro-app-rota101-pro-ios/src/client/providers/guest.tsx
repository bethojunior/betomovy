import {LocalProvider} from '../contexts/local';
import {OrderServiceProvider} from '../contexts/orderService';
import {MapProvider} from '../contexts/Map';
import { PropsWithChildren } from 'react';

export const GuestProvider = ({children}: PropsWithChildren) => (
  <LocalProvider>
    <OrderServiceProvider>
      <MapProvider>
        {children}
      </MapProvider>
    </OrderServiceProvider>
  </LocalProvider>
);
