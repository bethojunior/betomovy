import { useBubbleButton } from '@704apps/react-native-bubble-button';
import { SimpleLineIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { translate } from '../../../../../client/locales';
import { useLocalProvider } from '../../../context/local';
import { useTripProvider } from '../../../context/Trip';
import { useUserDriver } from '../../../context/userDriver';
import theme from '../../../styles/theme';
import { ButtonV2 } from '../../ButtonOnAndOff';
import { HomeHeaderTop } from '../../HomeHeaderTop';
import { If } from '../../If';
import { TextEdit } from '../../TextEdit';
import {
  ContainerBottom,
  ContainerHeader,
  ContainerIcon,
  ContainerText,
  ContainerTopTrip,
  ContentButton,
  HeaderBottom,
  HeaderBottomTitle,
  Icon,
  InfoTrip,
  InfoTripTitle,
} from './styles';

import { useDriverHours } from '../../../hooks/useDriverHours';
import { ModalHorasLimites } from '../../ModalHorasLimites';
import { useDriverStatus } from '../../../hooks/useDriverStatus';

interface Props {
  setOn: () => void;
  iniTripModal: boolean;
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  aminating: any;
  publicity: any;
}

export const V2 = ({
  setOn,
  iniTripModal,
  setModalVisible,
  aminating,
  publicity,
}: Props) => {
  const { navigate } = useNavigation<NavigationProp<any>>();
  const { hideBubble } = useBubbleButton();
  const { toogleDriverStatus } = useUserDriver();
  const { isOffline, isOnline } = useDriverStatus();
  const { location, setLocation } = useLocalProvider();

  const dispatchTrip = useTripProvider((context) => context.dispatchTrip);
  const { tripSummary } = useTripProvider((context) => context.stateTrip);

  const [initLocationX, setInitLocationX] = useState(0);

  const { checkHorasLimites, shouldShowModal, closeModal, getDriverHours } = useDriverHours();

  const conditionViewCard =
    tripSummary.totalScheduledAvailable == 0 &&
    tripSummary.totalScheduledAccepted == 0 &&
    tripSummary.totalOfferTrips == 0;

  const setOff = async () => {
    const locationStorage = await AsyncStorage.getItem('lastPosition');
    if (!location || Object.keys(location).length === 0) {
      const locationParse = await JSON.parse(locationStorage);
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

  return (
    <>
      <HomeHeaderTop
        aminating={aminating}
        children={
          <If condition={isOnline && !iniTripModal}>
            <ContainerTopTrip>
              {!conditionViewCard && (
                <>
                  <HeaderBottom>
                    <HeaderBottomTitle>
                      {translate('driverhome.modal_header')}
                    </HeaderBottomTitle>
                  </HeaderBottom>
                  <InfoTrip>
                    <InfoTripTitle
                      onPress={() => navigate('ScheduleAvailable')}
                    >
                      {tripSummary.totalScheduledAvailable}{' '}
                      {translate('driverhome.info_disp')}
                    </InfoTripTitle>
                    <InfoTripTitle
                      onPress={() => navigate('ScheduleAccepted')}
                    >
                      {tripSummary.totalScheduledAccepted}{' '}
                      {translate('driverhome.info_schedule')}
                    </InfoTripTitle>
                    <InfoTripTitle
                      onPress={() => navigate('tripsOffer')}
                    >
                      {tripSummary.totalOfferTrips} Ofertas
                    </InfoTripTitle>
                  </InfoTrip>
                </>
              )}
            </ContainerTopTrip>
          </If>
        }
      />
      <If condition={!iniTripModal}>
        <ContainerBottom>
          {publicity && publicity}
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
                  {isOffline
                    ? translate('driverhome.info_off')
                    : translate('driverhome.info_on')}
                </TextEdit>
              </ContainerText>
            </ContainerHeader>
            <ButtonV2
              initLocationX={initLocationX}
              setInitLocationX={setInitLocationX}
              setOff={setOff}
              setOn={setOn}
            />
          </ContentButton>
        </ContainerBottom>
      </If>

      {/* Modal de Horas Limites */}
      <ModalHorasLimites
        visible={shouldShowModal}
        onClose={closeModal}
      />
    </>
  );
};
