import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.xlarge}px;
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
`;

export const HeaderTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xlarge}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const CloseButton = styled.TouchableOpacity`
  width: ${RFValue(30)}px;
  height: ${RFValue(30)}px;
  border-radius: ${RFValue(15)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background_global};
`;
