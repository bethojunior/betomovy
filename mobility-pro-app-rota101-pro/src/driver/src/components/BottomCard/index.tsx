import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTripProvider } from '../../context/Trip';
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
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useTheme } from 'styled-components';
import { translate } from '../../../../client/locales';
import theme from '../../styles/theme';
import { TouchableOpacity } from 'react-native';
import { useDriverStatus } from '../../hooks/useDriverStatus';
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
  const { navigate } = useNavigation<NavigationProp<any>>();
  const { isOffline } = useDriverStatus();
  const { colors } = useTheme();

  const tripSummary = useTripProvider((context) => context.stateTrip.tripSummary);

  if (iniTripModal) return;

  return (
    <Bottom style={styles.shadow}>
      {(tripSummary.totalScheduledAvailable == 0 &&
        tripSummary.totalScheduledAccepted == 0 &&
        tripSummary.totalOfferTrips == 0) ||
        isOffline ? null : (
        <>
          <HeaderBottom>
            <HeaderBottomTitle>
              {translate('driverhome.modal_header')}
            </HeaderBottomTitle>
          </HeaderBottom>
          <InfoTrip>
            <TouchableOpacity
              onPress={() => navigate('ScheduleAvailable')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <InfoTripTitle>
                {tripSummary.totalScheduledAvailable}{' '}
                {translate('driverhome.info_disp')}
              </InfoTripTitle>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigate('ScheduleAccepted')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <InfoTripTitle>
                {tripSummary.totalScheduledAccepted}{' '}
                {translate('driverhome.info_schedule')}
              </InfoTripTitle>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigate('tripsOffer')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <InfoTripTitle>
                {tripSummary.totalOfferTrips} Ofertas
              </InfoTripTitle>
            </TouchableOpacity>
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
          style={{ marginTop: 3 }}
        />
        <ButtonBottomText>
          {isOffline
            ? translate('driverhome.info_off')
            : translate('driverhome.info_on')}
        </ButtonBottomText>
        <FontAwesome
          name="circle"
          size={20}
          color={isOffline ? colors.off : colors.on}
        />
      </ButtonBottom>
    </Bottom>
  );
};
