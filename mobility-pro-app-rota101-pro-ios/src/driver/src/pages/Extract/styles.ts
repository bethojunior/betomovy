import {shade} from 'polished';
import {Platform} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {RFValue} from 'react-native-responsive-fontsize';
import styled, {css} from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding-left: ${({theme}) => theme.spacing.xlarge}px;
  padding-right: ${({theme}) => theme.spacing.xlarge}px;
`;

export const Content = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
})`
  margin-bottom: ${({theme}) => theme.spacing.small}px;
`;

export const ContainerCard = styled.View``;

export const Chart = styled.View`
  width: ${RFValue(120)}px;
  height: ${RFValue(120)}px;
  justify-content: center;
`;

export const TextSize = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  color: ${({theme}) => shade(0.5, theme.colors.background_global)};
`;

export const ContainerGraphic = styled.View`
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-top: ${({theme}) => theme.spacing.large}px;
`;

export const ContainerValue = styled.View`
  margin-left: ${({theme}) => theme.spacing.medium}px;
  flex-direction: column;
  justify-content: center;
  margin-top: ${({theme}) => theme.spacing.medium}px;
`;

export const Value = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  color: ${({theme}) => theme.colors.secondary};
  font-weight: 600;
`;

export const Text = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const ContentInfo = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-bottom: ${RFValue(10)}px;
`;

export const Info = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${RFValue(10)}px;
`;

export const InfoText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const InfoValue = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const DateContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding-left: ${RFValue(14)}px;
  padding-right: ${RFValue(14)}px;
  margin-top: 10px;
  margin-bottom: ${RFValue(10)}px;
`;

export const DateText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.secondary};
  font-family: ${({theme}) => theme.fonts.regular};
  text-align: center;
  margin-top: ${RFValue(10)}px;
`;

export const ButtonDate = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-width: 1.5px;
  border-color: ${({theme}) => theme.colors.primary};
  border-radius: 10px;
  height: 33px;
  width: 120px;
`;

export const ButtonDateText = styled.Text`
  font-size: 13px;
  color: ${({theme}) => theme.colors.secondary};
  font-family: ${({theme}) => theme.fonts.bold};
  margin-right: 5px;
`;

export const ContentModalDate = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colors.background_global};
`;

export const Exit = styled.View`
  padding-right: 15px;
  padding-left: 15px;
  padding-top: ${RFValue(15)}px;
  flex-direction: row;
  align-items: center;

  ${Platform.OS === 'ios' &&
  css`
    padding-top: ${getStatusBarHeight() + RFValue(20)}px;
  `}
`;

export const ButtonExit = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

export const TextExit = styled.Text`
  font-size: ${RFValue(15)}px;
  font-family: ${({theme}) => theme.fonts.secondary_regular};
  color: ${({theme}) => theme.colors.primary};
`;

export const Filters = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: ${RFValue(10)}px;
`;
