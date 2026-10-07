import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.large}px;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const HeaderButton = styled.TouchableOpacity`
  width: ${RFValue(32)}px;
  height: ${RFValue(32)}px;
  align-items: center;
  justify-content: center;
`;

export const HeaderTitle = styled.Text`
  flex: 1;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const Content = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    padding: theme.spacing.large,
    gap: theme.spacing.large,
  },
}))``;

export const InfoNoteRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: ${RFValue(6)}px;
  padding: 0 ${({ theme }) => theme.spacing.small}px;
`;

export const InfoNoteText = styled.Text`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;
