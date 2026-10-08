import { Link } from "react-router-dom";
import { CaretUp } from "phosphor-react";

import { Container } from "./styles";

import { getPathImageDefault, getNameApplication, LogoMovyDefault } from "../../config/configApp";

import { useTranslation } from "react-i18next";

const Footer = () => {
    const handleUpPage = () => {
        window.scroll({ top: 0, behavior: "smooth" });
    }

    const { t } = useTranslation();

    const query = window.location.search;
    const urlParams = new URLSearchParams(query);
  
    const nameAppPartner = urlParams.get("name_app");
    
    return(
        <Container>
            <div className="content">
                <div className="content-logo">
                    <Link to={nameAppPartner ? `/?name_app=${nameAppPartner}` : "/"}>
                        <img
                          src={getPathImageDefault()}
                          alt={`logo-${getNameApplication()}`}
                          onError={(e) => {
                            e.currentTarget.src = LogoMovyDefault;
                          }}
                        />
                        <span className="project-name">{getNameApplication()}</span>
                    </Link>
                </div>
                <div className="content-description">
                    <span>{`Copyright © ${new Date().getFullYear()} - ${getNameApplication()} - ${t('text-footer-2')}`}</span>
                    <Link
                      to={nameAppPartner ? `/privacidade?name_app=${nameAppPartner}` : "/privacidade"}
                      className="footer-link-privacy"
                      aria-label={t("footer-privacy") as string}
                    >
                      {t("footer-privacy")}
                    </Link>
                </div>
                <div className="content-midias-socials">
                    <div onClick={handleUpPage} className="content-button-circle">
                        <CaretUp size={32} weight="bold" color="#f1f1f1f1" />
                    </div>
                </div>
            </div>
        </Container>    
    )
}

export default Footer;