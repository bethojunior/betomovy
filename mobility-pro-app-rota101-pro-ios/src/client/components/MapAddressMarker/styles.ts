import { PixelRatio } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Reanimated from 'react-native-reanimated';
import { readableTextColor } from '~/utils/color';
import {
  ACTION_COLUMN_WIDTH,
  CARD_HEIGHT,
  CARD_WIDTH,
  ETA_BADGE_WIDTH,
  PIN_SIZE,
} from './constants';

const round = PixelRatio.roundToNearestPixel;

// @ts-ignore — styled-components + reanimated.View
export const CardContainer = styled(Reanimated.View)`
  position: absolute;
`;

export const PinContainer = styled.View`
  position: absolute;
`;

export const MarkerCard = styled.TouchableOpacity.attrs({
  activeOpacity: 0.85,
})`
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT}px;
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.background_global};
  border-radius: ${RFValue(2)}px;
  overflow: hidden;
  shadow-color: #000000;
  shadow-offset: 0px ${round(4)}px;
  shadow-opacity: 0.14;
  shadow-radius: ${round(10)}px;
  elevation: 10;
`;

export const MarkerPin = styled.View<{ $variant: 'origin' | 'destination' }>`
  width: ${PIN_SIZE}px;
  height: ${PIN_SIZE}px;
  border-width: ${round(2)}px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.background_global};
  border-radius: ${({ $variant }) =>
    $variant === 'origin' ? round(PIN_SIZE / 2) : round(2)}px;
  background-color: #000000;
  shadow-color: #000000;
  shadow-offset: 0px ${round(2)}px;
  shadow-opacity: 0.2;
  shadow-radius: ${round(3)}px;
  elevation: 6;
`;

export const EtaBadge = styled.View`
  width: ${ETA_BADGE_WIDTH}px;
  background-color: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

export const EtaValue = styled.Text.attrs({
  style: { includeFontPadding: false },
})`
  font-size: ${RFValue(12)}px;
  font-weight: 700;
  color: ${({ theme }) => readableTextColor(theme.colors.primary)};
`;

export const EtaUnit = styled.Text.attrs({
  style: { includeFontPadding: false },
})`
  font-size: ${RFValue(10)}px;
  font-weight: 500;
  color: ${({ theme }) => readableTextColor(theme.colors.primary)};
  margin-top: ${round(2)}px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
`;

export const AddressContent = styled.View`
  flex: 1;
  padding-horizontal: ${RFValue(10)}px;
  justify-content: center;
`;

export const AddressLabel = styled.Text.attrs({
  style: { includeFontPadding: false },
})`
  font-size: ${RFValue(12)}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const ActionColumn = styled.View`
  width: ${ACTION_COLUMN_WIDTH}px;
  align-items: center;
  justify-content: center;
`;

export const NavigationIcon = styled(MaterialIcons).attrs(() => ({
  name: 'edit' as const,
  size: RFValue(18),
  color: `${({ theme }) => theme.colors.icon_gray}`,
}))``;
