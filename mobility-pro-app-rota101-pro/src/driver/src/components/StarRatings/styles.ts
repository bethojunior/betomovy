import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  justify-content: flex-start;
  flex-direction: row;
  margin: 0;
`;

export const StarImg = styled.Image`
  width: ${RFValue(35)}px;
  height: ${RFValue(35)}px;
`;
