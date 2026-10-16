import {LocalProvider} from '../contexts/local';
import {OrderServiceProvider} from '../contexts/orderService';
import {PaymentFormProvider} from '../contexts/paymentForms';
import {TravelProvider} from '../contexts/travel';
import {FavoriteProvider} from '../contexts/favorite';
import {UserIndicationProvider} from '../contexts/userIndication';
import {ReceiptProvider} from '../contexts/Receipt';
import {TransferenceProvider} from '../contexts/Transference';
import {PanicProvider} from '../contexts/Panic';
import {MenuProvider} from '../contexts/menu';
import {MapProvider} from '../contexts/Map';
import {LocationUpdater} from '../components/LocationUpdater';
import { PropsWithChildren } from 'react';

export const AppProvider = ({children}: PropsWithChildren) => (
  <MenuProvider>
    <LocalProvider>
      <OrderServiceProvider>
        <PaymentFormProvider>
          <FavoriteProvider>
            <UserIndicationProvider>
              <ReceiptProvider>
                <TravelProvider>
                  <TransferenceProvider>
                    <PanicProvider>
                      <MapProvider>
                        <LocationUpdater />
                        {children}
                      </MapProvider>
                    </PanicProvider>
                  </TransferenceProvider>
                </TravelProvider>
              </ReceiptProvider>
            </UserIndicationProvider>
          </FavoriteProvider>
        </PaymentFormProvider>
      </OrderServiceProvider>
    </LocalProvider>
  </MenuProvider>
);
