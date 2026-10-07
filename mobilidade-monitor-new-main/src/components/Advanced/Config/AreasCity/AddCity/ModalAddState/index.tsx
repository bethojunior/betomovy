import { Container, ContentInput, LabelText } from "./styles";

import swal from "sweetalert";
import { Modal, Input, Select, Button } from "antd";

import { useState } from "react";

import api from "../../../../../../services/api";

import { DeafaultOptionsAntd } from "../../../../../../pages/Advanced/Configs/AreasCity/AddCity/types";
import { AxiosError } from "axios";

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
    if (!idCountry || nameState.length <= 0) {
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
        nome: nameState,
        sigla: "--",
      });

      if (responseAddState.status) {
        swal({
          title: "Estado adicionada com sucesso!",
          icon: "success",
        });
        getState(idCountry);
        setVisibleModal(false);
        setNameState("");
        setIdCountry(null);
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
            options={listCountries}
          />
        </ContentInput>

        <ContentInput>
          <LabelText>Nome do estado:</LabelText>
          <Input
            onChange={(event) => setNameState(event.target.value)}
            value={nameState}
          />
        </ContentInput>
      </Container>
    </Modal>
  );
};
