import { Button, Input, Radio } from "antd";
import { useState, useEffect } from "react";
import swal from "sweetalert";
import { AxiosError } from "axios";

import {
  Container,
  Label,
  ContentInputsAcquirers,
  ContentInput,
  ContentBtn,
} from "./styles";

import { DeliveryAcquirersProps, DeliveryAcquirerMetadataProps } from "./types";

import api from "../../../../../services/api";

export const Acquirers = () => {
  const [deliveryAcquirers, setDeliveryAcquirers] = useState<
    DeliveryAcquirersProps[]
  >([]);
  const [acquirersSelected, setAcquirersSelected] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

  const getAcquirers = async () => {
    try {
      setLoading(true);
      const responseAcquirers = await api.get("deliveryAcquirer");

      if (responseAcquirers.status) {
        setDeliveryAcquirers(responseAcquirers.data.response);
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
    getAcquirers();
  }, []);

  useEffect(() => {
    if (acquirersSelected) {
      const selectedAcquirer = JSON.parse(
        acquirersSelected
      ) as DeliveryAcquirersProps;
      const initialInputValues: { [key: string]: string } = {};
      selectedAcquirer.delivery_acquirer_meta_data.forEach(
        (metadata: DeliveryAcquirerMetadataProps) => {
          if (metadata.value !== null) {
            initialInputValues[metadata.key] = metadata.value;
          }
        }
      );
      setInputValues(initialInputValues);
    }
  }, [acquirersSelected]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const acquirersFormated: DeliveryAcquirersProps | undefined =
    acquirersSelected && JSON.parse(acquirersSelected);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const arrayFormatado = Object.keys(inputValues).map((key) => ({
      key,
      value: inputValues[key],
    }));

    swal({
      title: "Confirma alteração de adquirente?",
      text: "Mudança de adquirente pode excluir coletivamente os números dos cartões de crédito dos usuários ja cadastrados, podendo causar falhas ou exigir recadastramento dos mesmos.",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .put(`deliveryAcquirer/${acquirersFormated?.id}`, {
            metadata: arrayFormatado,
          })
          .then((response) => {
            if (response.status) {
              swal({
                title: "Adquirente atualizado com sucesso",
                icon: "success",
              });
              getAcquirers();
              setAcquirersSelected(null);
            }
          })
          .catch((error: AxiosError) => {
            swal({
              title: error.response?.data.message,
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  return (
    <Container>
      <Radio.Group
        onChange={(event) => setAcquirersSelected(event.target.value)}
        value={acquirersSelected}
      >
        {deliveryAcquirers.map((value) => {
          return (
            <Radio key={value.id} value={JSON.stringify(value)}>
              {value.name}
            </Radio>
          );
        })}
      </Radio.Group>

      <ContentInputsAcquirers>
        <form onSubmit={handleSubmit}>
          {acquirersFormated?.delivery_acquirer_meta_data.map(
            (value: DeliveryAcquirerMetadataProps) => {
              return (
                <ContentInput key={value.key}>
                  <Label htmlFor={value.key}>{value.description}</Label>
                  <Input
                    id={value.key}
                    name={value.key}
                    placeholder={value.description}
                    value={inputValues[value.key] || ""}
                    onChange={handleInputChange}
                    required
                  />
                </ContentInput>
              );
            }
          )}

          {acquirersFormated && (
            <ContentBtn>
              <Button type="primary" htmlType="submit" loading={loading}>
                Salvar
              </Button>
            </ContentBtn>
          )}
        </form>
      </ContentInputsAcquirers>
    </Container>
  );
};
