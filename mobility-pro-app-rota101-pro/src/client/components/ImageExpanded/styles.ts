import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_opacity};
  opacity: 0.95;
  justify-content: center;
  align-items: center;
  padding: 10px;

  position: relative;
`;

export const ContainerImage = styled.View`
  width: ${RFValue(300)}px;
  height: ${RFValue(300)}px;
  border-radius: 20px;
`;

export const ImageExp = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: ${RFValue(300)}px;
`;
