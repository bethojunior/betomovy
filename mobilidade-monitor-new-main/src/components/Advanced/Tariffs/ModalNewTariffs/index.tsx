import { Modal } from "antd";
import swal from "sweetalert";

import {
  ContentTariffs,
  CardTariffs,
  GenderTariff,
  PictureTariff,
  TextTariff,
  TitleTariff,
  ContainerTariffs,
  DescriptionTariffs,
} from "./styles";

import {
  TypesTravelsProps,
  ListPricesProps,
} from "../../../../pages/Advanced/Configs/Tariffs/TypesTravels/types";

interface TariffsProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  datasTariffs: TypesTravelsProps[];
  listPrices: ListPricesProps[];
  setListPrices: (data: ListPricesProps[]) => void;
  onSelect?: (data: TypesTravelsProps) => void;
}

export const ModalNewTariffs = ({
  visible,
  setVisible,
  datasTariffs,
  listPrices,
  setListPrices,
  onSelect,
}: TariffsProps) => {
  const handleActivateTariffs = (datasTravel: TypesTravelsProps) => {
    swal({
      title: `Deseja ativar ${datasTravel.type}`,
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((accepted) => {
      if (accepted) {
        const objectSend = {
          trip_type: datasTravel,
        };
        setListPrices([...listPrices, objectSend] as any);
        if (onSelect) {
          onSelect(datasTravel);
        }
        setVisible(false);
      }
    });
  };

  return (
    <Modal
      title="Adicionar nova tarifa"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={false}
    >
      <ContainerTariffs>
        {datasTariffs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            Nenhuma modalidade disponível para adicionar no momento.
          </div>
        ) : (
          datasTariffs.map((value) => {
            return (
              <CardTariffs
                key={value.idTripType}
                onClick={() => handleActivateTariffs(value)}
              >
                <ContentTariffs>
                  <PictureTariff src={value?.picture} />
                  <DescriptionTariffs>
                    <TitleTariff>{value?.type}</TitleTariff>
                    <TextTariff>{value?.description}</TextTariff>
                    <GenderTariff>{`Gênero: ${value?.gender?.name || "Todos"}`}</GenderTariff>
                  </DescriptionTariffs>
                </ContentTariffs>
              </CardTariffs>
            );
          })
        )}
      </ContainerTariffs>
    </Modal>
  );
};
