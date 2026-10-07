import { useNavigate } from "react-router-dom";

import { Container } from "./styles";

import pathIconSuccess from "../../assets/svg/Check.svg";

import { useTranslation } from "react-i18next";
import { getLinkAppClient, getLinkAppDriver } from "../../config/configApp";
import { getLinkDynamicMonitor } from "../../config/configApp";

interface ScreenSuccessProps {
  title: string;
  text: string;
  isDriver: boolean;
}

const ScreenSuccess = ({ title, text, isDriver }: ScreenSuccessProps) => {
  const navigate = useNavigate();

  const query = window.location.search;
  const urlParams = new URLSearchParams(query);
  const appPartnerKey = urlParams.get("name_app");

  const { t } = useTranslation();

  const handleRedirectNavigate = () => {
    if (appPartnerKey) {
      navigate(`/?name_app=${appPartnerKey}`);
      return;
    }
    navigate("/");
  };

  const linkGoogleApp = localStorage.getItem(
    isDriver
      ? "@mobilidade-site-voutehomologar-link-app-driver"
      : "@mobilidade-site-voutehomologar-link-app-client"
  );

  const dynamicMonitorLink = getLinkDynamicMonitor("urlRedirectAppPlayStore");

  const urlRedirect =
    dynamicMonitorLink === null
      ? linkGoogleApp
        ? JSON.parse(linkGoogleApp)
        : isDriver
        ? getLinkAppDriver()
        : getLinkAppClient()
      : dynamicMonitorLink;

  return (
    <Container>
      <div className="content-icon-success">
        <img src={pathIconSuccess} alt="icon-success" />
      </div>

      <h1 className="text-success">{title}</h1>

      <p className="text-description">{text}</p>

      <div className="content-buttons">
        <button onClick={handleRedirectNavigate}>
          {t("message-success-button-back-home")}
        </button>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={urlRedirect}
        >
          {t("message-success-button-download-app")}
        </a>
      </div>
    </Container>
  );
};

export default ScreenSuccess;
