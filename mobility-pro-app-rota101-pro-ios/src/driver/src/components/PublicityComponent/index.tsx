import {View} from 'react-native';
import {useModules} from '../../../../client/contexts/modules';
import {useAuth} from '../../../../context/auth';
import {useTripProvider} from '../../context/Trip';
import {usePublicity} from '../../context/publicity';
import {useUserDriver} from '../../context/userDriver';
import {
  ContainerCardPublicity,
  ContainerPublicityAndDoorHandle,
} from '../../pages/Home/styles';
import {ButtonDoorHandle} from '../ButtonDoorHandle';
import CardPublicity from '../CardPublicty';
import {If} from '../If';

export const PublicityComponent = ({
  countTrip,
  setVisibleQrCode,
  visibleQrCode,
}) => {
  const {userDriverFind} = useUserDriver();
  const {
    cityConfig,
    isNegativate,
    setVisibleNegativateModal,
    visibleNegativateModal,
  } = useAuth();
  const {hasPublicity} = usePublicity();
  const {stateTrip} = useTripProvider();
  const {init} = useModules();
  const {tripAccepted} = stateTrip;

  if (
    userDriverFind.status === 'disponivel' &&
    cityConfig?.enableKnobTrip === '1' &&
    tripAccepted &&
    Object.keys(tripAccepted).length === 0 &&
    userDriverFind?.isDeliveryMan === '0'
  ) {
    return (
      <ContainerPublicityAndDoorHandle>
        <ButtonDoorHandle
          setVisibleNegativateModal={setVisibleNegativateModal}
          visibleNegativateModal={visibleNegativateModal}
          setVisible={setVisibleQrCode}
          visible={visibleQrCode}
          hasPublicity={hasPublicity}
          isNegativate={isNegativate}
        />
        {init !== 'Speedmob' && countTrip === 0 && hasPublicity && (
          <If condition={userDriverFind.status === 'disponivel'}>
            <ContainerCardPublicity>
              <CardPublicity setLoading={() => {}} appConstPublicity={2} />
            </ContainerCardPublicity>
          </If>
        )}
      </ContainerPublicityAndDoorHandle>
    );
  }
  return null;
};
