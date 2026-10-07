import { List, X, Translate } from "phosphor-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import { Container } from "./styles";
import Button from "../Button";
import ModalLinks from "../ModalLinks";
import ModalTranslations from "../ModalTranslations";

import {
  getPathImageDefault,
  getNameApplication,
} from "../../config/configApp";

import { useTranslation } from "react-i18next";

const Header = () => {
  const [isMobileLink, setIsMobileLink] = useState<boolean>(false);
  const [openModalLink, setOpenModalLink] = useState<boolean>(false);
  const [openModalTranslation, setOpenModalTranslation] =
    useState<boolean>(false);

  const { t } = useTranslation();

  const handleOpenNavMobile = () => {
    if (isMobileLink) {
      setIsMobileLink(false);
    } else {
      setIsMobileLink(true);
    }
  };

  const handleAppModalLink = () => {
    setOpenModalLink(true);
  };

  const handleAppModalTranslation = () => {
    setOpenModalTranslation(true);
  };

  const query = window.location.search;
  const urlParams = new URLSearchParams(query);

  const nameAppPartner = urlParams.get("name_app");

  return (
    <Container>
      <nav className="content-nav">
        <div className="content-logo">
          <img
            src={getPathImageDefault()}
            alt={`logo-${getNameApplication()}`}
          />
          <span className="project-name">{getNameApplication()}</span>
        </div>
        <ul className="content-links">
          <li>
            <a href="#sobre-nos">{t("nav-about-us")}</a>
          </li>
          <li>
            <Link
              to={
                nameAppPartner
                  ? `/passageiro?name_app=${nameAppPartner}`
                  : "/passageiro"
              }
            >
              {t("nav-passenger")}
            </Link>
          </li>
          <li>
            <Link
              to={
                nameAppPartner
                  ? `/motorista?name_app=${nameAppPartner}`
                  : "/motorista"
              }
            >
              {t("nav-driver")}
            </Link>
          </li>
          <li>
            <a href="#contato">{t("nav-contact")}</a>
          </li>

          <div className="content-button-links">
            <Button nameButton={t("nav-button")} onClick={handleAppModalLink} />
          </div>

          <div className="content-button-translations">
            <button onClick={handleAppModalTranslation}>
              <Translate size={32} weight="bold" />
            </button>
          </div>
        </ul>
        <div className="content-button-nav-mobile">
          <button onClick={handleOpenNavMobile}>
            <List size={30} weight="bold" />
          </button>
        </div>

        {isMobileLink && (
          <div className="content-nav-mobile">
            <nav>
              <button onClick={handleOpenNavMobile}>
                <X size={23} weight="bold" />
              </button>

              <ul>
                <li>
                  <a href="#sobre-nos">{t("nav-about-us")}</a>
                </li>
                <li>
                  <Link to="/passageiro">{t("nav-passenger")}</Link>
                </li>
                <li>
                  <Link to="/motorista">{t("nav-driver")}</Link>
                </li>
                <li>
                  <a href="#contato">{t("nav-contact")}</a>
                </li>
                <li onClick={handleAppModalLink}>
                  <button>{t("nav-button")}</button>
                </li>
                <li>
                  <button onClick={handleAppModalTranslation}>
                    <Translate size={32} weight="bold" />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </nav>

      <ModalLinks openModal={openModalLink} setOpenModal={setOpenModalLink} />

      <ModalTranslations
        openModal={openModalTranslation}
        setOpenModal={setOpenModalTranslation}
      />
    </Container>
  );
};

export default Header;
