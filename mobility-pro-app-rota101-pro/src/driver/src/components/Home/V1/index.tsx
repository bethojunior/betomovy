import { useEffect, useState, useContext } from 'react';
import { Pressable, View } from 'react-native';
import { translate } from '../../../../../client/locales';
import { BottomCard } from '../../BottomCard';
import { ButtonCircle } from '../../ButtonCircle';
import { HomeHeaderTop } from '../../HomeHeaderTop';
import { If } from '../../If';
import { ContainerBottom, ContentButton } from './styles';
import { useTripProvider } from '../../../context/Trip';
import { RFValue } from 'react-native-responsive-fontsize';

import { customToast } from '../../../../../utils/FlashMessage';
import { useBattery } from '../../../hooks/battery';
import { BatteryState } from 'expo-battery';
import { PulseComponent } from '../../PulseComponent';
import { mountSong } from '../../../utils/mountSong';
import { getDisabledPermissions, ModalPermission } from '../modalPermission';
import { IfoodModalContext } from '../../../../contexts/IfoodModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDriverHours } from '../../../hooks/useDriverHours';
import { ModalHorasLimites } from '../../ModalHorasLimites';
import { useDriverStatus } from '../../../hooks/useDriverStatus';
import { useNetwork } from '~/context/ConfigGlobal';

interface Props {
  setOn: () => void;
  loadingStatus: boolean;
  pulse: any;
  iniTripModal: boolean;
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  aminating: any;
  publicity: any;
}

export const V1 = ({
  setOn,
  loadingStatus,
  pulse,
  iniTripModal,
  modalVisible,
  setModalVisible,
  aminating,
  publicity,
}: Props) => {
  const { isOffline } = useDriverStatus();
  const { openCodeModal } = useContext(IfoodModalContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allPermissionsGranted, setAllPermissionsGranted] = useState(false);

  const { tripSummary } = useTripProvider((context) => context.stateTrip);
  const { itsNetwork } = useNetwork();
  const { battery, levelBatteryMin } = useBattery();

  const { shouldShowModal, closeModal, checkHorasLimitesRealtime, loadingRealtime } =
    useDriverHours();

  const conditionViewCard =
    (tripSummary.totalScheduledAvailable == 0 &&
      tripSummary.totalScheduledAccepted == 0 &&
      tripSummary.totalOfferTrips == 0) ||
    isOffline;

  const positionButton = conditionViewCard ? '10%' : `${RFValue(140)}px`;

  useEffect(() => {
    const checkPermissions = async () => {
      const disabledPermissions = await getDisabledPermissions();
      setAllPermissionsGranted(disabledPermissions.length === 0);
    };

    checkPermissions();
  }, []);

  const handleSetOn = async () => {
    const podeFicarOnline = await checkHorasLimitesRealtime();

    if (!podeFicarOnline) {
      return;
    }

    try {
      // Som curto de "ficou online" — nunca em loop e nunca o assobio de chamada
      mountSong(null, true, 'soundCallOnline').then(async (sound) => {
        if (!sound) return;
        await sound.setIsLoopingAsync(false);
        const status = await sound.getStatusAsync();
        if (status?.isLoaded) {
          await sound.playAsync();
        }
      });
    } catch (e) {}

    if (
      battery?.level &&
      battery?.level < levelBatteryMin &&
      battery?.state !== BatteryState.CHARGING
    ) {
      customToast(translate('home.message_low_battery') + " " + battery?.level + '%', 'warning');
      return;
    }
    const disabledPermissions = await getDisabledPermissions();
    if (disabledPermissions.length === 0) {
      await setOn();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    (async () => {
      const [flag, storedRef] = await Promise.all([
        AsyncStorage.getItem('deliveryModalVisible'),
        AsyncStorage.getItem('tripReference'),
      ]);
      if (flag === 'true' && storedRef) {
        await openCodeModal(storedRef);
      }
    })();
  }, [openCodeModal]);

  return (
    <>
      <HomeHeaderTop aminating={aminating} />
      <If condition={isOffline}>
        <ContentButton bottom={positionButton}>
          <View>
            <ButtonCircle
              enabled={itsNetwork}
              style={{ position: 'absolute', bottom: 0 }}
              title={translate('driverhome.button_init')}
              loading={loadingStatus || loadingRealtime}
            />
            {pulse.map((item, index) => (
              <Pressable key={index} onPress={handleSetOn} disabled={!itsNetwork}>
                <PulseComponent repeat={index === 0} />
              </Pressable>
            ))}
          </View>
        </ContentButton>
      </If>

      <ContainerBottom>
        {publicity && publicity}
        <BottomCard
          iniTripModal={iniTripModal}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      </ContainerBottom>

      <ModalPermission open={isModalOpen} onPress={handleCloseModal} />
      <ModalHorasLimites visible={shouldShowModal} onClose={closeModal} />
    </>
  );
};
