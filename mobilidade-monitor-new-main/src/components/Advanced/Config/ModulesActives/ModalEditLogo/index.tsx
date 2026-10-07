/* eslint-disable react-hooks/rules-of-hooks */
import { Button, Modal } from "antd";
import { AxiosError } from "axios";
import swal from "sweetalert";
import { FaLongArrowAltRight } from "react-icons/fa";

import { ChangeEvent, useState } from "react";

import { ModulesActivesProps } from "../../../../../pages/Advanced/Configs/ModulesActives/types";
import api from "../../../../../services/api";

import { Constants } from "../../../../../utils/constants";
import { resizeLogo } from "../../../../../hooks/resizeLogo";

import {
  Container,
  ContainerLogo,
  ContentIcon,
  ContentLogo,
  Logo,
  ObsText,
} from "./styles";

interface ModalEditLogoProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  moduleActiveSelected: ModulesActivesProps | null;
  setModuleActiveSelected: (data: ModulesActivesProps | null) => void;
  getModules: () => void;
}

export const ModalEditLogo = ({
  visible,
  setVisible,
  moduleActiveSelected,
  setModuleActiveSelected,
  getModules,
}: ModalEditLogoProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [logoSelectedUri, setLogoSelectedUri] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | Blob | null>(null);

  const handleCloseModal = () => {
    setVisible(false);
    setModuleActiveSelected(null);
    setLogoFile(null);
    setLogoSelectedUri(null);
  };

  const handleSelectLogo = async (data: ChangeEvent<HTMLInputElement>) => {
    if (data.target.files) {
      const file = data.target.files[0];
      try {
        const responseUriImg = await resizeLogo(
          file,
          70,
          90,
          "PNG",
          "base64"
        );
        const responseFileImg = await resizeLogo(
          file,
          70,
          90,
          "PNG",
          "blob"
        );

        const imageElement = new Image();

        imageElement.src = responseUriImg as string;

        imageElement.onload = () => {
          if (imageElement.width === imageElement.height) {
            setLogoSelectedUri(responseUriImg as string);
            setLogoFile(responseFileImg as Blob);
          } else {
            swal({
              title: "Imagem precisa ser em formato quadrado",
              icon: "warning",
            });
          }
        };
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleUpdateLogo = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("id", String(moduleActiveSelected?.id));
      formData.append("isActive", String(moduleActiveSelected?.isActive));
      formData.append("name", moduleActiveSelected?.name as string);
      formData.append("logo", logoFile as Blob);

      const responseUpdateLogo = await api.post("appModule/update", formData);

      if (responseUpdateLogo.status) {
        swal({
          title: "Logo atualizada com sucesso",
          icon: "success",
        }).then(() => {
          getModules();
          handleCloseModal();
        });
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Alterar logo"
      open={visible}
      onCancel={handleCloseModal}
      footer={[
        <Button key={1} onClick={handleCloseModal}>
          Cancelar
        </Button>,
        <Button
          key={2}
          type="primary"
          onClick={handleUpdateLogo}
          loading={loading}
          disabled={logoFile === null}
        >
          Salvar
        </Button>,
      ]}
    >
      <Container>
        <ContainerLogo>
          <ContentLogo>
            <h3>Logo Atual</h3>
            <Logo
              htmlFor="old-logo"
              backgroundImg={
                moduleActiveSelected?.logo
                  ? `${moduleActiveSelected.logo}?v=${new Date().getTime()}`
                  : Constants.defaultImgNotFound
              }
            ></Logo>
            <input
              type="file"
              placeholder="Escolha a logo"
              id="old-logo"
              disabled
            />
          </ContentLogo>

          <ContentIcon>
            <FaLongArrowAltRight />
          </ContentIcon>

          <ContentLogo>
            <h3>Logo Nova</h3>
            <Logo
              htmlFor="new-logo"
              backgroundImg={
                logoSelectedUri ? logoSelectedUri : Constants.defaultImgNotFound
              }
            ></Logo>
            <input
              type="file"
              placeholder="Escolha a logo"
              id="new-logo"
              onChange={handleSelectLogo}
            />
          </ContentLogo>
        </ContainerLogo>

        <ObsText>
          A imagem precisa ser em formato quadrado (largura e tamanho iguais)
        </ObsText>
      </Container>
    </Modal>
  );
};
