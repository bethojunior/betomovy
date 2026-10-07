import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface SimpleTextProps {
  colorText?: string;
}

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const Content = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    padding: RFValue(20),
  },
})`
  flex: 1;
`;

export const SimpleText = styled.Text<SimpleTextProps>`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  letter-spacing: ${RFValue(0.4)}px;
  line-height: ${RFValue(20)}px;
  opacity: 0.8;
  color: ${props =>
    props.colorText ? props.colorText : ({ theme }) => theme.colors.secondary};
`;
