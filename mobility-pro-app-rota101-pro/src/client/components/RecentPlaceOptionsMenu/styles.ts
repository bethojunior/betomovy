import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  color: ${({theme}) => theme.colors.text_gray};
  margin-bottom: ${({theme}) => theme.spacing.medium}px;
  padding: 0 ${({theme}) => theme.spacing.xlarge}px;
`;

export const OptionRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing.medium}px;
  padding: ${({theme}) => theme.spacing.large}px ${({theme}) => theme.spacing.xlarge}px;
  border-bottom-width: ${RFValue(1)}px;
  border-color: ${({theme}) => theme.colors.border};
`;

export const OptionText = styled.Text<{color?: string}>`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme, color}) => color || theme.colors.secondary};
`;
