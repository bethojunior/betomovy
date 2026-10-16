import Animated from 'react-native-reanimated';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled(Animated.View)`
  flex: 1;
  position: absolute;
  width: 100%;
  background-color: ${({theme}) => theme.colors.white};
  z-index: 2;
  gap: ${({theme}) => theme.spacing.large}px;

  padding: ${({theme}) => theme.spacing.large}px;

  border-top-left-radius: ${({theme}) => theme.borderRadius.xlarge}px;
  border-top-right-radius: ${({theme}) => theme.borderRadius.xlarge}px;

  bottom: 0;
`;

export const Handle = styled.View`
  align-self: center;
  width: ${RFValue(40)}px;
  height: ${RFValue(4)}px;
  border-radius: ${RFValue(2)}px;
  background-color: ${({theme}) => theme.colors.border};
`;

export const ContainerClose = styled.View`
  position: absolute;
  top: ${({theme}) => theme.spacing.large}px;
  right: ${({theme}) => theme.spacing.large}px;
  z-index: 1;
`;

export const CloseButton = styled.TouchableOpacity`
  width: ${RFValue(30)}px;
  height: ${RFValue(30)}px;
  border-radius: ${RFValue(15)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const DriverRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing.medium}px;
`;

export const ButtonImage = styled.TouchableOpacity``;

export const ImageClient = styled.Image`
  width: ${RFValue(56)}px;
  height: ${RFValue(56)}px;
  border-radius: ${RFValue(28)}px;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const DriverTextGroup = styled.View`
  flex: 1;
`;

export const DriverCaption = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  color: ${({theme}) => theme.colors.grayLight};
`;

export const TextClient = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.secondary};
`;

export const PriceCard = styled.View`
  align-items: center;
  gap: ${RFValue(4)}px;
  background-color: ${({theme}) => theme.colors.background_greenLight};
  border-radius: ${({theme}) => theme.borderRadius.large}px;
  padding: ${({theme}) => theme.spacing.large}px;
`;

export const PriceLabelRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(6)}px;
`;

export const PriceLabel = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.border_green};
`;

export const Price = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xslarge}px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.border_green};
`;

export const AddressCard = styled.View`
  background-color: ${({theme}) => theme.colors.white};
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border_white_light};
  border-radius: ${({theme}) => theme.borderRadius.large}px;
  padding: ${({theme}) => theme.spacing.large}px;
`;

export const AddressCardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(6)}px;
  margin-bottom: ${({theme}) => theme.spacing.medium}px;
`;

export const AddressCardHeaderText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.secondary};
`;

export const AddressContent = styled.View`
  flex-direction: row;
`;

export const AddressIconsColumn = styled.View`
  width: ${RFValue(16)}px;
  align-items: center;
  padding-top: ${RFValue(2)}px;
  margin-right: ${({theme}) => theme.spacing.medium}px;
`;

export const Ball = styled.View<{color?: string}>`
  width: ${RFValue(10)}px;
  height: ${RFValue(10)}px;
  border-radius: ${RFValue(5)}px;
  background-color: ${({color, theme}) => color || theme.colors.marker_origin};
`;

export const Line = styled.View`
  width: 1px;
  flex: 1;
  min-height: ${RFValue(20)}px;
  border-left-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
  border-style: dashed;
  margin: ${RFValue(4)}px 0;
`;

export const Square = styled.View`
  width: ${RFValue(10)}px;
  height: ${RFValue(10)}px;
  background-color: ${({theme}) => theme.colors.marker_destination};
`;

export const AddressBlocks = styled.View`
  flex: 1;
  gap: ${({theme}) => theme.spacing.large}px;
`;

export const Address = styled.Text<{selected?: boolean}>`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-weight: ${({selected}) => (selected ? '700' : '400')};
  color: ${({theme}) => theme.colors.text_gray};
`;

export const ContainerPrice = styled.View`
  gap: ${({theme}) => theme.spacing.small}px;
`;

export const ContainerRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(4)}px;
`;

export const SimpleText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.border_green};
`;
