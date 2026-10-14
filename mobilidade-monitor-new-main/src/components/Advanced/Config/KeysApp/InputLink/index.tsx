import { InputHTMLAttributes, useState } from "react";
import { Button, Switch } from "antd";
import { IoHelp } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import swal from "sweetalert";

import api from "../../../../../services/api";
import { isValidURL } from "../../../../../utils/IsValidUrl";
import { isBooleanConfigInputType } from "../../../../../utils/isBooleanConfigInputType";

import { Container, Input, ContentLinkInput } from "./styles";
import { AxiosError } from "axios";

interface InputLinkProps extends InputHTMLAttributes<HTMLInputElement> {
  titleLink?: string | undefined;
  urlLink?: string | undefined;
  valueInput?: string | undefined;
  keyInput: string;
  inputTypePro?: string;
}

export const InputLink = ({
  titleLink,
  urlLink,
  valueInput,
  keyInput,
  inputTypePro,
  ...props
}: InputLinkProps) => {
  const [value, setValue] = useState<string>(valueInput ? valueInput : "");
  const [loading, setLoading] = useState<boolean>(false);

  const isAudioField = (key: string): boolean => {
    const audioFields = [
      'soundCallTrip',
      'soundCallTripScheduled',
      'soundCallTripInDriver',
      'soundCallTripServices',
      'soundCallAlertSchedule',
      'soundCallOnline',
      'soundCallOffline'
    ];
    return audioFields.includes(key);
  };

  const persist = async (nextValue: string) => {
    try {
      setLoading(true);

      const responseUpdatedKey = await api.put("config", {
        [keyInput]: nextValue === "" ? null : nextValue
      });

      if (responseUpdatedKey.status) {
        swal({
          title: "Chave atualizada com sucesso",
          icon: "success",
        });
      }
    } catch (error) {
      const responseError = error as AxiosError;

      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateKey = async () => {
    // Validar URL apenas para campos de áudio
    if (isAudioField(keyInput) && value.trim() !== "" && !isValidURL(value)) {
      swal({
        title: "URL inválida",
        text: "Por favor, insira uma URL válida ou deixe o campo vazio",
        icon: "warning",
      });
      return;
    }

    if (keyInput === "enable_whatsapp_group_central" && value.trim() !== "0" && value.trim() !== "") {
      try {
        setLoading(true);
        const { data } = await api.get("config/enable_whatsapp_central");
        if (!data.status || data.response === "0") {
          swal({
            title: "Atenção",
            text: "É necessário habilitar o WhatsApp na central antes de ativar o disparo para grupo.",
            icon: "warning",
          });
          setLoading(false);
          return;
        }
      } catch (error) {
        const responseError = error as AxiosError;
        swal({
          title: responseError.response?.data.message || "Erro ao validar dependência",
          icon: "error",
        });
        setLoading(false);
        return;
      }
    }

    await persist(value);
  };

  const handleToggleChange = async (checked: boolean) => {
    const nextValue = checked ? "1" : "0";
    setValue(nextValue);
    await persist(nextValue);
  };

  if (isBooleanConfigInputType(inputTypePro)) {
    return (
      <Container>
        <Switch checked={value === "1"} loading={loading} onChange={handleToggleChange} />
      </Container>
    );
  }

  return (
    <Container>
      <Input
        {...props}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <ContentLinkInput title={titleLink} href={urlLink} target="_blank">
        <IoHelp />
      </ContentLinkInput>
      <Button
        type="primary"
        icon={<FaCheck />}
        onClick={updateKey}
        loading={loading}
        style={{ height: 38, minWidth: 38, borderRadius: 6 }}
      />
    </Container>
  );
};
