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
    const objectSend = {
      tripTypeId: datasTravel.idTripType,
      trip_type: datasTravel,
      min_price: "0.00",
      base_price: "0.00",
      km_price: "0.00",
      minute_price: "0.00",
      tax_price: "0.00",
      tax_price_type: "%",
      another_fee: "0.00",
      another_fee_type: "%",
      waypoint_price: "0.00",
      tag: "",
      color: "#00349A",
      idealListCommonPrice: 5,
    };
    const existingIndex = listPrices.findIndex(
      (p) =>
        Number(p.tripTypeId ?? p.trip_type?.idTripType) ===
        Number(datasTravel.idTripType)
    );
    if (existingIndex >= 0) {
      const updated = [...listPrices];
      updated[existingIndex] = objectSend as any;
      setListPrices(updated);
    } else {
      setListPrices([...listPrices, objectSend] as any);
    }
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
                  ? rawPic
                  : `https://minio.704app.com.br/rota101fb704/tripType/${rawPic}`)
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
