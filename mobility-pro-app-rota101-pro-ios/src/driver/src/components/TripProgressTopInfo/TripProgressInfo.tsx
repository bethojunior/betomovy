import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Trip } from '~/interfaces/trip';

import {
  AnimatedVehicleLottie,
  ProgressBarrer,
  ProgressBarrerContainer,
  ProgressContainer,
  TripDistanceContainer,
  TripDistanceInfoText,
  TripDistanceRigthText
} from './styles';

interface TripProgressInfoProps {
  tripAccepted?: Trip;
  metersRound: number;
  minutesTraveled: number;
  onPressBar?: () => void;
}

export const TripProgressInfo: React.FC<TripProgressInfoProps> = ({
  onPressBar,
  tripAccepted,
  metersRound,
  minutesTraveled
}) => {
  const [percent, setPercent] = useState(0);

  const calculatePercent = () => {
    const percent =
      ((metersRound || 1) /
        1000 /
        Number((Number(tripAccepted?.distance) || 1).toFixed(1))) *
      100;
    setPercent(percent === Infinity ? 0 : percent);
  };

  useEffect(() => {
    calculatePercent();
  }, [metersRound]);

  return (
    <Pressable onPress={onPressBar}>
      <ProgressContainer>
        <ProgressBarrerContainer>
          <ProgressBarrer width={percent} />
          <AnimatedVehicleLottie
            autoPlay
            source={require('../../assets/animations/progress-car.json')}
          />
        </ProgressBarrerContainer>

        <TripDistanceContainer>
          <View>
            <TripDistanceInfoText>Contratado</TripDistanceInfoText>
            <TripDistanceInfoText>
              {(tripAccepted && Number(tripAccepted?.distance || 0)?.toFixed(1)) ||
                0}{' '}
              Km / {(tripAccepted && tripAccepted?.estimatedTripTime) || 0} Min
            </TripDistanceInfoText>
          </View>
          <View>
            <TripDistanceRigthText>Rodado</TripDistanceRigthText>
            <TripDistanceInfoText>
              {((metersRound || 1) / 1000)?.toFixed(1) || 0} KM /{' '}
              {minutesTraveled?.toFixed(1) || 0} Min
            </TripDistanceInfoText>
          </View>
        </TripDistanceContainer>
      </ProgressContainer>
    </Pressable>
  );
};
