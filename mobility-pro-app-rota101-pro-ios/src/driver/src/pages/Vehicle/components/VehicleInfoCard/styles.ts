import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  padding: ${({ theme }) => theme.spacing.large}px;
`;

export const SectionTitleRow = styled.View`
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
`;

export const SectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
  padding: ${({ theme }) => theme.spacing.medium}px 0;
`;

export const RowIconWrapper = styled.View`
  width: ${RFValue(30)}px;
  height: ${RFValue(30)}px;
  border-radius: ${RFValue(15)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background_white};
`;

export const RowContent = styled.View`
  flex: 1;
`;

export const RowLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const RowValue = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: ${({ theme }) => theme.spacing.small}px;
`;

export const RowInput = styled.TextInput.attrs({
  underlineColorAndroid: 'transparent',
})`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: ${({ theme }) => theme.spacing.small}px;
  padding: ${({ theme }) => theme.spacing.small}px ${({ theme }) => theme.spacing.medium}px;
  border-width: ${({ theme }) => theme.borderWidth.small}px;
  border-color: ${({ theme }) => theme.colors.black};
  border-radius: ${({ theme }) => theme.borderRadius.small}px;
`;

export const BrandPickerButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.small}px;
  padding: ${({ theme }) => theme.spacing.small}px ${({ theme }) => theme.spacing.medium}px;
  border-width: ${({ theme }) => theme.borderWidth.small}px;
  border-color: ${({ theme }) => theme.colors.black};
  border-radius: ${({ theme }) => theme.borderRadius.small}px;
`;

export const BrandPickerButtonText = styled.Text<{ placeholder: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme, placeholder }) =>
    placeholder ? theme.colors.input_placeholder : theme.colors.secondary};
`;

export const BackToBrandListButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small}px;
  margin-top: ${({ theme }) => theme.spacing.small}px;
`;

export const BackToBrandListText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors.primary};
`;

export const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
`;
