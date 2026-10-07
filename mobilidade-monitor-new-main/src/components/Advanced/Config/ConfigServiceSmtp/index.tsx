import { Button, Input, Modal, Radio, Select } from "antd";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AxiosError } from "axios";
import swal from "sweetalert";

import { useEffect, useState } from "react";

import {
  Container,
  ContentInput,
  Label,
  Footer,
  ContentMsgError,
} from "./styles";

import api from "../../../../services/api";
import { ConfigServiceSmtpProps } from "../../../../pages/Advanced/Configs/ConfigServiceSMTP/types";

interface ModalAddConfigSmtpProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  serviceSelected: ConfigServiceSmtpProps | null;
  setServiceSelected: (data: ConfigServiceSmtpProps | null) => void;
  getServiceSmtp: () => void;
}

const schemaForm = yup
  .object({
    nameService: yup.string().required("Este campo é obrigatório"),
    emailRemetent: yup.string().email().required("Este campo é obrigatório"),
    nameRemetent: yup.string().required("Este campo é obrigatório"),
    host: yup.string().required("Este campo é obrigatório"),
    port: yup.string().required("Este campo é obrigatório"),
    user: yup.string().required("Este campo é obrigatório"),
    password: yup.string().required("Este campo é obrigatório"),
    cryptography: yup.string().required("Este campo é obrigatório"),
  })
  .required();

type SchemaFormProps = yup.InferType<typeof schemaForm>;

export const ModalAddConfigSmtp = ({
  visible,
  setVisible,
  serviceSelected,
  setServiceSelected,
  getServiceSmtp,
}: ModalAddConfigSmtpProps) => {
  const [defaultServiceEmail, setDefaultServiceEmail] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { control, handleSubmit, setValue, clearErrors } =
    useForm<SchemaFormProps>({
      resolver: yupResolver(schemaForm),
    });

  const handleCloseModal = () => {
    setVisible(false);
    setServiceSelected(null);
    setDefaultServiceEmail(false);
    setValue("cryptography", "");
    setValue("emailRemetent", "");
    setValue("nameRemetent", "");
    setValue("nameService", "");
    setValue("password", "");
    setValue("port", "");
    setValue("host", "");
    setValue("user", "");
  };

  const handleAddDefaultSmtp = async () => {
    try {
      setLoading(true);
      const responseAddDefaultSmpt = await api.put("smtpServer/disable");

      if (responseAddDefaultSmpt.status) {
        swal({
          title: "Credenciais de serviço SMTP atualizadas",
          icon: "success",
        });
        getServiceSmtp();
        handleCloseModal();
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSmtp: SubmitHandler<SchemaFormProps> = async (
    data: SchemaFormProps
  ) => {
    try {
      setLoading(true);

      const responseAddSmtp = await api.put(
        `smtpServer/${serviceSelected?.id}/update`,
        {
          encryption: data.cryptography,
          fromMailer: data.emailRemetent,
          fromName: data.nameRemetent,
          host: data.host,
          mailer: data.nameService,
          password: data.password,
          port: data.port,
          username: data.user,
        }
      );

      if (responseAddSmtp.status) {
        swal({
          title: "Serviço editado com sucesso!",
          icon: "success",
        });
        getServiceSmtp();
        handleCloseModal();
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSmtp: SubmitHandler<SchemaFormProps> = async (
    data: SchemaFormProps
  ) => {
    try {
      setLoading(true);

      const responseAddSmtp = await api.post("smtpServer", {
        encryption: data.cryptography,
        fromMailer: data.emailRemetent,
        fromName: data.nameRemetent,
        host: data.host,
        mailer: data.nameService,
        password: data.password,
        port: data.port,
        username: data.user,
      });

      if (responseAddSmtp.status) {
        swal({
          title: "Serviço cadastrado com sucesso!",
          icon: "success",
        });
        getServiceSmtp();
        handleCloseModal();
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serviceSelected) {
      setValue("cryptography", serviceSelected?.encryption);
      setValue("emailRemetent", serviceSelected?.fromMailer);
      setValue("nameRemetent", serviceSelected?.fromName);
      setValue("nameService", serviceSelected?.mailer);
      setValue("password", serviceSelected?.password);
      setValue("port", serviceSelected?.port);
      setValue("host", serviceSelected?.host);
      setValue("user", serviceSelected?.username);

      clearErrors("cryptography");
      clearErrors("emailRemetent");
      clearErrors("nameRemetent");
      clearErrors("nameService");
      clearErrors("password");
      clearErrors("port");
      clearErrors("host");
      clearErrors("user");
    }
  }, [serviceSelected]);

  return (
    <Modal
      title={
        serviceSelected
          ? "Editar novo serviço SMTP"
          : "Adicionar novo serviço SMTP"
      }
      open={visible}
      onCancel={handleCloseModal}
      footer={[]}
    >
      <Container
        onSubmit={
          serviceSelected
            ? handleSubmit(handleEditSmtp)
            : handleSubmit(handleAddSmtp)
        }
      >
        <Radio.Group
          onChange={(event) => setDefaultServiceEmail(event.target.value)}
          value={defaultServiceEmail}
        >
          <Radio value={true}>Usar o serviço de E-mail padrão</Radio>
          <Radio value={false}>
            Usar o serviço de E-mail personalizado (SMTP)
          </Radio>
        </Radio.Group>

        {!defaultServiceEmail && (
          <>
            <Controller
              control={control}
              name="nameService"
              render={({
                field: { onChange, name, value },
                fieldState: { error },
              }) => (
                <ContentInput>
                  <Label htmlFor="name-service">Nome do serviço</Label>
                  <Input
                    id="name-service"
                    placeholder="Nome do serviço"
                    name={name}
                    onChange={onChange}
                    value={value}
                    status={Boolean(error) ? "error" : ""}
                  />
                  {Boolean(error) && (
                    <ContentMsgError>{error?.message}</ContentMsgError>
                  )}
                </ContentInput>
              )}
            />

            <Controller
              control={control}
              name="emailRemetent"
              render={({
                field: { onChange, name, value },
                fieldState: { error },
              }) => (
                <ContentInput>
                  <Label htmlFor="email-remetent">Email do remetente</Label>
                  <Input
                    id="email-remetent"
                    placeholder="Email do remetente"
                    name={name}
                    onChange={onChange}
                    value={value}
                    status={Boolean(error) ? "error" : ""}
                  />
                  {Boolean(error) && (
                    <ContentMsgError>{error?.message}</ContentMsgError>
                  )}
                </ContentInput>
              )}
            />

            <Controller
              control={control}
              name="nameRemetent"
              render={({
                field: { onChange, name, value },
                fieldState: { error },
              }) => (
                <ContentInput>
                  <Label htmlFor="name-remetent">Nome do remetente</Label>
                  <Input
                    id="name-remetent"
                    placeholder="Nome do remetente"
                    name={name}
                    onChange={onChange}
                    value={value}
                    status={Boolean(error) ? "error" : ""}
                  />
                  {Boolean(error) && (
                    <ContentMsgError>{error?.message}</ContentMsgError>
                  )}
                </ContentInput>
              )}
            />

            <Controller
              control={control}
              name="host"
              render={({
                field: { onChange, name, value },
                fieldState: { error },
              }) => (
                <ContentInput>
                  <Label htmlFor="host">Host</Label>
                  <Input
                    id="host"
                    placeholder="Host"
                    name={name}
                    onChange={onChange}
                    value={value}
                    status={Boolean(error) ? "error" : ""}
                  />
                  {Boolean(error) && (
                    <ContentMsgError>{error?.message}</ContentMsgError>
                  )}
                </ContentInput>
              )}
            />

            <Controller
              control={control}
              name="port"
              render={({
                field: { onChange, name, value },
                fieldState: { error },
              }) => (
                <ContentInput>
                  <Label htmlFor="port">Porta</Label>
                  <Input
                    id="port"
                    placeholder="Porta"
                    name={name}
                    onChange={onChange}
                    value={value}
                    status={Boolean(error) ? "error" : ""}
                  />
                  {Boolean(error) && (
                    <ContentMsgError>{error?.message}</ContentMsgError>
                  )}
                </ContentInput>
              )}
            />

            <Controller
              control={control}
              name="user"
              render={({
                field: { onChange, name, value },
                fieldState: { error },
              }) => (
                <ContentInput>
                  <Label htmlFor="user">Usuário</Label>
                  <Input
                    id="user"
                    placeholder="Usuário"
                    name={name}
                    onChange={onChange}
                    value={value}
                    status={Boolean(error) ? "error" : ""}
                  />
                  {Boolean(error) && (
                    <ContentMsgError>{error?.message}</ContentMsgError>
                  )}
                </ContentInput>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({
                field: { onChange, name, value },
                fieldState: { error },
              }) => (
                <ContentInput>
                  <Label htmlFor="password">Senha</Label>
                  <Input.Password
                    id="password"
                    placeholder="Senha"
                    name={name}
                    onChange={onChange}
                    value={value}
                    status={Boolean(error) ? "error" : ""}
                  />
                  {Boolean(error) && (
                    <ContentMsgError>{error?.message}</ContentMsgError>
                  )}
                </ContentInput>
              )}
            />

            <Controller
              control={control}
              name="cryptography"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <ContentInput>
                  <Label htmlFor="cryptography">Criptografia</Label>
                  <Select
                    style={{
                      width: "100%",
                    }}
                    id="cryptography"
                    placeholder="Criptografia"
                    options={[
                      {
                        value: "ssl",
                        label: "SSL",
                      },
                      {
                        value: "tls",
                        label: "TLS",
                      },
                    ]}
                    onChange={onChange}
                    value={value}
                    status={Boolean(error) ? "error" : ""}
                  />
                  {Boolean(error) && (
                    <ContentMsgError>{error?.message}</ContentMsgError>
                  )}
                </ContentInput>
              )}
            />
          </>
        )}

        <Footer>
          <Button onClick={handleCloseModal}>Cancelar</Button>

          {!defaultServiceEmail ? (
            <Button htmlType="submit" type="primary" loading={loading}>
              {serviceSelected ? "Editar" : "Salvar"}
            </Button>
          ) : (
            <Button
              type="primary"
              loading={loading}
              onClick={handleAddDefaultSmtp}
            >
              Salvar
            </Button>
          )}
        </Footer>
      </Container>
    </Modal>
  );
};
