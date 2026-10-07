import { Modal, Button, Input } from "antd";
import swal from "sweetalert";

import { useDebounce } from "../../../../../hooks/useDebounce";

import {
  Container,
  ContentColorsApp,
  ContentDescription,
  ContentLogo,
  ContentSimulatorApp,
  LabelText,
  ContentInput,
  ColorsSectionTitle,
  LogoLabel,
  FullWidthSelect,
} from "./styles";

import { ModalEditProps } from "./types";

import pathLogoDefault from "../../../../../assets/logo-default-config-app.png";

import { ChangeEvent, useEffect, useMemo, useState, useRef } from "react";

import api from "../../../../../services/api";

import { SimulatorConfigApp } from "../SimulatorConfigApp";

const APPS_OPTIONS = [
  {
    label: "App Motorista",
    value: 2,
  },
  {
    label: "App Passageiro",
    value: 4,
  },
];

export const ModalEdit = ({
  setShowModal,
  showModal,
  configSelected,
  setConfigSelected,
  setLoading,
  typeModal,
  getAppConfig,
  listConfigSelected,
}: ModalEditProps) => {
  const [nameApp, setNameApp] = useState<string>("");
  const [idTypeConfig, setIdTypeConfig] = useState<number | null>(null);
  const [colorPrimary, setColorPrimary] = useState<string>("#000000");
  const [colorTextPrimary, setColorTextPrimary] = useState<string>("#ffffff");
  const [colorSecond, setColorSecond] = useState<string>("#ffffff");

  const [logoSelected, setLogoSelected] = useState<Blob | null>(null);
  const [urlLogo, setUrlLogo] = useState<string | null>(null);

  const refInputLogo = useRef<HTMLInputElement | null>(null);

  const debouncedColorPrimary = useDebounce((value: string) => {
    if (value.length > 0) {
      setColorPrimary(value);
    }
  }, 1000);

  const debouncedColorSecondary = useDebounce((value: string) => {
    if (value.length > 0) {
      setColorSecond(value);
    }
  }, 1000);

  const debouncedColorText = useDebounce((value: string) => {
    if (value.length > 0) {
      setColorTextPrimary(value);
    }
  }, 1000);

  const handleChangeColors = (
    newValue: string,
    type: "primary" | "text" | "secondary"
  ) => {
    if (type === "primary") {
      debouncedColorPrimary(newValue);
    } else if (type === "text") {
      debouncedColorText(newValue);
    } else if (type === "secondary") {
      debouncedColorSecondary(newValue);
    }
  };

  const handleUpdateAppConfig = async () => {
    try {
      setLoading(true);

      if (nameApp?.length <= 0) {
        swal({
          title: "Preencha o campo nome",
          icon: "warning",
        });

        return;
      }

      if (!idTypeConfig) {
        swal({
          title: "Escolha o layout do aplicativo",
          icon: "warning",
        });

        return;
      }

      if (!configSelected && logoSelected === null) {
        swal({
          title: "Escolha a logo da sua aplicação",
          icon: "warning",
        });

        return;
      }

      const formData = new FormData();

      formData.append("name", nameApp);
      formData.append("mainColor", colorPrimary as string);
      formData.append("mainColorText", colorTextPrimary as string);
      formData.append("secondaryColor", colorSecond as string);
      formData.append("secondaryColorText", "#000000");
      formData.append("appId", String(idTypeConfig));
      if (logoSelected !== null) {
        formData.append("logo", logoSelected as Blob);
      }

      const responseAppConfig = await api.post("appConfig", formData);

      if (responseAppConfig.status) {
        swal({
          title: "Configurações do aplicativo atualizadas com sucesso",
          icon: "success",
        });
        getAppConfig();
        setConfigSelected(null);
        setIdTypeConfig(null);
        setColorPrimary("#000000");
        setColorTextPrimary("#000000");
        setColorSecond("#000000");
        setNameApp("");
        setLogoSelected(null);
        setUrlLogo(null);
        setShowModal(false);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao atualizar configuração do aplicativo",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoFile = (file: File | Blob) => {
    setLogoSelected(file);
    setUrlLogo(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (urlLogo?.startsWith("blob:")) {
        URL.revokeObjectURL(urlLogo);
      }
    };
  }, [urlLogo]);

  const handleChangePhoto = (data: ChangeEvent<HTMLInputElement>) => {
    if (data.target.files) {
      const files = data.target.files[0];
      handleLogoFile(files);
    }
  };

  useEffect(() => {
    if (showModal && configSelected) {
      setUrlLogo(configSelected.logo);
      setLogoSelected(null);
      setIdTypeConfig(configSelected?.appId);
      setColorPrimary(configSelected?.mainColor);
      setColorTextPrimary(configSelected?.mainColorText);
      setColorSecond(configSelected?.secondaryColor);
      setNameApp(configSelected?.name);
    } else {
      setConfigSelected(null);
      setIdTypeConfig(null);
      setColorPrimary("#000000");
      setColorTextPrimary("#000000");
      setColorSecond("#ffffff");
      setNameApp("");
      setLogoSelected(null);
      setUrlLogo(null);
      if (refInputLogo.current) {
        refInputLogo.current.value = "";
      }
    }
  }, [showModal, configSelected]);

  const isTypeDriver = configSelected?.appId === 2 ? true : false;

  const appsSelected = useMemo(() => {
    if (!listConfigSelected[0]) {
      return APPS_OPTIONS;
    }

    return APPS_OPTIONS.filter(
      (data) => data.value !== listConfigSelected[0].appId
    );
  }, [listConfigSelected]);

  useEffect(() => {
    if (configSelected) {
      setIdTypeConfig(configSelected.appId);
      return;
    }

    if (appsSelected.length === 1) {
      setIdTypeConfig(appsSelected[0].value);
      return;
    }
  }, [configSelected, appsSelected]);

  const logoPreviewUrl = urlLogo ?? configSelected?.logo ?? pathLogoDefault;

  return (
    <Modal
      width={900}
      title={`Configuração Dinâmica de Cores de Logo de App${
        configSelected ? (isTypeDriver ? " Motorista" : " Passageiro") : "s"
      }`}
      open={showModal}
      onCancel={() => setShowModal(false)}
      footer={[
        <Button
          block
          type="primary"
          onClick={handleUpdateAppConfig}
          key={1}
        >
          Salvar
        </Button>,
      ]}
    >
      <Container>
        <ContentDescription>
          <div>
            <ContentInput>
              <LabelText>Nome</LabelText>
              <Input
                value={nameApp}
                onChange={(event) => setNameApp(event.target.value)}
              />
            </ContentInput>
            {!configSelected && (
              <ContentInput>
                <LabelText>Selecione layout do app</LabelText>
                <FullWidthSelect
                  value={idTypeConfig}
                  onChange={(value) => setIdTypeConfig(value as number)}
                  disabled={configSelected ? true : false}
                  options={appsSelected}
                />
              </ContentInput>
            )}
            <ColorsSectionTitle>Cores</ColorsSectionTitle>
            <ContentColorsApp>
              <ContentInput>
                <LabelText>Cor principal</LabelText>
                <input
                  type="color"
                  value={colorPrimary}
                  onChange={(event) =>
                    handleChangeColors(event.target.value, "primary")
                  }
                />
              </ContentInput>

              <ContentInput>
                <LabelText>Cor texto principal</LabelText>
                <input
                  type="color"
                  value={colorTextPrimary}
                  onChange={(event) =>
                    handleChangeColors(event.target.value, "text")
                  }
                />
              </ContentInput>

              <ContentInput>
                <LabelText>Cor secundária</LabelText>
                <input
                  type="color"
                  value={colorSecond}
                  onChange={(event) =>
                    handleChangeColors(event.target.value, "secondary")
                  }
                />
              </ContentInput>
            </ContentColorsApp>
          </div>

          <ContentLogo isExistsLogo={configSelected ? true : false}>
            <LogoLabel htmlFor="logo" bgImage={logoPreviewUrl} />
            <input
              type="file"
              ref={refInputLogo}
              id="logo"
              onChange={handleChangePhoto}
            />
            <span>
              {configSelected
                ? "Logo atual mantida. Clique para substituir (opcional)"
                : "Escolha uma logo para ser inserida no aplicativo"}
            </span>
          </ContentLogo>
        </ContentDescription>
        <ContentSimulatorApp>
          <div>
            <SimulatorConfigApp
              idTypeConfig={idTypeConfig}
              configSelected={configSelected}
              type={typeModal}
              colorPrimary={colorPrimary}
              colorSecondary={colorSecond}
              colorTextPrimary={colorTextPrimary}
            />
          </div>
        </ContentSimulatorApp>
      </Container>
    </Modal>
  );
};
