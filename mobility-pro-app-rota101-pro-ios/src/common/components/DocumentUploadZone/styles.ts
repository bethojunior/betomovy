import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import { cardShadow } from '../../theme/cardShadow';

export const DropZone = styled.TouchableOpacity`
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxlarge}px;
  border-width: ${({ theme }) => theme.borderWidth.medium}px;
  border-style: dashed;
  border-color: ${({ theme }) => theme.colors.black};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
`;

export const DropZoneTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.black};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.small}px;
`;

export const DropZoneInstruction = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.small}px;
`;

export const PreviewWrapper = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
  padding: ${({ theme }) => theme.spacing.large}px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  ${cardShadow}
`;

export const PreviewImage = styled.Image`
  width: ${RFValue(60)}px;
  height: ${RFValue(60)}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
`;

export const PreviewFileRow = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small}px;
`;

export const PreviewFileName = styled.Text`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const RemoveButton = styled.TouchableOpacity``;

export const PickerContent = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing.xlarge}px;
  padding-bottom: ${({ theme }) => theme.spacing.xlarge}px;
`;

export const PickerTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.medium}px;
`;

export const PickerOption = styled.TouchableOpacity<{ isLast?: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
  padding-vertical: ${({ theme }) => theme.spacing.medium}px;
  border-bottom-width: ${({ isLast, theme }) => (isLast ? 0 : theme.borderWidth.small)}px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const PickerOptionText = styled.Text`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  color: ${({ theme }) => theme.colors.secondary};
`;
