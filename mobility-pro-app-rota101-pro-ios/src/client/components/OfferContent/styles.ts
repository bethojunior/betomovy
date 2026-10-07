import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';

export const ContainerOffer = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const ContainerValue = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${RFValue(5)}px;
  margin: 0px ${RFValue(10)}px;
  border-radius: ${({theme}) => theme.borderRadius.small}px;
  background-color: ${({theme}) => theme.colors.secondary};
`;
