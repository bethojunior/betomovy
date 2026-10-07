// @ts-nocheck

import {lighten, shade} from 'polished';
import {RFValue} from 'react-native-responsive-fontsize';
import styled, {css} from 'styled-components/native';
import themeCss from '../../styles/theme';

interface ConfirmButtonProps {
  backgroundColor?: string;
}

export const Container = styled.View`
  padding: 0 ${RFValue(10)}px ${RFValue(10)}px ${RFValue(10)}px;
  /* border: 0.1px solid ${({theme}) => theme.colors.black}; */
  background-color: ${({theme}) => theme.colors.background_global};

  elevation: 6;
  border: ${RFValue(0.1)}px solid black;
  shadow-color: ${({theme}) => theme.colors.black};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.1;
  shadow-radius: ${RFValue(2)}px;
  border-radius: ${RFValue(2)}px;
  /* shadow-color: ${({theme}) => theme.colors.black}; */
`;

export const Header = styled.View`
  border: ${RFValue(1)}px solid transparent;
  border-bottom-color: ${({theme}) => theme.colors.border};
  padding: ${RFValue(10)}px;
  align-items: center;
  justify-content: center;
`;

export const ContentLastService = styled.View``;

export const ButtonText = styled.Text`
  color: ${({theme}) => theme.colors.background_global};
  font-size: ${RFValue(14)}px;
  font-weight: bold;
`;

export const ButtonNavigate = styled.TouchableOpacity`
  margin: ${RFValue(20)}px 0;

  align-self: center;

  background-color: ${({theme}) => theme.colors.primary};
  padding: ${RFValue(10)}px;
  border-radius: ${RFValue(5)}px;
  width: 50%;
  align-items: center;
`;

export const HeaderTitle = styled.Text`
  color: ${({theme}) => theme.colors.primary};
  font-weight: bold;
  font-size: ${RFValue(14)}px;
`;

export const HeaderInfoButton = styled.TouchableOpacity`
  position: absolute;
  right: 0;
`;

export const BackButton = styled.TouchableOpacity`
  border-radius: ${RFValue(50)}px;
  background-color: ${({theme}) => theme.colors.primary};
  padding: ${RFValue(10)}px;
  position: absolute;
  right: 0;
  margin: ${RFValue(10)}px ${RFValue(15)}px 0 0;
`;

export const DriverDoorHandle = styled.View`
  border-top-left-radius: ${({theme}) => theme.borderRadius.xlarge}px;
  border-top-right-radius: ${({theme}) => theme.borderRadius.xlarge}px;

  width: 100%;
  background-color: ${({theme}) => theme.colors.primary};
  padding: ${RFValue(10)}px;
  margin: ${RFValue(10)}px ${RFValue(15)}px 0 0;
  z-index: 1;
`;

export const ContainerDriver = styled.View`
  flex-direction: row;
  align-items: center;
  position: relative;
`;

export const DriverImage = styled.Image`
  width: ${RFValue(50)}px;
  height: ${RFValue(50)}px;
  border-radius: ${RFValue(50)}px;
  margin-right: ${RFValue(10)}px;
`;

export const Footer = styled.View`
  padding: ${RFValue(10)}px;
  flex-direction: row;
  align-items: center;
`;

export const ConfirmButton = styled.TouchableOpacity<ConfirmButtonProps>`
  background-color: ${props =>
    props.backgroundColor
      ? props.backgroundColor
      : ({theme}) => theme.colors.primary};
  padding: ${RFValue(10)}px;
  border-radius: ${RFValue(5)}px;
  flex: 1;
  height: ${RFValue(55)}px;
  justify-content: center;
  align-items: center;
`;

export const HeaderDialog = styled.View`
  margin-bottom: ${themeCss.spacing.large}px;
`;

export const ConfirmButtonText = styled.Text`
  color: ${({theme}) => theme.colors.primaryText};
  text-align: center;
  font-size: ${RFValue(16)}px;
`;

export const OptionalButton = styled.TouchableOpacity<{turbined?: boolean}>`
  margin-right: ${RFValue(5)}px;
  background-color: ${({theme, turbined}) =>
    turbined ? theme.colors.primary : theme.colors.background_global};
  border-radius: ${RFValue(5)}px;
  max-width: 18%;
  padding: ${RFValue(10)}px 0;
  flex: 1;
  height: ${RFValue(55)}px;
  justify-content: center;
  align-items: center;
  elevation: 5;

  shadow-color: ${({theme}) => theme.colors.secondary};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.2;
  shadow-radius: ${RFValue(5)}px;
`;

export const OptionalButtonText = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${RFValue(8)}px;
  font-weight: bold;
`;

export const OptionsList = styled.FlatList`
  max-height: ${RFValue(180)}px;
  min-height: ${RFValue(180)}px;
  margin-top: ${RFValue(5)}px;
`;

export const OptionTravelItem = styled.TouchableOpacity<{selected?: boolean}>`
  ${({selected, theme}) =>
    selected &&
    css`
      background-color: ${({theme}) => lighten(0.54, theme.colors.primary)};
      border: ${RFValue(1)}px solid
        ${shade(0.5, theme.colors.background_global)};
      elevation: 1;
      border-top-left-radius: ${RFValue(6)}px;
      border-top-right-radius: ${RFValue(6)}px;
      border-bottom-left-radius: ${RFValue(6)}px;
      border-bottom-right-radius: ${RFValue(6)}px;
      z-index: 1;
    `}
`;

export const OptionTravelItemContent = styled.View`
  flex-direction: row;
  padding: ${RFValue(8)}px;
  align-items: center;
  justify-content: center;
`;

export const RateImage = styled.ImageBackground`
  height: ${RFValue(50)}px;
  width: ${RFValue(50)}px;
`;

export const ContainerTextDriver = styled.View`
  flex: 1;
  margin-right: 20%;
`;

export const ContainerTextAnother = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-evenly;
  padding: ${({theme}) => theme.spacing.medium}px;
  margin-right: 20%;
`;

export const RateLabelContent = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding: 0px ${RFValue(10)}px;
`;

export const ContainerPrices = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const RateLabel = styled.Text<{turbined?: boolean}>`
  font-size: ${RFValue(12)}px;
  font-weight: bold;
  color: ${({theme, turbined}) =>
    turbined ? theme.colors.primary : theme.colors.secondary};
`;

export const RatePriceLabel = styled.Text<{turbined?: boolean}>`
  font-size: ${RFValue(12)}px;
  font-weight: bold;
  color: ${({theme, turbined}) =>
    turbined ? theme.colors.primary : theme.colors.secondary};
`;
export const RatePriceNoDiscount = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  text-decoration: line-through;
  font-weight: bold;
  color: ${({theme}) => theme.colors.secondary};
`;

export const OptionInDriver = styled.View`
  width: 100%;
  flex-direction: row;
  padding: ${RFValue(12)}px ${RFValue(14)}px;
  margin-top: -${RFValue(5)}px;
  align-items: center;
  background-color: ${({theme}) => theme.colors.border_green};
  border-radius: ${RFValue(5)}px;

  elevation: 5;

  shadow-color: ${({theme}) => theme.colors.secondary};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.5;
  shadow-radius: ${RFValue(5)}px;
`;

export const TextBid = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;
  color: ${({theme}) => theme.colors.background_global};
`;

export const OptionCoupon = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  padding: ${RFValue(8)}px ${RFValue(14)}px;
  align-items: center;
  background-color: ${({theme}) => shade(0.1, theme.colors.background_global)};
`;

export const Image = styled.Image`
  width: ${RFValue(30)}px;
  height: ${RFValue(30)}px;
  margin-right: ${RFValue(10)}px;
`;
export const ImageBid = styled.Image`
  max-width: ${RFValue(18)}px;
  max-height: ${RFValue(18)}px;
  margin-right: ${RFValue(10)}px;
`;

export const CancelationFeeContainer = styled.View`
  align-items: center;
  padding: ${RFValue(5)}px;
`;

export const PaymentMethodContainer = styled.View`
  border-top-width: ${RFValue(1)}px;
  border-top-color: ${({theme}) => theme.colors.border};
  border-bottom-width: ${RFValue(1)}px;
  border-bottom-color: ${({theme}) => theme.colors.border};
  flex-direction: row;
  align-items: center;
`;

export const ButtonOpenPaymentMethodModal = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`;

export const ButtonOpenPaymentMethodRight = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  border-left-width: ${RFValue(1)}px;
  border-left-color: ${({theme}) => theme.colors.border};
  max-width: 50%;
  gap: ${RFValue(8)}px;
  padding: 0 ${RFValue(8)}px;
`;

export const PaymentMethodSelected = styled.Text`
  font-size: ${RFValue(13)}px;
  padding: ${RFValue(8)}px ${RFValue(4)}px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.secondary};
`;

export const CurrencyType = styled.Text`
  font-size: ${RFValue(15)}px;
  padding: ${RFValue(8)}px ${RFValue(4)}px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.secondary};
`;

export const Loading = styled.ActivityIndicator.attrs(({theme}) => ({
  size: 'large',
  color: theme.colors.black,
}))``;

export const LoadingContainer = styled.View`
  height: ${RFValue(200)}px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;
