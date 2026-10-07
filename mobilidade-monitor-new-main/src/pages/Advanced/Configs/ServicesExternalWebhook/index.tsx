import { FaTrash } from "react-icons/fa";
import { TbPlugConnected } from "react-icons/tb";
import { CiPower } from "react-icons/ci";
import { HiPencil } from "react-icons/hi";
import { Button, Table, Tag, Pagination } from "antd";
import type { TableProps } from "antd";
import { AxiosError } from "axios";
import swal from "sweetalert";
import { useEffect, useState } from "react";

import {
  Container,
  ContentTable,
  ContentBtnActions,
  ContentPagination,
} from "./styles";

import { ModalAddEditRouteWebhook } from "../../../../components/Advanced/Config/ServicesExternalWebhook/ModalAddRouteWebhook";
import api from "../../../../services/api";
import { useContextAuth } from "../../../../contexts/auth";
import { WEBHOOKS } from "../../../../constants/permissions";

import { theme_colors } from "../../../../theme/theme";

import { WebhooksServicesProps } from "./types";

let last_page: number | null = null;

export const ServicesExternalsWebhook = () => {
  const { hasPermission } = useContextAuth();

  const [visibleModalAddRoute, setVisibleModalAddRoute] =
    useState<boolean>(false);

  const [webhooksServices, setWebhooksServices] = useState<
    WebhooksServicesProps[]
  >([]);

  const [webhookSelected, setWebhookSelected] =
    useState<WebhooksServicesProps | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const handleOpenModal = () => {
    setVisibleModalAddRoute(true);
  };

  const getAllWebhooks = async (page: number = 1) => {
    try {
      setLoading(true);
      const responseAllWebhooks = await api.get(`webhook?page=${page}`);
      last_page = responseAllWebhooks.data.response.last_page;
      setWebhooksServices(responseAllWebhooks.data.response.data);
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError?.response?.data?.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWebhook = (id: number) => {
    swal({
      title: "Aviso",
      icon: "warning",
      text: "Deseja realmente deletar esse webhook?",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .delete(`webhook/${id}`)
          .then((response) => {
            if (response.status) {
              getAllWebhooks();
              swal({
                title: "Sucesso",
                text: "Webhook deletado com sucesso",
                icon: "success",
              });
            }
          })
          .catch((error) => {
            console.error(error);
            swal({
              title: "Error",
              text: error?.response?.data?.message,
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const handleChangeStatus = (
    id: number,
    status: number,
    type_service: number
  ) => {
    swal({
      title: "Aviso",
      icon: "warning",
      text: `Deseja realmente ${
        status === 1 ? "desativar" : "ativar"
      } este webhook?`,
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .post(
            `webhook/${id}/${status === 1 ? "deactivating" : "activating"}`,
            {
              type_service_id: type_service,
            }
          )
          .then((response) => {
            if (response.status) {
              getAllWebhooks();
              swal({
                title: "Sucesso",
                text: `Webhook service ${
                  status === 1 ? "desativado" : "ativado"
                } com sucesso`,
                icon: "success",
              });
            }
          })
          .catch((error) => {
            console.error(error);
            swal({
              title: "Error",
              text: error?.response?.data?.message,
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const handleEditWebhook = (data: WebhooksServicesProps) => {
    setVisibleModalAddRoute(true);
    setWebhookSelected(data);
  };

  useEffect(() => {
    getAllWebhooks();
  }, []);

  const columns: TableProps<WebhooksServicesProps>["columns"] = [
    {
      title: "Id",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "Url",
      key: "url",
      dataIndex: "url",
    },
    {
      title: "Ação",
      key: "action",
      render: (_, data) => {
        return <span>{data.type_service.name}</span>;
      },
    },
    {
      title: "Método",
      key: "method",
      dataIndex: "method",
    },
    {
      title: "Status",
      key: "status",
      render: (_, data) => {
        const isActive = data.active === 1 ? true : false;

        return (
          <Tag color={isActive ? "green" : "red"}>
            {isActive ? "Ativo" : "Inativo"}
          </Tag>
        );
      },
    },
    {
      title: "Ações",
      key: "actions",
      align: "right",
      render: (_, data) => {
        return (
          <>
            <ContentBtnActions>
              {hasPermission(WEBHOOKS, "editar_webhooks") && (
                <Button
                  onClick={() => handleEditWebhook(data)}
                  title="Editar"
                  icon={
                    <HiPencil style={{ color: theme_colors.primary_antd }} />
                  }
                />
              )}

              {hasPermission(WEBHOOKS, "alterar_status") && (
                <Button
                  onClick={() =>
                    handleChangeStatus(
                      data.id,
                      data.active,
                      data.type_service_id
                    )
                  }
                  title={data.active === 1 ? "Desativar" : "Ativar"}
                  icon={
                    data.active === 1 ? (
                      <TbPlugConnected style={{ color: theme_colors.orange }} />
                    ) : (
                      <CiPower style={{ color: theme_colors.green }} />
                    )
                  }
                />
              )}

              {hasPermission(WEBHOOKS, "deletar_webhook_services") && (
                <Button
                  onClick={() => handleDeleteWebhook(data.id)}
                  title="Excluir"
                  icon={<FaTrash style={{ color: theme_colors.red_crismon }} />}
                />
              )}
            </ContentBtnActions>
          </>
        );
      },
    },
  ];

  return (
    <Container>
      {hasPermission(WEBHOOKS, "adicionar_webhooks") && (
        <Button type="primary" onClick={handleOpenModal}>
          Adicionar Serviço Webhook
        </Button>
      )}

      <ContentTable>
        <Table
          columns={columns}
          dataSource={webhooksServices}
          pagination={false}
          loading={loading}
        />
      </ContentTable>

      {last_page && (
        <ContentPagination>
          <Pagination
            total={last_page * 10}
            onChange={(currentValue) => {
              getAllWebhooks(currentValue);
            }}
          />
        </ContentPagination>
      )}

      <ModalAddEditRouteWebhook
        dataWebhook={webhookSelected}
        setDataWebhook={setWebhookSelected}
        visible={visibleModalAddRoute}
        setVisible={setVisibleModalAddRoute}
        getAllWebhooks={getAllWebhooks}
      />
    </Container>
  );
};
