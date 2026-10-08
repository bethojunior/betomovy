import { changeFavicon } from "../../utils/ChangeFavicon";
import api from "../../api/apiAxios";
import LogoMovyDefault from "../../assets/img/Logo_100x100.png";

//const HOME = "home";
const NAME_APPLICATION = "Demo";
const LINK_APP_CLIENT =
  "https://play.google.com/store/apps/details?id=br.com.fabrica704.fabrica704.client"; //'https://play.google.com/store/apps/details?id=br.com.fabrica704.elshaday.client';
const LINK_APP_DRIVERS =
  "https://play.google.com/store/apps/details?id=br.com.fabrica704.fabrica704.driver"; //'https://play.google.com/store/apps/details?id=br.com.fabrica704.elshaday.driver';
const LINK_APP_CLIENTE_IOS = ""; //'https://itunes.apple.com/br/app/return-cliente/id1452297278?mt=8';

const URL_REDIRECTS_STORAGE_KEY = "@urlRedirects";

export type UrlRedirects = {
  urlRedirectAppPlayStore: string | null;
  urlRedirectAppAppStore: string | null;
};

const readCachedUrlRedirects = (): UrlRedirects | null => {
  try {
    const raw = localStorage.getItem(URL_REDIRECTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Busca as URLs de loja configuradas no backend (config/general) e atualiza o cache local.
 * Única fonte de verdade para essa busca — App.tsx e a página /share dependem dela.
 */
export const fetchUrlRedirects = async (): Promise<UrlRedirects> => {
  const response = await api.get("config/general");
  const configs = response?.data?.data || [];

  const urlRedirects: UrlRedirects = {
    urlRedirectAppPlayStore:
      configs.find((item: any) => item.key === "url_redirect_app_play_store")
        ?.value ?? null,
    urlRedirectAppAppStore:
      configs.find((item: any) => item.key === "url_redirect_app_app_store")
        ?.value ?? null,
  };

  try {
    localStorage.setItem(URL_REDIRECTS_STORAGE_KEY, JSON.stringify(urlRedirects));
  } catch (error) {
    console.error(error);
  }

  return urlRedirects;
};

export const getPwa = () => {
  return window.env.REACT_APP_PWA;
};

export const getNameApplication = () => {
  return window.env.REACT_APP_PROJECT_NAME
    ? window.env.REACT_APP_PROJECT_NAME
    : NAME_APPLICATION;
};

export const getPathImageDefault = () => {
  const logoAppPartner = localStorage.getItem("logoAppPartner");

  if (logoAppPartner) {
    try {
      const parsed = JSON.parse(logoAppPartner);
      if (parsed) {
        changeFavicon(parsed);
        return parsed;
      }
    } catch {}
  }

  if (window.env.REACT_APP_BUCKET_URL && window.env.REACT_APP_BUCKET_URL !== "undefined") {
    const logoDefault = `${window.env.REACT_APP_BUCKET_URL}default.jpg`;
    changeFavicon(logoDefault);
    return logoDefault;
  }

  changeFavicon(LogoMovyDefault);
  return LogoMovyDefault;
};

export const getLinkAppClient = () => {
  const urlRedirectAppPlayStore = readCachedUrlRedirects()?.urlRedirectAppPlayStore;

  if (urlRedirectAppPlayStore) {
    return urlRedirectAppPlayStore;
  }

  if (window.env.REACT_APP_PROJECT_NAME) {
    return `https://play.google.com/store/search?q=${encodeURIComponent(
      window.env.REACT_APP_PROJECT_NAME + " - passageiro"
    )}&c=apps`;
  }

  return LINK_APP_CLIENT;
};

export const getLinkDynamicMonitor = (
  key: "urlRedirectAppPlayStore" | "urlRedirectAppAppStore"
) => {
  return readCachedUrlRedirects()?.[key] ?? null;
};

export const getLinkAppDriver = () => {
  return window.env.REACT_APP_PROJECT_NAME
    ? `https://play.google.com/store/search?q=${window.env.REACT_APP_PROJECT_NAME} - motorista&c=apps`
    : LINK_APP_DRIVERS;
};

export const getLinkAppClientIos = () => {
  const urlRedirectAppAppStore = readCachedUrlRedirects()?.urlRedirectAppAppStore;

  if (urlRedirectAppAppStore) {
    return urlRedirectAppAppStore;
  }

  return window.env.REACT_APP_LINK_APP_CLIENTE_IOS || LINK_APP_CLIENTE_IOS;
};

export const getColorPrimaryApp = () => {
  return window.env.REACT_APP_COLOR_PRIMARY;
};

export const getColorSecondaryApp = () => {
  return window.env.REACT_APP_COLOR_SECONDARY;
};

export const getColorsDefaults = () => {
  return {
    colorsPrimary: "#1f5579",
    colorSecondary: "#367FAE",
  };
};
