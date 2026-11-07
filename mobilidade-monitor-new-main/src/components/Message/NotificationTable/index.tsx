import React, { useEffect, useState } from "react";
import { Table, Tag, Tooltip, Popconfirm, Button, Empty, Image, Space } from "antd";
import { 
  MdDeleteOutline, 
  MdOpenInNew, 
  MdImage, 
  MdCalendarToday, 
  MdLocationCity, 
  MdPersonOutline,
  MdAdd
} from "react-icons/md";
import {
  TableContainer,
  TitleCell,
  MessageCell,
  ActionCell,
  ImageThumbnail,
} from "./styles";
import {
  NotificationListProps,
  NotificationTableProps,
  NotificationUserTypesProps,
} from "../../../pages/Message/Notification/types";
import api from "../../../services/api";

const NotificationTable: React.FC<NotificationTableProps> = ({
  notificationList,
  alertValues,
  setLoading,
  currentPage,
  totalItems,
  pageSize,
  getAllNotification,
  onOpenCreateModal,
}) => {
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
          const cityArr = Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.response)
            ? data.response
            : [];
          const cityMap = cityArr.reduce((acc: any, city: any) => {
            if (city) {
              const id = String(city.cityId || city.id);
              acc[id] = city.nome || city.name || city.shortName || "Cidade";
            }
            return acc;
          }, {});
          setCityNames(cityMap);
        } catch (error) {
          console.error("Erro ao carregar cidades:", error);
        }
      }
    };

    fetchCityNames();
  }, [notificationList]);

  const renderCityNames = (cityId?: string | number | null) => {
    if (!cityId) return <span style={{ color: "#94a3b8" }}>Todas as cidades</span>;
    const ids = String(cityId).split(",").map(id => id.trim()).filter(Boolean);
    if (ids.length === 0) return <span style={{ color: "#94a3b8" }}>Todas as cidades</span>;
    
    if (ids.length <= 2) {
      return ids.map((id) => (
        <Tag key={id} color="geekblue" icon={<MdLocationCity style={{ verticalAlign: "-2px" }} />}>
          {cityNames[id] || `Cidade #${id}`}
        </Tag>
      ));
    }

    return (
      <Tooltip title={ids.map((id) => cityNames[id] || `Cidade #${id}`).join(", ")}>
        <Tag color="geekblue" icon={<MdLocationCity style={{ verticalAlign: "-2px" }} />}>
          {cityNames[ids[0]] || `Cidade #${ids[0]}`} +{ids.length - 1}
        </Tag>
      </Tooltip>
    );
  };

  const renderRecipients = (types?: NotificationUserTypesProps[]) => {
    if (!Array.isArray(types) || types.length === 0) {
      return <Tag color="default">Todos os usuários</Tag>;
    }

    return types.map((item, idx) => {
      const typeName = (item?.userType || item?.name || "Usuário").toLowerCase();
      let color = "blue";
      if (typeName.includes("passageiro") || typeName.includes("cliente")) {
        color = "purple";
      } else if (typeName.includes("motorista") || typeName.includes("driver")) {
        color = "blue";
      } else if (typeName.includes("delivery") || typeName.includes("entregador")) {
        color = "orange";
      }
      return (
        <Tag key={idx} color={color} icon={<MdPersonOutline style={{ verticalAlign: "-2px" }} />}>
          {item?.userType || item?.name || "Usuário"}
        </Tag>
      );
    });
  };

  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(dateStr);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      const res = await api.delete(`notification/${id}`);
      setLoading(false);
      if (res.status === 200 || res.data?.status) {
        alertValues("Notificação excluída com sucesso!", "success");
        getAllNotification(currentPage);
      } else {
        alertValues("Não foi possível excluir a notificação.", "warning");
      }
    } catch (err) {
      setLoading(false);
      alertValues("Erro na comunicação com o servidor ao excluir.", "error");
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    const s3 = (import.meta.env.S3_LINK as string | undefined)?.replace(/\/$/, "") || "https://minio.704app.com.br/rota101fb704";
    return `${s3}/${imagePath.replace(/^\//, "")}`;
  };

  const columns = [
    {
      title: "Notificação",
      key: "notification",
      width: 280,
      render: (_: any, record: NotificationListProps) => (
        <TitleCell>
          <span className="title-text">{record.title || "Sem assunto"}</span>
          <span className="date-badge">
            <MdCalendarToday size={12} />
            {formatDate(record.created_at || record.date)}
          </span>
        </TitleCell>
      ),
    },
    {
      title: "Mensagem",
      dataIndex: "message",
      key: "message",
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          <MessageCell>{text || "Sem conteúdo"}</MessageCell>
        </Tooltip>
      ),
    },
    {
      title: "Público Alvo",
      key: "recipients",
      width: 200,
      render: (_: any, record: NotificationListProps) => (
        <Space wrap size={[0, 6]}>
          {renderRecipients(record.notification_user_types)}
        </Space>
      ),
    },
    {
      title: "Cidades",
      key: "cityId",
      width: 180,
      render: (_: any, record: NotificationListProps) => (
        <Space wrap size={[0, 6]}>
          {renderCityNames(record.cityId)}
        </Space>
      ),
    },
    {
      title: "Mídia / Link",
      key: "media",
      width: 140,
      render: (_: any, record: NotificationListProps) => (
        <Space size={8}>
          {record.image ? (
            <Image
              src={getImageUrl(record.image)}
              width={40}
              height={40}
              style={{ objectFit: "cover", borderRadius: 8, border: "1px solid #e2e8f0" }}
              fallback="https://placehold.co/80x80/e2e8f0/64748b?text=Foto"
            />
          ) : (
            <Tooltip title="Sem imagem anexada">
              <span style={{ color: "#cbd5e1", fontSize: 20, display: "flex", alignItems: "center" }}>
                <MdImage />
              </span>
            </Tooltip>
          )}

          {record.link && (
            <Tooltip title={`Abrir URL: ${record.link} ${record.identifyUserInLink ? '(usuário vinculado)' : ''}`}>
              <Button
                type="text"
                size="small"
                icon={<MdOpenInNew size={18} color="#0284c7" />}
                href={record.link}
                target="_blank"
                rel="noopener noreferrer"
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: "Ações",
      key: "actions",
      width: 80,
      align: "center" as const,
      render: (_: any, record: NotificationListProps) => (
        <ActionCell orientation="center">
          <Popconfirm
            title="Excluir notificação"
            description="Tem certeza que deseja apagar esta notificação?"
            okText="Sim, excluir"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.idNotification)}
          >
            <Button
              type="text"
              danger
              icon={<MdDeleteOutline size={20} />}
              style={{ borderRadius: 8 }}
            />
          </Popconfirm>
        </ActionCell>
      ),
    },
  ];

  return (
    <TableContainer>
      <Table
        rowKey={(record: any) => record.idNotification || record.id || Math.random()}
        dataSource={Array.isArray(notificationList) ? notificationList : []}
        columns={columns}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div style={{ padding: "16px 0" }}>
                  <p style={{ margin: "0 0 12px 0", color: "#64748b", fontSize: 14 }}>
                    Nenhuma notificação cadastrada ainda.
                  </p>
                  <Button
                    type="primary"
                    icon={<MdAdd size={16} />}
                    onClick={onOpenCreateModal}
                    style={{ background: "#0284c7", borderRadius: 8 }}
                  >
                    Criar Notificação
                  </Button>
                </div>
              }
            />
          ),
        }}
        pagination={{
          current: currentPage,
          total: totalItems,
          pageSize: pageSize,
          showSizeChanger: false,
          showTotal: (total) => `Total de ${total} notificações`,
          onChange: (page) => getAllNotification(page),
        }}
      />
    </TableContainer>
  );
};

export default NotificationTable;
