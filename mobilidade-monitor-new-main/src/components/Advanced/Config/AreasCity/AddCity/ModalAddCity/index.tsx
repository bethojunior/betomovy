import { AxiosError } from "axios";
import { Button, Input, Modal, Select } from "antd";

import { Container, ContentInput, LabelText } from "./styles";

import swal from "sweetalert";

import { useState } from "react";

import {
  StateProps,
  DeafaultOptionsAntd,
} from "../../../../../../pages/Advanced/Configs/AreasCity/AddCity/types";

import api from "../../../../../../services/api";

interface ModalAddCityProps {
  visibleModal: boolean;
  setVisibleModal: (data: boolean) => void;
  setLoading: (data: boolean) => void;
  listCountries: DeafaultOptionsAntd[];
  getCity: (idState: number) => void;
}

export const ModalAddCity = ({
  setVisibleModal,
  visibleModal,
  setLoading,
  listCountries,
  getCity,
}: ModalAddCityProps) => {
  const [states, setStates] = useState<StateProps[]>([]);
  const [idState, setIdState] = useState<number | null>(null);
  const [nameCity, setNameCity] = useState<string>("");

  const handleAddCity = async () => {
    if (!idState || nameCity.length <= 0) {
      swal({
        title: "Preencha os campos!",
        icon: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const responseAddCity = await api.post("city", {
        estado: String(idState),
        nome: nameCity,
        polygon: null,
        statusId: 0,
      });

      if (responseAddCity.status) {
        swal({
          title: "Cidade adicionada com sucesso!",
          icon: "success",
        });
        setVisibleModal(false);
        getCity(idState);
        setNameCity("");
        setStates([]);
        setIdState(null);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.response[0],
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getState = async (idCountry: number) => {
    try {
      setLoading(true);
      const responseState = await api.get(`estate/country/${idCountry}`);

      if (responseState.status) {
        setStates(responseState.data.response);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.response[0],
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const statesFormated: DeafaultOptionsAntd[] = states.map((value) => {
    return {
      value: value.id,
      label: value.name,
    };
  });

  return (
    <Modal
      title="Cadastrar nome da cidade"
      open={visibleModal}
      onCancel={() => setVisibleModal(false)}
      footer={[
        <Button onClick={() => setVisibleModal(false)} key={1}>
          Cancelar
        </Button>,
        <Button type="primary" onClick={handleAddCity} key={2}>
          Confirmar
        </Button>,
      ]}
    >
      <Container>
        <ContentInput>
          <LabelText>País:</LabelText>
          <Select
            style={{
              width: "100%",
            }}
            showSearch
            placeholder="Escolha um país"
            optionFilterProp="children"
            onChange={(idCountry) => getState(Number(idCountry))}
            filterOption={filterOption}
            options={listCountries}
          />
        </ContentInput>
        <ContentInput>
          <LabelText>Estado:</LabelText>
          <Select
            style={{
              width: "100%",
            }}
            showSearch
            placeholder="Escolha um estado"
            optionFilterProp="children"
            onChange={(idState) => setIdState(Number(idState))}
            filterOption={filterOption}
            options={statesFormated}
          />
        </ContentInput>
        <ContentInput>
          <LabelText>Cidade:</LabelText>
          <Input
            value={nameCity}
            onChange={(event) => setNameCity(event.target.value)}
          />
        </ContentInput>
      </Container>
    </Modal>
  );
};
