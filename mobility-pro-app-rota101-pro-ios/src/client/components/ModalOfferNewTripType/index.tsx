import {FC} from 'react';
import {Modal} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Button,
  Content,
  ContentButton,
  ModalContent,
  SubTitle,
  TextButton,
  Title,
} from './styles';
import {useTrip} from '../../contexts/Trip';
import {translate} from '../../locales';

interface Props {
  setVisibleTravelOption: (data: boolean) => void;
}

export const ModalOfferNewTripType: FC<Props> = ({
  setVisibleTravelOption,
}: Props) => {
  const {calculateAll, stateTripCustomer, dispatchTripCustomer} = useTrip();
  const navigation = useNavigation();

  const {
    origin,
    destination: destiny,
    waypoints,
    offerOtherTypeTrip,
  } = stateTripCustomer;

  const calcAndShowTravelOptions = async () => {
    calculateAll(origin, destiny, waypoints);

    dispatchTripCustomer({
      type: 'update',
      field: 'offerOtherTypeTrip',
      arg: false,
    });
    setVisibleTravelOption(true);
    dispatchTripCustomer({
      type: 'update',
      field: 'hideTravelOptions',
      arg: false,
    });
  };

  const cancel = () => {
    dispatchTripCustomer({
      type: 'update',
      field: 'offerOtherTypeTrip',
      arg: false,
    });
    dispatchTripCustomer({
      type: 'update',
      field: 'hideTravelOptions',
      arg: true,
    });
    setVisibleTravelOption(true);

    navigation.navigate('TripRoutes', {
      screen: 'Home',
    });
  };

  return (
    <Modal visible={offerOtherTypeTrip} animationType="slide" transparent>
      <Content>
        <ModalContent>
          <Title>{translate('offerOtherTrip.title')}</Title>
          <SubTitle>{translate('offerOtherTrip.subtitle')}</SubTitle>
          <ContentButton>
            <Button activeOpacity={0.8} onPress={cancel}>
              <TextButton>{translate('offerOtherTrip.cancel')}</TextButton>
            </Button>
            <Button
              activeOpacity={0.8}
              onPress={calcAndShowTravelOptions}
              btnYes
            >
              <TextButton btnYes>
                {translate('offerOtherTrip.accept')}
              </TextButton>
            </Button>
          </ContentButton>
        </ModalContent>
      </Content>
    </Modal>
  );
};
