import swal from "sweetalert";
import { AxiosError } from "axios";
import { Input, Button } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";

import {
  Container,
  ContentInput,
  LabelInput,
  ContentButton,
  MessageError,
  Loader,
} from "./styles";
import api from "../../../../services/api";
import { DeliveryInformationsProps } from "./types";

const schemaForm = yup
  .object({
    obs: yup
      .string()
      .min(10, "Precisa ter no mínimo 10 caracteres")
      .required("Este campo é obrigatório"),
    obs_destination: yup
      .string()
      .min(10, "Precisa ter no mínimo 10 caracteres")
      .required("Este campo é obrigatório"),
    obs_origin: yup
      .string()
      .min(10, "Precisa ter no mínimo 10 caracteres")
      .required("Este campo é obrigatório"),
  })
  .required();

type SchemaFormType = yup.InferType<typeof schemaForm>;

export const SuggestionText = () => {
  const { control, setValue, handleSubmit } = useForm<SchemaFormType>({
    resolver: yupResolver(schemaForm),
  });

  const [suggestionsDelivery, setSuggestionsDelivery] =
    useState<DeliveryInformationsProps | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const getSuggestions = async () => {
    try {
      setLoading(true);
      const responseSuggestions = await api.get("deliveryInfoSuggestion");

      if (responseSuggestions.status) {
        setSuggestionsDelivery(responseSuggestions.data.response);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.message,
        icon: "error",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: SchemaFormType) => {
    try {
      setLoading(true);
      const responseSave = await api.post("deliveryInfoSuggestion", {
        obs: data.obs,
        obsDestination: data.obs_destination,
        obsOrigin: data.obs_origin,
      });

      if (responseSave.status) {
        swal({
          title: "Sucesso",
          text: "Sugestões de textos salvas com sucesso.",
          icon: "success",
        });
        getSuggestions();
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.response[0],
        icon: "error",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSuggestions();
  }, []);

  useEffect(() => {
    if (suggestionsDelivery) {
      setValue("obs", suggestionsDelivery.deliveryInfoSuggestion.obs);
      setValue(
        "obs_destination",
        suggestionsDelivery.deliveryInfoSuggestion.obsDestination
      );
      setValue(
        "obs_origin",
        suggestionsDelivery.deliveryInfoSuggestion.obsOrigin
      );
    }
  }, [suggestionsDelivery]);

  if (loading) return <Loader spinning />;

  return (
    <Container onSubmit={handleSubmit(handleSave)}>
      <Controller
        control={control}
        name="obs"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <ContentInput>
            <LabelInput>Observação</LabelInput>
            <Input.TextArea
              value={value}
              onChange={onChange}
              rows={5}
              status={Boolean(error) ? "error" : ""}
            />
            {error && <MessageError>{error.message}</MessageError>}
          </ContentInput>
        )}
      />

      <Controller
        control={control}
        name="obs_destination"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <ContentInput>
            <LabelInput>Texto no campo de coleta</LabelInput>
            <Input.TextArea
              value={value}
              onChange={onChange}
              rows={5}
              status={Boolean(error) ? "error" : ""}
            />
            {error && <MessageError>{error.message}</MessageError>}
          </ContentInput>
        )}
      />

      <Controller
        control={control}
        name="obs_origin"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <ContentInput>
            <LabelInput>Texto no campo de entrega</LabelInput>
            <Input.TextArea
              value={value}
              onChange={onChange}
              rows={5}
              status={Boolean(error) ? "error" : ""}
            />
            {error && <MessageError>{error.message}</MessageError>}
          </ContentInput>
        )}
      />

      <ContentButton>
        <Button type="primary" loading={loading} htmlType="submit">
          Salvar
        </Button>
      </ContentButton>
    </Container>
  );
};
