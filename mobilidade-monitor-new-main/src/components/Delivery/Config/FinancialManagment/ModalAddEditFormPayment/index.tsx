import { Button, Input, Modal, Select } from "antd";
import swal from "sweetalert";
import { AxiosError } from "axios";

import { Container, ContentInput, Label } from "./styles";
import { useEffect, useState } from "react";
import api from "../../../../../services/api";

import { ListFormPaymentsProps } from "./types";

import { FormPaymentsProps } from "../FormPayment/types";

interface ModalAddEditFormPaymentProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  getFormsPayments: () => void;
  formPaymentSelected: FormPaymentsProps | null;
  setFormPaymentSelected: (data: FormPaymentsProps | null) => void;
}

export const ModalAddEditFormPayment = ({
  visible,
  setVisible,
  getFormsPayments,
  formPaymentSelected,
  setFormPaymentSelected,
}: ModalAddEditFormPaymentProps) => {
  const [loadingListFormPayment, setLoadingListFormPayment] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [listFormsPayments, setListFormsPayments] = useState<
    ListFormPaymentsProps[]
  >([]);

  const [description, setDescription] = useState<string>("");
  const [idFormPayment, setIdFormPayment] = useState<number | null>(null);

  const handleCloseModal = () => {
    setVisible(false);
    setDescription("");
    setIdFormPayment(null);
    setFormPaymentSelected(null);
  };

  const handleEditFormPayment = async () => {
    if (description.length <= 0 || idFormPayment === null) {
      swal({
        title: "Preencha os campos",
        icon: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const responseFormPayment = await api.put(
        `deliveryPaymentForm/${formPaymentSelected?.id}`,
        {
          name: description,
          paymentFormTypeId: String(idFormPayment),
        }
      );

      if (responseFormPayment.status) {
        swal({
          title: "Forma de pagamento editada com sucesso",
          icon: "success",
        });
        handleCloseModal();
        getFormsPayments();
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFormPayment = async () => {
    if (description.length <= 0 || idFormPayment === null) {
      swal({
        title: "Preencha os campos",
        icon: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const responseFormPayment = await api.post("deliveryPaymentForm", {
        name: description,
        paymentFormTypeId: String(idFormPayment),
      });

      if (responseFormPayment.status) {
        swal({
          title: "Forma de pagamento adicionada com sucesso",
          icon: "success",
        });
        handleCloseModal();
        getFormsPayments();
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFormPayments = async () => {
    try {
      setLoadingListFormPayment(true);
      const responseGetFormPayments = await api.get("paymentFormType");

      if (responseGetFormPayments?.data) {
        const raw = responseGetFormPayments.data?.response ?? responseGetFormPayments.data?.data;
        setListFormsPayments(Array.isArray(raw) ? raw : []);
      }
    } catch (error) {
      setListFormsPayments([]);
    } finally {
      setLoadingListFormPayment(false);
    }
  };

  useEffect(() => {
    getFormPayments();
  }, []);

  useEffect(() => {
    if (formPaymentSelected) {
      setDescription(formPaymentSelected?.name || "");
      setIdFormPayment(formPaymentSelected?.paymentFormTypeId ?? null);
    }
  }, [formPaymentSelected]);

  const optionsFormPaymentsFormated = (Array.isArray(listFormsPayments) ? listFormsPayments : []).map((value) => {
    return {
      value: value?.id,
      label: value?.description || "",
    };
  });

  return (
    <Modal
      title={
        formPaymentSelected
          ? "Editar forma de pagamento"
          : "Adicionar forma de pagamento"
      }
      open={visible}
      onCancel={handleCloseModal}
      footer={[
        <Button key={1} onClick={handleCloseModal}>
          Cancelar
        </Button>,
        <Button
          key={2}
          type="primary"
          loading={loading}
          onClick={
            formPaymentSelected ? handleEditFormPayment : handleAddFormPayment
          }
        >
          {formPaymentSelected ? "Editar" : "Adicionar"}
        </Button>,
      ]}
    >
      <Container>
        <ContentInput>
          <Label>Descrição</Label>
          <Input
            placeholder="Descrição"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </ContentInput>

        <ContentInput>
          <Label>Tipo de forma de pagamento</Label>
          <Select
            placeholder="Tipo de forma de pagamento"
            options={optionsFormPaymentsFormated}
            loading={loadingListFormPayment}
            onChange={(value) => setIdFormPayment(value)}
            value={idFormPayment}
          />
        </ContentInput>
      </Container>
    </Modal>
  );
};
