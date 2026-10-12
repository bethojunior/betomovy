import { MdDelete } from "react-icons/md";
import { Button, Table, Tooltip } from "antd";
import swal from "sweetalert";
import { useEffect, useState } from "react";

import { Container } from "./styles";

import {
  NotificationListProps,
  NotificationTableProps,
  NotificationUserTypesProps,
} from "../../../pages/Message/Notification/types";
import api from "../../../services/api";

const NotificationTable = ({
  notificationList,
  alertValues,
  setLoading,
  currentPage,
  getAllNotification,
}: NotificationTableProps) => {
  const [cityNames, setCityNames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchCityNames = async () => {
      const rawList = Array.isArray(notificationList) ? notificationList : [];
      const cityIds = Array.from(
        new Set(
          rawList
            .map((notification) => notification?.cityId?.toString()?.split(","))
            .filter(Boolean)
            .flat()
        )
      ).filter(Boolean);

      if (cityIds.length > 0) {
        try {
          const { data } = await api.get(`city/actives/fully`);
          const cityArr = Array.isArray(data?.response) ? data.response : (Array.isArray(data?.data) ? data.data : []);
          const cityMap = cityArr.reduce((acc: any, city: any) => {
            if (city) {
              const id = city.cityId || city.id;
              acc[id] = city.nome || city.name || "Cidade";
            }
            return acc;
          }, {});
          setCityNames(cityMap);
        } catch (error) {
          console.error("Erro ao buscar nomes das cidades:", error);
        }
      }
    };

    fetchCityNames();
  }, [notificationList]);

  const renderCityNames = (cityId: string) => {
    if (!cityId) return "Não informado";
    const ids = cityId.split(",");
    const names = ids.map((id) => cityNames[id] || "Desconhecida");
    return names.join(", ");
  };

  const renderTooltip = (item?: NotificationUserTypesProps[]) => {
    if (!Array.isArray(item) || item.length === 0) {
      return "Todos os usuários";
    }
    return item
      .map((res: NotificationUserTypesProps) => {
        return `${res?.userType || "Usuário"}<br />`;
      })
      .join(" ");
  };

  const deleteNotification = (id: number) => {
    swal({
      title: "Você realmente deseja excluir essa notificação?",
      icon: "warning",
      buttons: ["Cancelar", "Continuar"],
      dangerMode: true,
    }).then((res) => {
      if (res) {
        setLoading(true);
        api.delete(`notification/${id}`).then((response) => {
          setLoading(false);
          if (response.status == 200) {
            getAllNotification(currentPage);
            return alertValues("Sucesso ao excluir notificação", "success");
          }
          return alertValues("Erro ao tentar excluir notificação", "warning");
        });
      }
    });
  };

  const columns = [
    {
      title: "Assunto",
      dataIndex: "title",
      key: "title",
      width: 200, 
      ellipsis: {
        showTitle: false, 
      },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: "Descrição",
      dataIndex: "message",
      key: "message",
      width: 300, 
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: "Link",
      key: "link",
      width: 100,
      render: (item: NotificationListProps) => {
        return !item.link ? (
          "-"
        ) : (
          <a href={item.link} target="_blank">
            Ver
          </a>
        );
      },
    },
    {
      title: "Imagem",
      key: "image",
      width: 100,
      render: (item: NotificationListProps) => {
        return !item.image ? (
          "-"
        ) : (
          <a href={import.meta.env.S3_LINK + item.image} target="_blank">
            Ver
          </a>
        );
      },
    },
    {
      title: "Destinatario",
      key: "address",
      width: 150,
      render: (item: NotificationListProps) => (
        <Tooltip
          placement="topRight"
          title={
            <div
              dangerouslySetInnerHTML={{
                __html: renderTooltip(item?.notification_user_types),
              }}
            ></div>
          }
        >
          <Button>Usuários</Button>
        </Tooltip>
      ),
    },
    {
      title: "Cidade",
      key: "city",
      width: 200, 
      ellipsis: {
        showTitle: false, 
      },
      render: (item: NotificationListProps) => (
        <Tooltip placement="topLeft" title={renderCityNames(item.cityId?.toString())}>
          {renderCityNames(item.cityId?.toString())}
        </Tooltip>
      ),
    },
    {
      title: "Excluir",
      key: "address",
      width: 100,
      render: (item: NotificationListProps) => (
        <MdDelete
          style={{ cursor: "pointer" }}
          color="red"
          size={20}
          onClick={() => deleteNotification(item.idNotification)}
        />
      ),
    },
  ];

  return (
    <Container>
      <Table
        pagination={false}
        rowKey={(record: any) => record.idNotification || record.id || Math.random()}
        dataSource={Array.isArray(notificationList) ? notificationList : []}
        columns={columns}
      />
    </Container>
  );
};

export default NotificationTable;
