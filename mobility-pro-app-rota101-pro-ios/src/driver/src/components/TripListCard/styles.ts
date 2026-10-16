import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export * from '../../../../common/components/TripListCard/styles';

export const MetricsRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const MetricBlock = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(6)}px;
`;

export const MetricTextBlock = styled.View``;

export const MetricCaption = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const MetricValue = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const MetricDivider = styled.View`
  width: 1px;
  height: ${RFValue(24)}px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: 0 ${({ theme }) => theme.spacing.medium}px;
`;
