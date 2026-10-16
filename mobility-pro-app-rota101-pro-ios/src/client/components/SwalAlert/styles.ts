import styled from 'styled-components/native';
import {Button} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
export const Container = styled.View`
  position: absolute;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;

  z-index: 10;
`;

export const AlertContainer = styled.View`
  width: 80%;
  padding: ${({theme}) => theme.spacing.large}px;

  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const Title = styled.Text`
  font-family: MavenPro_600SemiBold;
  font-size: ${RFValue(20)}px;
  margin-bottom: 10px;
  text-align: center;

  color: ${({theme}) => theme.colors.secondary};
`;

export const ButtonOk = styled(Button)`
  width: 100%;
  padding: ${({theme}) => theme.spacing.small}px;
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
`;

export const ContainerText = styled.View`
  border-bottom-width: 0.5px;
  padding-bottom: 5px;
  border-bottom-color: ${({theme}) => theme.colors.border};
`;

export const ContainerRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
