import { Modal, Button, Input, Select } from "antd";
import { useState, useEffect } from "react";
import { MessageObservation } from "./style";
import api from "../../../../services/api";
import swal from "sweetalert";

/* eslint-disable */

type TypesMessageAlertProps = "success" | "info" | "warning" | "error";

interface PaymentsTypeProps {
  description: string;
  id: number;
  isGeneral: number;
  name: string;
  showable: number;
}

interface TripPaymentsFormProps {
  active: number | boolean;
  idTripPaymentForm: number;
  name: string;
  payment_form_type: PaymentsTypeProps;
}

interface ModalMethodsPaymentsProps {
  showModal: boolean;
  setShowModal: (data: boolean) => void;
  data?: TripPaymentsFormProps | null;
  setDataModal: (data: TripPaymentsFormProps | null) => void;
  formPayments: PaymentsTypeProps[];
  loading: boolean;
  setLoading: (data: boolean) => void;
  messageAlert: (message: string, typeMessage: TypesMessageAlertProps) => void;
  getDatas: () => void;
}

const ModalMethodsPayments = ({
  showModal,
  setShowModal,
  data,
  formPayments,
  setLoading,
  messageAlert,
  setDataModal,
  getDatas,
}: ModalMethodsPaymentsProps) => {
  const [DescriptionPayment, setDescriptionPayment] = useState<string>("");
  const [TypePayments, setTypePayments] = useState<string>("");

  useEffect(() => {
    if (showModal) {
      if (data) {
        setDescriptionPayment(data.name || "");
        const typeId =
          data.payment_form_type?.id || (data as any).paymentFormTypeId;
        setTypePayments(typeId ? String(typeId) : "");
      } else {
        setDescriptionPayment("");
        setTypePayments("");
      }
    }
  }, [showModal, data]);

  const handleEditFormPayment = (datas: TripPaymentsFormProps) => {
    const nameToSend = DescriptionPayment.trim() || datas.name;
    const typeToSend =
      TypePayments ||
      datas.payment_form_type?.id ||
      (datas as any).paymentFormTypeId;

    if (!nameToSend) {
      swal({
        title: "Aviso",
        text: "Por favor, digite a descrição da forma de pagamento.",
        icon: "warning",
      });
      return;
    }

    if (!typeToSend) {
      swal({
        title: "Aviso",
        text: "Escolha o tipo de pagamento.",
        icon: "warning",
      });
      return;
    }

    const { idTripPaymentForm } = datas;
    setLoading(true);
    api
      .put(`/tripPaymentForm/${idTripPaymentForm}`, {
        name: nameToSend,
        paymentFormTypeId: Number(typeToSend),
      })
      .then((response) => {
        setLoading(false);
        if (response.data.status || response.status === 200) {
          messageAlert("Forma de pagamento editada com sucesso!", "success");
          handleCloseModal();
          getDatas();
        } else {
          messageAlert(
            response.data.message || "Erro ao editar forma de pagamento!",
            "error"
          );
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        const errorMsg =
          error?.response?.data?.message || "Erro ao editar forma de pagamento!";
        messageAlert(errorMsg, "error");
      });
  };

  const handleCreateFormPayment = () => {
    if (!DescriptionPayment.trim()) {
      swal({
        title: "Aviso",
        text: "Por favor, digite a descrição da forma de pagamento.",
        icon: "warning",
      });
      return;
    }

    if (!TypePayments) {
      swal({
        title: "Aviso",
        text: "Por favor, escolha o tipo de pagamento.",
        icon: "warning",
      });
      return;
    }

    setLoading(true);

    api
      .post("/tripPaymentForm", {
        name: DescriptionPayment.trim(),
        paymentFormTypeId: Number(TypePayments),
      })
      .then((response) => {
        setLoading(false);
        if (
          response.data.status ||
          response.status === 200 ||
          response.status === 201
        ) {
          messageAlert("Forma de pagamento criada com sucesso!", "success");
          handleCloseModal();
          getDatas();
        } else {
          messageAlert(
            response.data.message || "Erro ao criar forma de pagamento!",
            "error"
          );
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        const errorMsg =
          error?.response?.data?.message || "Erro ao criar forma de pagamento!";
        messageAlert(errorMsg, "error");
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDataModal(null);
    setDescriptionPayment("");
    setTypePayments("");
  };

  const formPaymentsFormated = (formPayments || []).map((value) => {
    return {
      value: Number(value.id),
      label: value.name,
    };
  });

  return (
    <Modal
      title={
        data ? "Editar Método de pagamento" : "Adicionar Método de Pagamento"
      }
      open={showModal}
      onOk={handleCloseModal}
      onCancel={handleCloseModal}
      footer={[
        <Button onClick={handleCloseModal} key="cancel">
          Cancelar
        </Button>,
        data ? (
          <Button
            type="primary"
            onClick={() => handleEditFormPayment(data)}
            key="edit"
          >
            Editar
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={handleCreateFormPayment}
            key="create"
          >
            Cadastrar
          </Button>
        ),
      ]}
    >
      <Input
        value={DescriptionPayment}
        placeholder="Descrição"
        onChange={(event) => setDescriptionPayment(event.target.value)}
      />
      <MessageObservation>
        Descrição de como a forma de pagamento irá aparecer no aplicativo
      </MessageObservation>

      <Select
        style={{
          width: "100%",
          marginTop: 10,
        }}
        placeholder="Escolha a forma de pagamento"
        value={TypePayments ? Number(TypePayments) : undefined}
        onChange={(value) => setTypePayments(String(value))}
        options={formPaymentsFormated}
      />
    </Modal>
  );
};

export default ModalMethodsPayments;
