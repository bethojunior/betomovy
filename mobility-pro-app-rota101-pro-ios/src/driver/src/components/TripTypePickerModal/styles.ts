import { FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import { TripType } from '../../context/Trip/types';

export const ICON_COLOR_MUTED = '#94a3b8';

const TRIP_TYPE_LIST_CONTENT_STYLE = {
  paddingBottom: RFValue(8),
};

/* ─── Overlay ────────────────────────────────────────────────── */

export const Backdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.45);
  justify-content: flex-end;
`;

/* ─── Bottom sheet ───────────────────────────────────────────── */

export const Sheet = styled.View<{ bottomInset?: number }>`
  background-color: #ffffff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding-top: 12px;
  padding-horizontal: 20px;
  padding-bottom: ${({ bottomInset }) => bottomInset ?? RFValue(12)}px;
  max-height: 82%;
  shadow-color: #000;
  shadow-offset: 0px -4px;
  shadow-opacity: 0.12;
  shadow-radius: 12px;
  elevation: 20;
`;

export const Handle = styled.View`
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background-color: #e2e8f0;
  align-self: center;
  margin-bottom: 20px;
`;

/* ─── Cabeçalho ─────────────────────────────────────────────── */

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-horizontal: 4px;
`;

export const TitleText = styled.Text`
  font-size: ${RFValue(18)}px;
  font-family: MavenPro_700Bold;
  color: #0f172a;
`;

export const SubtitleText = styled.Text`
  font-size: ${RFValue(12)}px;
  font-family: MavenPro_400Regular;
  color: #94a3b8;
  margin-top: 2px;
`;

/* ─── Empty state ────────────────────────────────────────────── */

export const EmptyText = styled.Text`
  text-align: center;
  font-size: ${RFValue(13)}px;
  font-family: MavenPro_400Regular;
  color: #94a3b8;
  padding-vertical: 32px;
`;

export const TripTypeList = styled(FlatList<TripType>).attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: TRIP_TYPE_LIST_CONTENT_STYLE,
})``;
