import {
  Container,
  ContentInput,
  LabelText,
} from "./styles";
import { Button, Input, Modal, TimePicker } from "antd";
import type { Dayjs } from "dayjs";
import locale from "antd/lib/date-picker/locale/pt_BR";
import swal from "sweetalert";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import { useState, useEffect } from "react";
import Session from "../../../../utils/Session";
import Utils from "../../../../utils/Utils";

import api from "../../../../services/api";
import dayjs from "dayjs";
import Mask from "../../../../services/Mask";

interface ModalDynamicPerAreaProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  setLoading: (data: boolean) => void;
  getDynamicAreas: () => void;
  editingItem: any;
}

export const ModalEditDynamicPerArea = ({
  setVisible,
  visible,
  setLoading,
  getDynamicAreas,
  editingItem,
}: ModalDynamicPerAreaProps) => {
  const [valueMultiplied, setValueMultiplied] = useState("0,00");
  const [timeInit, setTimeInit] = useState<string>("");
  const [timeFinal, setTimeFinal] = useState<string>("");

  const citySelected = Session.getLocal("citySelected");

  useEffect(() => {
    if (editingItem) {
      setValueMultiplied(editingItem?.multiplierValue || "0,00");
      setTimeInit(editingItem?.startTime || "");
      setTimeFinal(editingItem?.endTime || "");
    }
  }, [editingItem]);

  const handleSaveArea = async () => {

    if (Utils.BrlToNumberUpdate(String(valueMultiplied), "positive") <= 0) {
      swal({
        title: "O valor multiplicado precisa ser maior que 0,00",
        icon: "info",
      });
      return;
    }

    if (timeInit === "" || timeFinal === "") {
      swal({
        title: "Escolha o intervalo de tempo",
        icon: "info",
      });
      return;
    }

    setLoading(true);

    try {

      const objectSend = {
        cityId: citySelected.cityId,
        endTime: timeFinal,
        multiplierValue: Utils.BrlToNumberUpdate(String(valueMultiplied), "positive"),
        startTime: timeInit,
      };

      const responseDynamicArea = await api.put(`dynamicArea/${editingItem?.id}/update`, objectSend);

      if (responseDynamicArea.status) {
        swal({
          title: "Área dinâmica editada com sucesso",
          icon: "success",
        });
        getDynamicAreas();
        setValueMultiplied("0,00");
        setTimeInit("");
        setTimeFinal("");
        setVisible(false);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao salvar área",
        icon: "error",
      });
    }
    setLoading(false);
  };

  const onChangeInit = (_: Dayjs | null, timeString: string | string[]) => {
    setTimeInit(timeString as string);
  };

  const onChangeFinal = (_: Dayjs | null, timeString: string | string[]) => {
    setTimeFinal(timeString as string);
  };

  useEffect(() => {
    if (visible && editingItem) {
      setValueMultiplied(editingItem?.multiplierValue || "0,00");
      setTimeInit(editingItem?.startTime || "");
      setTimeFinal(editingItem?.endTime || "");
    }
  }, [visible, editingItem]);

  useEffect(() => {
    if (!visible) {
      setValueMultiplied("0,00");
      setTimeInit("");
      setTimeFinal("");
    }
  }, [visible]);

  return (
    <Modal open={visible} onCancel={() => setVisible(false)} footer={null} width={600}>
      <Container>
        <ContentInput>
          <LabelText>Nome do bairro</LabelText>
          <Input
            type="text"
            value={editingItem?.name}
            disabled
          />
        </ContentInput>
        <ContentInput>
          <LabelText>Valor multiplicado</LabelText>
          <Input
            type="text"
            value={valueMultiplied}
            onChange={(event) =>
              setValueMultiplied(Mask.setMaskMoney(event.target.value))
            }
            placeholder="Digite o valor multiplicado"
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
            <LabelText>Hora incial:</LabelText>
            <TimePicker
              style={{
                width: "100%",
              }}
              value={timeInit ? dayjs(timeInit, "HH:mm") : null}
              locale={locale}
              placeholder="Escolha o tempo"
              onChange={onChangeInit}
            />
          </ContentInput>
          <ContentInput style={{ flex: 1 }}>
            <LabelText>Hora final:</LabelText>
            <TimePicker
              style={{
                width: "100%",
              }}
              locale={locale}
              value={timeFinal ? dayjs(timeFinal, "HH:mm") : null}
              placeholder="Escolha o tempo"
              onChange={onChangeFinal}
            />
          </ContentInput>
        </ContentInput>

        <Button type="primary" onClick={handleSaveArea}>
          Salvar
        </Button>
      </Container>
    </Modal>
  );
};