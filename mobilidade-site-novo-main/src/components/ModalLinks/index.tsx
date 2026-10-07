import { Modal as ModalMaterial } from "@mui/material";
import { X } from "phosphor-react";
import swal from "sweetalert";
import axios from "axios";

import { Container } from "./styles";

import { Spinner } from "../Spinner";

import { Fragment, useEffect, useState } from "react";

interface ModalProps {
  openModal: boolean;
  setOpenModal: (data: boolean) => void;
}

export default function ModalLinks({ openModal, setOpenModal }: ModalProps) {
  const handleClose = () => setOpenModal(false);

  const [customerInformationsApps, setCustomerInformationsApps] = useState<
    AppProps[]
  >([]);

  const [loadingLinksApps, setLoadingLinksApps] = useState<boolean>(false);

  const getAppsCustomer = async () => {
    try {
      setLoadingLinksApps(true);
      const responseAppsCustomer = await axios(
        `https://loja704.com.br/api/lojapps/${window.env.REACT_APP_PROJECT_NAME}`
      );

      if (responseAppsCustomer.status) {
        setCustomerInformationsApps(responseAppsCustomer.data.response);
      }
    } catch (error) {
      swal({
        title: "Error",
        text: "Erro ao pegar aplicativos",
        icon: "error",
      });
    } finally {
      setLoadingLinksApps(false);
    }
  };

  useEffect(() => {
    getAppsCustomer();
  }, []);

  useEffect(() => {
    if (customerInformationsApps.length > 0) {
      customerInformationsApps.map((data: AppProps) => {
        const linkDownloadApp = data.google_play_link
          ? data.google_play_link
          : `https://loja704.com.br/${data.reference}/details-app`;

        if (data.app_type.id === 1) {
          localStorage.setItem(
            `@mobilidade-site-${process.env.REACT_APP_PROJECT_NAME}-link-app-driver`,
            JSON.stringify(linkDownloadApp)
          );
        }

        if (data.app_type_id === 2 && !data.title.includes("Pro")) {
          localStorage.setItem(
            `@mobilidade-site-${process.env.REACT_APP_PROJECT_NAME}-link-app-client`,
            JSON.stringify(linkDownloadApp)
          );
        }

        return true;
      });
    }
  }, [customerInformationsApps]);

  return (
    <div>
      <ModalMaterial
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Container>
          <div className="content-links-application">
            <div className="content-button-close-modal">
              <button onClick={handleClose}>
                <X size={32} weight="bold" />
              </button>
            </div>

            {loadingLinksApps && <Spinner />}

            {!loadingLinksApps &&
              customerInformationsApps.map((value) => {
                const linkDownloadApp = value.google_play_link
                  ? value.google_play_link
                  : `https://loja704.com.br/${value.reference}/details-app`;

                return (
                  <Fragment key={value.id}>
                    <div>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={linkDownloadApp}
                      >
                        {value.title.toLocaleUpperCase()}
                      </a>
                    </div>

                    {value.link_ios && (
                      <div>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={value.link_ios}
                        >
                          {`${value.title.toLocaleUpperCase()} IOS`}
                        </a>
                      </div>
                    )}
                  </Fragment>
                );
              })}
          </div>
        </Container>
      </ModalMaterial>
    </div>
  );
}
