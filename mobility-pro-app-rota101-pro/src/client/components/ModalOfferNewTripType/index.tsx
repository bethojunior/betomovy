import { FC } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Button,
  ContentButton,
  ModalContent,
  SubTitle,
  TextButton,
  Title,
} from './styles';
import { useTrip } from '../../contexts/Trip';
import { translate } from '../../locales';
import { PIX_CACHE_KEY, TRIP_CACHE_KEY } from '../../constants/pixCache';
import { BottomSheetModal } from '../BottomSheetModal';

interface Props {
  setVisibleTravelOption: (data: boolean) => void;
}

export const ModalOfferNewTripType: FC<Props> = ({ setVisibleTravelOption }: Props) => {
  const { calculateAll, clearTrip, stateTripCustomer, dispatchTripCustomer } = useTrip();
  const navigation = useNavigation<NavigationProp<any>>();

  const {
    origin,
    destination: destiny,
    waypoints,
    offerOtherTypeTrip,
  } = stateTripCustomer;

  const calcAndShowTravelOptions = async () => {
    calculateAll(origin, destiny, waypoints);

    dispatchTripCustomer({ type: 'update', field: 'offerOtherTypeTrip', arg: false });
    dispatchTripCustomer({ type: 'update', field: 'hideTravelOptions', arg: false });

    setVisibleTravelOption(true);
  };

  const cancel = async () => {
    const fieldsToReset = {
      offerOtherTypeTrip: false,
      hideTravelOptions: true,
      origin: {},
      destination: {},
      selectedOptionTravel: {},
      selectedPaymentMethod: {},
      trip: {},
      loadingTrip: false,
    };

    Object.entries(fieldsToReset).forEach(([field, arg]) => {
      dispatchTripCustomer({ type: 'update', field, arg });
    });

    await AsyncStorage.multiRemove([PIX_CACHE_KEY, TRIP_CACHE_KEY, 'trip']);

    clearTrip();

    setVisibleTravelOption(false);
    navigation.navigate('TripRoutes', { screen: 'Home' });
  };

  return (
    <BottomSheetModal visible={offerOtherTypeTrip} onRequestClose={cancel}>
      <ModalContent>
        <Title>{translate('offerOtherTrip.title')}</Title>
        <SubTitle>{translate('offerOtherTrip.subtitle')}</SubTitle>
        <ContentButton>
          <Button activeOpacity={0.8} onPress={cancel}>
            <TextButton>{translate('offerOtherTrip.cancel')}</TextButton>
          </Button>
          <Button activeOpacity={0.8} onPress={calcAndShowTravelOptions} btnYes>
            <TextButton btnYes>{translate('offerOtherTrip.accept')}</TextButton>
          </Button>
        </ContentButton>
      </ModalContent>
    </BottomSheetModal>
  );
};
