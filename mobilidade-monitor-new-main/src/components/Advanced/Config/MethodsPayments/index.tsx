import { Modal, Button, Input, Select } from "antd";
import { useState } from "react";
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

  const handleEditFormPayment = (datas: TripPaymentsFormProps) => {
    if (TypePayments.length <= 0) {
      swal({
        title: "Escolha o tipo de pagamento",
        icon: "warning",
      });
      return;
    }

    const { idTripPaymentForm } = datas;
    setLoading(true);
    api
      .put(`/tripPaymentForm/${idTripPaymentForm}`, {
        name: DescriptionPayment,
        paymentFormTypeId: TypePayments,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.status) {
          messageAlert("Forma de pagamento editada com sucesso!", "success");
          setShowModal(false);
          getDatas();
          setTypePayments("");
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        messageAlert("Erro ao editar forma de pagamento!", "error");
        setShowModal(false);
      });
  };

  const handleCreateFormPayment = () => {
    setLoading(true);

    api
      .post("/tripPaymentForm", {
        name: DescriptionPayment,
        paymentFormTypeId: TypePayments,
      })
      .then((response) => {
        setLoading(false);
        if (response.data.status) {
          messageAlert("Forma de pagamento criada com sucesso!", "success");
          setShowModal(false);
          setLoading(false);
          getDatas();
        }
      })
      .catch((error) => {
        console.log(error);
        messageAlert("Erro ao criar forma de pagmento!", "error");
        setShowModal(false);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDataModal(null);
  };

  const formPaymentsFormated = formPayments.map((value) => {
    return {
      value: value.id,
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
        <Button onClick={handleCloseModal}>Cancelar</Button>,
        data ? (
          <Button type="primary" onClick={() => handleEditFormPayment(data)}>
            Editar
          </Button>
        ) : (
          <Button type="primary" onClick={handleCreateFormPayment}>
            Cadastrar
          </Button>
        ),
      ]}
    >
      <Input
        defaultValue={data ? data.name : ""}
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
        onChange={(value) => setTypePayments(String(value))}
        options={formPaymentsFormated}
      />
    </Modal>
  );
};

export default ModalMethodsPayments;
