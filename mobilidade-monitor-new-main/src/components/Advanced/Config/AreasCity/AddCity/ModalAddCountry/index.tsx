import { Container, ContentInput, LabelText } from "./styles";

import { Modal, Input, Button } from "antd";

import { useState } from "react";
import { AxiosError } from "axios";

import api from "../../../../../../services/api";
import swal from "sweetalert";

interface ModalAddCountryProps {
  visibleModal: boolean;
  setVisibleModal: (data: boolean) => void;
  setLoading: (data: boolean) => void;
  getCountries: () => void;
}

export const ModalAddCountry = ({
  setVisibleModal,
  visibleModal,
  setLoading,
  getCountries,
}: ModalAddCountryProps) => {
  const [country, setCountry] = useState<string>("");

  const handleAddCountry = async () => {
    if (country.length <= 0) {
      swal({
        title: "Preencha o campo país!",
        icon: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const responseAddCountry = await api.post("country", {
        name: country,
        shortName: "-",
      });

      if (responseAddCountry.status) {
        swal({
          title: "País adicionado com sucesso!",
          icon: "success",
        });
        setVisibleModal(false);
        getCountries();
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

  return (
    <Modal
      title="Cadastrar nome do país"
      open={visibleModal}
      onCancel={() => setVisibleModal(false)}
      footer={[
        <Button onClick={() => setVisibleModal(false)} key={1}>
          Cancelar
        </Button>,
        <Button type="primary" onClick={handleAddCountry} key={2}>
          Confirmar
        </Button>,
      ]}
    >
      <Container>
        <ContentInput>
          <LabelText>País</LabelText>
          <Input
            onChange={(event) => setCountry(event.target.value)}
            value={country}
          />
        </ContentInput>
      </Container>
    </Modal>
  );
};
