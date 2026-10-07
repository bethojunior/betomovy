import {useBubbleButton} from '@704apps/react-native-bubble-button';
import {SimpleLineIcons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {translate} from '../../../../../client/locales';
import {useLocalProvider} from '../../../context/local';
import {useTripProvider} from '../../../context/Trip';
import {useUserDriver} from '../../../context/userDriver';
import theme from '../../../styles/theme';
import {ButtonV2} from '../../ButtonOnAndOff';
import {HomeHeaderTop} from '../../HomeHeaderTop';
import {If} from '../../If';
import {TextEdit} from '../../TextEdit';
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

import {UseContextBattery} from '../../../../../context/Battery';
import {customToast} from '../../../../../utils/FlashMessage';

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
  const {navigate} = useNavigation();
  const {hideBubble} = useBubbleButton();
  const {userDriverFind, toogleDriverStatus} = useUserDriver();
  const {location, setLocation} = useLocalProvider();
  const {dispatchTrip, stateTrip} = useTripProvider();
  const {tripsOffer} = stateTrip;
  const {listSchedule, listScheduleAccepted} = stateTrip;

  const [initLocationX, setInitLocationX] = useState(0);

  const {levelBattery} = UseContextBattery();

  const conditionViewCard =
    listSchedule.length == 0 &&
    listScheduleAccepted.length == 0 &&
    tripsOffer?.length == 0;

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

    dispatchTrip({type: 'update', field: 'trip', arg: {}});
    setModalVisible(false);
  };

  const handleSetOn = () => {
    if (levelBattery < 7) {
      customToast(translate('home.message_low_battery'), 'warning');
    } else {
      setOn();
    }
  };

  return (
    <>
      <HomeHeaderTop
        aminating={aminating}
        children={
          <If
            condition={userDriverFind?.status === 'disponivel' && !iniTripModal}
          >
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
                      onPress={() => {
                        navigate('ScheduleAvailable', {
                          listSchedule,
                        });
                      }}
                    >
                      {listSchedule.length || 0}{' '}
                      {translate('driverhome.info_disp')}
                    </InfoTripTitle>
                    <InfoTripTitle
                      onPress={() =>
                        navigate('ScheduleAccepted', {
                          listScheduleAccepted,
                        })
                      }
                    >
                      {listScheduleAccepted.length || 0}{' '}
                      {translate('driverhome.info_schedule')}
                    </InfoTripTitle>
                    <InfoTripTitle
                      onPress={() =>
                        navigate('tripsOffer', {
                          tripsOffer,
                        })
                      }
                    >
                      {tripsOffer?.length || 0} Ofertas
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
              setOn={setOn}
            />
          </ContentButton>
        </ContainerBottom>
      </If>
    </>
  );
};
