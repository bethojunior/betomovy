import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';
import { useEffect, useState } from 'react';
import { Container, Content, ContentButton } from './styles';

import Brazil from '../../assets/languagesIcons/brazil.svg';
import France from '../../assets/languagesIcons/france.svg';
import Spain from '../../assets/languagesIcons/spain.svg';
import Portugal from '../../assets/languagesIcons/portugal.svg';
import UnitedStates from '../../assets/languagesIcons/unitedStates.svg';
import Angola from '../../assets/languagesIcons/angola.svg';
import { LanguageItem } from '../../components/LanguageItem';
import I18n, { translate, setLanguageToI18n } from '../../locales';
import { Button } from '../../components/Button';
import { Dialog } from '../../components/Dialog';
import { customToast } from '../../../utils/FlashMessage';

import { useNavigation } from '@react-navigation/native';
export function Languages() {
  const [languageSelected, setLanguageSelected] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isBrazilEnabled, setIsBrazilEnabled] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    AsyncStorage.getItem('@App:brazil_active').then(val => {
      if (val === 'false') {
        setIsBrazilEnabled(false);
        if (I18n.locale === 'pt_BR') {
          handleLanguage('en_US');
        }
      }
    }).catch(() => {});
  }, []);

  const handleLanguage = async (locale: string) => {
    try {
      if (locale === I18n.locale) {
        customToast(translate('toast.text_language_already_active'), 'info');
        setDialogVisible(false);
        return;
      }

      await AsyncStorage.setItem('@language', locale);
      await setLanguageToI18n();
      setDialogVisible(false);
      customToast(translate('toast.text_language_changed_success'), 'success');

      setTimeout(() => {
        navigation.navigate('TripRoutes', { screen: 'Home' });
      }, 1500);
    } catch (error) {
      console.error('Erro ao alterar idioma:', error);
      customToast(translate('toast.text_language_change_error'), 'danger');
    }
  };

  const setLanguage = (language: string) => {
    setLanguageSelected(language);
  };

  useEffect(() => {
    setLanguageSelected(I18n.locale);

    {/* DEFINE A LINGUAGEM EM INGLÊS COMO PADRÃO PARA O USUÁRIO ESCOLHER A LINGUAGEM */ }
    if (I18n.locale === 'language_not_found') {
      I18n.locale = 'en_US';
      customToast(translate('toast.text_language_not_tracked'), 'warning');
    }
  }, []);

  return (
    <Container>
      <Content>
        {isBrazilEnabled && (
          <LanguageItem
            name="Português - BR"
            onPress={() => setLanguage('pt_BR')}
            selected={languageSelected === 'pt_BR'}
          >
            <Brazil height={RFValue(50)} width={RFValue(50)} />
          </LanguageItem>
        )}

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
          onPress={() => setLanguage('pt_AO')}
          selected={languageSelected === 'pt_AO'}
        >
          <Angola height={RFValue(50)} width={RFValue(50)} />
        </LanguageItem>

        <LanguageItem
          name="Português - PT"
          onPress={() => setLanguage('pt_PT')}
          selected={languageSelected === 'pt_PT'}
        >
          <Portugal height={RFValue(50)} width={RFValue(50)} />
        </LanguageItem>
      </Content>

      <ContentButton>
        <Button
          title={translate('language.text_button_select')}
          onPress={() => {
            if (languageSelected === I18n.locale) {
              customToast(translate('toast.text_select_different_language'), 'warning');
              return;
            }
            setDialogVisible(true);
          }}
        />
      </ContentButton>

      <Dialog
        visibleDialog={dialogVisible}
        setVisible={() => setDialogVisible(false)}
        title={translate('language.title_dialog')}
        paragraph={translate('language.paragraph_dialog')}
        onConfirm={() => handleLanguage(languageSelected)}
        onCancel={() => setDialogVisible(false)}
      />
    </Container>
  );
}
