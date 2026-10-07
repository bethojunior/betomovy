import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.secondary};
  margin-top: ${RFValue(15)}px;
  margin-bottom: ${RFValue(8)}px;
  padding-left: ${({theme}) => theme.spacing.large}px;
`;

export const CardContent = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: ${({theme}) => theme.spacing.xxlarge}px;
  padding-right: ${({theme}) => theme.spacing.xxlarge}px;
  padding-top: ${({theme}) => theme.spacing.small}px;
  padding-bottom: ${({theme}) => theme.spacing.small}px;
  margin-top: ${RFValue(7)}px;
`;

export const Icon = styled.Image`
  width: 30px;
  height: 30px;
`;

export const CardPaymentForm = styled.TouchableOpacity`
  width: 87%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const ButtonExclused = styled.TouchableOpacity`
  width: 13%;
  justify-content: center;
  align-items: flex-end;
`;

export const TitleDeleteCard = styled.Text`
  align-self: center;
  margin-bottom: 20px;
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.large}px;
`;

export const TextPaymentType = styled.Text`
  margin-left: 10px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const ContentButton = styled.View`
  padding-left: ${({theme}) => theme.spacing.large}px;
  padding-right: ${({theme}) => theme.spacing.large}px;
  align-items: center;
`;

export const Button = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  width: 30%;
  align-items: center;
  align-self: flex-end;
  padding: 10px;
  border-radius: 5px;
  margin-top: 20px;
`;

export const AddCardButton = styled(Button)<{centered?: boolean}>`
  align-self: ${({centered}) => (centered ? 'center' : 'flex-end')};
  width: 100%;
`;

export const TextButton = styled.Text`
  color: ${({theme}) => theme.colors.primaryText};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;

export const ListFormsPaymentContent = styled.View`
  align-items: center;
  margin-top: 10px;
  padding: 10px 20px;
`;

export const Name = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.colors.primaryText};
`;

export const CardName = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.colors.secondary};
  text-align: center;
`;

export const ButtonPrePaid = styled.TouchableOpacity`
  padding: 10px;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 10px;
  margin-top: 2px;
  margin-bottom: 5px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
export const ModalBody = styled.View`
  align-items: center;
`;

export const TextDebit = styled.Text`
  text-align: justify;
`;

export const MoreInfo = styled.Text`
  margin: 20px 0 20px 0;
`;

export const TextPix = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.secondary};
  margin-bottom: 16px;
  text-align: center;
`;

export const CopyButton = styled(Button)`
  background-color: ${({theme}) => theme.colors.primary};
  text-align: center;
  border-radius: 10px;
  margin-top: -2px;
  margin-bottom: -36px;
  width: 100%;
`;

export const ContainerValue = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0;
  width: 100%;
  background-color: ${({theme}) => theme.colors.grayBright};
  border-radius: 10px;
  padding: 0 24px;
`;

export const InfoContainer = styled.View`
  flex-direction: 'row';
  align-items: 'center';
  margin-bottom: 10px;
`;

export const Label = styled.Text`
  margin-top: 5px;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const Value = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.secondary};
`;

export const DateText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const InfoText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  color: ${({theme}) => theme.colors.text_gray};
  width: 90%;
  margin: 0 auto;
  margin-bottom: 20px;
  margin-top: 8px;
  text-align: center;
`;

export const PixFieldLabel = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  color: ${({theme}) => theme.colors.secondary};
  margin-bottom: 4px;
`;

export const PixFieldValue = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.secondary};
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.colors.secondary};
  padding-bottom: 6px;
  width: 100%;
`;
