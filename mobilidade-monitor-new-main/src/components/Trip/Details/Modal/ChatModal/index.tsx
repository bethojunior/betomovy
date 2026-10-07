import { FC } from "react";
import { Button, Modal } from "antd";
import { TypeMessage, MessageContent, Message } from "./styles";

import { Constants } from "../../../../../utils/constants";
interface ChatMessage {
  isAudio: boolean;
  isDriver: boolean;
  message: string;
  name: string;
  nickname: string;
  userId: number;
}

interface ModalProps {
  data: ChatMessage[];
  visibility: boolean;
  closeModal: () => void;
  tripReference: string | undefined;
}

const ChatModal: FC<ModalProps> = ({
  data,
  visibility,
  closeModal,
  tripReference,
}) => {
  return (
    <Modal
      title="Chat entre motorista e cliente"
      open={visibility}
      onCancel={closeModal}
      footer={[
        <Button key="back" onClick={closeModal}>
          Fechar
        </Button>,
      ]}
    >
      {data?.map((item, index) => {
        const type = item.isDriver ? "Motorista" : "Cliente";

        if (item.isAudio) {
          return (
            <MessageContent type={item.isDriver} key={index}>
              <audio
                style={{
                  width: "100%",
                }}
                src={`${Constants.url_audio}${tripReference}/${item.message}`}
                controls
              />
            </MessageContent>
          );
        }
        return (
          <MessageContent type={item.isDriver} key={index + 1}>
            <TypeMessage>{type}</TypeMessage>
            <Message>{item.message}</Message>
          </MessageContent>
        );
      })}
    </Modal>
  );
};

export default ChatModal;
