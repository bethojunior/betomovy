import { color } from 'react-native-reanimated';
import { Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components";


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
`

export const AlertContainer = styled.View`
  width: 80%;
  padding: ${({theme}) => theme.spacing.medium}px;
  border-radius: ${({theme}) => theme.borderRadius.small}px;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const Title = styled.Text`
  font-family: MavenPro_600SemiBold;
  font-size: ${RFValue(16)}px;
  margin-bottom: 10px;
  text-align: center;

  color: ${({theme}) => theme.colors.light_gray};
`;

export const SubTitle = styled.Text`
  font-family: MavenPro_400Regular;
  font-size: ${RFValue(12)}px;
   margin-bottom: 5px;
  text-align: center;

  color: ${({theme}) => theme.colors.light_gray};
`;

export const ButtonsContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({theme}) => theme.spacing.small}px;
`;

export const AlertButton = styled(Button)`
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const Separator = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.light_gray};
  margin: ${({ theme }) => theme.spacing.small}px 0;
`

export const AnimationContainer = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
`
