// @ts-nocheck

import {lighten, shade} from 'polished';
import {RFValue} from 'react-native-responsive-fontsize';
import styled, {css} from 'styled-components/native';
import themeCss from '../../../../styles/theme';

export const Container = styled.View`
  display: flex;
  height: 100%;
`;

export const HeaderDialog = styled.View`
  margin-bottom: ${({theme}) => theme.spacing.large}px;
`;

export const Header = styled.View`
  border-bottom-width: 0.5px;
  border-bottom-color: ${({theme}) => theme.colors.primary};
  padding: 10px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

export const HeaderTitle = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-weight: bold;
  font-size: 14px;
`;

export const HeaderInfoButton = styled.TouchableOpacity`
  position: absolute;
  right: 0;
`;

export const BackButton = styled.TouchableOpacity`
  border-radius: 50px;
  background-color: ${({theme}) => theme.colors.secondary};
  padding: ${({theme}) => theme.spacing.large};
  position: absolute;
  right: 0;
  margin: 10px ${({theme}) => theme.spacing.large} 0 0;
`;

export const ContainerSchedule = styled.View`
  height: 320px;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const ContainerInput = styled.View`
  margin-top: ${({theme}) => theme.spacing.xxlarge}px;
  align-items: center;
  justify-content: center;
  width: 200px;
`;

export const InputTime = styled.TextInput`
  border: 1px solid ${({theme}) => theme.colors.grayLight};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  padding: ${({theme}) => theme.spacing.medium}px;
  width: 100%;
  margin-bottom: ${({theme}) => theme.spacing.medium}px;
  font-size: 14px;
`;

export const TitleSchedule = styled.Text`
  text-align: center;
  font-size: 20px;
  color: ${({theme}) => theme.colors.secondary};
  font-weight: bold;
  margin-bottom: 15px;
`;
export const SubScheduleAddress = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.secondary};
  font-weight: bold;
  margin-bottom: 8px;
`;
export const SubSchedule = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.colors.secondary};
  font-weight: bold;
  margin-bottom: 8px;
`;
export const Footer = styled.View`
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  height: 50px;
  /* padding: ${({theme}) => theme.spacing.medium}px 0; */
  flex-direction: row;
`;

export const FooterGL = styled.View`
  /* position: absolute;
  bottom: 0;
  right: 0;
  left: 0; */
  height: 60px;
  /* padding: ${({theme}) => theme.spacing.medium}px 0; */
  flex-direction: row;
`;

export const ContainerDate = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-right: 50%;
`;

export const IconClock = styled.View`
  margin-left: ${RFValue(10)}px;
`;

export const ConfirmButton = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  padding: ${({theme}) => theme.spacing.medium}px 0;
  border-radius: 5px;
  flex: 1;
  justify-content: center;
`;

export const ContainerActions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({theme}) => theme.spacing.large}px;
`;

export const ConfirmButtonText = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  text-align: center;
  font-size: 20px;
`;

export const OptionalButton = styled.TouchableOpacity`
  margin-right: 5px;
  background-color: ${({theme}) => theme.colors.background_global};
  border-radius: 5px;
  max-width: 18%;
  padding: 10px 0;
  flex: 1;
  justify-content: center;
  align-items: center;
  elevation: 5;
`;

export const OptionalButtonText = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: 12px;
  font-weight: bold;
`;

export const ContainerFlatList = styled.SafeAreaView`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

export const OptionsList = styled.FlatList`
  max-height: ${RFValue(260)}px;
  min-height: ${RFValue(260)}px;
  flex: 1;
`;

export const OptionTravelItem = styled.TouchableOpacity`
  flex: 1;
  margin: ${RFValue(8)}px;
  ${({selected}) =>
    selected &&
    css`
      background-color: ${({theme}) =>
        shade(0.1, theme.colors.background_global)};
      elevation: 7;
      border-radius: 6px;
    `}
`;

export const OptionTravelItemContent = styled.View`
  flex-direction: column;
  padding: 8px;
  align-items: center;
  justify-content: center;
`;

export const RateImage = styled.Image`
  height: ${RFValue(60)}px;
  width: ${RFValue(60)}px;
  border-radius: 100px;
`;

export const RateLabelContent = styled.View`
  flex: 1;
  padding: 0px 10px;
`;

export const RateLabel = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.secondary};
`;

export const RatePriceLabel = styled.Text`
  font-size: ${RFValue(12)}px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.secondary};
`;
export const NameLabel = styled.Text`
  font-size: ${RFValue(12)}px;
  padding: 0.5px ${({theme}) => theme.spacing.medium}px;
  font-size: ${RFValue(10)}px;
  padding: 0.5px ${({theme}) => theme.spacing.small}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const PaymentMethodContainer = styled.View`
  margin: 5px 0;
  flex-direction: row;
  align-items: center;
  width: 100%;
  border: 1px solid ${({theme}) => theme.colors.primary};
  border-radius: 4px;
`;

export const ButtonOpenPaymentMethodModal = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border-right-width: 1px;
  border-right-color: ${({theme}) => theme.colors.border};
  width: 100%;
  padding: ${({theme}) => theme.spacing.small}px;
  justify-content: space-between;
`;

export const PaymentMethodSelected = styled.Text`
  font-size: 13px;
  padding: 8px 4px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const CurrencyType = styled.Text`
  font-size: 15px;
  padding: 8px 4px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const Loading = styled.ActivityIndicator.attrs(() => ({
  size: 'large',
  color: themeCss.colors.secondary,
}))``;

export const LoadingContainer = styled.View`
  height: 200px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;
