import { Modal as ModalMaterial } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { X } from 'phosphor-react';

import { Container } from './styles';

import CardLanguage from '../CardLanguage';

import { isLanguageEnabled } from '../../utils/languageConfig';

interface ModalProps{
    openModal: boolean;
    setOpenModal: (data: boolean) => void;
}

export default function ModalTranslations({ openModal, setOpenModal }:ModalProps) {
  const handleClose = () => setOpenModal(false);

  const { t } = useTranslation();

  return (
    <div>
      <ModalMaterial
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Container>
            <div className='content-translations'>
                <div className='content-button-close-modal'>
                  <button onClick={handleClose}>
                    <X size={32} weight='bold' />
                  </button>
                </div>

                <h1>{t('modal-language-title')}</h1>
                <div className='content-cards-translation'>
                    {isLanguageEnabled('en') && (
                      <CardLanguage codeLanguage='en' nameLanguage={t('modal-language-en')} />
                    )}
                    {isLanguageEnabled('pt') && (
                      <CardLanguage codeLanguage='pt' nameLanguage={t('modal-language-pt')} />
                    )}
                    {isLanguageEnabled('es') && (
                      <CardLanguage codeLanguage='es' nameLanguage={t('modal-language-es')} />
                    )}
                    {isLanguageEnabled('fr') && (
                      <CardLanguage codeLanguage='fr' nameLanguage={t('modal-language-fr')} />
                    )}
                </div>
            </div>
        </Container>
      </ModalMaterial>
    </div>
  );
}