// @ts-nocheck

import { MotiView } from 'moti';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const CardContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const CancelBtn = styled.TouchableOpacity`
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.red};
  border-radius: ${RFValue(20)}px;
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;
  align-items: center;
  justify-content: center;
  background-color: transparent;
`;

export const AudioInfo = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-horizontal: ${RFValue(8)}px;
`;

export const WaveformRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const PulsingDot = styled(MotiView)`
  width: ${RFValue(8)}px;
  height: ${RFValue(8)}px;
  border-radius: ${RFValue(4)}px;
  background-color: ${({ theme }) => theme.colors.red};
  margin-right: ${RFValue(6)}px;
`;

export const WaveBar = styled(MotiView)<{ barHeight: number }>`
  width: ${RFValue(3)}px;
  height: ${({ barHeight }) => RFValue(barHeight)}px;
  border-radius: ${RFValue(2)}px;
  background-color: ${({ theme }) => theme.colors.primary};
  margin-right: ${RFValue(2)}px;
`;

export const TimerValue = styled.Text`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${RFValue(22)}px;
  font-weight: bold;
`;

export const RecordingLabel = styled.Text`
  color: ${({ theme }) => theme.colors.text_gray};
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  margin-top: ${RFValue(3)}px;
`;

export const SendBtn = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${RFValue(20)}px;
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;
  align-items: center;
  justify-content: center;
  elevation: 4;
  shadow-color: ${({ theme }) => theme.colors.primary};
  shadow-offset: 0px 3px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
`;
