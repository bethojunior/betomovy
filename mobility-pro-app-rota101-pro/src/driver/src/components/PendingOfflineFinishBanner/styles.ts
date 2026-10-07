import styled from 'styled-components/native';
import { Animated } from 'react-native';
import { rgba } from 'polished';

export const Container = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background_global};
  padding-vertical: 12px;
  padding-horizontal: 24px;
  border-bottom-width: 0.5px;
  border-color: ${({ theme }) => rgba(theme.colors.secondary, 0.2)};
`;

export const InfoGroup = styled.View`
  flex: 1;
`;

export const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

export const Dot = styled(Animated.View)`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #f8a63d;
`;

export const Title = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const Subtitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => rgba(theme.colors.secondary, 0.5)};
  margin-top: 2px;
`;

export const CountBlock = styled.View`
  align-items: flex-end;
`;

export const CountValue = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  line-height: 22px;
`;

export const CountLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => rgba(theme.colors.secondary, 0.5)};
`;
