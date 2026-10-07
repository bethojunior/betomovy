import {
  Container,
  ContentInput,
  LabelText,
} from "./styles";
import { Button, Input, Modal } from "antd";
import swal from "sweetalert";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import { useState, useEffect } from "react";
import Session from "../../../../utils/Session";
import Utils from "../../../../utils/Utils";

import api from "../../../../services/api";

interface ModalDynamicPerAreaProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  setLoading: (data: boolean) => void;
  getMonitoringArea: () => void;
  editingItem: any;
}

export const ModalEditMonitoringArea = ({
  setVisible,
  visible,
  setLoading,
  getMonitoringArea,
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

      const responseMonitoringArea = await api.put(`monitoringArea/${editingItem?.id}/update`, objectSend);

      if (responseMonitoringArea.status) {
        swal({
          title: "Área de monitoramento editada com sucesso",
          icon: "success",
        });
        getMonitoringArea();
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
          <LabelText>Nome da Área</LabelText>
          <Input
            type="text"
            value={editingItem?.name}
          />
        </ContentInput>
        <Button type="primary" onClick={handleSaveArea}>
          Salvar
        </Button>
      </Container>
    </Modal>
  );
};