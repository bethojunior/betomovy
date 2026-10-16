import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
`;

export const Image = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 100px;
`;

export const IconContainer = styled.View`
  height: ${RFValue(24)}px;
  width: ${RFValue(24)}px;
  border-radius: ${RFValue(12)}px;
  align-items: center;
  justify-content: center;
  elevation: 5;
  margin-left: ${RFValue(-24)}px;
  z-index: 1;
  background-color: ${({theme}) => theme.colors.background_global};
`;
