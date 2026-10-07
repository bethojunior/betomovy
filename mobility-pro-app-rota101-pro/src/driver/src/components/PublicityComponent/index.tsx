import ListPublicity from '~/components/ListPublicity';
import { usePublicity } from '~/hooks/usePublicity';
import { useModules } from '../../../../client/contexts/modules';
import { useAuth } from '../../../../context/auth';
import { useTripProvider } from '../../context/Trip';
import { useLocalProvider } from '../../context/local';
import { useUserDriver } from '../../context/userDriver';
import { ContainerPublicityAndDoorHandle } from '../../pages/Home/styles';
import { ButtonDoorHandle } from '../ButtonDoorHandle';
import { If } from '../If';
import { RFValue } from 'react-native-responsive-fontsize';
import { APP_TYPE } from '~/constants/app';
import { ADVERTISING_APP_SITE_TYPE } from '~/constants/advertisingAppSite';

export const PublicityComponent = ({ countTrip, setVisibleQrCode, visibleQrCode }) => {
  const { userDriverFind } = useUserDriver();

  const {
    cityConfig,
    isNegativate,
    setVisibleNegativateModal,
    visibleNegativateModal,
    userDriver,
  } = useAuth();

  const { init } = useModules();
  const { location } = useLocalProvider();
  const tripAccepted: any = useTripProvider(
    (context: any) => context.stateTrip.tripAccepted,
  );

  const { data: publicityList } = usePublicity({
    position: location?.coords,
    typeConst: APP_TYPE.DRIVER,
    advertisingAppSiteId: ADVERTISING_APP_SITE_TYPE.ABERTURA,
    genderId: userDriver.genderId,
  });

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
          isNegativate={isNegativate}
        />

        {init !== 'Speedmob' && countTrip === 0 && (
          <If condition={userDriverFind.status === 'disponivel'}>
            <ListPublicity data={publicityList} paddingBottom={RFValue(10)} />
          </If>
        )}
      </ContainerPublicityAndDoorHandle>
    );
  }
  return null;
};
