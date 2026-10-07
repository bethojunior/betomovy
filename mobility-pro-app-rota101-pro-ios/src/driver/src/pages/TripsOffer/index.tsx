import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {translate} from '../../../../client/locales';
import {CardOffer} from '../../components/CardOffer';
import {useTripProvider} from '../../context/Trip';
import {Container, ContainerCard, WithoutTripText} from './style';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TripsOffer({route}) {
  const {acceptTripOffer, stateTrip, dispatchTrip} = useTripProvider();
  const {tripsOffer} = stateTrip;
  const {goBack} = useNavigation();
  const acceptTrip = async (tripReference: string) => {
    await acceptTripOffer(tripReference);
    goBack();
  };

  const checkIfIsRemoved = async () => {
    let list = JSON.parse(await AsyncStorage.getItem('refusedOffer')) || [];
    const offers = tripsOffer.filter(
      ({tripReference}) => !list.includes(tripReference),
    );
    dispatchTrip({type: 'update', field: 'tripsOffer', arg: offers});
    // setTripsOffer(offers);
  };

  useEffect(() => {
    checkIfIsRemoved();
  }, []);

  return (
    <Container>
      <ContainerCard>
        {tripsOffer?.length > 0 ? (
          tripsOffer?.map((trip, index) => {
            return (
              <CardOffer
                onPressAccept={acceptTrip}
                checkIfIsRemoved={checkIfIsRemoved}
                trip={trip}
                key={index}
              />
            );
          })
        ) : (
          <WithoutTripText>
            {translate('tripDriver.there_are_no_trips_available')}
          </WithoutTripText>
        )}
      </ContainerCard>
    </Container>
  );
}
