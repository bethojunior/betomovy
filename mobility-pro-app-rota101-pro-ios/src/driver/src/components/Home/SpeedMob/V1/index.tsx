import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeHeaderTopSpeedMob from '../../../HomeHeaderTop/SpeedMob';
import { useBubbleButton } from '@704apps/react-native-bubble-button';

import { useUserDriver } from '../../../../context/userDriver';
import { useLocalProvider } from '../../../../context/local';
import { useTripProvider } from '../../../../context/Trip';

import { SimpleLineIcons } from '@expo/vector-icons';

import { ButtonV2 } from '../../../ButtonOnAndOff';

import { translate } from '../../../../../../client/locales';

import { TextEdit } from '../../../TextEdit';

import theme from '../../../../styles/theme';
import { RFValue } from 'react-native-responsive-fontsize';

import { useNavigation } from '@react-navigation/native';

import {
  ContentButton,
  ContainerHeader,
  ContainerIcon,
  ContainerText,
  Icon,
} from './styles';

import { useState } from 'react';

import { customToast } from '../../../../../../utils/FlashMessage';
import { useBattery } from '../../../../hooks/battery';
import { BatteryState } from 'expo-battery';
import { useDriverHours } from '../../../../hooks/useDriverHours';
import { ModalHorasLimites } from '../../../ModalHorasLimites';

interface V1SpeedMobProps {
  setOn: () => void;
  setModalVisible: (value: boolean) => void;
}

export default function V1SpeedMob({ setOn, setModalVisible }: V1SpeedMobProps) {
  const { hideBubble } = useBubbleButton();
  const { userDriverFind, toogleDriverStatus } = useUserDriver();
  const { location, setLocation } = useLocalProvider();
  const dispatchTrip: any = useTripProvider(
    (context: any) => context.dispatchTrip,
  );
  const [initLocationX, setInitLocationX] = useState(0);

  const { battery, levelBatteryMin } = useBattery();

  const { checkHorasLimites, shouldShowModal, closeModal, getDriverHours } = useDriverHours();

  const setOff = async () => {
    userDriverFind.status = 'desligado';
    const locationStorage = await AsyncStorage.getItem('lastPosition');
    if (!location || Object.keys(location).length === 0) {
      let locationParse = await JSON.parse(locationStorage);
      location.coords = (await JSON.parse(locationStorage)) || {
        coords: {
          latitude: 0,
          longitude: 0,
        },
      };
      setLocation(
        locationParse || {
          coords: {
            latitude: 0,
            longitude: 0,
          },
        },
      );
    }
    await toogleDriverStatus('desligado', {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    await hideBubble();

    dispatchTrip({ type: 'update', field: 'trip', arg: {} });
    setModalVisible(false);
  };

  const handleSetOn = async () => {
    await getDriverHours();
    const podeFicarOnline = checkHorasLimites();
    if (!podeFicarOnline) {
      return;
    }

    if (
      battery?.level &&
      battery?.level < levelBatteryMin &&
      battery?.state !== BatteryState.CHARGING
    ) {
      customToast(translate('home.message_low_battery'), 'warning');
    } else {
      setOn();
    }
  };

  return (
    <>
      <HomeHeaderTopSpeedMob />
      <ContentButton>
        <ContainerHeader>
          <ContainerIcon
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <Icon>
              <SimpleLineIcons
                name="arrow-up"
                size={RFValue(15)}
                color={theme.colors.background_global}
              />
            </Icon>
          </ContainerIcon>
          <ContainerText>
            <TextEdit size="large" color={theme.colors.secondary}>
              {userDriverFind.status === 'desligado'
                ? translate('driverhome.info_off')
                : translate('driverhome.info_on')}
            </TextEdit>
          </ContainerText>
        </ContainerHeader>
        <ButtonV2
          initLocationX={initLocationX}
          setInitLocationX={setInitLocationX}
          setOff={setOff}
          setOn={handleSetOn}
        />
      </ContentButton>

      {/* Modal de Horas Limites */}
      <ModalHorasLimites
        visible={shouldShowModal}
        onClose={closeModal}
      />
    </>
  );
}
