import I18n from 'i18n-js';

export function useTranslation() {
  const translate = (key: I18n.Scope, options?: any) => I18n.t(key, options);

  return {t: translate};
}
