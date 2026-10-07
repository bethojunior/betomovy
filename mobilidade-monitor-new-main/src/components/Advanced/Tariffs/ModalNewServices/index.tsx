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
}

export const ModalNewServices = ({
  visible,
  setVisible,
  datasTariffs,
  listPrices,
  setListPrices,
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
        setVisible(false);
      }
    });
  };

  return (
    <Modal
      title="Adicionar novo serviço"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={false}
    >
      <ContainerTariffs>
        {datasTariffs.map((value) => {
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
                  <GenderTariff>{`Gênero: ${value?.gender?.name}`}</GenderTariff>
                </DescriptionTariffs>
              </ContentTariffs>
            </CardTariffs>
          );
        })}
      </ContainerTariffs>
    </Modal>
  );
};
