import {DeliveryOrderProvider} from '../../../../context/DeliveryOrder';
import {TripRealtimeDeliveryComponent} from '../TripRealtimeDeliveryComponent';

export const TripRealtimeDelivery = () => {
  return (
    <DeliveryOrderProvider>
      <TripRealtimeDeliveryComponent />
    </DeliveryOrderProvider>
  );
};
