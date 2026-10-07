import { Button, Switch } from "antd";
import { ListConfig } from "../../../../pages/Delivery/ConfigCall/types";
import { ButtonContainer, CardContainer, InputConf } from "./styles";
import { CardProps } from "./types";
import { useState } from "react";
import { AxiosError } from "axios";
import api from "../../../../services/api";
import Mask from "../../../../services/Mask";

const ConfigCard = ({ item, sendAlert, setLoading }: CardProps) => {
  const [inputValue, setInputValue] = useState<string>(item.value || "");
  const [buttonDisable, setButtonDisable] = useState(true);

  const updateValues = async () => {
    try {
      if (inputValue.length === 0 || !inputValue) {
        return sendAlert("Campo não pode ser vazio", "warning");
      }
      setLoading(true);
      const result = await api.put(`deliveryCallConfig/${item.key}`, {
        value: inputValue,
      });
      setLoading(false);
      const { data } = result;
      if (data.status) {
        return sendAlert("Configuração alterada com sucesso", "success");
      }
      sendAlert("Erro ao alterar configuração", "warning");
    } catch (error) {
      const axiosError = error as AxiosError;
      setLoading(false);
      sendAlert("Erro ao alterar configuração", "warning");
      console.error(axiosError);
    }
  };

  const typeInput = (item: ListConfig) => {
    switch (item.fieldType) {
      case "number":
        return (
          <InputConf
            value={inputValue}
            width="100px"
            type="text"
            onChange={(e) => {
              setInputValue(Mask.setMaskJustNumber(e.target.value));
              setButtonDisable(false);
            }}
          ></InputConf>
        );
      case "boolean":
        return <Switch defaultChecked={Boolean(item.value)}></Switch>;
      default:
        return (
          <InputConf
            defaultValue={item.value}
            width="70%"
            type="text"
          ></InputConf>
        );
    }
  };
  return (
    <CardContainer>
      <div style={{ width: "60%" }}>
        <span>{item.description}</span>
      </div>
      <ButtonContainer>
        {typeInput(item)}
        <Button
          type="primary"
          style={{ marginLeft: 10 }}
          disabled={buttonDisable}
          onClick={updateValues}
        >
          Salvar
        </Button>
      </ButtonContainer>
    </CardContainer>
  );
};

export default ConfigCard;
