import {useState} from 'react';
import {useAuth} from '../../../../context/auth';
import {useTripProvider} from '../../context/Trip';
import {useUserDriver} from '../../context/userDriver';
import {If} from '../If';
import {ModalDoorHandle} from '../ModalDoorHandle';
import {ModalDoorHandleManual} from '../ModalDoorHandleManual';
import {useModals} from '../../../../context/Modals';

export const DoorHandleComponent = ({setVisibleQrCode, visibleQrCode}) => {
  const {userDriverFind} = useUserDriver();
  const {cityConfig} = useAuth();
  const tripAccepted: any = useTripProvider(
    (context: any) => context.stateTrip.tripAccepted,
  );
  const {containerTaximeter} = useModals();
  const [modalManual, setModalManual] = useState(false);

  return (
    <If
      condition={
        userDriverFind.status === 'disponivel' &&
        cityConfig?.enableKnobTrip === '1' &&
        tripAccepted &&
        Object.keys(tripAccepted).length === 0
      }
    >
      {/* Objetos da Macaneta */}
      {!containerTaximeter && (
        <>
          {/* SE O MÓDULO SPEEDMOB NÃO ESTIVER ATIVADO CAI NESSA CONDIÇÃO AQUI */}
          <ModalDoorHandle
            setVisible={setVisibleQrCode}
            visible={visibleQrCode}
            setVisibleManual={setModalManual}
          />
          {modalManual && (
            <ModalDoorHandleManual
              setVisible={setModalManual}
              visible={modalManual}
            />
          )}
        </>
      )}
    </If>
  );
};
