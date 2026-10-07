import { useState, useEffect } from "react";
import { Table, Button as ButtonAnd } from "antd";
import { FaTrash } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import swal from "sweetalert";
import api from "../../../../services/api";

import { Container, ContentTable, ContentButtonsAction } from "./style";

import Alert from "../../../../components/Utils/Alert";
      
import ModalMethodsPayments from "../../../../components/Advanced/Config/MethodsPayments";

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

type TypesMessageAlertProps = "success" | "info" | "warning" | "error";

const MethodsPayments = () => {
  const [datasTripPayments, setDatasTripPayments] = useState<
    TripPaymentsFormProps[]
  >([]);
  const [datasTypePayments, setDatasTypePayments] = useState<
    PaymentsTypeProps[]
  >([]);
   
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [messageAlert, setMessageAlert] = useState<string>("");
  const [typeMessageAlert, setTypeMessageAlert] =
    useState<TypesMessageAlertProps>("success");
  const [showMessageAlert, setShowMessageAlert] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [dataModal, setDataModal] = useState<TripPaymentsFormProps | null>();

  const handleShowMessageAlert = (
    message: string,
    typeMessage: TypesMessageAlertProps
  ) => {
    setMessageAlert(message);
    setTypeMessageAlert(typeMessage);
    setShowMessageAlert(true);
  };

  const handleGetDatas = async () => {
    try {
      setLoadingTable(true);
      const [responseTripPayment, responseTypePayment] = await Promise.all([
        api.get("/tripPaymentForm"),
        api.get("/paymentFormType"),
      ]);
      setDatasTripPayments(responseTripPayment.data.response);
      setDatasTypePayments(responseTypePayment.data.response);
    } catch (error) {
      console.error("Erro ao buscar dados de formas de pagamento:", error);
      handleShowMessageAlert("Erro ao buscar dados de formas de pagamento!", "error");
    } finally {
      setLoadingTable(false);
    }
  };

  const handleDeleteMethodPayment = (dataMethod: TripPaymentsFormProps) => {
    const { idTripPaymentForm } = dataMethod;

    swal({
      title: "Deseja remover essa forma de pagamento?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isRemoved) => {
      if (isRemoved) {
        setLoadingTable(true);
        api
          .delete(`tripPaymentForm/${idTripPaymentForm}`)
          .then((response) => {
            setLoadingTable(false);
            if (response.data.status) {
              handleShowMessageAlert(
                "Tipo de pagamento deletado com sucesso!",
                "success"
              );
              setDatasTripPayments(
                datasTripPayments.filter(
                  (data) => data.idTripPaymentForm !== idTripPaymentForm
                )
              );
            }
          })
          .catch((error) => {
            console.log(error);
            setLoadingTable(false);
            handleShowMessageAlert(
              "Erro ao deletar forma de pagamento!",
              "error"
            );
          });
      }
    });
  };

  const handleOpenModalEdit = (dataMethod: TripPaymentsFormProps) => {
    setShowModal(true);
    setDataModal(dataMethod);
  };

  const colums = [
    {
      title: "Descrição",
      dataIndex: "name",
      key: "description",
      width: 150,
    },
    {
      title: "Tipo",
      dataIndex: ["payment_form_type", "description"],
      key: "type",
      width: 300,
    },
    {
      title: "Ações",
      key: "actions",
      width: 100,
      ellipsis: true,
      render: (_: any, dataRecord: TripPaymentsFormProps) => (
        <ContentButtonsAction>
          <ButtonAnd
            type="link"
            style={{
              color: "#1E90FF",
            }}
            icon={<FiEdit />}
            onClick={() => handleOpenModalEdit(dataRecord)}
          />

          <ButtonAnd
            type="link"
            style={{
              color: "#DC143C",
            }}
            icon={<FaTrash />}
            onClick={() => handleDeleteMethodPayment(dataRecord)}
          />
        </ContentButtonsAction>
      ),
    },
  ];

  useEffect(() => {
    handleGetDatas();
  }, []);

  return (
    <Container>
      <Alert
        typeAlert={typeMessageAlert}
        message={messageAlert}
        setVisibility={setShowMessageAlert}
        visibility={showMessageAlert}
      />
      <ButtonAnd type="primary" onClick={() => setShowModal(true)}>
        Adicionar Nova Forma de Pagamento
      </ButtonAnd>

      <ModalMethodsPayments
        getDatas={handleGetDatas}
        setDataModal={setDataModal}
        messageAlert={handleShowMessageAlert}
        setLoading={setLoadingTable}
        loading={loadingTable}
        formPayments={datasTypePayments}
        showModal={showModal}
        setShowModal={setShowModal}
        data={dataModal}
      />

      <ContentTable>
        <Table
          columns={colums}
          dataSource={datasTripPayments}
          pagination={false}
          loading={loadingTable}
        />
      </ContentTable>
    </Container>
  );
};

export default MethodsPayments;
