import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

const MARKER_COLUMN_WIDTH = RFValue(16);
const LINE_WIDTH = 2;

export const Card = styled.View`
  position: relative;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  padding: ${({ theme }) => theme.spacing.large}px;
`;

export const TimelineLine = styled.View`
  position: absolute;
  top: ${RFValue(8)}px;
  bottom: ${RFValue(8)}px;
  left: ${({ theme }) => theme.spacing.large + (MARKER_COLUMN_WIDTH - LINE_WIDTH) / 2}px;
  width: ${LINE_WIDTH}px;
  background-color: ${({ theme }) => theme.colors.border};
`;

export const PointRow = styled.View<{ isLast?: boolean }>`
  flex-direction: row;
  margin-bottom: ${({ theme, isLast }) => (isLast ? 0 : theme.spacing.large)}px;
`;

export const MarkerColumn = styled.View`
  width: ${MARKER_COLUMN_WIDTH}px;
  align-items: center;
  padding-top: ${RFValue(3)}px;
  margin-right: ${({ theme }) => theme.spacing.medium}px;
`;

export const DotOrigin = styled.View`
  width: ${RFValue(10)}px;
  height: ${RFValue(10)}px;
  border-radius: ${RFValue(5)}px;
  background-color: ${({ theme }) => theme.colors.marker_origin};
`;

export const DotWaypoint = styled.View`
  width: ${RFValue(8)}px;
  height: ${RFValue(8)}px;
  border-radius: ${RFValue(4)}px;
  background-color: ${({ theme }) => theme.colors.grayLight};
`;

export const DotDestination = styled.View`
  width: ${RFValue(10)}px;
  height: ${RFValue(10)}px;
  background-color: ${({ theme }) => theme.colors.marker_destination};
`;

export const PointBlock = styled.View`
  flex: 1;
`;

export const PointLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  margin-bottom: ${RFValue(2)}px;
`;

export const PointPrimaryText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const PointSecondaryText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.grayLight};
  margin-top: ${RFValue(2)}px;
`;

export const StopsToggle = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(6)}px;
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
`;

export const StopsToggleText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;
