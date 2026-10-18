import { AxiosError } from "axios";
import { Button, Modal, Select, AutoComplete } from "antd";

import { Container, ContentInput, LabelText } from "./styles";

import swal from "sweetalert";

import { useState } from "react";

import {
  StateProps,
  DeafaultOptionsAntd,
} from "../../../../../../pages/Advanced/Configs/AreasCity/AddCity/types";

import api from "../../../../../../services/api";
import {
  mergeCountries,
  getStatesByCountry,
  getCitiesByStateId,
} from "../../../../../../data/locationData";

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
  const [cityOptions, setCityOptions] = useState<{ value: string; label: string }[]>([]);

  const handleAddCity = async () => {
    if (!idState || nameCity.trim().length <= 0) {
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
        nome: nameCity.trim(),
        polygon: null,
        statusId: 1,
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
        setCityOptions([]);
      }
    } catch (error) {
      const responseError = error as AxiosError<any>;
      const errMsg = Array.isArray(responseError.response?.data?.response)
        ? responseError.response?.data?.response[0]
        : (responseError.response?.data?.message || "Erro ao adicionar cidade");
      swal({
        title: errMsg,
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

      const apiList = responseState.status && Array.isArray(responseState.data?.response)
        ? responseState.data.response
        : [];
      const mergedStates = getStatesByCountry(idCountry, apiList);
      setStates(mergedStates as any);
    } catch (error) {
      setStates(getStatesByCountry(idCountry, []) as any);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectState = (selectedStateId: number) => {
    const sId = Number(selectedStateId);
    setIdState(sId);
    const st = states.find((s) => Number(s.id) === sId);
    const citiesList = getCitiesByStateId(
      sId,
      st?.name,
      (st as any)?.sigla,
      []
    );
    setCityOptions(
      citiesList.map((c) => ({
        value: c.name,
        label: c.name,
      }))
    );
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string | number }
  ) =>
    String(option?.label ?? "")
      .toLowerCase()
      .includes(input.toLowerCase());

  const countriesOptions: DeafaultOptionsAntd[] = (
    Array.isArray(listCountries) && listCountries.length > 0
      ? listCountries
      : mergeCountries([]).map((c) => ({ value: c.id, label: c.name }))
  );

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
            options={countriesOptions}
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
            onChange={(idState) => handleSelectState(Number(idState))}
            filterOption={filterOption}
            options={statesFormated}
          />
        </ContentInput>
        <ContentInput>
          <LabelText>Cidade:</LabelText>
          <AutoComplete
            style={{
              width: "100%",
            }}
            placeholder="Escolha ou digite uma cidade"
            value={nameCity}
            onChange={(val) => setNameCity(val)}
            options={cityOptions}
            filterOption={(input, option) =>
              (option?.value ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </ContentInput>
      </Container>
    </Modal>
  );
};
