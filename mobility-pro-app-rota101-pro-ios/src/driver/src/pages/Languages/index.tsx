import {Alert, NativeModules} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RFValue} from 'react-native-responsive-fontsize';
import {useEffect, useState} from 'react';
import {Container, Content, ContentButton} from './styles';

import Brazil from '../../assets/languagesIcons/brazil.svg';
import France from '../../assets/languagesIcons/france.svg';
import Spain from '../../assets/languagesIcons/spain.svg';
import Portugal from '../../assets/languagesIcons/portugal.svg';
import UnitedStates from '../../assets/languagesIcons/unitedStates.svg';
import Angola from '../../assets/languagesIcons/angola.svg';
import {LanguageItem} from '../../components/LanguageItem';
import I18n, {translate} from '../../../../client/locales';
import {Button} from '../../components/Button';
import {Dialog} from '../../components/Dialog';
import * as Updates from 'expo-updates';

export function Languages() {
  const [languageSelected, setLanguageSelected] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleLanguage = async (locale: string) => {
    await AsyncStorage.setItem('@language', locale);
    await Updates.reloadAsync();
  };

  const setLanguage = async (language: string) => {
    setLanguageSelected(language);
  };

  useEffect(() => {
    setLanguageSelected(I18n.locale);
  }, []);

  return (
    <Container>
      <Content>
        <LanguageItem
          name="Português - BR"
          onPress={() => setLanguage('pt_BR')}
          selected={languageSelected === 'pt_BR'}
        >
          <Brazil height={RFValue(50)} width={RFValue(50)} />
        </LanguageItem>

        <LanguageItem
          name="Inglês"
          onPress={() => setLanguage('en_US')}
          selected={languageSelected === 'en_US'}
        >
          <UnitedStates height={RFValue(50)} width={RFValue(50)} />
        </LanguageItem>

        <LanguageItem
          name="Francês"
          onPress={() => setLanguage('fr_FR')}
          selected={languageSelected === 'fr_FR'}
        >
          <France height={RFValue(50)} width={RFValue(50)} />
        </LanguageItem>

        <LanguageItem
          name="Espanhol"
          onPress={() => setLanguage('es_US')}
          selected={languageSelected === 'es_US'}
        >
          <Spain height={RFValue(50)} width={RFValue(50)} />
        </LanguageItem>

        <LanguageItem
          name="Português - AO"
          onPress={() =>
            Alert.alert('Em breve', 'Ainda não disponível para sua localidade')
          }
          selected={false}
        >
          <Angola height={RFValue(50)} width={RFValue(50)} />
        </LanguageItem>

        <LanguageItem
          name="Português - PT"
          onPress={() =>
            Alert.alert('Em breve', 'Ainda não disponível para sua localidade')
          }
          selected={false}
        >
          <Portugal height={RFValue(50)} width={RFValue(50)} />
        </LanguageItem>
      </Content>

      <ContentButton>
        <Button
          title={translate('driver_language.text_button_select')}
          onPress={() => setDialogVisible(true)}
        />
      </ContentButton>

      <Dialog
        visibleDialog={dialogVisible}
        setVisible={() => setDialogVisible(false)}
        title={translate('driver_language.title_dialog')}
        paragraph={translate('driver_language.paragraph_dialog')}
        onConfirm={() => handleLanguage(languageSelected)}
        onCancel={() => setDialogVisible(false)}
      />
    </Container>
  );
}
