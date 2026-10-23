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
    if (onSelect) {
      onSelect(datasTravel);
    }
    setVisible(false);
  };

  return (
    <Modal
      title={
        <span style={{ fontSize: 17, fontWeight: 700, color: "#0F172A" }}>
          Selecione a Modalidade para Adicionar
        </span>
      }
      open={visible}
      onCancel={() => setVisible(false)}
      footer={false}
      centered
      width={640}
      zIndex={10000030}
    >
      <ContainerTariffs>
        {datasTariffs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
            Nenhuma modalidade disponível para adicionar no momento.
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
