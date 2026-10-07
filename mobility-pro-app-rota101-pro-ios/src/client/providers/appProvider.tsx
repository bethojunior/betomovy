import {LocalProvider} from '../contexts/local';
import {OrderServiceProvider} from '../contexts/orderService';
import {PaymentFormProvider} from '../contexts/paymentForms';
import {PublicityProvider} from '../contexts/publicity';
import {TravelProvider} from '../contexts/travel';
import {FavoriteProvider} from '../contexts/favorite';
import {UserIndicationProvider} from '../contexts/userIndication';
import {ReceiptProvider} from '../contexts/Receipt';
import {TransferenceProvider} from '../contexts/Transference';
import {PanicProvider} from '../contexts/Panic';
import {MenuProvider} from '../contexts/menu';
import {MapProvider} from '../contexts/Map';

export const AppProvider = ({children}: ChildrenType) => (
  <MenuProvider>
    <LocalProvider>
      <OrderServiceProvider>
        <PaymentFormProvider>
          <FavoriteProvider>
            <UserIndicationProvider>
              <ReceiptProvider>
                <TravelProvider>
                  <PublicityProvider>
                    <TransferenceProvider>
                      <PanicProvider>
                        <MapProvider>{children}</MapProvider>
                      </PanicProvider>
                    </TransferenceProvider>
                  </PublicityProvider>
                </TravelProvider>
              </ReceiptProvider>
            </UserIndicationProvider>
          </FavoriteProvider>
        </PaymentFormProvider>
      </OrderServiceProvider>
    </LocalProvider>
  </MenuProvider>
);
