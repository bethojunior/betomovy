import { Container, ContentInput, LabelText } from "./styles";

import swal from "sweetalert";
import { Modal, Input, Select, Button } from "antd";

import { useState } from "react";

import api from "../../../../../../services/api";

import { DeafaultOptionsAntd } from "../../../../../../pages/Advanced/Configs/AreasCity/AddCity/types";
import { AxiosError } from "axios";
import { mergeCountries } from "../../../../../../data/locationData";

interface ModalAddStateProps {
  visibleModal: boolean;
  setVisibleModal: (data: boolean) => void;
  setLoading: (data: boolean) => void;
  listCountries: DeafaultOptionsAntd[];
  getState: (idCountry: number) => void;
}

export const ModalAddState = ({
  setVisibleModal,
  visibleModal,
  setLoading,
  listCountries,
  getState,
}: ModalAddStateProps) => {
  const [idCountry, setIdCountry] = useState<number | null>(null);
  const [nameState, setNameState] = useState<string>("");

  const handleAddState = async () => {
    if (!idCountry || nameState.trim().length <= 0) {
      swal({
        title: "Preencha os campos!",
        icon: "warning",
      });
      return;
    }

    try {
      setLoading(true);

      const responseAddState = await api.post("estate", {
        countryId: String(idCountry),
        nome: nameState.trim(),
        sigla: "--",
      });

      if (responseAddState.status) {
        swal({
          title: "Estado adicionado com sucesso!",
          icon: "success",
        });
        getState(idCountry);
        setVisibleModal(false);
        setNameState("");
        setIdCountry(null);
      }
    } catch (error) {
      const responseError = error as AxiosError<any>;
      const errMsg = Array.isArray(responseError.response?.data?.response)
        ? responseError.response?.data?.response[0]
        : (responseError.response?.data?.message || "Erro ao adicionar estado");
      swal({
        title: errMsg,
        icon: "error",
      });
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

  return (
    <Modal
      title="Cadastrar nome do estado"
      open={visibleModal}
      onCancel={() => setVisibleModal(false)}
      footer={[
        <Button onClick={() => setVisibleModal(false)} key={1}>
          Cancelar
        </Button>,
        <Button type="primary" onClick={handleAddState} key={2}>
          Confirmar
        </Button>,
      ]}
    >
      <Container>
        <ContentInput>
          <LabelText>Selecione um país:</LabelText>
          <Select
            style={{
              width: "100%",
            }}
            showSearch
            placeholder="Escolha um país"
            optionFilterProp="children"
            onChange={(idCountry) => setIdCountry(Number(idCountry))}
            filterOption={filterOption}
            options={countriesOptions}
          />
        </ContentInput>

        <ContentInput>
          <LabelText>Nome do estado:</LabelText>
          <Input
            onChange={(event) => setNameState(event.target.value)}
            value={nameState}
            placeholder="Digite o nome do estado"
          />
        </ContentInput>
      </Container>
    </Modal>
  );
};
