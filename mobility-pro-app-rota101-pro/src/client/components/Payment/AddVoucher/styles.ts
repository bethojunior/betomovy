import styled, {css} from 'styled-components/native';
import {Platform} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button} from 'react-native-paper';

export const Content = styled.View`
  flex-direction: column;
  width: 100%;
`;

export const PaymentMethodLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  color: ${({ theme }) => theme.colors.text_gray};
  margin-top: 16px;
  margin-bottom: 4px;
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xxxlarge}px;
  color: ${({theme}) => theme.colors.secondary};
  font-weight: bold;
`;

export const SubTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const ContentPicker = styled.View`
  ${Platform.OS === 'ios' &&
  css`
    margin-top: 10px;
    padding: 25px 0;
    overflow: hidden;
  `}
`;

export const ContentSelectCard = styled.View`
  ${Platform.OS === 'ios' &&
  css`
    margin-top: ${RFValue(12)}px;
  `}
`;

export const ContainerCard = styled.View`
  flex-direction: column;
  width: 100%;
`;

export const ContentButton = styled(Button)`
  flex-direction: row;
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
  margin-top: -10px;
`;

export const ProgressBarContainer = styled.View`
  height: 10px;
  width: '100%';
  background-color: '#e0e0e0';
  border-radius: 5px;
  margin-top: 10px;
  overflow: 'hidden';
`;

export const ContainerValue = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
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
  margin-top: -16px;
  text-align: center;
`;

export const CloseButton = styled.TouchableOpacity`
  align-self: flex-end;
  padding: 4px;
  margin-bottom: 8px;
`;
