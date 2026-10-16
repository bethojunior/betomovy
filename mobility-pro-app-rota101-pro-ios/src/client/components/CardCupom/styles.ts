import {mix, rgba} from 'polished';
import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';

interface CardProps {
  disabled?: boolean;
  selected?: boolean;
}

export const ICON_SIZE = RFValue(56);
const BORDER_WIDTH = RFValue(1.5);

// ---------- wrapper (toque no ticket inteiro seleciona) ----------

export const ContainerCard = styled.TouchableOpacity`
  width: 100%;
  margin-top: ${({theme}) => theme.spacing.large}px;
`;

// ---------- casco do card (reto, sem recortes) ----------

export const Card = styled.View<CardProps>`
  flex-direction: row;
  align-items: stretch;
  border-radius: ${({theme}) => theme.borderRadius.large}px;
  border-width: ${BORDER_WIDTH}px;
  border-color: ${({theme}) => theme.colors.primary};
  background-color: ${({theme, selected}) =>
    selected ? mix(0.08, theme.colors.primary, theme.colors.white) : theme.colors.white};
  opacity: ${({disabled}) => (disabled ? 0.5 : 1)};
`;

// ---------- CouponStub (canhoto destacável, lado esquerdo) ----------

export const StubColumn = styled.View`
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  max-width: 34%;
  padding: ${({theme}) => theme.spacing.medium}px ${({theme}) => theme.spacing.small}px;
  gap: ${RFValue(3)}px;
`;

export const IconAvatar = styled.View`
  width: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${({theme}) => rgba(theme.colors.primary, 0.1)};
`;

export const Image = styled.Image`
  width: ${RFValue(30)}px;
  height: ${RFValue(30)}px;
`;

export const StubCode = styled.Text`
  text-align: center;
  flex-wrap: wrap;
  font-size: ${RFValue(11.5)}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.secondary};
`;

export const StubLabel = styled.Text`
  text-align: center;
  text-transform: uppercase;
  font-size: ${RFValue(7.5)}px;
  font-family: ${({theme}) => theme.fonts.medium};
  letter-spacing: 0.3px;
  color: ${({theme}) => theme.colors.text_gray};
`;

// ---------- divisória tracejada entre canhoto e corpo do ticket ----------

export const DividerColumn = styled.View`
  flex-direction: column;
  align-self: stretch;
  align-items: center;
  justify-content: space-between;
  width: ${RFValue(9)}px;
  padding: ${({theme}) => theme.spacing.medium}px 0;
`;

export const VDash = styled.View`
  width: ${RFValue(2)}px;
  height: ${RFValue(4.5)}px;
  border-radius: ${RFValue(1)}px;
  background-color: ${({theme}) => rgba(theme.colors.primary, 0.55)};
`;

// ---------- corpo do ticket (lado direito) ----------

export const Content = styled.View`
  flex: 1;
  min-width: 0;
  justify-content: center;
  padding: ${({theme}) => theme.spacing.small}px ${({theme}) => theme.spacing.medium}px;
  gap: ${({theme}) => theme.spacing.small}px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({theme}) => theme.spacing.small}px;
`;

export const CodeText = styled.Text`
  flex-shrink: 1;
  flex-wrap: wrap;
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.secondary};
`;

export const PriceValue = styled.Text`
  flex-shrink: 0;
  font-size: ${RFValue(13)}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.secondary};
`;

export const DiscountPill = styled.View`
  align-self: flex-start;
  padding: ${RFValue(3)}px ${({theme}) => theme.spacing.medium}px;
  border-radius: ${({theme}) => theme.borderRadius.xxlarge}px;
  background-color: ${({theme}) => rgba(theme.colors.primary, 0.14)};
`;

export const DiscountPillText = styled.Text`
  font-size: ${RFValue(9.5)}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.secondary};
`;

/** Linha tracejada horizontal — traços em fileira em vez de border-style: dashed (não renderiza no Android). */
export const HorizontalDivider = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Dash = styled.View`
  width: ${RFValue(4)}px;
  height: ${RFValue(1.5)}px;
  border-radius: ${RFValue(1)}px;
  background-color: ${({theme}) => rgba(theme.colors.primary, 0.5)};
`;

export const DetailList = styled.View`
  gap: ${RFValue(4)}px;
`;

export const DetailRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: ${RFValue(5)}px;
`;

export const DetailText = styled.Text`
  flex: 1;
  flex-wrap: wrap;
  font-size: ${RFValue(10)}px;
  line-height: ${RFValue(13)}px;
  color: ${({theme}) => theme.colors.text_gray};
`;

export const ValidUntilText = styled.Text`
  font-size: ${RFValue(10)}px;
  font-family: ${({theme}) => theme.fonts.medium};
  color: ${({theme}) => theme.colors.text_gray};
`;

export const PaymentFormCaption = styled.Text`
  font-size: ${RFValue(10)}px;
  font-family: ${({theme}) => theme.fonts.medium};
  color: ${({theme}) => theme.colors.destructive};
`;
