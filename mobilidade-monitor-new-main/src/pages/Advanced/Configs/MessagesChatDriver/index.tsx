import {
  Container,
  ContentTable,
  ButtonTable,
  ContentHead,
  ContentInput,
  LabelText,
} from "./styles";
import { ColumnsType } from "antd/es/table";
import { Table, Select, Button, Input } from "antd";
import { MdDelete, MdEdit } from "react-icons/md";
import swal from "sweetalert";

import { useEffect, useState } from "react";

import Preload from "../../../../components/Utils/Preload";
import { ModalEditChatbotDriver } from "../../../../components/Advanced/Config/MessagesChatDriver";

import { ChatBotTripProps, ChatBotTripTypeProps } from "./types";
import api from "../../../../services/api";

export const MessagesChatDriver = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [chatBotTrip, setChatBotTrip] = useState<ChatBotTripProps[]>([]);
  const [chatBotTripType, setChatBotTripType] = useState<
    ChatBotTripTypeProps[]
  >([]);
  const [showModalEditMessage, setShowModalEditMessage] =
    useState<boolean>(false);
  const [messageSelected, setMessageSelected] =
    useState<ChatBotTripProps | null>(null);

  const [typesTrips, setTypesTrips] = useState<number | undefined>(undefined);
  const [message, setMessage] = useState<string>("");

  const getChatBotTripAndType = () => {
    setLoadingTable(true);

    const responseChatBotTrip = api.get("chatBotTrip");
    const responseChabotBotTripType = api.get("chatBotTripType");

    Promise.all([responseChatBotTrip, responseChabotBotTripType])
      .then((response) => {
        const trips = response[0]?.data?.response ?? response[0]?.data?.data;
        const types = response[1]?.data?.response ?? response[1]?.data?.data;

        setChatBotTrip(Array.isArray(trips) ? trips : []);
        setChatBotTripType(Array.isArray(types) ? types : []);
      })
      .catch((error) => {
        console.error(error);
        setChatBotTrip([]);
        setChatBotTripType([]);
      })
      .finally(() => {
        setLoadingTable(false);
      });
  };

  useEffect(() => {
    getChatBotTripAndType();
  }, []);

  useEffect(() => {
    if (typesTrips == null && chatBotTripType.length > 0) {
      setTypesTrips(chatBotTripType[0].id);
    }
  }, [chatBotTripType, typesTrips]);

  const handleAddNewMessage = async () => {
    try {
      if (!typesTrips) {
        swal({
          title: "Selecione o tipo de viagem",
          icon: "warning",
        });
        return;
      }

      if (message.length <= 0) {
        swal({
          title: "Preencha o campo mensagem",
          icon: "warning",
        });
        return;
      }

      setLoadingTable(true);

      const responseAddNewMessage = await api.post("chatBotTrip", {
        chatBotTripTypeId: typesTrips,
        message,
      });

      if (responseAddNewMessage.status) {
        swal({
          title: "Mensagem inserida com sucesso",
          icon: "success",
        });
        getChatBotTripAndType();
        setMessage("");
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao inserir mensagem",
        icon: "error",
      });
    } finally {
      setLoadingTable(false);
    }
  };

  const handleEditMessage = (value: ChatBotTripProps) => {
    setMessageSelected(value);
    setShowModalEditMessage(true);
  };

  const deleteMessage = (id: number) => {
    swal({
      title: "Você realmente deseja excluir esta mensagem?",
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
      dangerMode: true,
    }).then((res) => {
      if (res) {
        setLoadingTable(true);
        api.delete(`chatBotTrip/${id}`).then((result) => {
          setLoadingTable(false);
          if (result.status === 200) {
            getChatBotTripAndType();
            swal({
              title: "Notificação excluída com sucesso!",
              icon: "success",
            });
            return;
          }
          swal({
            title: "Erro ao tentar excluir notificação!",
            icon: "error",
          });
          return;
        });
      }
    });
  };

  const resolveTripTypeName = (item: ChatBotTripProps) => {
    const type =
      item.chatBotTripType ||
      item.chat_bot_trip_type ||
      chatBotTripType.find((t) => t.id === item.chatBotTripTypeId);
    return type?.name || "—";
  };

  const columns: ColumnsType<ChatBotTripProps> = [
    {
      title: "Tipo de viagem",
      key: "idUserPenaltyType",
      render: (_, item) => <p>{resolveTripTypeName(item)}</p>,
      width: 200,
      ellipsis: true,
    },
    {
      title: "Mensagem",
      dataIndex: "message",
      key: "description",
      width: 300,
    },
    {
      title: "Ações",
      key: "actions",
      width: 100,
      render: (_, item) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <ButtonTable
              onClick={() => handleEditMessage(item)}
              colorButton="#0000F7"
            >
              <MdEdit />
            </ButtonTable>
            <ButtonTable
              onClick={() => deleteMessage(item.idChatBotTrip)}
              colorButton="#DC143C"
            >
              <MdDelete />
            </ButtonTable>
          </div>
        );
      },
    },
  ];

  const typeTripsFormated = chatBotTripType.map((value) => {
    return {
      label: value.name,
      value: value.id,
    };
  });

  return (
    <Container>
      <Preload visible={loading} />
      <ContentHead>
        <ContentInput>
          <LabelText>Tipo de Viagem</LabelText>
          <Select
            style={{
              width: "100%",
            }}
            value={typesTrips}
            onChange={(value) => setTypesTrips(value)}
            options={typeTripsFormated}
          />
        </ContentInput>

        <ContentInput>
          <LabelText>Mensagem</LabelText>
          <Input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </ContentInput>

        <Button
          style={{
            width: "100%",
          }}
          type="primary"
          onClick={handleAddNewMessage}
        >
          Salvar
        </Button>
      </ContentHead>

      <ContentTable>
        <Table columns={columns} dataSource={chatBotTrip} pagination={false} loading={loadingTable} />
      </ContentTable>

      <ModalEditChatbotDriver
        selectTypeMessage={chatBotTripType}
        messageSelected={messageSelected}
        getMessagesDrives={getChatBotTripAndType}
        setLoading={setLoading}
        setShowModal={setShowModalEditMessage}
        showModal={showModalEditMessage}
      />
    </Container>
  );
};
