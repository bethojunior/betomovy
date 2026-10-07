import {useNavigation} from '@react-navigation/native';
import {useTripProvider} from '../../context/Trip';
import {
  Bottom,
  styles,
  HeaderBottom,
  InfoTrip,
  InfoTripTitle,
  HeaderBottomTitle,
  ButtonBottom,
  ButtonBottomText,
} from './styles';
import {Ionicons, FontAwesome} from '@expo/vector-icons';
import {useUserDriver} from '../../context/userDriver';
import {useTheme} from 'styled-components';
import {translate} from '../../../../client/locales';
import {If} from '../If';
import theme from '../../styles/theme';
interface Props {
  iniTripModal: boolean;
  setModalVisible: (value: boolean) => void;
  modalVisible: boolean;
}

export const BottomCard = ({
  iniTripModal,
  setModalVisible,
  modalVisible,
}: Props) => {
  const {navigate} = useNavigation();
  const {userDriverFind} = useUserDriver();
  const {colors} = useTheme();
  const {stateTrip} = useTripProvider();
  const {tripsOffer} = stateTrip;
  const {listSchedule, listScheduleAccepted} = stateTrip;
  return (
    <Bottom visible={!iniTripModal} style={styles.shadow}>
      {listSchedule.length == 0 &&
      listScheduleAccepted.length == 0 &&
      tripsOffer?.length == 0 ? null : (
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
              {listSchedule.length || 0} {translate('driverhome.info_disp')}
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

      <ButtonBottom
        activeOpacity={0.5}
        onPress={() => setModalVisible(!modalVisible)}
      >
        <Ionicons
          name="chevron-up"
          size={25}
          color={theme.colors.secondary}
          style={{marginTop: 3}}
        />
        <ButtonBottomText>
          {userDriverFind.status === 'desligado'
            ? translate('driverhome.info_off')
            : translate('driverhome.info_on')}
        </ButtonBottomText>
        <FontAwesome
          name="circle"
          size={20}
          color={userDriverFind.status === 'desligado' ? colors.off : colors.on}
        />
      </ButtonBottom>
    </Bottom>
  );
};
