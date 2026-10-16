import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { cardShadow } from '../../theme/cardShadow';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.medium}px;
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.large}px;
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.large}px;
  ${cardShadow}
`;

export const PressableContent = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const GoBackButton = styled.TouchableOpacity`
  padding: 6px 10px 6px 4px;
`;

export const TitleColumn = styled.View`
  flex: 1;
  margin-left: ${({ theme }) => theme.spacing.medium}px;
`;

export const Label = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.grayLight};
`;

export const Title = styled.Text`
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const SubtitleContainer = styled.View`
  margin-top: ${RFValue(4)}px;
`;

export const CallButtonContainer = styled.View`
  margin-left: ${({ theme }) => theme.spacing.medium}px;
`;

export const CallButton = styled.TouchableOpacity`
  width: 35px;
  height: 35px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
`;
