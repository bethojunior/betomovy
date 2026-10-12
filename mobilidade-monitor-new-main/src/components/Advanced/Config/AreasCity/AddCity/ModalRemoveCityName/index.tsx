import { AxiosError } from "axios";
import { Button, Modal, Select } from "antd";
import { useState } from "react";
import swal from "sweetalert";

import { Container, ContentInput, LabelInput } from "./styles";

import api from "../../../../../../services/api";

import {
  DeafaultOptionsAntd,
  StateProps,
} from "../../../../../../pages/Advanced/Configs/AreasCity/AddCity/types";
import { CityProps } from "../../../../../../pages/Advanced/Configs/AreasCity/AddCity/types";
import {
  mergeCountries,
  getStatesByCountry,
  getCitiesByStateId,
} from "../../../../../../data/locationData";

interface ModalRemoveCityNameProps {
  visibleModal: boolean;
  setVisibleModal: (data: boolean) => void;
  setLoading: (data: boolean) => void;
  listCountries: DeafaultOptionsAntd[];
}

export const ModalRemoveCityName = ({
  visibleModal,
  setLoading,
  setVisibleModal,
  listCountries,
}: ModalRemoveCityNameProps) => {
  const [states, setStates] = useState<StateProps[]>([]);
  const [cities, setCities] = useState<CityProps[]>([]);
  const [idCity, setIdCity] = useState<number | null>(null);

  const handleRemoveCity = async () => {
    if (!idCity) {
      swal({
        title: "Escolha a cidade para deletar",
        icon: "warning",
      });
      return;
    }

    swal({
      title: "Deseja apagar essa cidade?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .delete(`city/${idCity}/delete/cityName`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Cidade deletada com sucesso",
                icon: "success",
              }).then((isAccept) => {
                if (isAccept) {
                  window.location.reload();
                }
              });
            }
          })
          .catch((error: AxiosError<any>) => {
            const errMsg = Array.isArray(error.response?.data?.response)
              ? error.response?.data?.response[0]
              : (error.response?.data?.message || "Erro ao remover cidade");
            swal({
              title: errMsg,
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const getState = async (idCountry: number) => {
    try {
      setLoading(true);
      const responseState = await api.get(`estate/country/${idCountry}`);

      const apiList = responseState.status && Array.isArray(responseState.data?.response)
        ? responseState.data.response
        : [];
      setStates(getStatesByCountry(idCountry, apiList) as any);
    } catch (error) {
      setStates(getStatesByCountry(idCountry, []) as any);
    } finally {
      setLoading(false);
    }
  };

  const getCity = async (idState: number) => {
    try {
      setLoading(true);
      const responseCity = await api.get(`city?estateId=${idState}`);
      const apiList = responseCity.status && Array.isArray(responseCity.data?.response)
        ? responseCity.data.response
        : [];
      setCities(getCitiesByStateId(idState, undefined, undefined, apiList) as any);
    } catch (error) {
      setCities(getCitiesByStateId(idState, undefined, undefined, []) as any);
    } finally {
      setLoading(false);
    }
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

  const citiesFormated: DeafaultOptionsAntd[] = cities.map((value) => {
    return {
      value: value.id,
      label: value.name,
    };
  });

  return (
    <Modal
      title="Apagar Nome da Cidade"
      open={visibleModal}
      onCancel={() => setVisibleModal(false)}
      footer={[
        <Button key={1} onClick={() => setVisibleModal(false)}>
          Cancelar
        </Button>,
        <Button key={2} type="primary" onClick={handleRemoveCity}>
          Confirmar
        </Button>,
      ]}
    >
      <Container>
        <ContentInput>
          <LabelInput>Selecione um país</LabelInput>
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
          <LabelInput>Selecione um estado</LabelInput>
          <Select
            style={{
              width: "100%",
            }}
            showSearch
            placeholder="Escolha um estado"
            optionFilterProp="children"
            onChange={(idState) => getCity(Number(idState))}
            filterOption={filterOption}
            options={statesFormated}
          />
        </ContentInput>

        <ContentInput>
          <LabelInput>Selecione a cidade</LabelInput>
          <Select
            style={{
              width: "100%",
            }}
            showSearch
            placeholder="Escolha uma cidade"
            optionFilterProp="children"
            onChange={(idCity) => setIdCity(idCity)}
            filterOption={filterOption}
            options={citiesFormated}
          />
        </ContentInput>
      </Container>
    </Modal>
  );
};
