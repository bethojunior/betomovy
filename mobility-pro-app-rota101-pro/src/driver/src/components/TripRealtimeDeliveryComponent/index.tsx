import {ModalDeliveryCall} from '../ModalDeliveryCall';
import {TripRealtimeDeliverySocket} from '../TripRealtimeDeliverySocket';
import {ViewDeliveryTrip} from '../ViewDeliveryTrip';

export const TripRealtimeDeliveryComponent = () => {
  // Renderize algo se necessário ou retorne null se o componente não tiver UI
  return (
    <>
      <TripRealtimeDeliverySocket />
      <ModalDeliveryCall />
      <ViewDeliveryTrip />
    </>
  );
};
