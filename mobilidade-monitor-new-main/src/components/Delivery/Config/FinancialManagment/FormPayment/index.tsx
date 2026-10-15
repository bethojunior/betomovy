import { Button, Table, Divider } from "antd";
import type { TableProps } from "antd";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import swal from "sweetalert";
import { AxiosError } from "axios";

import { useEffect, useState } from "react";

import {
  Container,
  ContentTable,
  ContentBtnActions,
  ContentHeader,
} from "./styles";

import { FormPaymentsProps } from "./types";

import { theme_colors } from "../../../../../theme/theme";
import api from "../../../../../services/api";

import { ModalAddEditFormPayment } from "../ModalAddEditFormPayment";

export const FormPayment = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formsPayments, setFormsPayments] = useState<FormPaymentsProps[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [formPaymentSelected, setFormPaymentSelected] =
    useState<FormPaymentsProps | null>(null);

  const getFormsPayments = async () => {
    try {
      setLoading(true);

      const responseFormsPayments = await api.get("deliveryPaymentForm");

      if (responseFormsPayments?.data) {
        const raw = responseFormsPayments.data?.response ?? responseFormsPayments.data?.data;
        setFormsPayments(Array.isArray(raw) ? raw : []);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data?.message ?? "Erro ao buscar formas de pagamento",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditFormPayment = (data: FormPaymentsProps) => {
    setOpenModal(true);
    setFormPaymentSelected(data);
  };

  const handleDeleteFormPayment = (idFormPayment: number) => {
    swal({
      title: "Deseja realmente deletar essa forma de pagamento?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        setLoading(true);
        api
          .delete(`deliveryPaymentForm/${idFormPayment}`)
          .then((response) => {
            if (response.status) {
              swal({
                title: "Forma de pagamento deletada com sucesso",
                icon: "success",
              });
              getFormsPayments();
            }
          })
          .catch((error: AxiosError) => {
            console.error(error);
            swal({
              title: error.response?.data?.message ?? "Erro ao deletar forma de pagamento",
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const columns: TableProps<FormPaymentsProps>["columns"] = [
    {
      title: "Descrição",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Tipo",
      key: "type",
      width: 300,
      render: (_, data) => {
        return <span>{data.payment_form_type?.description || "-"}</span>;
      },
    },
    {
      title: "Ações",
      key: "actions",
      align: "right",
      width: 50,
      ellipsis: true,
      render: (_, data) => {
        return (
          <ContentBtnActions>
            <Button
              onClick={() => handleEditFormPayment(data)}
              icon={<MdEdit style={{ color: theme_colors.primary_antd }} />}
            />
            <Button
              onClick={() => handleDeleteFormPayment(data.id)}
              icon={<FaTrash style={{ color: theme_colors.red_crismon }} />}
            />
          </ContentBtnActions>
        );
      },
    },
  ];

  useEffect(() => {
    getFormsPayments();
  }, []);

  return (
    <Container>
      <ContentHeader>
        <Button type="primary" onClick={() => setOpenModal(true)}>
          Adicionar forma de pagamento
        </Button>
      </ContentHeader>

      <Divider />

      <ContentTable>
        <Table
          columns={columns}
          dataSource={formsPayments}
          loading={loading}
          pagination={false}
          rowKey={(item) => item.id}
          locale={{
            emptyText: "Sem dados",
          }}
        />
      </ContentTable>

      <ModalAddEditFormPayment
        formPaymentSelected={formPaymentSelected}
        setFormPaymentSelected={setFormPaymentSelected}
        setVisible={setOpenModal}
        visible={openModal}
        getFormsPayments={getFormsPayments}
      />
    </Container>
  );
};
