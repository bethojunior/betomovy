import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const MarkerContainer = styled.View`
  align-items: center;
`;

export const LocationLabel = styled.View`
  background-color: ${({theme}) => theme.colors.white};
  border-radius: ${({theme}) => theme.borderRadius.large}px;
  padding: ${({theme}) => theme.spacing.small}px
    ${({theme}) => theme.spacing.medium}px;
  margin-bottom: ${({theme}) => theme.spacing.small}px;
  shadow-color: ${({theme}) => theme.colors.black};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: ${RFValue(3)}px;
  elevation: 3;
`;

export const LocationLabelText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  color: ${({theme}) => theme.colors.secondary};
  font-weight: 600;
`;

export const PulseHalo = styled.View`
  width: ${RFValue(36)}px;
  height: ${RFValue(36)}px;
  border-radius: ${RFValue(18)}px;
  background-color: ${({theme}) => theme.colors.primary}33;
  align-items: center;
  justify-content: center;
`;

export const PulseDot = styled.View`
  width: ${RFValue(16)}px;
  height: ${RFValue(16)}px;
  border-radius: ${RFValue(8)}px;
  background-color: ${({theme}) => theme.colors.primary};
  border-width: ${RFValue(2)}px;
  border-color: ${({theme}) => theme.colors.white};
`;
