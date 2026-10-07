import { BrowserRouter } from "react-router-dom";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { GlobalStyle } from "./GlobalStyle";
import RoutesApplication from "./routes/RoutesApplications";

import { DriverDatasContextProvider } from "./contexts/DriverDatasContext";

import { fetchUrlRedirects, getColorsDefaults } from "./config/configApp";

import api from "./api/apiAxios";
import { useStorage } from "./utils/Storage";
import { useAuthStore } from "./store/authStore";

const App = () => {
  const [informationsCustomer, setInformationsCustomer] =
    useState<InformationsCustomerProps | null>(null);
  const [configAppPartner, setConfigAppPartner] =
    useState<ConfigAppPartner | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const { i18n } = useTranslation();
  const { getItem } = useStorage();
  const { setAuthenticated } = useAuthStore();

  const languageBrowser = localStorage.getItem("languageApplication");

  const getConfigAppPartner = async () => {
    const query = window.location.search;
    const urlParams = new URLSearchParams(query);

    if (!urlParams.get("name_app")) {
      localStorage.removeItem("logoAppPartner");
      return;
    }

    try {
      const responseConfigAppPartner = await api.get(
        `configapppartner/getconfigapppartner?app_partner=${urlParams.get(
          "name_app"
        )}`
      );

      if (responseConfigAppPartner.status) {
        if (responseConfigAppPartner.data.data.length > 0) {
          const logoAppPartner =
            responseConfigAppPartner?.data?.data[0]?.logo_app;
          localStorage.setItem(
            "logoAppPartner",
            JSON.stringify(logoAppPartner)
          );
          setConfigAppPartner(responseConfigAppPartner.data.data[0]);
          return;
        } else {
          window.location.href = "/";
        }

        localStorage.removeItem("logoAppPartner");
      }
    } catch (error) {
      localStorage.removeItem("logoAppPartner");
      console.error(error);
    }
  };

  const getInformationsCustomer = async () => {
    try {
      setLoading(true);
      const responseInformationsCustomer = await api.get(
        `customer/getinformationsbyprojectname?projectName=${window.env.REACT_APP_PROJECT_NAME}`
      );

      if (responseInformationsCustomer?.data?.status) {
        if (responseInformationsCustomer.data) {
          setInformationsCustomer(
            responseInformationsCustomer.data.data.response
          );

          localStorage.setItem(
            `@site-${window.env.REACT_APP_PROJECT_NAME}:informations_customer`,
            JSON.stringify(responseInformationsCustomer.data.data.response)
          );
        } else {
          setInformationsCustomer(null);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrlRedirects().catch((error) => console.error(error));
  }, []);

  const switchLanguageDefault = (languageBrowser: string) => {
    const language = languageBrowser.split("-")[0];

    switch (language) {
      case "pt":
        return i18n.changeLanguage("pt");
      case "en":
        return i18n.changeLanguage("en");
      case "fr":
        return i18n.changeLanguage("fr");
      case "es":
        return i18n.changeLanguage("es");
      default:
        return i18n.changeLanguage("en");
    }
  };

  const isAuthenticated = () => {
    const user = getItem("user");
    if (!user) return;
    const userParse = JSON.parse(user);
    setAuthenticated(true);

    api.defaults.headers.common.token = userParse.api_token;
    api.defaults.headers.common.userid = userParse.idUser;
  };

  useEffect(() => {
    getConfigAppPartner();
  }, []);

  useEffect(() => {
    switchLanguageDefault(navigator.language);
    isAuthenticated();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (languageBrowser !== null) {
      i18n.changeLanguage(languageBrowser);
    }
  }, [languageBrowser, i18n]);

  useEffect(() => {
    const informationsColorsCustomer = localStorage.getItem(
      `@site-${window.env.REACT_APP_PROJECT_NAME}:informations_customer`
    );

    if (informationsColorsCustomer) {
      const informationsCustomer = JSON.parse(informationsColorsCustomer);
      setInformationsCustomer(informationsCustomer);
    } else {
      getInformationsCustomer();
    }
  }, []);

  const configBackgroundColorPrimary = informationsCustomer
    ? informationsCustomer.customer_apps[0].main_color
    : (getColorsDefaults().colorsPrimary as string);

  const configBackgroundColorSecondary = informationsCustomer
    ? informationsCustomer.customer_apps[0].secondary_color
    : (getColorsDefaults().colorSecondary as string);

  const backgroundColorPrimary = configAppPartner
    ? configAppPartner.primary_color
    : configBackgroundColorPrimary;
  const backgroundColorSecondary = configAppPartner
    ? configAppPartner.secondary_color
    : configBackgroundColorSecondary;

  return (
    <BrowserRouter>
      <GlobalStyle
        backgroundColorPrimary={backgroundColorPrimary}
        backgroundColorSecondary={backgroundColorSecondary}
      />
      {!loading && (
        <DriverDatasContextProvider>
          <RoutesApplication />
        </DriverDatasContextProvider>
      )}
    </BrowserRouter>
  );
};

export default App;
