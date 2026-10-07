import swal from "sweetalert";
import { useEffect, useState } from "react";
import { Button, Modal, Input } from "antd";
import { Container, ContentInput, LabelInput } from "./styles";
import api from "../../../../../services/api";

import {
  IModalConfigListPhonesProps,
  IResponseConfigListContactsProps,
} from "./types";

export const ModalConfigListPhones = ({
  visible,
  setVisible,
  refetchAndResetStates
}: IModalConfigListPhonesProps) => {
  const [messageConfig, setMessageConfig] =
    useState<IResponseConfigListContactsProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getConfigsListPhones = async () => {
    try {
      setLoading(true);
      const responseConfigListPhones = await api.get(
        "config_list_phone_general/config",
      );

      if (responseConfigListPhones.status) {
        const dataConfigListPhones: IResponseConfigListContactsProps =
          responseConfigListPhones.data.response[0] ?? null;

        setMessageConfig(dataConfigListPhones);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Error",
        text: "Erro ao salvar configuração",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setVisible(false);
  };

  const handleSaveConfigurations = async () => {
    if (!messageConfig) {
      return;
    }

    try {
      setLoading(true);
      const responseConfigListPhones = await api.put(
        `config_list_phone_general/config/${messageConfig?.id}`,
        {
          messageContacts: messageConfig?.messageContacts,
        },
      );

      if (responseConfigListPhones.status) {
        swal({
          title: "Sucesso",
          text: "Configuração salva com sucesso",
          icon: "success",
        });

        getConfigsListPhones();
        handleCloseModal();
        refetchAndResetStates();
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Error",
        text: "Erro ao salvar configuração",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getConfigsListPhones();
  }, []);

  return (
    <Modal
      open={visible}
      onCancel={handleCloseModal}
      title="Configuração Lista Telefônica"
      footer={[
        <Button onClick={handleCloseModal}>Cancelar</Button>,
        <Button
          type="primary"
          onClick={handleSaveConfigurations}
          disabled={loading}
          loading={loading}
        >
          Confirmar
        </Button>,
      ]}
    >
      <Container>
        <ContentInput>
          <LabelInput>Mensagem</LabelInput>
          <Input
            value={messageConfig?.messageContacts ?? ""}
            onChange={({ target: { value } }) =>
              setMessageConfig({
                ...messageConfig,
                messageContacts: value,
              } as any)
            }
          />
        </ContentInput>
      </Container>
    </Modal>
  );
};
