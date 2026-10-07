import {Dimensions} from 'react-native';
import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';

const CARD_MAX_WIDTH = Dimensions.get('window').width * 0.78;

export const Card = styled.View`
  flex-direction: row;
  align-items: flex-start;
  align-self: flex-end;
  max-width: ${CARD_MAX_WIDTH}px;
  background-color: ${({theme}) => theme.colors.white};
  border-radius: ${({theme}) => theme.radius.large}px;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
  margin-top: ${({theme}) => theme.spacing.medium}px;
  margin-right: ${({theme}) => theme.spacing.large}px;
  margin-left: ${({theme}) => theme.spacing.large}px;
  padding: ${({theme}) => theme.spacing.large}px;
  shadow-color: ${({theme}) => theme.colors.black};
  shadow-offset: 0px ${RFValue(3)}px;
  shadow-opacity: 0.2;
  shadow-radius: ${RFValue(8)}px;
  elevation: 6;
`;

export const IconBadge = styled.View<{color: string}>`
  width: ${RFValue(26)}px;
  height: ${RFValue(26)}px;
  border-radius: ${RFValue(13)}px;
  background-color: ${({color}) => color};
  align-items: center;
  justify-content: center;
  margin-right: ${({theme}) => theme.spacing.medium}px;
`;

export const Content = styled.View`
  flex: 1;
`;

export const Title = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: MavenPro_500Medium;
`;

export const Description = styled.Text`
  color: ${({theme}) => theme.colors.text_gray};
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-family: MavenPro_400Regular;
  margin-top: ${({theme}) => theme.spacing.small}px;
`;

export const CloseButton = styled.TouchableOpacity`
  padding: ${({theme}) => theme.spacing.small}px;
  margin-left: ${({theme}) => theme.spacing.small}px;
`;
