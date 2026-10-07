import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface ItemProps {
  textColor?: string;
}

export const ItemRow = styled.View`
  flex-direction: row-reverse;
  align-items: center;
`;

export const Item = styled.Text<ItemProps>`
  font-size: ${({theme}) => theme.fontSizes.small + 6}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme, textColor}) =>
    textColor ? textColor : theme.colors.primary};
  margin-left: ${RFValue(5)}px;
`;
