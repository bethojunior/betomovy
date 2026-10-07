import {shade} from 'polished';
import {Platform} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';
import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';
import themeCss from '../../styles/theme';

interface TextProps {
  color?: string;
  size?: 'small' | 'smalls' | 'medium' | 'large';
  transform?: string;
}

export const ContainerModal = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_global};
  padding: ${Platform.OS === 'ios' ? '30px 0' : '0'};
`;
export const HeaderModal = styled.View`
  padding: 0 20px 10px;
  margin-top: ${({theme}) => theme.spacing.xxlarge}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) =>
    shade(0.02, theme.colors.background_global)};
`;

export const BackButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export const Content = styled.View`
  flex: 1;
  padding: 0 20px;
  justify-content: center;
`;

export const Text = styled.Text<TextProps>`
  text-transform: ${props => props.transform || 'none'};
  font-size: ${({size}) => {
    switch (size) {
      case 'small':
        return `${themeCss.fontSizes.small}px`;
      case 'smalls':
        return `${themeCss.fontSizes.smalls}px`;
      case 'medium':
        return `${themeCss.fontSizes.medium}px`;
      case 'large':
        return `${themeCss.fontSizes.large}px`;
      default:
        return `${themeCss.fontSizes.medium}px`;
    }
  }};
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({color, theme}) => color || theme.colors.secondary};
`;

export const ContainerData = styled.View`
  flex-direction: column;
`;

export const ContainerDataItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({theme}) => theme.spacing.large}px;
`;

export const ContainerInput = styled.View`
  flex-direction: column;
  margin-bottom: ${({theme}) => theme.spacing.large}px;
`;

export const Input = styled.TextInput`
  width: 50%;
  height: 50px;
  padding: 0 16px;
  background: ${({theme}) => shade(0.05, theme.colors.background_global)};
  border-radius: 10px;
  margin-right: 16px;
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;

export const InputLabel = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;

  color: ${({theme}) => theme.colors.secondary};
`;

export const ContainerPiggyBank = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin: ${({theme}) => theme.spacing.large}px 0;
`;

export const Button = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background: ${({theme}) => theme.colors.primary};
  border-radius: 10px;
  margin-top: 8px;
  align-items: center;
  justify-content: center;
`;

export const Label = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const ContentTransferModal = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const CurrentSald = styled.Text`
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 5px;
  text-align: center;
  padding: ${Platform.OS === 'ios' ? '15px 5px' : '5px'};
  margin: 5px 0;
  height: ${RFValue(40)}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const TextObservation = styled.Text`
  font-size: 12px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const Asterisk = styled.Text`
  font-size: 12px;
  color: ${({theme}) => theme.colors.primary};
`;

export const ObservationContent = styled.View`
  flex-direction: row;
`;

export const ContentValue = styled.View`
  width: 48%;
  text-align: center;
`;

export const TitleValueTransfer = styled.Text`
  font-weight: bold;
  color: ${({theme}) => theme.colors.secondary};
`;

export const SimpleText = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
`;

export const InputMoney = styled(TextInputMask)`
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.secondary};
  border-radius: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 5px;
  height: ${RFValue(40)}px;
  color: ${({theme}) => theme.colors.secondary};
  text-align: center;
`;
