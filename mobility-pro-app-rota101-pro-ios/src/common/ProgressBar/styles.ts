import styled from 'styled-components/native';
import {ProgressBarrerProps} from './types';
import {RFValue} from 'react-native-responsive-fontsize';

export const ProgressContainer = styled.View`
  background-color: ${({theme}) => theme.colors.secondary};
  width: 95%;
  align-self: center;
  align-items: center;
  border-radius: 30px;
  height: 40px;
  position: absolute;
  top: 130px;
  z-index: 10;
  justify-content: center;
  overflow: hidden;
  elevation: 100;
`;

export const ProgressBarrer = styled.View<ProgressBarrerProps>`
  transition: 0.5s all;
  width: ${({width}) => (width >= 100 ? '100%' : `${width}%`)};
  align-self: flex-start;
  height: 40px;
  border-radius: 30px;
  background-color: ${({theme}) => theme.colors.primary};
  position: absolute;
`;

export const TextTime = styled.Text`
  font-family: MavenPro_500Medium;
  color: ${({theme}) => theme.colors.background_global};
  align-self: center;
  font-size: ${RFValue(12)}px;
`;

export const CotentTime = styled.View`
  flex-direction: row;
  padding: 0 10px;
  align-items: center;
`;

export const Time = styled.Text`
  margin-left: 10px;
  font-family: MavenPro_500Medium;
  color: ${({theme}) => theme.colors.background_global};
  font-size: ${RFValue(14)}px;
`;
