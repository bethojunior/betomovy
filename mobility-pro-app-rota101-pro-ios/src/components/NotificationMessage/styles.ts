import {MotiView} from 'moti';
import {shade} from 'polished';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled(MotiView)`
  position: absolute;
  width: 95%;
  border-radius: 20px;
  min-height: 75px;
  z-index: 10;
  margin: 12px 10px 0;
  padding: ${RFValue(8)}px ${RFValue(12)}px;
  background-color: ${({theme}) =>
    shade(0.8, theme.colors.background_black_light)};
`;

export const Row = styled(MotiView)`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const Pressable = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const Content = styled.View`
  flex-direction: column;
  margin-left: 10px;
  flex: 1;
`;

export const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 50px;
`;

export const Title = styled.Text`
  color: ${({theme}) => theme.colors.background_global};
  font-family: MavenPro_500Medium;
  line-height: ${({theme}) => theme.fontSizes.medium + 6}px;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;

export const MessageText = styled.Text`
  color: ${({theme}) => theme.colors.white};
  font-family: MavenPro_200Medium;
  line-height: ${({theme}) => theme.fontSizes.smalls + 6}px;
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  max-width: 100%;
`;
