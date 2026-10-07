import styled from 'styled-components/native';

export const ModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 16px;
`;

export const ModalTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const CloseButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
`;

export const InfoDivider = styled.View`
  width: 1px;
  background-color: ${({ theme }) => theme.colors.secondary}20;
  margin-vertical: 12px;
`;

export const TextPix = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
  text-align: center;
  line-height: 18px;
  margin-bottom: 20px;
  padding-horizontal: 16px;
`;

export const InfoText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
  text-align: center;
  line-height: 18px;
  margin-bottom: 10px;
  padding-horizontal: 16px;
`;
