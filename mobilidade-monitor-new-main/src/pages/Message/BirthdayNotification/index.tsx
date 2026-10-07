import { Table } from "antd";
import { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import swal from "sweetalert";

import {
  DeleteButton,
  NotificationButton,
  EmptryNotification,
  ContentTable,
} from "./styles";

import BirthdayModal from "../../../components/Message/BirthdayNotificationModal";
import Alert from "../../../components/Utils/Alert";
 
import api from "../../../services/api";

interface EventNotification extends Array<EventNotificationData> {}

interface EventNotificationData {
  created_at: string;
  description: string;
  eventNotificationTypeId: number;
  event_notification_type: {
    id: number;
    name: string;
  };
  id: number;
  statusId: number;
  title: string;
  updated_at: string;
}

interface MessageProps {
  id: number;
  name: string;
}

const BirthdayNotification = () => {
       
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [notificationList, setNotificationList] = useState<EventNotification>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const notificationRequest = () => {
    setLoadingTable(true);
    api.get(`eventNotification`).then((result) => {
      setLoadingTable(false);
      setNotificationList(result.data.response);
    });
  };

  useEffect(() => {
    notificationRequest();
  }, []);

  const deleteNotification = (id: number) => {
    swal({
      title: "Você realmente deseja excluir esta mensagem?",
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
      dangerMode: true,
    }).then((res) => {
      if (res) {
        setLoadingTable(true);
        api.delete(`eventNotification/${id}`).then((result) => {
          setLoadingTable(false);
          if (result.status === 200) {
            notificationRequest();
            setTypeAlert("success");
            setMessageAlert("Notificação excluída com sucesso!");
            return setShowAlert(true);
          }
          setTypeAlert("error");
          setMessageAlert("Erro ao tentar excluir notificação!");
          return setShowAlert(true);
        });
      }
    });
  };

  const columns = [
    {
      title: "Tipo",
      dataIndex: "event_notification_type",
      key: "event_notification_type.name",
      width: 200,
      ellipsis: true,
      render: (item: MessageProps) => (
        <p
          style={{
            margin: 0,
          }}
        >
          {item.name}
        </p>
      ),
    },
    {
      title: "Tipo de notificação",
      dataIndex: "title",
      key: "description",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Mensagem",
      dataIndex: "description",
      key: "link",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Excluir",
      key: "actions",
      width: 100,
      ellipsis: true,
      render: (item: MessageProps) => (
        <DeleteButton onClick={() => deleteNotification(item.id)}>
          <AiFillDelete />
        </DeleteButton>
      ),
    },
  ];

  return (
    <div>
       
      <Alert
        visibility={showAlert}
        setVisibility={setShowAlert}
        message={messageAlert}
        typeAlert={typeAlert}
      />
      <BirthdayModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        notificationRequest={notificationRequest}
      />
      <NotificationButton
        type="primary"
        onClick={() => setIsModalVisible(true)}
      >
        Nova notificação
      </NotificationButton>
      {notificationList?.length === 0 ? (
        <EmptryNotification>
          <p>Você ainda não possui mensagem</p>
        </EmptryNotification>
      ) : (
        <ContentTable>
          <Table
            rowKey="id"
            dataSource={notificationList}
            columns={columns}
            pagination={false}
            loading={loadingTable}
          />
        </ContentTable>
      )}
    </div>
  );
};

export default BirthdayNotification;
