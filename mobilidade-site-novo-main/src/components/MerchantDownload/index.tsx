import { Container } from "./styles";

import pathGooglePlay from '../../assets/svg/Google-Play.svg';
import pathAppStore from '../../assets/svg/app-store.svg';

import { getLinkAppClientIos, getLinkAppClient } from "../../config/configApp";

import { useTranslation } from "react-i18next";

const MerchantDownload = () => {

    const { t } = useTranslation();

    return(
        <Container>
            <div className="content-merchant-website">
                <h1>{t('text-merchant')} <br /> {t('text-merchant-2')}</h1>
                <div className="content-buttons">
                    <a href={getLinkAppClient()} target="_blank" rel="noopener noreferrer">
                        <img src={pathGooglePlay} alt="logo-googleplay" />
                    </a>
                    <a href={getLinkAppClientIos()} target="_blank" rel="noopener noreferrer">
                        <img src={pathAppStore} alt="logo-appstore" />
                    </a>
                </div>
            </div>
        </Container>
    )
}

export default MerchantDownload;