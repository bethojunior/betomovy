import {useAuth} from '../../../../context/auth';
import {useTripProvider} from '../../context/Trip';
import {useUserDriver} from '../../context/userDriver';
import {If} from '../If';
import {ModalDoorHandleManual} from '../ModalDoorHandleManual';
import {useModals} from '../../../../context/Modals';

export const DoorHandleComponent = ({setVisibleQrCode, visibleQrCode}) => {
  const {userDriverFind} = useUserDriver();
  const {cityConfig} = useAuth();
  const tripAccepted: any = useTripProvider(
    (context: any) => context.stateTrip.tripAccepted,
  );
  const {containerTaximeter} = useModals();

  return (
    <If
      condition={
        userDriverFind.status === 'disponivel' &&
        cityConfig?.enableKnobTrip === '1' &&
        tripAccepted &&
        Object.keys(tripAccepted).length === 0
      }
    >
      {/* Viagem Manual de Maçaneta direta sem necessidade de ler QR Code */}
      {!containerTaximeter && visibleQrCode && (
        <ModalDoorHandleManual
          setVisible={setVisibleQrCode}
          visible={visibleQrCode}
        />
      )}
    </If>
  );
};
