import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

/** Botão de voltar + título na mesma linha — antes cada um ocupava sua própria linha, inflando o header. */
export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing.medium}px;
  margin: ${({theme}) => theme.spacing.large}px ${({theme}) => theme.spacing.xlarge}px 0;
`;

const HEADER_BUTTON_SIZE = RFValue(28);

export const BackButton = styled.TouchableOpacity`
  width: ${HEADER_BUTTON_SIZE}px;
  height: ${HEADER_BUTTON_SIZE}px;
  border-radius: ${RFValue(14)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.background_white_light};
`;

export const Title = styled.Text`
  flex: 1;
  text-align: center;
  font-size: ${({theme}) => theme.fontSizes.xxxlarge}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.secondary};
`;

/** Mesma largura do BackButton, do outro lado do título — sem isso o "Cupons" centraliza no espaço sobrando e fica puxado pra direita. */
export const HeaderSpacer = styled.View`
  width: ${HEADER_BUTTON_SIZE}px;
`;

export const Subtitle = styled.Text`
  text-align: center;
  margin-top: ${({theme}) => theme.spacing.small}px;
  margin-horizontal: ${({theme}) => theme.spacing.xlarge}px;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.text_gray};
`;

export const ContainerCoupons = styled.ScrollView.attrs(({theme}) => ({
  contentContainerStyle: {
    padding: theme.spacing.xlarge,
    gap: theme.spacing.large,
  },
}))`
  max-height: ${RFValue(360)}px;
  margin-top: ${({theme}) => theme.spacing.medium}px;
`;

export const ContentButton = styled.View`
  flex-direction: row;
  gap: ${({theme}) => theme.spacing.medium}px;
  padding: ${({theme}) => theme.spacing.large}px ${({theme}) => theme.spacing.xlarge}px
    ${({theme}) => theme.spacing.xlarge}px;
  border-top-width: 1px;
  border-top-color: ${({theme}) => theme.colors.border};
`;

export const CancelButton = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-vertical: ${({theme}) => theme.spacing.large}px;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
`;

export const CancelButtonText = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.medium};
`;

export const ConfirmButton = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-vertical: ${({theme}) => theme.spacing.large}px;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
`;

export const ConfirmButtonText = styled.Text`
  color: ${({theme}) => theme.colors.primaryText};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.bold};
`;
