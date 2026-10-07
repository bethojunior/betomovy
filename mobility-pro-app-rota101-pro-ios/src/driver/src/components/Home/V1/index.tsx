import {TouchableOpacity} from 'react-native';
import {translate} from '../../../../../client/locales';
import {useUserDriver} from '../../../context/userDriver';
import {BottomCard} from '../../BottomCard';
import {ButtonCircle} from '../../ButtonCircle';
import {HomeHeaderTop} from '../../HomeHeaderTop';
import {If} from '../../If';
import {ContainerBottom, ContentButton} from './styles';
import {useTripProvider} from '../../../context/Trip';
import {RFValue} from 'react-native-responsive-fontsize';

import {UseContextBattery} from '../../../../../context/Battery';
import {customToast} from '../../../../../utils/FlashMessage';
import {useBattery} from '../../../hooks/battery';
import {BatteryState} from 'expo-battery';
import {PulseComponent} from '../../PulseComponent';

interface Props {
  setOn: () => void;
  loadingStatus: boolean;
  pulse: any;
  // Pulse: any;
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
  // Pulse,
  iniTripModal,
  modalVisible,
  setModalVisible,
  aminating,
  publicity,
}: Props) => {
  const {userDriverFind} = useUserDriver();
  const {stateTrip} = useTripProvider();
  const {listSchedule, listScheduleAccepted, tripsOffer} = stateTrip;
  const {battery} = useBattery();
  const {levelBatteryMin} = UseContextBattery();

  const conditionViewCard =
    listSchedule?.length == 0 &&
    listScheduleAccepted?.length == 0 &&
    tripsOffer?.length == 0;

  const positionButton = conditionViewCard ? '10%' : `${RFValue(140)}px`;

  const handleSetOn = () => {
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
      <HomeHeaderTop aminating={aminating} />
      <If condition={userDriverFind.status === 'desligado'}>
        <ContentButton
          activeOpacity={0.8}
          bottom={positionButton}
          onPress={handleSetOn}
        >
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: '100%',
              justifyContent: 'center',
            }}
            onPress={handleSetOn}
            activeOpacity={0.8}
          >
            <ButtonCircle
              title={translate('driverhome.button_init')}
              onPress={handleSetOn}
              loading={loadingStatus}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: '100%',
              justifyContent: 'center',
            }}
            onPress={handleSetOn}
            activeOpacity={0.8}
          >
            {pulse.map((item, index) => (
              <PulseComponent repeat={index === 0} key={index} />
            ))}
          </TouchableOpacity>
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
    </>
  );
};
