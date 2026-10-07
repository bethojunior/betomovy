import {Platform, NativeModules} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import I18n from 'i18n-js';
import en from './en-US';
import pt from './pt-BR';
import es from './es-US';
import fr from './fr-FR';

const normalizeTranslate = {
  en_US: 'en_US',
  pt_BR: 'pt_BR',
  en: 'en_US',
  pt_US: 'pt_BR',
  es_US: 'es_US',
  fr_FR: 'fr_FR',
};

const androidLanguage = async () => {
  const language = await AsyncStorage.getItem('@language');
  if (language) {
    return language;
  }

  let locale = await NativeModules.I18nManager.localeIdentifier;
  locale = switchIosLanguage(locale);
  await AsyncStorage.setItem(
    '@language',
    locale || NativeModules.I18nManager.localeIdentifier,
  );

  return locale || NativeModules.I18nManager.localeIdentifier;
};

const switchIosLanguage = (locale: string) => {
  // isso ocorre pq a resposta no ios vem por exemplo pt_BR, frBR.
  const localeForm = locale?.split('_') || undefined;
  switch (localeForm && localeForm.length > 0 ? localeForm[0] : undefined) {
    case 'en':
      return 'en_US';
    case 'pt':
      return 'pt_BR';
    case 'es':
      return 'es_US';
    case 'fr':
      return 'fr_FR';
    default:
      return 'pt_BR';
  }
};

const iosSetLanguage = async () => {
  const locale = await AsyncStorage.getItem('@language');
  if (locale) {
    return locale;
  }
  await AsyncStorage.setItem(
    '@language',
    switchIosLanguage(NativeModules.SettingsManager.settings.AppleLocale),
  );
  return switchIosLanguage(
    NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0],
  );
};

const getLanguageByDevice = async () => {
  return Platform.OS === 'ios'
    ? await iosSetLanguage()
    : await androidLanguage();
};

I18n.translations = {
  en_US: en,
  pt_BR: pt,
  es_US: es,
  fr_FR: fr,
};

const setLanguageToI18n = async () => {
  const language = await getLanguageByDevice();
  // @ts-ignore
  const translateNormalize = normalizeTranslate[language];
  const iHaveThisLanguage =
    // eslint-disable-next-line no-prototype-builtins
    I18n.translations.hasOwnProperty(translateNormalize);
  // eslint-disable-next-line no-unused-expressions
  iHaveThisLanguage
    ? (I18n.locale = translateNormalize)
    : (I18n.locale = 'language_not_found'); // Linguagem padrão do cliente BRWASH, caso não tenha a linguagem do dispositivo. Use com sabedoria
};

setLanguageToI18n();

export const translate = (key: I18n.Scope) => I18n.t(key);

export default I18n;
