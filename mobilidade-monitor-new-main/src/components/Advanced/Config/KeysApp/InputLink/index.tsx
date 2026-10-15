import { InputHTMLAttributes, useState, useEffect } from "react";
import { Button, Switch, Tooltip } from "antd";
import { IoHelp } from "react-icons/io5";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import swal from "sweetalert";

import api from "../../../../../services/api";
import { isValidURL } from "../../../../../utils/IsValidUrl";
import { isBooleanConfigInputType } from "../../../../../utils/isBooleanConfigInputType";

import { Container, Input, InputWrapper, ContentLinkInput } from "./styles";
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
  const [value, setValue] = useState<string>(valueInput !== undefined && valueInput !== null ? String(valueInput) : "");
  const [loading, setLoading] = useState<boolean>(false);
  const [showSecret, setShowSecret] = useState<boolean>(false);

  useEffect(() => {
    setValue(valueInput !== undefined && valueInput !== null ? String(valueInput) : "");
  }, [valueInput]);

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

  const isSecretField = (key: string): boolean => {
    const lower = key.toLowerCase();
    return (
      inputTypePro === "password" ||
      lower.includes("secret") ||
      lower.includes("password_redis") ||
      lower.includes("default_import_password")
    );
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
      const responseError = error as AxiosError<any>;
      const errMsg = Array.isArray(responseError.response?.data?.response)
        ? responseError.response?.data?.response[0]
        : (responseError.response?.data?.message || "Erro ao atualizar chave");

      swal({
        title: errMsg,
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
        const responseError = error as AxiosError<any>;
        swal({
          title: responseError.response?.data?.message || "Erro ao validar dependência",
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
    const isChecked = value === "1" || value === "true";
    return (
      <Container style={{ justifyContent: "flex-start", padding: "4px 0" }}>
        <Switch 
          checked={isChecked} 
          loading={loading} 
          onChange={handleToggleChange}
          checkedChildren="Ativado"
          unCheckedChildren="Desativado"
        />
      </Container>
    );
  }

  const isSecret = isSecretField(keyInput);

  return (
    <Container>
      <InputWrapper>
        {urlLink && (
          <ContentLinkInput title={titleLink || "Ajuda / Documentação"} href={urlLink} target="_blank">
            <IoHelp />
          </ContentLinkInput>
        )}
        <Input
          {...props}
          type={isSecret && !showSecret ? "password" : "text"}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={`Configurar ${keyInput}...`}
          style={{
            paddingLeft: urlLink ? "36px" : "12px",
            paddingRight: isSecret ? "36px" : "12px",
          }}
        />
        {isSecret && (
          <button
            type="button"
            onClick={() => setShowSecret(!showSecret)}
            style={{
              position: "absolute",
              right: 10,
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: 4,
            }}
            title={showSecret ? "Ocultar valor sensível" : "Exibir valor sensível"}
          >
            {showSecret ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </InputWrapper>
      <Tooltip title="Salvar alteração desta chave">
        <Button
          type="primary"
          icon={<FaCheck />}
          onClick={updateKey}
          loading={loading}
          style={{ height: 38, minWidth: 38, borderRadius: 6 }}
        />
      </Tooltip>
    </Container>
  );
};
