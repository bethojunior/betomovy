import {View, Text} from 'react-native';
import {useTripProvider} from '../../context/Trip';
import {useRouteTraveled} from '../../context/RouteTraveled';
import {RFValue} from 'react-native-responsive-fontsize';
import {useEffect} from 'react';

export const DistanceInScreenComponent = () => {
  const {stateTrip} = useTripProvider();
  const {tripAccepted} = stateTrip;
  const {metersRound, minutesTraveled} = useRouteTraveled();

  return (
    <View style={{position: 'absolute', right: 5, top: -RFValue(50)}}>
      <View>
        <Text style={{color: 'red', fontWeight: 'bold', fontSize: RFValue(10)}}>
          Contratado:{' '}
          {(tripAccepted && Number(tripAccepted?.distance || 0)?.toFixed(1)) ||
            0}{' '}
          Km / {(tripAccepted && tripAccepted?.estimatedTripTime) || 0} Min
        </Text>
        <Text style={{color: 'red', fontWeight: 'bold', fontSize: RFValue(10)}}>
          Rodado: {((metersRound || 1) / 1000)?.toFixed(1) || 0} KM /{' '}
          {minutesTraveled?.toFixed(1) || 0} Min
        </Text>
      </View>
    </View>
  );
};
