import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const TRIP_TYPE_IMAGE_WIDTH = RFValue(52);
export const TRIP_TYPE_IMAGE_HEIGHT = RFValue(38);

export const ICON_COLOR_MUTED = '#94a3b8';
export const ICON_COLOR_UNSELECTED = '#cbd5e1';

const baseCardCss = `
  flex-direction: row;
  align-items: center;
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 10px;
`;

export const ItemCard = styled.TouchableOpacity`
  ${baseCardCss}
  background-color: #f8fafc;
  border: 1.5px solid #e2e8f0;
`;

export const ItemCardSelected = styled.TouchableOpacity`
  ${baseCardCss}
  background-color: ${({ theme }) => theme.colors.primary}12;
  border: 1.5px solid ${({ theme }) => theme.colors.primary};
`;

export const ItemImageWrap = styled.View`
  width: ${TRIP_TYPE_IMAGE_WIDTH}px;
  height: ${TRIP_TYPE_IMAGE_HEIGHT}px;
  border-radius: 8px;
  margin-right: 14px;
  overflow: visible;
  align-items: center;
  justify-content: center;
`;

export const TripTypeImage = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: ${TRIP_TYPE_IMAGE_WIDTH}px;
  height: ${TRIP_TYPE_IMAGE_HEIGHT}px;
`;

export const ItemImagePlaceholder = styled.View`
  width: ${TRIP_TYPE_IMAGE_WIDTH}px;
  height: ${TRIP_TYPE_IMAGE_HEIGHT}px;
  border-radius: 8px;
  background-color: #f1f5f9;
  align-items: center;
  justify-content: center;
`;

export const TurbineBadge = styled.View`
  position: absolute;
  top: -6px;
  right: -6px;
`;

export const ItemTextWrap = styled.View`
  flex: 1;
`;

export const ItemName = styled.Text<{ selected?: boolean }>`
  font-size: ${RFValue(14)}px;
  font-family: MavenPro_600SemiBold;
  color: ${({ theme, selected }) => (selected ? theme.colors.primary : '#1e293b')};
`;

export const ItemDescription = styled.Text`
  font-size: ${RFValue(11)}px;
  font-family: MavenPro_400Regular;
  color: ${ICON_COLOR_MUTED};
  margin-top: 3px;
  line-height: ${RFValue(16)}px;
`;

export const ItemPrice = styled.Text<{ turbine?: boolean }>`
  font-size: ${RFValue(13)}px;
  font-family: MavenPro_600SemiBold;
  color: ${({ theme, turbine }) => (turbine ? theme.colors.primary : theme.colors.secondary)};
  margin-top: 3px;
`;

export const ItemCheckWrap = styled.View`
  margin-left: 10px;
`;
