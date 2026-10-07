import AsyncStorage from '@react-native-async-storage/async-storage';
import {translate} from '../../../../client/locales';
import {ButtonTarget} from '../../../../common/ButtonTarget';
import {useNavigation} from '@react-navigation/native';
import {useTripStatusProvider} from '../../context/TripStatus';

export const ButtonTargetComponent = () => {
  const navigation = useNavigation();
  const {buttonTargetVisibility, setButtonTargetVisibility} =
    useTripStatusProvider();
  const navigateToTripDetails = async () => {
    const trip = JSON.parse(await AsyncStorage.getItem('lastTripFinished'));
    navigation.navigate('DetailsTrip', {
      tripReference: trip.tripReference,
      trip,
    });
  };

  return (
    <ButtonTarget
      text={translate('home.see_details_trip')}
      visible={buttonTargetVisibility}
      setVisible={setButtonTargetVisibility}
      callback={navigateToTripDetails}
      secondsToHide={5}
    />
  );
};
