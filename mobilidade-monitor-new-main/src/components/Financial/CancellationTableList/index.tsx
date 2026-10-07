import { Space } from "antd";
import type { TableProps } from "antd";
import { FC, useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import Preload from "../../Utils/Preload";
import swal from "sweetalert";

import api from "../../../services/api";
import {
  BodyTable,
  TableContainer,
  TableList,
  TableButtonsContainer,
  LeftButton,
  RightButton,
  SocialButton,
  WhatsappIcon,
  MoneyButton,
  CashIcon,
  ButtonDeleteCancellationFee,
  ContentButtons,
} from "./styles";

interface CancellationFeeData {
  cityId: number;
  cityName: string;
  created_at: string;
  date: string;
  driverEmail: string;
  driverName: string;
  driverPaidName: string;
  driverPhone: string;
  driverUserId: number;
  driverUserType: string;
  endDate: string;
  feeValue: number;
  id: number;
  idDriver: number;
  idDriverPaid: number;
  idUser: number;
  paid_tripReference: string;
  paymentDate: string;
  paymentForm: string;
  price: number;
  status: string;
  statusId: number;
  tripCallType: string;
  tripCancellationFeeType: number;
  tripCancellationFeeTypeCreatedAt: string;
  tripCancellationFeeTypeDescription: string;
  tripCancellationFeeTypeId: number;
  tripCancellationFeeTypeName: string;
  tripCancellationFeeTypeUpdatedAt: string;
  tripReference: string;
  tripType: string;
  userEmail: string;
  userName: string;
  userPhone: string;
}

interface TableInterface {
  cancellationListDataProps: CancellationFeeData[];
  handlePaginationProps: () => void;
  currentPageProps: number;
  previesPageProps: () => void;
  lastPageProps: number;
  showTableButtonsProps: boolean;
  deleteFeeProps: (res: number) => void;
  searchRequest: (numberPage?: number | undefined) => void;
}

const CancellationTableList: FC<TableInterface> = ({
  cancellationListDataProps,
  handlePaginationProps,
  currentPageProps,
  previesPageProps,
  lastPageProps,
  showTableButtonsProps,
  deleteFeeProps,
  searchRequest,
}) => {
  const [whatsAppMessage, setWhatAsppMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleDeleteCancellationFee = async (id: number) => {
    swal({
      icon: "info",
      title: "Deseja mesmo deletar essa taxa?",
      text: "Essa ação é permanente",
      buttons: ["Não", "Sim"],
    }).then((accepted) => {
      if (accepted) {
        setLoading(true);
        api
          .delete(`trip/cancellationFee/${id}`)
          .then((response) => {
            setLoading(false);
            if (response.data) {
              swal({
                title: "Taxa excluida com sucesso",
                icon: "success",
              });
              searchRequest();
            }
          })
          .catch((error) => {
            setLoading(false);
            console.log(error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  const columns: TableProps<CancellationFeeData>["columns"] = [
    {
      title: "Cliente",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Motorista Coletor",
      dataIndex: "driverPaidName",
      key: "driverPaidName",
    },
    {
      title: "Data Cobrança",
      key: "date",
      render: (_, data) => {
        return <span>{new Date(data.date).toLocaleString()}</span>;
      },
    },
    {
      title: "Valor R$",
      key: "feeValue",
      render: (_, data) => {
        return (
          <span>
            {data.feeValue.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        );
      },
    },
    {
      title: "Motorista Beneficiado",
      dataIndex: "driverName",
      key: "driverName",
    },
    {
      title: "Data Recebimento",
      key: "paymentDate",
      render: (_, data) => {
        return <span>{new Date(data.paymentDate).toLocaleString()}</span>;
      },
    },
    {
      title: "Data de Criação",
      key: "created_at",
      render: (_, data) => {
        return <span>{new Date(data.created_at).toLocaleString()}</span>;
      },
    },
    {
      render: (items: CancellationFeeData) => (
        <Space size="middle">
          <ContentButtons>
            <SocialButton
              target="_blank"
              href={`https://api.whatsapp.com/send?phone=55${items.driverPhone}&text=${whatsAppMessage}`}
            >
              <WhatsappIcon />
            </SocialButton>
            <ButtonDeleteCancellationFee
              onClick={() => handleDeleteCancellationFee(items.id)}
            >
              <FaTrash size={20} color="#dc143c" />
            </ButtonDeleteCancellationFee>
            {items.status === "canceled" ? (
              ""
            ) : (
              <MoneyButton
                onClick={() => {
                  deleteFeeProps(items.id);
                }}
              >
                <CashIcon />
              </MoneyButton>
            )}
          </ContentButtons>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    api.get("config/whatsapp_message_driver").then((result) => {
      const { response } = result.request;
      if (!JSON.parse(response).status) {
        return "";
      }
      return setWhatAsppMessage(result.data.response);
    });
  }, []);

  return (
    <>
      <Preload visible={loading} />
      <BodyTable>
        {showTableButtonsProps === false ? (
          ""
        ) : (
          <TableContainer>
            <TableList
              columns={columns as any}
              dataSource={cancellationListDataProps}
              size="small"
            />

            <TableButtonsContainer>
              <LeftButton
                disabled={currentPageProps === 1}
                onClick={previesPageProps}
              >
                <FiArrowLeft />
              </LeftButton>
              <RightButton
                disabled={currentPageProps === lastPageProps}
                onClick={handlePaginationProps}
              >
                <FiArrowRight />
              </RightButton>
            </TableButtonsContainer>
          </TableContainer>
        )}
      </BodyTable>
    </>
  );
};

export default CancellationTableList;
