import { FC, useEffect, useState } from "react";
import { Modal, Skeleton, message as antdMessage } from "antd";
import { FaWhatsapp } from "react-icons/fa";
import {
  ModalBody,
  MessageBox,
  MessageText,
  MessageTextarea,
  EnviarButton,
} from "./styles";
import { openWhatsApp } from "../../utils/whatsappUtils";
import Utils from "../../utils/Utils";
import api from "../../services/api";
import type { ModalWhatsAppParabensProps } from "./types";
import {
  WHATSAPP_PARABENS_DRIVER_TEMPLATE_KEY,
  WHATSAPP_PARABENS_CLIENT_TEMPLATE_KEY,
  DEFAULT_TEMPLATE_DRIVER,
  DEFAULT_TEMPLATE_CLIENT,
} from "./constants";

export type { ModalWhatsAppParabensProps } from "./types";
export { WHATSAPP_PARABENS_DRIVER_TEMPLATE_KEY, WHATSAPP_PARABENS_CLIENT_TEMPLATE_KEY } from "./constants";

const buildMessageFromTemplate = (
  template: string,
  firstName: string,
  projectName: string,
  quantityTripsFormatted: string
): string => {
  return template
    .replace(/{firstName}/g, firstName)
    .replace(/{projectName}/g, projectName)
    .replace(/{quantityTrips}/g, quantityTripsFormatted);
};

const getTemplateKeyByType = (type: "driver" | "client"): string =>
  type === "driver" ? WHATSAPP_PARABENS_DRIVER_TEMPLATE_KEY : WHATSAPP_PARABENS_CLIENT_TEMPLATE_KEY;

const getDefaultTemplateByType = (type: "driver" | "client"): string =>
  type === "driver" ? DEFAULT_TEMPLATE_DRIVER : DEFAULT_TEMPLATE_CLIENT;

export const ModalWhatsAppParabens: FC<ModalWhatsAppParabensProps> = ({
  open,
  onClose,
  name,
  quantityTrips,
  phone,
  projectName,
  type,
}) => {
  const [isLoadingTemplate, setIsLoadingTemplate] = useState<boolean>(false);
  const [editableMessage, setEditableMessage] = useState<string>("");
  const displayName = Utils.capitalizeFirstLetter(projectName) || "App";
  const firstName = name?.trim().split(/\s+/)[0] || name;
  const quantityTripsFormatted = quantityTrips.toLocaleString("pt-BR");

  useEffect(() => {
    if (!open) return;
    setIsLoadingTemplate(true);
    const templateKey = getTemplateKeyByType(type);
    const fetchTemplate = async (): Promise<void> => {
      try {
        const response = await api.get<{ response?: Array<{ key: string; value: string }> }>(
          "config/additional"
        );
        const list = response?.data?.response ?? [];
        const config = list.find((c) => c.key === templateKey);
        const resolvedTemplate = config?.value?.trim() || getDefaultTemplateByType(type);
        const resolvedMessage = buildMessageFromTemplate(
          resolvedTemplate,
          firstName,
          displayName,
          quantityTripsFormatted
        );
        setEditableMessage(resolvedMessage);
      } catch {
        const fallbackTemplate = getDefaultTemplateByType(type);
        const fallbackMessage = buildMessageFromTemplate(
          fallbackTemplate,
          firstName,
          displayName,
          quantityTripsFormatted
        );
        setEditableMessage(fallbackMessage);
      } finally {
        setIsLoadingTemplate(false);
      }
    };
    fetchTemplate();
  }, [open, type, firstName, displayName, quantityTripsFormatted]);

  const modalTitle = type === "driver" ? "Parabéns motorista - WhatsApp" : "Parabéns cliente - WhatsApp";

  const handleEnviar = () => {
    const messageToSend = editableMessage.trim();
    if (!messageToSend) {
      antdMessage.warning("Digite uma mensagem antes de enviar.");
      return;
    }
    const opened = openWhatsApp(phone, messageToSend);
    if (!opened) {
      antdMessage.warning("Telefone não disponível para envio pelo WhatsApp.");
      return;
    }
    onClose();
  };

  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={onClose}
      footer={null}
      width={480}
      destroyOnClose
    >
      <ModalBody>
        <MessageBox>
          {isLoadingTemplate ? (
            <Skeleton active paragraph={{ rows: 4 }} title={false} />
          ) : (
            <>
              <MessageText>Edite a mensagem antes de enviar:</MessageText>
              <MessageTextarea
                value={editableMessage}
                onChange={(event) => setEditableMessage(event.target.value)}
                placeholder="Digite a mensagem que será enviada..."
                aria-label="Mensagem para envio pelo WhatsApp"
              />
            </>
          )}
        </MessageBox>
        <EnviarButton
          type="button"
          onClick={handleEnviar}
          aria-label="Enviar mensagem pelo WhatsApp"
        >
          <FaWhatsapp />
          Enviar
        </EnviarButton>
      </ModalBody>
    </Modal>
  );
};
