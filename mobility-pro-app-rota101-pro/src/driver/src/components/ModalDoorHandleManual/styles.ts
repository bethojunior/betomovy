import { MotiView } from 'moti';
import { TextInputMask } from 'react-native-masked-text';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import { Picker } from '@react-native-picker/picker';

/* ─── Container principal ─────────────────────────────────────── */

export const Container = styled(MotiView)`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

/* ─── Header ─────────────────────────────────────────────────── */

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xlarge}px ${({ theme }) => theme.spacing.xxlarge}px;
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom-width: 0.5px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const BackBtn = styled.TouchableOpacity`
  padding: ${({ theme }) => theme.spacing.medium}px;
  margin-left: ${RFValue(-6)}px;
`;

export const HeaderTitle = styled.Text`
  flex: 1;
  margin-left: ${({ theme }) => theme.spacing.medium}px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-family: ${({ theme }) => theme.fonts.medium};
`;

/* ─── ScrollView ─────────────────────────────────────────────── */

export const ScrollViewAddress = styled.View`
  flex: 1;
`;

/* ─── Card genérico ──────────────────────────────────────────── */

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xlarge}px ${({ theme }) => theme.spacing.xxlarge}px;
`;

export const AddressCard = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xlarge}px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.08;
  shadow-radius: 4px;
`;

/* ─── Seção de endereços (ícone + input) ─────────────────────── */

export const AddressRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
`;

export const AddressIconCol = styled.View`
  width: ${RFValue(20)}px;
  align-items: center;
  padding-top: ${RFValue(13)}px;
  margin-right: ${({ theme }) => theme.spacing.medium}px;
`;

export const OriginDot = styled.View`
  width: ${RFValue(10)}px;
  height: ${RFValue(10)}px;
  border-radius: ${RFValue(5)}px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const StopDot = styled.View`
  width: ${RFValue(9)}px;
  height: ${RFValue(9)}px;
  border-radius: ${RFValue(5)}px;
  background-color: ${({ theme }) => theme.colors.white};
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.primary};
`;

export const DestinationSquare = styled.View`
  width: ${RFValue(10)}px;
  height: ${RFValue(10)}px;
  border-radius: ${RFValue(2)}px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const RouteLine = styled.View`
  width: 1.5px;
  flex: 1;
  background-color: ${({ theme }) => theme.colors.border};
  margin-vertical: ${RFValue(3)}px;
  min-height: ${RFValue(14)}px;
`;

export const AddressInputWrap = styled.View`
  flex: 1;
  padding-bottom: ${({ theme }) => theme.spacing.medium}px;
`;

/* Input standalone (sem botão lateral) */
export const InputAddress = styled.TextInput.attrs({
  underlineColorAndroid: 'transparent',
})`
  height: ${RFValue(44)}px;
  text-align-vertical: center;
  padding: ${({ theme }) => theme.spacing.medium}px ${({ theme }) => theme.spacing.large}px;
  background-color: ${({ theme }) => theme.colors.background_global};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  text-align: left;
`;

/* Container input + botão colado */
export const InputWithButton = styled.View`
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.background_global};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  overflow: hidden;
  align-items: stretch;
`;

export const InputInRow = styled.TextInput.attrs({
  underlineColorAndroid: 'transparent',
})`
  flex: 1;
  height: ${RFValue(44)}px;
  text-align-vertical: center;
  padding: ${({ theme }) => theme.spacing.medium}px ${({ theme }) => theme.spacing.large}px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  text-align: left;
`;

/* Caixa relativa para posicionar o overlay de exibição sobre o input */
export const AddressFieldBox = styled.View`
  flex: 1;
  height: ${RFValue(44)}px;
  position: relative;
`;

/*
 * Overlay que mostra o valor do endereço com reticências no final quando
 * o campo não está focado. TextInput nativo, quando o texto é maior que a
 * largura visível e o campo perde o foco, pode manter o scroll na posição
 * do cursor (fim do texto) em vez de voltar ao início — por isso não dá
 * pra confiar só no TextInput pra exibir o valor truncado corretamente.
 */
export const AddressValueOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${RFValue(44)}px;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.medium}px ${({ theme }) => theme.spacing.large}px;
  background-color: ${({ theme }) => theme.colors.background_global};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
`;

export const AddressValueText = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  text-align: left;
`;

export const WaypointRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-top: ${({ theme }) => theme.spacing.small}px;
`;

export const RemoveWaypointButton = styled.TouchableOpacity`
  height: ${RFValue(44)}px;
  background-color: #ff3b30;
  align-items: center;
  justify-content: center;
  padding-horizontal: ${({ theme }) => theme.spacing.medium}px;
`;

export const AddWaypointIconButton = styled.TouchableOpacity`
  height: ${RFValue(44)}px;
  background-color: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
  padding-horizontal: ${({ theme }) => theme.spacing.medium}px;
`;

/* ─── Sugestões de endereço ──────────────────────────────────── */

export const SuggestionList = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-top-width: 0.5px;
  border-bottom-width: 0.5px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const SuggestionItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xlarge}px;
`;

export const SuggestionIconWrap = styled.View`
  width: ${RFValue(32)}px;
  height: ${RFValue(32)}px;
  border-radius: ${RFValue(16)}px;
  background-color: ${({ theme }) => theme.colors.background_global};
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing.large}px;
`;

export const SuggestionTextWrap = styled.View`
  flex: 1;
`;

export const SuggestionMainText = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-family: ${({ theme }) => theme.fonts.medium};
`;

export const SuggestionSubText = styled.Text`
  color: ${({ theme }) => theme.colors.placeholder};
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  margin-top: ${RFValue(2)}px;
`;

export const SuggestionDivider = styled.View`
  height: 0.5px;
  background-color: ${({ theme }) => theme.colors.border};
  margin-left: ${RFValue(58)}px;
`;

/* ─── Card de preço ──────────────────────────────────────────── */

export const PriceCard = styled.View`
  background-color: #e2e2e2;
  padding: ${({ theme }) => theme.spacing.xlarge}px ${({ theme }) => theme.spacing.xxlarge}px;
  align-items: center;
  border-bottom-width: 0.5px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const PriceTouchable = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(8)}px;
`;

export const PriceCardRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const PriceLargeText = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.xsslarge}px;
  font-family: ${({ theme }) => theme.fonts.bold};
`;

export const PriceSaveBtn = styled.TouchableOpacity`
  padding: ${RFValue(4)}px;
  opacity: 0.75;
`;

export const InputMask = styled(TextInputMask)`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.xsslarge}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  flex: 1;
`;

/* ─── Seção de formulário ────────────────────────────────────── */

export const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(6)}px;
  margin-bottom: ${({ theme }) => theme.spacing.medium}px;
`;

export const SectionLabel = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-family: ${({ theme }) => theme.fonts.medium};
`;

export const FormDivider = styled.View`
  height: 0.5px;
  background-color: ${({ theme }) => theme.colors.border};
  margin-vertical: ${({ theme }) => theme.spacing.medium}px;
`;

export const FormLabel = styled.Text`
  color: ${({ theme }) => theme.colors.placeholder};
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  font-family: ${({ theme }) => theme.fonts.medium};
  margin-bottom: ${RFValue(4)}px;
  text-transform: uppercase;
  letter-spacing: ${RFValue(0.5)}px;
`;

export const FormInput = styled.TextInput.attrs({
  underlineColorAndroid: 'transparent',
})`
  padding: ${({ theme }) => theme.spacing.medium}px 0;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const PickerContainer = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const StyledPicker = styled(Picker)`
  color: ${({ theme }) => theme.colors.secondary};
  margin-left: ${RFValue(-8)}px;
`;

/* ─── Scroll principal ───────────────────────────────────────── */

export const ScrollContent = styled.ScrollView`
  flex: 1;
`;

/* ─── Campos redesenhados ─────────────────────────────────────── */

export const FieldRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${({ theme }) => theme.spacing.large}px;
`;

export const FieldIconCircle = styled.View<{ focused?: boolean }>`
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;
  border-radius: ${RFValue(20)}px;
  background-color: ${({ theme, focused }) =>
    focused ? theme.colors.primary + '18' : theme.colors.background_global};
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing.large}px;
`;

export const FieldContent = styled.View`
  flex: 1;
`;

export const FieldLabel = styled.Text<{ focused?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme, focused }) =>
    focused ? theme.colors.primary : theme.colors.placeholder};
  letter-spacing: ${RFValue(0.4)}px;
  margin-bottom: ${RFValue(3)}px;
`;

export const FieldTextInput = styled.TextInput.attrs({
  underlineColorAndroid: 'transparent',
})`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.secondary};
  padding: 0;
  padding-bottom: ${RFValue(6)}px;
`;

export const FieldLine = styled.View<{ focused?: boolean }>`
  height: ${({ focused }) => (focused ? RFValue(2) : 1)}px;
  background-color: ${({ theme, focused }) =>
    focused ? theme.colors.primary : theme.colors.border};
`;

/* ─── Botão confirmar ────────────────────────────────────────── */

export const ConfirmButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.xlarge}px;
  align-items: center;
  justify-content: center;
`;

export const ConfirmText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  letter-spacing: ${RFValue(0.5)}px;
`;

/* ─── Botão verificar cadastro (Zafira) ───────────────────────── */

export const ZafiraButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.large}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.large}px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

export const ZafiraButtonIcon = styled.Image`
  width: ${RFValue(24)}px;
  height: ${RFValue(24)}px;
  margin-right: ${({ theme }) => theme.spacing.medium}px;
`;

export const ZafiraButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-family: ${({ theme }) => theme.fonts.bold};
`;
