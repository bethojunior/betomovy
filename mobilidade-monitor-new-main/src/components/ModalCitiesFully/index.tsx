import { Button, Modal, Select } from "antd";
import swal from "sweetalert";

import { useEffect, useState } from "react";

import { Container } from "./styles";
import api from "../../services/api";
import Session from "../../utils/Session";

import Utils from "../../utils/Utils";

export const ModalCitiesFully = () => {
  const [cities, setCities] = useState<DefaultOptionsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [citySelected, setCitySelected] = useState<CityProps | null>(null);

  const { getPathByPolygon } = Utils;

  const handleSelectCity = () => {
    if (!citySelected || !citySelected.polygon) {
      return;
    }

    const pointsCity = getPathByPolygon(citySelected.polygon);
    
    Session.setLocal("citySelected", JSON.stringify(citySelected));
    Session.setLocal("pointsCity", JSON.stringify(pointsCity));
    window.location.reload();
  };

  const getCitiesFully = async () => {
    try {
      setLoading(true);
      const responseCitiesFully = await api.get("city/actives/fully");

      if (responseCitiesFully) {
        const rawList = responseCitiesFully?.data?.response ?? responseCitiesFully?.data?.data ?? [];
        const list = Array.isArray(rawList) ? rawList : [];
        const citiesFormated = list.map(
          (value: CityProps) => {
            return {
              value: JSON.stringify(value),
              label: value.nome,
            };
          }
        );
        setCities(citiesFormated);
      }
    } catch (error) {
      swal({
        title: "Error",
        text: "Ocorreu um erro ao obter dados das cidades ativas",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCitiesFully();
  }, []);

  return (
    <Modal
      title="Alerta"
      open={true}
      closable={false}
      footer={[
        <Button
          key={1}
          type="primary"
          onClick={handleSelectCity}
          disabled={!citySelected}
        >
          Confirmar
        </Button>,
      ]}
    >
      <Container>
        <p>
          Você ainda não escolheu sua localização. Por favor, selecione uma
          cidade para receber informações do seu aplicativo em relação a cidade
          escolhida.
        </p>

        <Select
          style={{
            width: "100%",
          }}
          placeholder="Escolha a cidade"
          onChange={(city) => setCitySelected(JSON.parse(city))}
          options={cities}
          loading={loading}
        />
      </Container>
    </Modal>
  );
};
