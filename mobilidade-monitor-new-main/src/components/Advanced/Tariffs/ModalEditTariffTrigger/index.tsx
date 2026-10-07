import { Modal, Select, Input, DatePicker, Button } from "antd";
import locale from "antd/lib/date-picker/locale/pt_BR";
import "dayjs/locale/pt-br";
import swal from "sweetalert";

import api from "../../../../services/api";

import { useState, useEffect } from "react";

import { Container, ContentInput, LabelText } from "./styles";

import { TripTypesProps } from "../../../../pages/Advanced/Configs/Tariffs/TariffTrigger/types";

import Session from "../../../../utils/Session";
import Utils from "../../../../utils/Utils";
import dayjs from "dayjs";
import { FiTrendingUp } from "react-icons/fi";
import { AiFillEye } from "react-icons/ai";
import Mask from "../../../../services/Mask";

interface ModalEditTariffTriggerProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  tripTypes: TripTypesProps[];
  setLoading: (data: boolean) => void;
  getPricesDynamicScheduled: () => void;
  selectedItem: any;
}

export const ModalEditTariffTrigger = ({
  visible,
  setVisible,
  tripTypes,
  setLoading,
  getPricesDynamicScheduled,
  selectedItem,
}: ModalEditTariffTriggerProps) => {
  const [valueTax, setValueTax] = useState<string>("0,00");
  const [dateInitial, setDateInitial] = useState<string | [string, string]>("");
  const [dateFinal, setDateFinal] = useState<string | [string, string]>("");
  const [idTripType, setIdTripType] = useState<number | null>(null);

  const formatDate = (date: string): string => {
    const parsedDate = new Date(date);

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const hours = String(parsedDate.getHours()).padStart(2, "0");
    const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
    const seconds = String(parsedDate.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (selectedItem) {
      setValueTax(String(selectedItem.multiplierValue));
      setDateInitial(dayjs(selectedItem.startDate) as any);
      setDateFinal(dayjs(selectedItem.endDate) as any);
      setIdTripType(selectedItem.tripTypeId ?? tripTypes[0]?.id);
    }
  }, [selectedItem, tripTypes]);

  const handleSaveEditTariffTrigger = async () => {
    if (Utils.BrlToNumber(valueTax, "positive") <= 0) {
      swal({
        title: "O valor da taxa tem que ser maior que zero",
        icon: "warning",
      });
      return;
    }

    if (!dateFinal || !dateInitial) {
      swal({
        title: "Preencha os campos de datas",
        icon: "warning",
      });
      return;
    }

    if (new Date(dateFinal as any) <= new Date(dateInitial as any)) {
      swal({
        title: "A data final precisa ser maior que a data inicial",
        icon: "warning",
      });
      return;
    }

    const startDate = formatDate(dateInitial as any);
    const endDate = formatDate(dateFinal as any);


    const startDateUTC = new Date(startDate).toISOString();
    const endDateUTC = new Date(endDate).toISOString();

    const objectSend = {
      cityId: Session.getLocal("citySelected").cityId,
      tripTypeId: idTripType,
      multiplierValue: Utils.BrlToNumber(valueTax, "positive"),
      startDate,
      endDate,
      startDateUTC,
      endDateUTC,
      tag: `<div style="display: flex;justify-content: center;align-items: center;">
              <i class="material-icons" style="font-size: 2vw;left: -0.5vw;position: relative;">
                trending_up
              </i>
              ${Utils.BrlToNumber(valueTax, "positive").toFixed(1)}x
            </div>`,
    };

    setLoading(true);
    try {
      const response = await api.put(
        `priceDynamicScheduled/${selectedItem.id}/update`,
        objectSend
      );

      if (response.status) {
        swal({
          title: "Gatilho atualizado com sucesso!",
          icon: "success",
        });
        getPricesDynamicScheduled();
        setVisible(false);
      } else {
        swal({
          title: "Erro ao atualizar o gatilho",
          icon: "error",
        });
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao atualizar o gatilho",
        icon: "error",
      });
    }
    setLoading(false);
  };

  return (
    <Modal
      title="Editar Tarifa"
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={
        <Button type="primary" onClick={handleSaveEditTariffTrigger}>
          Salvar Alterações
        </Button>
      }
    >
      <Container>
        <LabelText>Tipo de Viagem</LabelText>
        <Select
          value={idTripType}
          onChange={setIdTripType}
          style={{ width: "100%" }}
        >
          {tripTypes.map((trip) => (
            <Select.Option key={trip.tripTypeId} value={trip.tripTypeId}>
              {trip.type}
            </Select.Option>
          ))}
        </Select>
        <ContentInput
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <ContentInput>
            <LabelText>Taxa (ex:1,5 = 50% a mais)</LabelText>
            <Input
              type="text"
              addonBefore={<FiTrendingUp style={{ marginTop: 4 }} size={20} />}
              value={valueTax}
              onChange={(event) =>
                setValueTax(Mask.setMaskMoney(event.target.value))
              }
            />
          </ContentInput>
          <ContentInput>
            <LabelText>Etiqueta que cliente verá</LabelText>
            <Input
              disabled
              addonBefore={<AiFillEye style={{ marginTop: 4 }} size={20} />}
              value={`${Utils.BrlToNumber(valueTax, "positive")}X`}
            />
          </ContentInput>
        </ContentInput>
        <LabelText>De:</LabelText>
        <ContentInput>
          <DatePicker
            style={{
              width: "100%",
            }}
            locale={locale}
            showTime
            format="DD/MM/YYYY HH:mm:ss"
            placeholder="Data inicial"
            value={dateInitial}
            onChange={(date) => setDateInitial(date)}
          />

          <LabelText>Até:</LabelText>
          <DatePicker
            value={dateFinal}
            onChange={(date) => setDateFinal(date)}
            locale={locale}
            style={{
              width: "100%",
            }}
            showTime
            format="DD/MM/YYYY HH:mm:ss"
          />
        </ContentInput>
      </Container>
    </Modal>
  );
};
