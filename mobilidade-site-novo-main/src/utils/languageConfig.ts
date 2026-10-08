export interface LanguageSetting {
  code: string;
  name: string;
  country: string;
  flag: string;
  enabled: boolean;
}

const LANGUAGE_STORAGE_KEY = "@movy:enabled_languages";

// Idioma padrão: Estados Unidos ativado, Brasil desativado
export const DEFAULT_LANGUAGES: LanguageSetting[] = [
  { code: "en", name: "English (United States)", country: "US", flag: "🇺🇸", enabled: true },
  { code: "pt", name: "Português (Brasil)", country: "BR", flag: "🇧🇷", enabled: false },
  { code: "es", name: "Español", country: "ES", flag: "🇪🇸", enabled: false },
  { code: "fr", name: "Français", country: "FR", flag: "🇫🇷", enabled: false },
];

export const getLanguagesConfig = (): LanguageSetting[] => {
  try {
    const raw = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Erro ao ler configuração de idiomas:", e);
  }
  return DEFAULT_LANGUAGES;
};

export const setLanguagesConfig = (configs: LanguageSetting[]): void => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, JSON.stringify(configs));
  } catch (e) {
    console.error("Erro ao salvar configuração de idiomas:", e);
  }
};

export const isLanguageEnabled = (code: string): boolean => {
  const configs = getLanguagesConfig();
  const lang = configs.find((l) => l.code === code);
  return lang ? lang.enabled : false;
};

export const isBrazilActive = (): boolean => {
  return isLanguageEnabled("pt");
};

export const getDefaultLanguageCode = (): string => {
  const configs = getLanguagesConfig();
  const activeLangs = configs.filter((l) => l.enabled);
  if (activeLangs.length > 0) {
    // Se o inglês (US) estiver ativo, preferência para ele
    const en = activeLangs.find((l) => l.code === "en");
    return en ? en.code : activeLangs[0].code;
  }
  return "en";
};
