import { FC, useEffect, useState } from "react";
import api from "../../../services/api";
import { FaTrash } from "react-icons/fa";
import swal from "sweetalert";
import Preload from "../../Utils/Preload";
import {
  ListContainer,
  CardList,
  ColumnCard,
  LabelCard,
  ItemCard,
  SocialRede,
  SocialButton,
  WhatsappIcon,
  MoneyButton,
  CashIcon,
  ButtonDeleteCancellationFee,
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

interface Listing {
  cancellationListProps: CancellationFeeData[];
  searchRequestProps: () => void;
  deleteFeeProps: (res: number) => void;
  searchRequest: (numberPage?: number | undefined) => void;
}

const CancellationList: FC<Listing> = ({
  cancellationListProps,
  searchRequestProps,
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

  useEffect(() => {
    api.get("config/whatsapp_message_driver").then((result) => {
      setWhatAsppMessage(result.data.response);
    });
  }, []);

  return (
    <>
      <Preload visible={loading} />
      <ListContainer>
        {cancellationListProps?.map((item: CancellationFeeData) => {
          return (
            <CardList key={item.id}>
              <ColumnCard>
                <LabelCard>Cliente:</LabelCard>
                <ItemCard>{item.userName}</ItemCard>
              </ColumnCard>
              <ColumnCard>
                <LabelCard>Coletor:</LabelCard>
                <ItemCard>{item.driverName}</ItemCard>
              </ColumnCard>
              <ColumnCard>
                <LabelCard>Data Cobrança:</LabelCard>
                <ItemCard>{item.date}</ItemCard>
              </ColumnCard>
              <ColumnCard>
                <LabelCard>Valor:</LabelCard>
                <ItemCard>
                  {item.feeValue.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </ItemCard>
              </ColumnCard>
              <ColumnCard>
                <LabelCard>Beneficiado:</LabelCard>
                <ItemCard>{item.driverPaidName}</ItemCard>
              </ColumnCard>
              <ColumnCard>
                <LabelCard>Data Recebimento:</LabelCard>
                <ItemCard>{item.paymentDate}</ItemCard>
              </ColumnCard>
              <SocialRede>
                <SocialButton
                  target="_blank"
                  href={`https://api.whatsapp.com/send?phone=55${item.driverPhone}&text=${whatsAppMessage}`}
                >
                  <WhatsappIcon />
                </SocialButton>
                <ButtonDeleteCancellationFee
                  onClick={() => handleDeleteCancellationFee(item.id)}
                >
                  <FaTrash size={20} color="#dc143c" />
                </ButtonDeleteCancellationFee>
                {item.status === "canceled" ? (
                  ""
                ) : (
                  <MoneyButton
                    onClick={() => {
                      deleteFeeProps(item.id);
                      searchRequestProps();
                    }}
                  >
                    <CashIcon />
                  </MoneyButton>
                )}
              </SocialRede>
            </CardList>
          );
        })}
      </ListContainer>
    </>
  );
};

export default CancellationList;
