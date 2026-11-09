import {Platform, NativeModules} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import I18n from 'i18n-js';
import en from './en-US';
import pt from './pt-BR';
import es from './es-US';
import fr from './fr-FR';
import ptAO from './pt-AO';
import ptPT from './pt-PT';

const normalizeTranslate = {
  en_US: 'en_US',
  pt_BR: 'pt_BR',
  en: 'en_US',
  pt_US: 'pt_BR',
  es_US: 'es_US',
  fr_FR: 'fr_FR',
  pt_AO: 'pt_AO',
  pt_PT: 'pt_PT',
};

const androidLanguage = async () => {
  try {
    const saved = await AsyncStorage.getItem('@language');
    if (saved && saved !== 'en_US') {
      return saved;
    }
  } catch {}

  // Idioma padrao do aplicativo MOVY: Portugues (Brasil)
  const defaultLocale = 'pt_BR';
  try {
    await AsyncStorage.setItem('@language', defaultLocale);
  } catch {}
  return defaultLocale;
};

const switchIosLanguage = (locale: string) => {
  const localeForm = locale?.split('_') || undefined;
  switch (localeForm && localeForm.length > 0 ? localeForm[0] : undefined) {
    case 'pt': {
      const country = localeForm[1]?.toUpperCase();
      if (country === 'AO') return 'pt_AO';
      if (country === 'PT') return 'pt_PT';
      return 'pt_BR';
    }
    case 'en':
      return 'en_US';
    case 'es':
      return 'es_US';
    case 'fr':
      return 'fr_FR';
    default:
      return 'pt_BR';
  }
};

const iosSetLanguage = async () => {
  try {
    const locale = await AsyncStorage.getItem('@language');
    if (locale && locale !== 'en_US') return locale;
    await AsyncStorage.setItem('@language', 'pt_BR');
    return 'pt_BR';
  } catch (error) {
    return 'pt_BR';
  }
};

const getLanguageByDevice = async () => {
  return Platform.OS === 'ios'
    ? await iosSetLanguage()
    : await androidLanguage();
};

I18n.translations = {
  pt_BR: pt,
  en_US: en,
  es_US: es,
  fr_FR: fr,
  pt_AO: ptAO,
  pt_PT: ptPT,
};

I18n.defaultLocale = 'pt_BR';
I18n.locale = 'pt_BR';
I18n.fallbacks = true;

export const setLanguageToI18n = async () => {
  const language = await getLanguageByDevice();
  // @ts-ignore
  const translateNormalize = normalizeTranslate[language] || 'pt_BR';
  const iHaveThisLanguage =
    // eslint-disable-next-line no-prototype-builtins
    I18n.translations.hasOwnProperty(translateNormalize);
  // eslint-disable-next-line no-unused-expressions
  iHaveThisLanguage
    ? (I18n.locale = translateNormalize)
    : (I18n.locale = 'pt_BR');
};

setLanguageToI18n();

export const translate = (key: I18n.Scope, options?: any) =>
  I18n.t(key, options);

export default I18n;
