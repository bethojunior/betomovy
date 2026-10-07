import {BankProvider} from './bank';
import {ConfigProvider} from './Config';
import {ConfigLocalProvider} from './ConfigLocal';
import LocalProvider from './local';
import {MenuProvider} from './menu';
import {MyTravelProvider} from './MyTravel';
import {PanicProvider} from './Panic';
import {PaymentFormProvider} from './paymentForms';
import {PrepaidProvider} from './prepaid';
import {PublicityProvider} from './publicity';
import {RoutesProvider} from './Route';
import {RouteTraveledProvider} from './RouteTraveled';
import {StationReturnProvider} from './StationReturn';
import {TaximeterProvider} from './Taximeter';
import TripProvider from './Trip';
import UserDriverProvider from './userDriver';
import {VehicleProvider} from './Vehicle';
import {ZoneDynamicProvider} from './ZoneDynamic';

interface IAppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({children}: IAppProviderProps) => (
  <UserDriverProvider>
    <MenuProvider>
      <BankProvider>
        <PaymentFormProvider>
          <ConfigLocalProvider>
            <LocalProvider>
              <TripProvider>
                <VehicleProvider>
                  <StationReturnProvider>
                    <PanicProvider>
                      <MyTravelProvider>
                        <PrepaidProvider>
                          <ZoneDynamicProvider>
                            <ConfigProvider>
                              <RoutesProvider>
                                <TaximeterProvider>
                                  <PublicityProvider>
                                    {children}
                                  </PublicityProvider>
                                </TaximeterProvider>
                              </RoutesProvider>
                            </ConfigProvider>
                          </ZoneDynamicProvider>
                        </PrepaidProvider>
                      </MyTravelProvider>
                    </PanicProvider>
                  </StationReturnProvider>
                </VehicleProvider>
              </TripProvider>
            </LocalProvider>
          </ConfigLocalProvider>
        </PaymentFormProvider>
      </BankProvider>
    </MenuProvider>
  </UserDriverProvider>
);
