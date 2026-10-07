import styled from 'styled-components/native';

export const JourneyCard = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #f1f5f9;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: flex-start;
`;

export const Dot = styled.View<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: ${({ color }) => color};
  border: 3px solid #fff;
  elevation: 2;
`;

export const WaypointDot = styled.View`
  width: 14px;
  height: 14px;
  border-radius: 3px;
  background-color: #94a3b8;
  border: 2px solid #fff;
  elevation: 1;
`;

export const TimelineLine = styled.View`
  width: 2px;
  flex: 1;
  min-height: 18px;
  background-color: #e2e8f0;
  margin-vertical: 4px;
`;

export const TitleResume = styled.Text`
  font-size: 12px;
  font-family: MavenPro_500Medium;
  color: #6b7280;
`;

export const WaypointLabel = styled.Text`
  font-size: 10px;
  font-family: MavenPro_600SemiBold;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 1px;
`;

export const Info = styled.Text`
  font-size: 14px;
  font-family: MavenPro_400Regular;
  color: #111827;
  margin-top: 2px;
`;

export const WaypointToggleRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 6px;
  padding-right: 2px;
`;

export const WaypointBadge = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f1f5f9;
  border-radius: 20px;
  padding-vertical: 4px;
  padding-horizontal: 10px;
  gap: 5px;
`;

export const WaypointBadgeText = styled.Text`
  font-size: 12px;
  font-family: MavenPro_600SemiBold;
  color: #475569;
`;

export const WaypointChevron = styled.View<{ open: boolean }>`
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background-color: ${({ open }) => (open ? '#e2e8f0' : 'transparent')};
`;

export const WaypointsDropdown = styled.View`
  background-color: #f8fafc;
  border-radius: 10px;
  margin-top: 6px;
  margin-bottom: 10px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
`;

export const WaypointsScroll = styled.ScrollView`
  max-height: 140px;
`;

export const WaypointItem = styled.View<{ isLast: boolean }>`
  flex-direction: row;
  align-items: flex-start;
  padding-vertical: 10px;
  padding-horizontal: 12px;
  border-bottom-width: ${({ isLast }) => (isLast ? '0' : '1')}px;
  border-bottom-color: #e2e8f0;
`;

export const WaypointItemAddress = styled.Text`
  font-size: 13px;
  font-family: MavenPro_400Regular;
  color: #1e293b;
  line-height: 18px;
`;
