import {MotiView} from 'moti';
import {shade} from 'polished';
import styled from 'styled-components/native';

export const ModalMessage = styled.View`
  position: absolute;
  width: 95%;

  border-radius: 20px;
  max-height: 100px;
  min-height: 75px;
  /* padding: 5px 0; */
  /* height: 45px; */
  z-index: 10;
  margin: 0 10px;
  background-color: ${({theme}) =>
    shade(0.8, theme.colors.background_black_light)};
`;

export const Dot = styled(MotiView)`
  width: 10px;
  height: 10px;
  position: absolute;
  right: 0;
  border-radius: 100px;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const ClientContainer = styled(MotiView)`
  flex-direction: row;
  align-items: center;
  flex: 1;
  padding: 0 ${({theme}) => theme.spacing.large}px;
`;

export const ButtonNotificationMessage = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const ContentMessage = styled.View`
  flex-direction: column;
  justify-content: space-between;
  margin-left: 10px;
  flex: 1;
`;

export const PictureMessage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 50px;
`;
export const ClientNameMessage = styled.Text`
  color: ${({theme}) => theme.colors.background_global};
  font-family: MavenPro_500Medium;
  font-weight: bold;
  margin-top: 3px;
  padding: 5px 0;
`;

export const ClientMessage = styled.Text`
  color: ${({theme}) => theme.colors.background_global};
  font-family: MavenPro_500Medium;
  margin-top: 3px;
  padding: 5px 0;
  max-height: 50px;
  max-width: 100%;
`;
