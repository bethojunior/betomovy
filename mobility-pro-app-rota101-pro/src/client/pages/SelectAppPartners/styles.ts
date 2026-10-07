import styled from 'styled-components/native';

interface ButtonAcceptAppPartnersProps {
  isDisabled?: boolean;
}

interface CardAppPartnerProps {
  isSelected?: boolean;
}

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 10px;
  background-color: ${({theme}) => theme.colors.background_white};
`;

export const TextSelectAppPartner = styled.Text`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
`;

export const ContainerAppPartner = styled.ScrollView`
  width: 100%;
  flex: 1;
  gap: 10px;
  padding: 15px 0;
`;

export const ContentButtonConfirmAccount = styled.View``;

export const CardAppPartner = styled.TouchableOpacity<CardAppPartnerProps>`
  flex: 1;
  min-height: 120px;
  border-width: ${({isSelected}) => (isSelected ? '3px' : '1px')};
  border-color: ${({isSelected, theme}) =>
    isSelected ? '#1a08d4' : theme.colors.black};
  border-radius: 10px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  gap: 5px;
  margin: 5px;
`;

export const IconAppPartner = styled.Image`
  width: 70px;
  height: 70px;
  resize-mode: stretch;
`;

export const TitleAppPartner = styled.Text`
  text-align: center;
  font-size: 16px;
`;

export const ContentBtn = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 10px;
`;

export const ButtonConfirmAccount = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  margin: 10px 0;
  padding: 8px 12px;
  border-radius: 8px;
`;

export const ButtonCancelAppPartners = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.button_text_disabled};
  border-radius: 8px;
  padding: 8px 12px;
  width: 50%;
`;

export const ButtonAcceptAppPartners = styled.TouchableOpacity<ButtonAcceptAppPartnersProps>`
  background-color: ${({theme, isDisabled}) =>
    isDisabled ? theme.colors.grayBright : theme.colors.primary};
  border-radius: 8px;
  padding: 8px 12px;
`;

export const BtnText = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.colors.white};
  text-align: center;
`;
