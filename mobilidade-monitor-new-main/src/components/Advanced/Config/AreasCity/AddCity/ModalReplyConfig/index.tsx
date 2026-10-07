import { Button, Modal, Select } from "antd";
import swal from "sweetalert";
import { AxiosError } from "axios";

import { Container, ContentInput, LabelText } from "./styles";

import { useState } from "react";

import {
  CitiesFullyProps,
  CityProps,
  CitySelectedFormatedProps,
} from "../../../../../../pages/Advanced/Configs/AreasCity/AddCity/types";

import api from "../../../../../../services/api";

interface ModalReplyConfigProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  citiesFully: CitiesFullyProps[];
  cities: CityProps[];
  placeSelected: [number, number] | null;
  polygonCity: CitySelectedFormatedProps | string | null;
  stateId: number | null;
  setLoading: (data: boolean) => void;
  coordinatesCaptured: any;
}

export const ModalReplyConfig = ({
  setVisible,
  visible,
  citiesFully,
  cities,
  placeSelected,
  polygonCity,
  stateId,
  setLoading,
  coordinatesCaptured,
}: ModalReplyConfigProps) => {
  const [idCity, setIdCity] = useState<number | null>(null);

  const handleMirroringCity = async (
    datasCity: any,
    cityMirrorId: number | null
  ) => {
    try {
      setLoading(true);

      const responseMirroringCity = await api.post("city/mirroring", {
        cityMirrorId: String(cityMirrorId),
        estado: stateId,
        mirroringCityId: datasCity?.id,
        nome: datasCity?.name,
      });

      if (responseMirroringCity.status) {
        swal({
          title: "Cidade espelhada com sucesso",
          icon: "success",
        }).then(() => {
          window.location.reload();
        });
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

  const handleAddCity = async (
    idMirroringCity: number | null,
    isMirroring: boolean = false
  ) => {
    try {
      setLoading(true);

      const dataCity = JSON.parse(
        polygonCity as string
      ) as CitySelectedFormatedProps;

      const getDatasCity = cities.find((data) => data.name === dataCity.name);

      const polygonFormated = placeSelected?.map((value: any) => {
        return {
          lat: value[1],
          lng: value[0],
        };
      });

      const coordinatesFormated = coordinatesCaptured?.map((value: any) => {
        return {
          lat: value[1],
          lng: value[0],
        };
      });

      const responseAddCity = await api.post(`city/${getDatasCity?.id}/area`, {
        estate_id: getDatasCity?.estate_id,
        name: getDatasCity?.name,
        polygon: coordinatesFormated ? coordinatesFormated : polygonFormated,
        short_name: null,
        old_name: getDatasCity?.name,
      });

      if (responseAddCity.status) {
        swal({
          title: "Area salva com sucesso!",
          icon: "success",
        }).then(() => {
          if (!isMirroring) {
            window.location.reload();
          } else {
            handleMirroringCity(getDatasCity, idMirroringCity);
          }
        });
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

  const citiesFormated = citiesFully.map((value) => {
    return {
      value: value.cityId,
      label: value.nome,
    };
  });

  return (
    <Modal
      title="Replicar configuração de cidade"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={[
        <Button onClick={() => handleAddCity(idCity)} key={1}>
          Não
        </Button>,
        <Button
          type="primary"
          onClick={() => handleAddCity(idCity, true)}
          key={2}
        >
          Sim
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
