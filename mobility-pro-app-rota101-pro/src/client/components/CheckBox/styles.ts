import {RFValue} from 'react-native-responsive-fontsize';
import styled, {css} from 'styled-components/native';

interface ItemProps {
  textColor?: string;
  titleSize?: string;
  flex?: number;
}

export const ItemRow = styled.View<{flex?: number}>`
  flex-direction: row-reverse;
  justify-content: flex-end;
  align-items: center;
  flex: ${({flex}) => flex || 'none'};
`;

export const Item = styled.Text<ItemProps>`
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme, textColor}) => textColor ? textColor : theme.colors.primary};
  margin-left: ${RFValue(5)}px;
  flex: ${({flex}) => flex || 'none'};
  ${(props) => {
    switch (props.titleSize) {
      case 'small':
        return css`
          font-size: ${props.theme.fontSizes.smalls + 1}px;
        `;
      case 'medium':
        return css`
          font-size: ${props.theme.fontSizes.medium}px;
        `;
      case 'large':
        return css`
          font-size: ${props.theme.fontSizes.large}px;
        `;
      default:
        return css`
          font-size: ${props.theme.fontSizes.medium}px;
        `;
    }
  }};
`;
