import { Modal, Button, Select, Input } from "antd";

import { Container, ContentInput, LabelText } from "./styles";

import api from "../../../../services/api";

import {
  ChatBotTripProps,
  ChatBotTripTypeProps,
} from "../../../../pages/Advanced/Configs/MessagesChatDriver/types";

import swal from "sweetalert";
import { useEffect, useState } from "react";

interface ModalEditChatbotDriverProps {
  showModal: boolean;
  setShowModal: (data: boolean) => void;
  setLoading: (data: boolean) => void;
  getMessagesDrives: () => void;
  messageSelected: ChatBotTripProps | null;
  selectTypeMessage: ChatBotTripTypeProps[];
}

export const ModalEditChatbotDriver = ({
  setShowModal,
  showModal,
  getMessagesDrives,
  setLoading,
  messageSelected,
  selectTypeMessage,
}: ModalEditChatbotDriverProps) => {
  const [idMessage, setIdMessage] = useState<number | undefined>(
    messageSelected?.chat_bot_trip_type.id
  );
  const [message, setMessage] = useState<string>("");

  const handleEditMessage = async () => {
    setLoading(true);
    try {
      const responseMessage = await api.put(
        `chatBotTrip/${messageSelected?.idChatBotTrip}`,
        {
          chatBotTripTypeId: idMessage,
          message: message,
        }
      );

      if (responseMessage.status) {
        swal({
          title: "Mensagem editada com sucesso",
          icon: "success",
        });
        getMessagesDrives();
        setShowModal(false);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao editar mensagem",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const typesMessagesFormated = selectTypeMessage.map((value) => {
    return {
      label: value.name,
      value: value.id,
    };
  });

  useEffect(() => {
    if (messageSelected) {
      setMessage(messageSelected?.message);
      setIdMessage(messageSelected?.chatBotTripTypeId);
    } else {
      setMessage("");
      setIdMessage(undefined);
    }
  }, [showModal]);

  return (
    <Modal
      title="Editar mensagem de motorista"
      open={showModal}
      onCancel={() => setShowModal(false)}
      footer={[
        <Button onClick={() => setShowModal(false)}>Cancelar</Button>,
        <Button type="primary" onClick={handleEditMessage}>
          Editar
        </Button>,
      ]}
    >
      <Container>
        <ContentInput>
          <LabelText>Tipo de Viagem</LabelText>
          <Select
            style={{
              width: "100%",
            }}
            onChange={(value) => setIdMessage(value)}
            value={idMessage}
            options={typesMessagesFormated}
          />
        </ContentInput>

        <ContentInput>
          <LabelText>Mensagem</LabelText>
          <Input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </ContentInput>
      </Container>
    </Modal>
  );
};
