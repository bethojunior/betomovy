// @ts-nocheck

import {shade} from 'polished';
import {Button} from 'react-native-paper';
import styled, {css} from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => shade(0.04, theme.colors.background_global)};
`;

export const Content = styled.ScrollView`
  flex: 1;
`;

export const ContainerBaseBoard = styled.View`
  width: 100%;
  margin-top: 10px;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  flex-direction: row;
`;

export const NavBarContent = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const ContainerButtonCall = styled.View`
  margin-left: auto;
  margin-right: 10px;
  margin-top: 10px;
`;

export const GoBackButton = styled.TouchableOpacity`
  padding: 10px 20px;
`;

export const NavBarTitle = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: ${({theme}) => theme.colors.primary};
`;

export const FooterContent = styled.View`
  background-color: ${({theme}) => theme.colors.background_white};
  border-radius: 25px;
  padding: 0 10px;
  margin: 0 10px 10px;
  flex-direction: row;
  align-items: center;
`;

export const ContentSwitch = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({theme}) => theme.spacing.large}px;
  margin-top: ${({theme}) => theme.spacing.large}px;
`;

export const FooterInput = styled.TextInput`
  flex: 1;
  padding: 6px;
`;

export const RecordingButtonContainer = styled.View`
  ${({recording}) =>
    recording &&
    css`
      width: 50px;
      align-items: center;
      justify-content: center;
      height: 180px;
      position: absolute;
      right: 0;
    `}
`;

export const RecordingButton = styled.Pressable`
  ${({recording, theme}) =>
    recording &&
    css`
      background-color: ${theme.colors.secondary};
    `}
  color: ${({theme}) => theme.colors.white};
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 50px;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
`;

export const TrashIconContainer = styled.View`
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 50px;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
`;

export const ButtonSend = styled.TouchableOpacity`
  width: 35px;
  height: 35px;
  border-radius: 25px;
  background-color: ${({theme}) => theme.colors.primary};
  align-items: center;
  justify-content: center;
`;
