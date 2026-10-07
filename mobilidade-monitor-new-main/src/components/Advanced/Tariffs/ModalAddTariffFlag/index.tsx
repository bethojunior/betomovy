import { Container, ContentInput, LabelText, SubTitle } from "./styles";

import { Button, Input, Modal, Select, TimePicker } from "antd";
import type { Dayjs } from "dayjs";
import swal from "sweetalert";
import { useState } from "react";
import locale from "antd/lib/date-picker/locale/pt_BR";

import Mask from "../../../../services/Mask";
import Session from "../../../../utils/Session";
import Utils from "../../../../utils/Utils";

import { TripTypesProps } from "../../../../pages/Advanced/Configs/Tariffs/TariffFlag/types";
import api from "../../../../services/api";

interface ModalAddTariffFlagProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  tripTypes: TripTypesProps[];
  setLoading: (data: boolean) => void;
  loading?: boolean;
  getTariffFlag: () => void;
}

const daysWeekList = [
  {
    value: "1",
    label: "Domingo",
  },
  {
    value: "2",
    label: "Segunda-feira",
  },
  {
    value: "3",
    label: "Terça-feira",
  },
  {
    value: "4",
    label: "Quarta-feira",
  },
  {
    value: "5",
    label: "Quinta-feira",
  },
  {
    value: "6",
    label: "Sexta-feira",
  },
  {
    value: "7",
    label: "Sábado",
  },
];

export const ModalAddTariffFlag = ({
  setVisible,
  visible,
  tripTypes,
  setLoading,
  loading,
  getTariffFlag,
}: ModalAddTariffFlagProps) => {
  const [selectedTripTypes, setSelectedTripTypes] = useState<number[]>([]);
  const [valueTax, setValueTax] = useState<string>("0,00");
  const [daysWeek, setDaysWeek] = useState<string[]>([]);
  const [timeInit, setTimeInit] = useState<string>("");
  const [timeFinal, setTimeFinal] = useState<string>("");

  const cityId = Session.getLocal("citySelected").cityId;

  const handleCreateNewTrigger = async () => {
    if (selectedTripTypes.length === 0) {
      swal({
        title: "Selecione pelo menos uma modalidade.",
        icon: "info",
      });
      return;
    }

    if (Utils.BrlToNumber(valueTax, "positive") <= 0) {
      swal({
        title: "O valor da taxa dever ser maior que zero!",
        icon: "info",
      });
      return;
    }

    if (timeInit === "" || timeFinal === "") {
      swal({
        title: "Selecione o horário de funcionamento do gatilho.",
        icon: "info",
      });
      return;
    }

    if (daysWeek.length === 0) {
      swal({
        title: "Os dias da semana são obrigatórios",
        icon: "info",
      });
      return;
    }

    setLoading(true);
    try {
      const objectSend = {
        cityId: cityId,
        dayOfWeek: daysWeek,
        tripTypeId: selectedTripTypes.map(String),
        multiplierValue: Utils.BrlToNumber(valueTax, "positive"),
        timezoneOffset: new Date().getTimezoneOffset(),
        timeEnd: timeFinal,
        timeStart: timeInit,
      };

      const responseNewTrigger = await api.post("price/dynamic", objectSend);

      if (!responseNewTrigger.status) {
        const responseError = JSON.parse(responseNewTrigger.request.response);
        swal({
          title: responseError.response[0],
          text: "Já existe um gatilho para essa data e horário",
          icon: "info",
        });
        setLoading(false);
        return;
      }

      if (responseNewTrigger.status) {
        swal({
          title: "Novo gatilho criado com sucesso",
          icon: "success",
        });
        getTariffFlag();
        setSelectedTripTypes([]);
        setValueTax("0,00");
        setDaysWeek([]);
        setTimeFinal("");
        setTimeInit("");
        setVisible(false);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao criar novo gatilho",
        icon: "error",
      });
    }
    setLoading(false);
  };

  const handleChangeSelectTypeTrip = (values: (number | string)[]) => {
    setSelectedTripTypes(values.map((value) => Number(value)));
  };

  const handleSelectDaysWeek = (value: string[]) => {
    setDaysWeek(value);
  };

  const onChangeInit = (_: Dayjs | null, timeString: string | string[]) => {
    setTimeInit(timeString as string);
  };

  const onChangeFinal = (_: Dayjs | null, timeString: string | string[]) => {
    setTimeFinal(timeString as string);
  };

  const optionsTripTypes =
    tripTypes &&
    tripTypes.map((value) => {
      return {
        value: value.tripTypeId,
        label: value.type,
      };
    });

  return (
    <Modal
      title="Novo Gatilho"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={[
        <Button type="default" onClick={() => setVisible(false)} key={1}>
          Cancelar
        </Button>,
        <Button type="primary" onClick={handleCreateNewTrigger} loading={loading} key={2}>
          Salvar
        </Button>,
      ]}
    >
      <Container>
        <ContentInput>
          <LabelText>Modalidade do motorista</LabelText>
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
        <SubTitle>Detalhes</SubTitle>
        <ContentInput>
          <LabelText>Taxa</LabelText>
          <Input
            type="text"
            value={valueTax}
            onChange={(event) =>
              setValueTax(Mask.setMaskMoney(event.target.value))
            }
          />
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
          <ContentInput style={{ flex: 1 }}>
            <LabelText>Válido de:</LabelText>
            <TimePicker
              style={{
                width: "100%",
              }}
              locale={locale}
              placeholder="Escolha o tempo"
              onChange={onChangeInit}
            />
          </ContentInput>
          <ContentInput style={{ flex: 1 }}>
            <LabelText>Até:</LabelText>
            <TimePicker
              style={{
                width: "100%",
              }}
              locale={locale}
              placeholder="Escolha o tempo"
              onChange={onChangeFinal}
            />
          </ContentInput>
        </ContentInput>
        <SubTitle>Dias válidos</SubTitle>
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          placeholder="Escolha os dias da semana"
          onChange={handleSelectDaysWeek}
          value={daysWeek}
        >
          {daysWeekList.map((value) => {
            return (
              <Select.Option key={value.value} value={value.value}>
                {value.label}
              </Select.Option>
            );
          })}
        </Select>
      </Container>
    </Modal>
  );
};
