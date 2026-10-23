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

export const ModalNewServices = ({
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
      title="Adicionar novo serviço"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={false}
    >
      <ContainerTariffs>
        {datasTariffs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            Nenhum serviço disponível para adicionar no momento.
          </div>
        ) : (
          datasTariffs.map((value) => {
            const rawPic = value?.picture || "";
            const picSrc = rawPic
              ? (rawPic.startsWith("http")
                  ? (rawPic.includes("minio.704app") ? `https://s3-sa-east-1.amazonaws.com/voutehomologar/tripType/${rawPic.split('/').pop()}` : rawPic)
                  : `https://s3-sa-east-1.amazonaws.com/voutehomologar/tripType/${rawPic}`)
              : "/default-trip-icon.png";

            return (
              <CardTariffs
                key={value.idTripType}
                onClick={() => handleActivateTariffs(value)}
              >
                <ContentTariffs>
                  <PictureTariff
                    src={picSrc}
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = "/default-trip-icon.png";
                    }}
                  />
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
