import { View, Text } from 'react-native';
import ModalFrame from '../Modal/ModalFrame';
import { RFValue } from 'react-native-responsive-fontsize';
import { AnimatedIconInfoLottie, KmContainer, KmTitle, ModalTitle, ModalTitleContainer } from './styles';
import React from 'react';
import { Trip } from '~/interfaces/trip';

interface TripProgressInfoModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  tripAccepted?: Trip;
  metersRound: number;
  minutesTraveled: number;
}

export const TripProgressInfoModal: React.FC<TripProgressInfoModalProps> = ({
  visible,
  setVisible,
  tripAccepted,
  metersRound,
  minutesTraveled,
}) => {
  return (
    <ModalFrame
      visible={visible}
      setVisible={setVisible}
      hideCancel
      textConfirm='Fechar'
      onPressConfirm={() => setVisible(false)}
      onClose={() => setVisible(false)}
    >
      <View>
        <ModalTitleContainer>
          <AnimatedIconInfoLottie
            autoPlay
            loop={false}
            source={require('../../../../client/assets/animation/infoAnimation.json')}
          />

          <ModalTitle>
            Tempo e Distância
          </ModalTitle>
        </ModalTitleContainer>

        <KmContainer>
          <View>
            <KmTitle>Contratado</KmTitle>
            <Text>
              Distância:{' '}
              {(tripAccepted &&
                Number(tripAccepted?.distance || 0)?.toFixed(1)) ||
                0}{' '}
              Km
            </Text>
            <Text>
              Tempo: {(tripAccepted && tripAccepted?.estimatedTripTime) || 0}{' '}
              Min
            </Text>
          </View>
          <View>
            <KmTitle>Rodado</KmTitle>
            <Text>
              Distância: {((metersRound || 1) / 1000)?.toFixed(1) || 0} Km
            </Text>
            <Text>Tempo: {minutesTraveled?.toFixed(1) || 0} Min</Text>
          </View>
        </KmContainer>
      </View>
    </ModalFrame>
  )
}
