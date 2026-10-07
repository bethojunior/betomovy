import {FavoriteProvider} from '../contexts/favorite';
import {PaymentProvider} from '../contexts/Payment';
import {TripProvider} from '../contexts/Trip';
import {TripGLProvider} from '../contexts/TripGL';

export const GetLightProvider = ({children}: any) => (
  <TripProvider>
    <TripGLProvider>
      <FavoriteProvider>
        <PaymentProvider>{children}</PaymentProvider>
      </FavoriteProvider>
    </TripGLProvider>
  </TripProvider>
);
