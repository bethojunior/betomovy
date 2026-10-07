import { AxiosError } from "axios";
import { Table, Button } from "antd";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { RiMailSendFill } from "react-icons/ri";
import swal from "sweetalert";
import type { TableProps } from "antd";

import { useState, useEffect } from "react";

import { ConfigServiceSmtpProps } from "./types";

import {
  Container,
  ContentTable,
  ContentBtnActions,
  ContentBtnAddSmtp,
} from "./styles";

import { ModalAddConfigSmtp } from "../../../../components/Advanced/Config/ConfigServiceSmtp";

import api from "../../../../services/api";

import { theme_colors } from "../../../../theme/theme";
import { ModalServiceSmtp } from "../../../../components/Advanced/Config/ConfigServiceSmtp/ModalServiceSmtp";

export const ConfigServiceSMTP = () => {
  const [isEmailTestModalVisible, setIsEmailTestModalVisible] =
    useState<boolean>(false);
  const [serviceSmtp, setServiceSmtp] = useState<ConfigServiceSmtpProps[]>([]);
  const [serviceSelected, setServiceSelected] =
    useState<ConfigServiceSmtpProps | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getServiceSmtp = async () => {
    try {
      setLoading(true);
      const responseServiceSmtp = await api.get("smtpServer");

      if (responseServiceSmtp.status) {
        setServiceSmtp(responseServiceSmtp.data.response);
      }
    } catch (error) {
      const responseAlert = error as AxiosError;
      swal({
        title: responseAlert.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (serviceSelected: ConfigServiceSmtpProps) => {
    setOpenModal(true);
    setServiceSelected(serviceSelected);
  };

  const handleDelete = (id: number) => {
    swal({
      title: "Deseja realmente deletar este serviço?",
      icon: "info",
      buttons: ["Cancelar", "Confirmar"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .put(`smtpServer/${id}/remove`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Serviço deletado com sucesso!",
                icon: "success",
              });
              getServiceSmtp();
            }
          })
          .catch((error: AxiosError) => {
            swal({
              title: error.response?.data.message,
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const columns: TableProps<ConfigServiceSmtpProps>["columns"] = [
    {
      title: "Nome do Serviço",
      dataIndex: "mailer",
      key: "name-service",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Email do Remetente",
      dataIndex: "fromMailer",
      key: "email-remetent",
      width: 250,
    },
    {
      title: "Nome do Remetente",
      dataIndex: "fromName",
      key: "name-remetent",
      width: 250,
    },
    {
      title: "Host",
      dataIndex: "host",
      key: "host",
      width: 250,
    },
    {
      title: "Porta",
      dataIndex: "port",
      key: "port",
      width: 150,
    },
    {
      title: "Usuário",
      dataIndex: "username",
      key: "user",
      width: 250,
    },
    {
      title: "Criptografia",
      dataIndex: "encryption",
      key: "encryption",
      width: 150,
    },
    {
      title: "Padrão",
      key: "default",
      width: 150,
      render: (_, data) => {
        return <span>{data.default === 1 ? "Sim" : "Não"}</span>;
      },
    },
    {
      title: "Ações",
      key: "actions",
      width: 150,
      ellipsis: true,
      align: "right",
      render: (_, data) => {
        return (
          <ContentBtnActions>
            <Button
              title="Editar serviço"
              icon={<MdEdit style={{ color: theme_colors.primary_antd }} />}
              onClick={() => handleEditService(data)}
            />
            <Button
              title="Deletar serviço"
              icon={<FaTrash style={{ color: theme_colors.red_crismon }} />}
              onClick={() => handleDelete(data.id)}
            />
            <Button
              title="Testar envio de email"
              type="primary"
              icon={<RiMailSendFill />}
              onClick={() => setIsEmailTestModalVisible(true)}
            />
          </ContentBtnActions>
        );
      },
    },
  ];

  useEffect(() => {
    getServiceSmtp();
  }, []);

  return (
    <Container>
      <ContentBtnAddSmtp>
        <Button type="primary" onClick={() => setOpenModal(true)}>
          Cadastrar Novo SMTP
        </Button>
      </ContentBtnAddSmtp>
      <ContentTable>
        <Table
          dataSource={serviceSmtp}
          columns={columns}
          pagination={false}
          loading={loading}
        />
      </ContentTable>
      <ModalAddConfigSmtp
        getServiceSmtp={getServiceSmtp}
        setVisible={setOpenModal}
        visible={openModal}
        serviceSelected={serviceSelected}
        setServiceSelected={setServiceSelected}
      />
      <ModalServiceSmtp
        visible={isEmailTestModalVisible}
        setVisible={setIsEmailTestModalVisible}
        setLoading={setIsEmailTestModalVisible}
        isSendingEmail={loading}
      />
    </Container>
  );
};
