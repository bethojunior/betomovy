import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Button, Modal, Input, Upload, UploadProps, Image } from "antd";
import { UploadFile } from "antd/lib";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { UploadOutlined } from "@ant-design/icons";
import swal from "sweetalert";

import {
  Container,
  Footer,
  Form,
  ContentInput,
  LabelInput,
  Row,
  MessageError,
} from "./styles";

import { ModalAddAndEditConfigProps, SchemaFormConfigApp } from "./types";
import { schemaFormConfigApp } from "./schema";
import api from "../../../../../services/api";
import { formatTextWithoutCharacters } from "../../../../../utils/Helpers";
import Mask from "../../../../../services/Mask";

export const ModalAddAndEditConfig = ({
  visible,
  setVisible,
  configAppSelected,
  setConfigAppSelected,
  getConfigsAppPartner,
}: ModalAddAndEditConfigProps) => {
  const { control, handleSubmit, setValue, reset } =
    useForm<SchemaFormConfigApp>({
      resolver: yupResolver(schemaFormConfigApp),
      defaultValues: {
        requiredLogo: !configAppSelected,
      },
    });

  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [changeLogo, setChangeLogo] = useState<boolean>(false);

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setValue("logoApp", newFileList[0]?.originFileObj as any);
    return false;
  };

  const { setMaskPhoneValue } = Mask;

  const handleCloseModal = () => {
    setVisible(false);
    setConfigAppSelected(null);
    setChangeLogo(true);
    reset();
  };

  const handleSaveConfigAppPartner = async (data: SchemaFormConfigApp) => {
    try {
      setLoading(true);

      let appPartnerSupport: string | null = null;

      if (data.phoneSupport) {
        appPartnerSupport = data.phoneSupport?.replace(/[^0-9+]/g, "");
      }

      const formData = new FormData();

      formData.append("key", formatTextWithoutCharacters(data.nameApp));
      formData.append("name_app", data.nameApp);
      formData.append("primary_color", data.primaryColor);
      formData.append("secondary_color", data.secondaryColor);
      formData.append("text_color", data.textColor);
      formData.append("logo_app", data.logoApp as File);

      if (data.phoneSupport) {
        formData.append("phone_support", String(appPartnerSupport));
      }

      const responseAddConfigAppPartner = await api.post(
        "config_app_partners",
        formData
      );

      if (responseAddConfigAppPartner.status) {
        swal({
          title: "Sucesso",
          text: "Configuração de app adicionada com sucesso",
          icon: "success",
        });

        handleCloseModal();
        getConfigsAppPartner();
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.response[0],
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeLogo = () => {
    setChangeLogo(true);
    setFileList([]);
  };

  const handleEditConfigAppPartner = async (data: SchemaFormConfigApp) => {
    try {
      setLoading(true);

      let appPartnerSupport: string | null = null;

      if (data.phoneSupport) {
        appPartnerSupport = data.phoneSupport?.replace(/[^0-9+]/g, "");
      }

      const formData = new FormData();

      formData.append("key", formatTextWithoutCharacters(data.nameApp));
      formData.append("name_app", data.nameApp);
      formData.append("primary_color", data.primaryColor);
      formData.append("secondary_color", data.secondaryColor);
      formData.append("text_color", data.textColor);

      if (data.phoneSupport) {
        formData.append("phone_support", String(appPartnerSupport));
      }

      if (data.logoApp) {
        formData.append("logo_app", data.logoApp as File);
      }

      const responseEditConfigAppPartner = await api.post(
        `config_app_partners/${configAppSelected?.id}`,
        formData
      );

      if (responseEditConfigAppPartner.status) {
        swal({
          title: "Sucesso",
          text: "Configuração de app editada com sucesso",
          icon: "success",
        });

        handleCloseModal();
        getConfigsAppPartner();
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.response[0],
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (configAppSelected) {
      setValue("nameApp", configAppSelected.name_app);
      setValue("primaryColor", configAppSelected.primary_color);
      setValue("secondaryColor", configAppSelected.secondary_color);
      setValue("textColor", configAppSelected.text_color);
      setValue(
        "phoneSupport",
        setMaskPhoneValue(configAppSelected?.phone_support ?? "")
      );
      setChangeLogo(false);
      setValue("requiredLogo", false);
    } else {
      setValue("primaryColor", "#000000");
      setValue("secondaryColor", "#000000");
      setValue("textColor", "#000000");
      setChangeLogo(true);
      setValue("requiredLogo", true);
      setFileList([]);
    }
  }, [configAppSelected]);

  return (
    <Modal
      open={visible}
      onCancel={handleCloseModal}
      title={
        configAppSelected ? "Editar Configuração" : "Adicionar Configuração"
      }
      footer={[]}
    >
      <Container>
        <Form
          onSubmit={handleSubmit(
            configAppSelected
              ? handleEditConfigAppPartner
              : handleSaveConfigAppPartner
          )}
        >
          <Controller
            control={control}
            name="nameApp"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ContentInput>
                <LabelInput>Nome do app</LabelInput>
                <Input
                  type="text"
                  onChange={onChange}
                  value={value}
                  status={error ? "error" : ""}
                />
                {Boolean(error) && (
                  <MessageError>{error?.message}</MessageError>
                )}
              </ContentInput>
            )}
          />

          <div
            style={{
              margin: "1rem 0",
            }}
          >
            <Controller
              control={control}
              name="phoneSupport"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <ContentInput>
                  <LabelInput>Telefone Suporte</LabelInput>
                  <Input
                    type="text"
                    onChange={(event) => {
                      const valueInput = event.target.value;
                      onChange(setMaskPhoneValue(valueInput));
                    }}
                    value={value}
                    status={error ? "error" : ""}
                    placeholder="+55 (00) 0 0000-0000"
                  />
                  {Boolean(error) && (
                    <MessageError>{error?.message}</MessageError>
                  )}
                </ContentInput>
              )}
            />
          </div>

          {!changeLogo && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <Image
                src={configAppSelected?.logo_app}
                width={100}
                alt={`logo-${configAppSelected?.name_app}`}
              />

              <Button
                style={{
                  width: "100%",
                }}
                onClick={handleChangeLogo}
              >
                Alterar Logo
              </Button>
            </div>
          )}

          {changeLogo && (
            <Controller
              control={control}
              name="logoApp"
              render={({ fieldState: { error } }) => (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <Upload
                    style={{
                      width: "100%",
                    }}
                    listType="picture"
                    maxCount={1}
                    className="upload-list-inline"
                    name="file"
                    accept=".jpeg, .png"
                    onChange={handleChange}
                    fileList={fileList as []}
                    multiple={false}
                    beforeUpload={() => {
                      return false;
                    }}
                  >
                    <Button
                      style={{
                        width: "100%",
                      }}
                      icon={<UploadOutlined />}
                    >
                      Escolha a Logo
                    </Button>
                  </Upload>

                  {Boolean(error) && (
                    <MessageError>{error?.message}</MessageError>
                  )}
                </div>
              )}
            />
          )}

          <Row>
            <Controller
              control={control}
              name="primaryColor"
              render={({ field: { onChange, value } }) => (
                <ContentInput
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <LabelInput>Cor principal</LabelInput>
                  <input type="color" onChange={onChange} value={value} />
                </ContentInput>
              )}
            />

            <Controller
              control={control}
              name="secondaryColor"
              render={({ field: { onChange, value } }) => (
                <ContentInput
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <LabelInput>Cor secundária</LabelInput>
                  <input type="color" onChange={onChange} value={value} />
                </ContentInput>
              )}
            />

            <Controller
              control={control}
              name="textColor"
              render={({ field: { onChange, value } }) => (
                <ContentInput
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <LabelInput>Cor de texto</LabelInput>
                  <input type="color" onChange={onChange} value={value} />
                </ContentInput>
              )}
            />
          </Row>

          <Footer>
            <Button type="primary" htmlType="submit" loading={loading}>
              {configAppSelected ? "Editar" : "Adicionar"}
            </Button>
            <Button onClick={handleCloseModal}>Cancelar</Button>
          </Footer>
        </Form>
      </Container>
    </Modal>
  );
};
