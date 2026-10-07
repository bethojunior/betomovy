import React from 'react';
import {Linking, Alert} from 'react-native';
import {useSupportNumber} from '../../hooks/useSupportNumber';
import {translate} from '../../client/locales';
import {
  Container,
  SupportText,
  SupportLink,
} from './styles';

export const SupportTextComponent: React.FC = () => {
  const {getSupportNumberFormatted} = useSupportNumber();

  const handleSupportContact = async () => {
    const phoneNumber = getSupportNumberFormatted();
    if (!phoneNumber) {
      Alert.alert(
        'Erro',
        'Número de suporte não configurado.',
      );
      return;
    }
    
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    
    try {
      await Linking.openURL(whatsappUrl);
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível abrir o aplicativo de contato. Tente novamente.',
      );
    }
  };

  return (
    <Container>
      <SupportText>
        {translate('support.text_login_support')}{' '}
        <SupportLink onPress={handleSupportContact}>
          {translate('support.text_contact_support')}
        </SupportLink>
      </SupportText>
    </Container>
  );
};