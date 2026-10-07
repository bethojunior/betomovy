import { useState, useEffect, FC } from "react";
import { Input, Button, notification } from "antd";
import api from "../../../../../services/api";

import { ModalServiceSmtpProps } from "./types";
import { StyledModal } from "./styles";

import Utils from "../../../../../utils/Utils";

export const ModalServiceSmtp: FC<ModalServiceSmtpProps> = ({
  visible,
  setLoading,
  isSendingEmail,
  setVisible,
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoadingState] = useState(false);

  const handleClose = () => {
    setLoadingState(false);
    setEmail("");
    setError("");
    setVisible(false);
  };

  const handleOk = async () => {
    if (!Utils.checkIfEmailIsValid(email)) {
      setError("Por favor, insira um endereço de email válido.");
      return;
    }

    if (!isSendingEmail) {
      setLoadingState(true);
      try {
        const response = await api.post("smtpServer/test", { email });
        if (response.status) {
          notification.success({
            message: "Sucesso",
            description: "Email enviado com sucesso!",
            placement: "topRight",
          });
          setEmail("");
        }
      } catch (error) {
        notification.error({
          message: "Erro",
          description: "A autenticação no servidor SMTP falhou.",
          placement: "topRight",
        });
      } finally {
        setLoadingState(false);
      }
    }
  };

  useEffect(() => {
    setError("");
  }, [email]);

  useEffect(() => {
    if (visible) {
      setEmail("");
      setError("");
    }
  }, [visible]);

  return (
    <StyledModal
      title="Teste de e-mail"
      open={visible}
      onOk={handleOk}
      onCancel={handleClose}
      footer={[
        <Button key="back" onClick={() => setLoading(false)} disabled={loading}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isSendingEmail}
          onClick={handleOk}
          disabled={loading}
        >
          Enviar
        </Button>,
      ]}
    >
      <Input
        placeholder="Digite seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onPressEnter={handleOk}
      />
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
    </StyledModal>
  );
};
