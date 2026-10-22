import { Container, ContentInput, LabelText } from "./styles";
import { useState } from "react";
import { AxiosError } from "axios";

import swal from "sweetalert";
import { Button, Modal, Select } from "antd";

import api from "../../../../../../services/api";

import { CitiesFullyProps } from "../../../../../../pages/Advanced/Configs/AreasCity/AddCity/types";

interface ModalRemoveCityProps {
  visibleModal: boolean;
  setVisibleModal: (data: boolean) => void;
  setLoading: (data: boolean) => void;
  citiesFully: CitiesFullyProps[];
}

export const ModalRemoveCity = ({
  setLoading,
  setVisibleModal,
  visibleModal,
  citiesFully,
}: ModalRemoveCityProps) => {
  const [idCity, setIdCity] = useState<number | null>(null);

  const handleRemoveCity = async () => {
    if (!idCity) {
      swal({
        title: "Escolha uma cidade para remover",
        icon: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      let success = false;
      try {
        const responseRemoveCity = await api.delete(`role/city/delete/${idCity}`);
        if (responseRemoveCity.status === 200 || responseRemoveCity.data?.status) {
          success = true;
        }
      } catch (e1) {
        try {
          const res2 = await api.delete(`city/${idCity}`);
          if (res2.status === 200 || res2.data?.status) {
            success = true;
          }
        } catch (e2) {
          throw e1;
        }
      }

      if (success) {
        swal({
          title: "Cidade removida com sucesso!",
          icon: "success",
        }).then(() => {
          window.location.reload();
        });
        setVisibleModal(false);
      }
    } catch (error) {
      const responseError = error as AxiosError<any>;
      const errMsg = Array.isArray(responseError.response?.data?.response)
        ? responseError.response?.data?.response[0]
        : (responseError.response?.data?.message || "Erro ao remover cidade");
      swal({
        title: errMsg,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const citiesFormated = citiesFully.map((value) => {
    return {
      value: value.cityId,
      label: value.nome,
    };
  });

  return (
    <Modal
      title="Remover Cidade"
      open={visibleModal}
      onCancel={() => setVisibleModal(false)}
      footer={[
        <Button onClick={() => setVisibleModal(false)} key={1}>
          Cancelar
        </Button>,
        <Button type="primary" onClick={handleRemoveCity} key={2}>
          Remover
        </Button>,
      ]}
    >
      <Container>
        <ContentInput>
          <LabelText>Cidade</LabelText>
          <Select
            style={{ width: "100%" }}
            onChange={(idCity) => setIdCity(idCity)}
            options={citiesFormated}
          />
        </ContentInput>
      </Container>
    </Modal>
  );
};
