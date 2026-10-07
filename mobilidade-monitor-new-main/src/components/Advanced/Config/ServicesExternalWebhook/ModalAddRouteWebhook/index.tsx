import { useEffect, useState } from "react";
import { Modal, Input, Select, Divider, Button } from "antd";
import { AxiosError } from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import swal from "sweetalert";

import { ModalAddRouteWebhookProps } from "./types";

import {
  Container,
  ContentInput,
  LabelInput,
  ContentBtnFooter,
  MessageErrorInput,
} from "./styles";
import { TypesWebhooksProps } from "../../../../../pages/Advanced/Configs/ServicesExternalWebhook/types";
import api from "../../../../../services/api";

import { SchemaWebookProps } from "./types";
import { schemaWebhook } from "./schema";

const methods_webhooks = [
  {
    value: "GET",
    label: "GET",
  },
  {
    value: "POST",
    label: "POST",
  },
  {
    value: "PUT",
    label: "PUT",
  },
  {
    value: "DELETE",
    label: "DELETE",
  },
  {
    value: "PATCH",
    label: "PATCH",
  },
];

export const ModalAddEditRouteWebhook = ({
  visible,
  setVisible,
  getAllWebhooks,
  dataWebhook,
  setDataWebhook,
}: ModalAddRouteWebhookProps) => {
  const { control, reset, handleSubmit, setValue } = useForm<SchemaWebookProps>(
    {
      resolver: yupResolver(schemaWebhook),
    }
  );

  const [typesServices, setTypesServices] = useState<DefaultOptionsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCloseModal = () => {
    setVisible(false);
    setDataWebhook(null);
    reset();
  };

  const getTypesServices = async () => {
    try {
      const responseTypesServices = await api.get("webhook/typesServices");

      const typesServicesFormated = responseTypesServices.data.response.map(
        (value: TypesWebhooksProps) => {
          return {
            value: value.id,
            label: value.name.toLocaleUpperCase(),
          };
        }
      );
      setTypesServices(typesServicesFormated);
    } catch (error) {
      console.error(error);
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        icon: "error",
        text: responseError.response?.data.message,
      });
    }
  };

  const handleSaveData = async (data: SchemaWebookProps) => {
    try {
      setLoading(true);
      const responseSave = await api.post("webhook", {
        url: data.url,
        active: 1,
        type_service_id: data.type_services,
        method: data.method,
      });

      if (responseSave.status) {
        getAllWebhooks();
        handleCloseModal();
        swal({
          title: "Sucesso",
          icon: "success",
          text: "Webhook salvo com sucesso",
        });
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        icon: "error",
        text: responseError.response?.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditWebhook = async (data: SchemaWebookProps) => {
    try {
      setLoading(true);
      const responseEdit = await api.patch(`webhook/${dataWebhook?.id}`, {
        url: data.url,
        active: 1,
        type_service_id: data.type_services,
        method: data.method,
      });

      if (responseEdit.status) {
        getAllWebhooks();
        handleCloseModal();
        swal({
          title: "Sucesso",
          icon: "success",
          text: "Webhook editado com sucesso",
        });
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        icon: "error",
        text: responseError.response?.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTypesServices();
  }, []);

  useEffect(() => {
    if (dataWebhook) {
      setValue("url", dataWebhook.url);
      setValue("type_services", dataWebhook.type_service_id);
      setValue("method", dataWebhook.method);
    }
  }, [dataWebhook]);
  

  return (
    <Modal
      open={visible}
      onCancel={handleCloseModal}
      title={dataWebhook ? "Editar rota webhook" : "Adicionar rota webhook"}
      footer={[]}
    >
      <Container
        onSubmit={handleSubmit(
          dataWebhook ? handleEditWebhook : handleSaveData
        )}
      >
        <Controller
          control={control}
          name="url"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <ContentInput>
              <LabelInput htmlFor="url">Url</LabelInput>
              <Input
                id="url"
                placeholder="https://exemplo.com"
                onChange={onChange}
                value={value}
              />
              {error?.message && (
                <MessageErrorInput>{error?.message}</MessageErrorInput>
              )}
            </ContentInput>
          )}
        />

        <Controller
          control={control}
          name="method"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <ContentInput>
              <LabelInput htmlFor="method">Método</LabelInput>
              <Select
                id="method"
                placeholder="Escolha o método"
                onChange={onChange}
                options={methods_webhooks}
                value={value}
              />
              {error?.message && (
                <MessageErrorInput>{error?.message}</MessageErrorInput>
              )}
            </ContentInput>
          )}
        />

        <Controller
          control={control}
          name="type_services"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <ContentInput>
              <LabelInput htmlFor="type-service">Tipo de serviço</LabelInput>
              <Select
                id="type-service"
                placeholder="Escolha o tipo de serviço"
                onChange={onChange}
                options={typesServices}
                value={value}
              />
              {error?.message && (
                <MessageErrorInput>{error?.message}</MessageErrorInput>
              )}
            </ContentInput>
          )}
        />

        <Divider />

        <ContentBtnFooter>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button type="primary" loading={loading} htmlType="submit">
            {dataWebhook ? "Editar" : "Salvar"}
          </Button>
        </ContentBtnFooter>
      </Container>
    </Modal>
  );
};
