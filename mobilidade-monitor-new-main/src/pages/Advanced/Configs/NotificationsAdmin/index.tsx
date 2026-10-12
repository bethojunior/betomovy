import { Select, Button, Table, Pagination } from "antd";
import { FaTrash } from "react-icons/fa";
import { TableProps } from "antd/lib";
import swal from "sweetalert";
import { AxiosError } from "axios";

import { useEffect, useState } from "react";

import {
  Container,
  ContentInput,
  ContentTable,
  ContentPagination,
} from "./styles";
import api from "../../../../services/api";

import { AdminNotificationProps, TypesNotificationsProps } from "./types";
import { theme_colors } from "../../../../theme/theme";

let total_pages: number | null = null;

export const NotificationAdmin = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [notifications, setNotifications] = useState<AdminNotificationProps[]>(
    []
  );
  const [idTypeNotification, setIdTypeNotification] = useState<number | null>(
    null
  );
  const [typesNotifications, setTypesNotifications] = useState<
    DefaultOptionsProps[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getNotificationsAdmin = async (
    page: number = 1,
    typeNotification: number | null = null
  ) => {
    try {
      setLoading(true);
      const responseNotification = await api.get(
        `adminNotification?page=${page}${
          typeNotification ? `&adminNotificationTypeId=${typeNotification}` : ""
        }`
      );

      if (responseNotification.status) {
        if (responseNotification.data?.response) {
          total_pages = responseNotification.data.response?.last_page ?? null;
          const nData = responseNotification.data.response?.data;
          setNotifications(Array.isArray(nData) ? nData : (Array.isArray(responseNotification.data.response) ? responseNotification.data.response : []));
        } else {
          setNotifications([]);
        }
      }
    } catch (error) {
      setNotifications([]);
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data?.message || "Erro ao carregar notificações",
        icon: "error",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getTypesNotification = async () => {
    try {
      const responseTypesNotifications = await api.get("adminNotificationType");

      if (responseTypesNotifications.status) {
        const rawTypes = responseTypesNotifications.data?.response;
        const typesNotificationsFormated = (Array.isArray(rawTypes) ? rawTypes : []).map(
          (value: TypesNotificationsProps) => ({
            value: value?.id,
            label: value?.name,
          })
        );
        setTypesNotifications(typesNotificationsFormated);
      }
    } catch (error) {
      setTypesNotifications([]);
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data?.message || "Erro ao carregar tipos de notificação",
        icon: "error",
      });
      console.error(error);
    }
  };

  const handleFilter = () => {
    setCurrentPage(1);
    getNotificationsAdmin(1, idTypeNotification);
  };

  const handleClearFilter = () => {
    getNotificationsAdmin(1);
    setIdTypeNotification(null);
    setCurrentPage(1);
  };

  const handleConfirmRead = (idNotification: number) => {
    swal({
      title: "Aviso",
      text: "Confirmar marcação de leitura",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .post(`adminNotification/${idNotification}/read`)
          .then((response) => {
            if (response.status) {
              getNotificationsAdmin(currentPage, idTypeNotification);
            }
          })
          .catch((error: AxiosError) => {
            swal({
              title: "Error",
              text: error.response?.data.message,
              icon: "error",
            });
            console.error(error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const columns: TableProps<AdminNotificationProps>["columns"] = [
    {
      title: "Descrição",
      key: "description",
      width: 300,
      render: (_, data) => {
        return <p dangerouslySetInnerHTML={{ __html: data.message }} />;
      },
    },
    {
      title: "Data",
      key: "date",
      width: 200,
      render: (_, data) => {
        return <span>{new Date(data.created_at).toLocaleString()}</span>;
      },
    },
    {
      title: "Usuário",
      key: "user",
      width: 250,
      render: (_, data) => {
        return (
          <span>
            {data?.driver ? (
              <a
                href={`/driver/list?openModalDriverId=${data?.driver?.idDriver}`}
                target="_blank"
                rel="noreferrer"
              >
                Motorista {data?.user?.name ?? ""}
              </a>
            ) : (
              data?.user?.name ?? ""
            )}
          </span>
        );
      },
    },
    {
      title: "Contato",
      key: "contact",
      width: 200,
      render: (_, data) => {
        const phone = data?.user?.phone ?? "";
        return (
          <Button
            type="link"
            href={`https://wa.me/55${phone.replace(/\D/g, "")}`}
            target="_blank"
            style={{
              padding: 0,
            }}
          >
            {phone}
          </Button>
        );
      },
    },
    {
      title: "Ações",
      key: "actions",
      width: 100,
      render: (_, data) => {
        return (
          <>
            {data?.read === 0 && (
              <Button type="primary" onClick={() => handleConfirmRead(data?.id)}>
                Marcar
              </Button>
            )}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getNotificationsAdmin();
    getTypesNotification();
  }, []);

  return (
    <Container>
      <ContentInput>
        <Select
          placeholder="Filtro"
          options={typesNotifications}
          onChange={(value) => setIdTypeNotification(value)}
          value={idTypeNotification}
          style={{
            minWidth: 250,
          }}
        />
        <Button type="primary" loading={loading} onClick={handleFilter}>
          Filtrar
        </Button>

        <Button
          title="Limpar filtro"
          icon={<FaTrash color={theme_colors.red_crismon} />}
          onClick={handleClearFilter}
        />
      </ContentInput>

      <ContentTable>
        <Table
          columns={columns}
          dataSource={Array.isArray(notifications) ? notifications : []}
          loading={loading}
          pagination={false}
        />
      </ContentTable>

      {total_pages && (
        <ContentPagination>
          <Pagination
            showSizeChanger={false}
            total={total_pages * 10}
            current={currentPage}
            onChange={(currentPage) => {
              setCurrentPage(currentPage);
              getNotificationsAdmin(currentPage, idTypeNotification);
            }}
          />
        </ContentPagination>
      )}
    </Container>
  );
};
