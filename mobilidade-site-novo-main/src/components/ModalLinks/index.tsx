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

  const defaultApps: AppProps[] = [
    {
      id: 1,
      title: "Movy Passageiro",
      reference: "movy-passageiro",
      google_play_link: "https://play.google.com/store/apps/details?id=br.com.client.rota101",
      link_ios: "https://apps.apple.com/app/movy/id6738981234",
      app_type: { id: 2, name: "Passageiro" },
      app_type_id: 2,
    } as any,
    {
      id: 2,
      title: "Movy Motorista",
      reference: "movy-motorista",
      google_play_link: "https://play.google.com/store/apps/details?id=br.com.driver.rota101",
      link_ios: "https://apps.apple.com/app/movy-pro/id6738985678",
      app_type: { id: 1, name: "Motorista" },
      app_type_id: 1,
    } as any,
  ];

  const getAppsCustomer = async () => {
    try {
      setLoadingLinksApps(true);
      const projectName = window.env?.REACT_APP_PROJECT_NAME || process.env.REACT_APP_PROJECT_NAME || "movy";
      const responseAppsCustomer = await axios.get(
        `https://loja704.com.br/api/lojapps/${projectName}`,
        { timeout: 4000 }
      );

      if (responseAppsCustomer?.data?.response && responseAppsCustomer.data.response.length > 0) {
        setCustomerInformationsApps(responseAppsCustomer.data.response);
      } else {
        setCustomerInformationsApps(defaultApps);
      }
    } catch (error) {
      console.warn("Loja704 inacessível, utilizando links padrão do app:", error);
      setCustomerInformationsApps(defaultApps);
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
