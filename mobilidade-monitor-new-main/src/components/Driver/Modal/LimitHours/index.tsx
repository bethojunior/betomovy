import { FC, useState, useEffect } from "react";
import { Button, Modal, Input } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import api from "../../../../services/api";
import Alert from "../../../Utils/Alert";

interface LimitHoursModalProps {
  visibility: boolean;
  handleCloseModal: () => void;
  driverId: number;
  currentHoursOpen?: number | null;
}

const LimitHoursModal: FC<LimitHoursModalProps> = ({
  visibility,
  handleCloseModal,
  driverId,
  currentHoursOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const [hours, setHours] = useState<number>(0);
  const [timeInput, setTimeInput] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<"success" | "info" | "warning" | "error">("success");

  const applyTimeMask = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      const hours = numbers.slice(0, 2);
      const minutes = numbers.slice(2);
      
      const validHours = parseInt(hours) > 23 ? '23' : hours;
      const validMinutes = parseInt(minutes) > 59 ? '59' : minutes;
      
      return `${validHours}:${validMinutes}`;
    } else {
      const hours = numbers.slice(0, 2);
      const minutes = numbers.slice(2, 4);
      
      const validHours = parseInt(hours) > 23 ? '23' : hours;
      const validMinutes = parseInt(minutes) > 59 ? '59' : minutes;
      
      return `${validHours}:${validMinutes}`;
    }
  };

  const convertTimeToHours = (timeStr: string): number => {
    if (!timeStr) return 0;
    
    if (timeStr.includes(':')) {
      const [hoursStr, minutesStr] = timeStr.split(':');
      const hours = parseInt(hoursStr) || 0;
      const minutes = parseInt(minutesStr) || 0;
      return hours + (minutes / 60);
    }
    
    return parseFloat(timeStr) || 0;
  };

  const convertHoursToTime = (hours: number): string => {
    if (hours === 0) return "0:00";
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}:${minutes.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (visibility && currentHoursOpen !== null && currentHoursOpen !== undefined) {
      const currentHours = currentHoursOpen / 60;
      setHours(currentHours);
      setTimeInput(convertHoursToTime(currentHours));
    } else if (visibility) {
      setHours(0);
      setTimeInput("0:00");
    }
  }, [visibility, currentHoursOpen]);

  const handleSubmit = async () => {
    if (hours === null || hours === undefined || hours < 0) {
      setMessageAlert("Por favor, insira um valor válido para as horas");
      setTypeAlert("warning");
      setShowAlert(true);
      return;
    }

    setLoading(true);
    try {
      const limitMinutes = hours * 60;
      const response = await api.post("driver/insertLimitHours", {
        driverId,
        limitHours: limitMinutes,
      });

      if (response.data.status) {
        setMessageAlert("Limite de horas configurado com sucesso!");
        setTypeAlert("success");
        setShowAlert(true);
        handleClose();
      } else {
        setMessageAlert("Erro ao configurar limite de horas");
        setTypeAlert("error");
        setShowAlert(true);
      }
    } catch (error) {
      setMessageAlert("Erro ao configurar limite de horas");
      setTypeAlert("error");
      setShowAlert(true);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setHours(0);
    setTimeInput("0:00");
    handleCloseModal();
  };

  return (
    <>
      <Alert
        visibility={showAlert}
        setVisibility={setShowAlert}
        message={messageAlert}
        typeAlert={typeAlert}
      />
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ClockCircleOutlined />
            Configurar Limite de Horas
          </div>
        }
        open={visibility}
        onCancel={handleClose}
        footer={[
          <Button key="cancel" onClick={handleClose}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
            Confirmar
          </Button>,
        ]}
      >
        <div style={{ padding: "20px 0" }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
            Limite de horas de trabalho:
          </label>
          <Input
            style={{ width: "100%" }}
            placeholder="Ex: 8:30 (8h30min)"
            value={timeInput}
            onChange={(e) => {
              const value = e.target.value;
              const maskedValue = applyTimeMask(value);
              setTimeInput(maskedValue);
              setHours(convertTimeToHours(maskedValue));
            }}
            addonAfter="horas"
          />
        </div>
      </Modal>
    </>
  );
};

export default LimitHoursModal;