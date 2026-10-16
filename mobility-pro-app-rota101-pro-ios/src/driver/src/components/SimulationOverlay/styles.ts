import styled from 'styled-components/native';
import { Animated, Image, TouchableOpacity } from 'react-native';
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
  background-color: #0a84ff;
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

export const ProgressBlock = styled.View`
  align-items: flex-end;
  margin-right: 12px;
`;

export const ProgressCount = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  line-height: 22px;
`;

export const ProgressTotal = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: 400;
  color: ${({ theme }) => rgba(theme.colors.secondary, 0.5)};
`;

export const ProgressLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => rgba(theme.colors.secondary, 0.5)};
`;

export const StopButton = styled(TouchableOpacity)`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.red};
  align-items: center;
  justify-content: center;
`;
