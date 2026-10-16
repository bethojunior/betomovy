import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import { Card } from '~/components/ui/Card';

export const Container = styled(Card)`
  margin: 6px 0;
  border-left-width: 4px;
  border-color: ${({ theme }) => theme.colors.primary};
`;

/* ── Passenger section ── */
export const PassengerSection = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 14px 16px 12px 16px;
  gap: 12px;
`;

export const AvatarWrapper = styled.View``;

export const Photo = styled.Image`
  width: ${RFValue(52)}px;
  height: ${RFValue(52)}px;
  border-radius: ${RFValue(26)}px;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const AvatarFallback = styled.View`
  width: ${RFValue(52)}px;
  height: ${RFValue(52)}px;
  border-radius: ${RFValue(26)}px;
  background-color: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

export const PassengerInfo = styled.View`
  flex: 1;
`;

export const PassengerName = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${RFValue(14)}px;
  font-family: MavenPro_600SemiBold;
  line-height: ${RFValue(19)}px;
`;

export const TripTypeBadge = styled.View<{ isShared?: boolean }>`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  background-color: ${({ theme, isShared }) =>
    isShared ? theme.colors.background_greenLight : theme.colors.blue_water};
  border-radius: 20px;
  padding: 3px 10px;
  margin-top: 4px;
  gap: 4px;
`;

export const TripTypeBadgeText = styled.Text<{ isShared?: boolean }>`
  font-size: ${RFValue(10)}px;
  font-family: MavenPro_600SemiBold;
  color: ${({ theme, isShared }) =>
    isShared ? theme.colors.on : theme.colors.primary};
`;

/* ── Date/time row ── */
export const DateTimeRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background_white};
  padding: 9px 16px;
  gap: 8px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

export const DateTimeItem = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

export const DateTimeText = styled.Text`
  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.colors.secondary};
  font-family: MavenPro_600SemiBold;
`;

/* ── Route section ── */
export const RouteSection = styled.View`
  flex-direction: row;
  padding: 14px 16px;
  gap: 12px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

export const Timeline = styled.View`
  align-items: center;
  padding-top: 3px;
`;

export const DotOrigin = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const TimelineLine = styled.View`
  width: 2px;
  flex: 1;
  min-height: 22px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: 4px 0;
`;

export const DotDestination = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.colors.red};
`;

export const RouteAddresses = styled.View`
  flex: 1;
  justify-content: space-between;
  gap: 8px;
`;

export const AddressLabel = styled.Text`
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.grayLight};
  font-family: MavenPro_600SemiBold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1px;
`;

export const AddressText = styled.Text`
  font-size: ${RFValue(12)}px;
  color: ${({ theme }) => theme.colors.secondary};
  font-family: MavenPro_600SemiBold;
  line-height: ${RFValue(17)}px;
`;

export const AddressBlock = styled.View``;

/* ── Footer ── */
export const Footer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px 16px 14px 16px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
  gap: 12px;
`;

export const PriceBlock = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const PriceLabel = styled.Text`
  font-size: ${RFValue(10)}px;
  color: ${({ theme }) => theme.colors.grayLight};
  font-family: MavenPro_600SemiBold;
`;

export const PriceValue = styled.Text`
  font-size: ${RFValue(18)}px;
  color: ${({ theme }) => theme.colors.primary};
  font-family: MavenPro_600SemiBold;
`;

export const AcceptButton = styled.TouchableOpacity`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  padding: 13px 0;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 6px;
`;

export const AcceptButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${RFValue(13)}px;
  font-family: MavenPro_600SemiBold;
`;

export const CancelButton = styled.TouchableOpacity`
  flex: 1;
  border-radius: 12px;
  padding: 13px 0;
  align-items: center;
  justify-content: center;
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.red};
`;

export const CancelButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.red};
  font-size: ${RFValue(12)}px;
  font-family: MavenPro_600SemiBold;
`;

