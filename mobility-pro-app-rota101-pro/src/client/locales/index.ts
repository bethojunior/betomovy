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
  const v1Migrated = await AsyncStorage.getItem('@app_default_en_v3');
  if (!v1Migrated) {
    await AsyncStorage.setItem('@app_default_en_v3', 'true');
    await AsyncStorage.setItem('@language', 'en_US');
    return 'en_US';
  }
  const language = await AsyncStorage.getItem('@language');
  if (language) {
    return language;
  }

  // Idioma padrão do aplicativo deve ser SEMPRE Inglês (Estados Unidos)
  const defaultLocale = 'en_US';
  await AsyncStorage.setItem('@language', defaultLocale);
  return defaultLocale;
};

const switchIosLanguage = (locale: string) => {
  // isso ocorre pq a resposta no ios vem por exemplo pt_BR, frBR.
  const localeForm = locale?.split('_') || undefined;
  switch (localeForm && localeForm.length > 0 ? localeForm[0] : undefined) {
    case 'en':
      return 'en_US';
    case 'pt': {
      const country = localeForm[1]?.toUpperCase();
      if (country === 'AO') return 'pt_AO';
      if (country === 'PT') return 'pt_PT';
      return 'pt_BR';
    }
    case 'es':
      return 'es_US';
    case 'fr':
      return 'fr_FR';
    default:
      return 'en_US';
  }
};

const iosSetLanguage = async () => {
  try {
    const v1Migrated = await AsyncStorage.getItem('@app_default_en_v3');
    if (!v1Migrated) {
      await AsyncStorage.setItem('@app_default_en_v3', 'true');
      await AsyncStorage.setItem('@language', 'en_US');
      return 'en_US';
    }
    const locale = await AsyncStorage.getItem('@language');
    if (locale) return locale;
    await AsyncStorage.setItem('@language', 'en_US');
    return 'en_US';
  } catch (error) {
    const fallback = 'en_US';
    try {
      await AsyncStorage.setItem('@language', fallback);
    } catch {}
    return fallback;
  }
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
  pt_AO: ptAO,
  pt_PT: ptPT,
};

I18n.defaultLocale = 'en_US';
I18n.locale = 'en_US';
I18n.fallbacks = true;

export const setLanguageToI18n = async () => {
  const language = await getLanguageByDevice();
  // @ts-ignore
  const translateNormalize = normalizeTranslate[language] || 'en_US';
  const iHaveThisLanguage =
    // eslint-disable-next-line no-prototype-builtins
    I18n.translations.hasOwnProperty(translateNormalize);
  // eslint-disable-next-line no-unused-expressions
  iHaveThisLanguage
    ? (I18n.locale = translateNormalize)
    : (I18n.locale = 'en_US');
};

setLanguageToI18n();

export const translate = (key: I18n.Scope, options?: any) =>
  I18n.t(key, options);

export default I18n;
