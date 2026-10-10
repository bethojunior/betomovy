import { Modal, Select, Input, DatePicker, Button } from "antd";
import type { DatePickerProps } from "antd/es/date-picker";
import locale from "antd/lib/date-picker/locale/pt_BR";
import "dayjs/locale/pt-br";
import { FiTrendingUp } from "react-icons/fi";
import { AiFillEye } from "react-icons/ai";
import swal from "sweetalert";

import api from "../../../../services/api";

import { useState } from "react";

import { Container, LabelText, ContentInput } from "./styles";

import { TripTypesProps } from "../../../../pages/Advanced/Configs/Tariffs/TariffTrigger/types";

import Session from "../../../../utils/Session";
import Mask from "../../../../services/Mask";
import Utils from "../../../../utils/Utils";

interface ModalAddTariffTriggerProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  tripTypes: TripTypesProps[];
  setLoading: (data: boolean) => void;
  getPricesDynamicScheduled: () => void;
}

export const ModalAddTariffTrigger = ({
  visible,
  setVisible,
  tripTypes,
  setLoading,
  getPricesDynamicScheduled,
}: ModalAddTariffTriggerProps) => {
  const [valueTax, setValueTax] = useState<string>("0,00");
  const [dateInitial, setDateInitial] = useState<string | [string, string]>("");
  const [dateFinal, setDateFinal] = useState<string | [string, string]>("");
  const [selectedTripTypes, setSelectedTripTypes] = useState<number[]>([]);
  
  const handleSaveNewTariffTrigger = async () => {
    if (selectedTripTypes.length === 0) {
      swal({
        title: "Selecione pelo menos um tipo de viagem",
        icon: "warning",
      });

      return;
    }

    if (Utils.BrlToNumber(valueTax, "positive") <= 0) {
      swal({
        title: "O valor da taxa tem que ser maior que zero",
        icon: "warning",
      });

      return;
    }

    if (dateFinal === "" || dateInitial === "") {
      swal({
        title: "Preencha os campos de datas",
        icon: "warning",
      });

      return;
    }

    if (new Date(dateFinal as string) <= new Date(dateInitial as string)) {
      swal({
        title: "A data final precisa ser maior que a data incial",
        icon: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const objectSend = {
        cityId: Session.getLocal("citySelected")?.cityId,
        endDate: Utils.transformDate(dateFinal as string),
        endDateUTC: new Date(
          Utils.transformDate(dateFinal as string) as any
        ).toISOString(),
        multiplierValue: Utils.BrlToNumber(valueTax, "positive"),
        startDate: Utils.transformDate(dateInitial as string),
        startDateUTC: new Date(
          Utils.transformDate(dateInitial as string) as any
        ).toISOString(),
        tag: `<div style="display: flex;justify-content: center;align-items: center;"><i class="material-icons" style="font-size: 2vw;left: -0.5vw;position: relative;">trending_up</i>${Utils.BrlToNumber(
          valueTax,
          "positive"
        ).toFixed(1)}x</div>`,
        tripTypeId: selectedTripTypes,
      };

      const responseAddTariffTrigger = await api.post(
        "priceDynamicScheduled",
        objectSend
      );

      if (responseAddTariffTrigger.status) {
        swal({
          title: "Gatilho atualizado",
          icon: "success",
        });
        getPricesDynamicScheduled();
        setVisible(false);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao cadastrar gatilho",
        icon: "error",
      });
    }
    setLoading(false);
  };

  const optionsTripTypes =
    tripTypes &&
    tripTypes.map((value) => {
      return {
        value: value.tripTypeId,
        label: value.type,
      };
    });

  const handleChangeSelectTypeTrip = (values: (number | string)[]) => {
    setSelectedTripTypes(values.map((value) => Number(value)));
  };

  const onChangeDateInitial: DatePickerProps["onChange"] = (_, dateString) => {
    setDateInitial(dateString as string);
  };

  const onChangeDateFinal: DatePickerProps["onChange"] = (_, dateString) => {
    setDateFinal(dateString as string);
  };

  return (
    <Modal
      title="Adicionar um novo gatilho"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={[
        <Button type="primary" onClick={handleSaveNewTariffTrigger} key={1}>
          Salvar
        </Button>,
      ]}
    >
      <Container>
        <ContentInput>
          <LabelText>Tipo de viagem</LabelText>
          <Select
          mode="multiple"
            style={{
              width: "100%",
            }}
            placeholder="Selecione um ou mais tipos de viagem"
            onChange={handleChangeSelectTypeTrip}
            value={selectedTripTypes}
          >
            {optionsTripTypes.map((value) => {
              return (
                <Select.Option key={value.value} value={value.value}>
                  {value.label}
                </Select.Option>
              );
            })}
          </Select>
        </ContentInput>
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
        <ContentInput>
          <LabelText>De:</LabelText>
          <DatePicker
            style={{
              width: "100%",
            }}
            locale={locale}
            showTime
            format="DD/MM/YYYY HH:mm:ss"
            placeholder="Data inicial"
            onChange={onChangeDateInitial}
          />
        </ContentInput>
        <ContentInput
          style={{
            marginTop: 10,
          }}
        >
          <LabelText>Até:</LabelText>
          <DatePicker
            style={{
              width: "100%",
            }}
            locale={locale}
            showTime
            format="DD/MM/YYYY HH:mm:ss"
            placeholder="Data final"
            onChange={onChangeDateFinal}
          />
        </ContentInput>
      </Container>
    </Modal>
  );
};
