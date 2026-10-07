import { FC, ReactNode, useState } from "react";
import api from "../../../../services/api";
import { IoLogoWhatsapp } from "react-icons/io";
import {
  CardContainer,
  ListRacingContainer,
  ContentInformationsTrip,
  ContentFormPayment,
  FlexContainer,
  DetailsContainer,
  DropDetailsContainer,
  DropDetails,
  StartAndEndContainer,
  DateItem,
  CardLabel,
  StatusItem,
  ClientNameItem,
  ValueItem,
  SituationItem,
  PaymentItem,
  CanceledItem,
  UlRacing,
  LiRacing,
  IconArrow,
  LiArrow,
  ContentTrip,
  ContentReportCustomer,
  DescriptionTypeTrip,
  LinkWhatsapp,
  FlowItem,
} from "./styles";

interface TripsData {
  canceledBy: string;
  customerId: number;
  customerComment: string;
  customerName: string;
  date: string;
  driverId: number;
  idTrip: number;
  paymentForm: string;
  price: number;
  situation: string;
  status: string;
  tripReference: string;
  userId: number;
  phone?: string;
  flow?: "mobicity" | "ifood";
}

interface CardData {
  item: TripsData;
  isTypeSearch: "today" | "month" | "analysis";
  getStatusProps: (val: string) => ReactNode;
  driverOrCustomerProps: (val: string) => ReactNode;
}

interface WayInformationsProps {
  destinationAddress: string;
  originAddress: string;
  driverPhone: string;
  tripType: string;
  driverName: string;
}

const Card: FC<CardData> = ({
  item,
  getStatusProps,
  driverOrCustomerProps,
  isTypeSearch,
}) => {
  const [wayInformations, setWayInformations] =
    useState<WayInformationsProps>();
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [jutPreloadAfterOpenDetails, setJutPreloadAfterOpenDetails] =
    useState(false);

  const formatPhoneNumber = (phone?: string) => {
    if (!phone) return "";
    return phone.replace(/\D/g, "");
  };

  const speedmob = import.meta.env.ISSPEEDMOB;
  const nameApp = import.meta.env.PROJECT_NAME;

  const detailsTrip = (tripReference: string) => {
    if (jutPreloadAfterOpenDetails === false) {
      setLoadingAddresses(true);
      api.get(`trip/${tripReference}/way`).then((values) => {
        setWayInformations(values.data.response);
        setLoadingAddresses(false);
        setJutPreloadAfterOpenDetails(true);
      });
    }
  };

  return (
    <>
      <CardContainer key={item.userId}>
        <ListRacingContainer>
          <ContentInformationsTrip>
            <div>
              <DateItem>{new Date(item.date).toLocaleString()}</DateItem>
            </div>
            <FlexContainer>
              <CardLabel>Status:</CardLabel>
              <StatusItem>{getStatusProps(item.status)}</StatusItem>
            </FlexContainer>
            <FlexContainer>
              <CardLabel>Cliente:</CardLabel>
              <ClientNameItem>{item.customerName}</ClientNameItem>
            </FlexContainer>
            {item.flow && (
              <FlexContainer>
                <CardLabel>Tipo:</CardLabel>
                <FlowItem flow={item.flow}> {item.flow} </FlowItem>
              </FlexContainer>
            )}
            <div>
              <ValueItem>
                {item.price
                  ? item.price.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })
                  : ""}
              </ValueItem>
            </div>
          </ContentInformationsTrip>

          <ContentTrip>
            <ContentFormPayment>
              <FlexContainer>
                <SituationItem>{item.situation}</SituationItem>
              </FlexContainer>
              <FlexContainer>
                <CardLabel>Forma de pagamento:</CardLabel>
                <PaymentItem>{item.paymentForm}</PaymentItem>
              </FlexContainer>
              {item.canceledBy !== null ? (
                <FlexContainer>
                  <CardLabel>Cancelada pelo: </CardLabel>
                  <CanceledItem>
                    {driverOrCustomerProps(item.canceledBy)}
                  </CanceledItem>
                </FlexContainer>
              ) : (
                ""
              )}
              {speedmob === "false" ? (
                <FlexContainer>
                  <a
                    target="blank"
                    href={`/trip/list/details/${item.tripReference}`}
                  >
                    Ver detalhamento
                  </a>
                </FlexContainer>
              ) : (
                ""
              )}

              {item.status === "not_answered" && (
                <LinkWhatsapp
                  href={`https://wa.me/55${formatPhoneNumber(item.phone)
                    }?text=${encodeURIComponent(
                      `Olá, somos o suporte da ${nameApp}, gostaríamos de falar sobre sua *Corrida não atendida*`
                    )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IoLogoWhatsapp size={24} color="#25D366" />
                </LinkWhatsapp>
              )}
            </ContentFormPayment>

            {isTypeSearch === "analysis" &&
              item?.customerComment?.length > 0 && (
                <ContentReportCustomer color="red">
                  <h3>Viagem com Relato de cliente</h3>

                  <p>{item.customerComment}</p>
                </ContentReportCustomer>
              )}
          </ContentTrip>
        </ListRacingContainer>
        <DetailsContainer>
          <DropDetailsContainer
            onChange={() => {
              setJutPreloadAfterOpenDetails(false);
              detailsTrip(item.tripReference);
            }}
            bordered={false}
            key={item.tripReference}
          >
            <DropDetails header="Ver Endereços" key={item.tripReference}>
              {loadingAddresses ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>Carregando endereços...</div>
              ) : (
                wayInformations && (
                  <>
                    <DescriptionTypeTrip>{`Viagem no ${wayInformations?.tripType
                      } com ${!wayInformations?.driverName
                        ? "-"
                        : wayInformations.driverName
                      }`}</DescriptionTypeTrip>
                    <StartAndEndContainer>
                      <UlRacing>
                        <LiRacing>{wayInformations?.originAddress}</LiRacing>
                        <LiArrow>
                          <IconArrow />
                        </LiArrow>
                        <LiRacing>{wayInformations?.destinationAddress}</LiRacing>
                      </UlRacing>
                    </StartAndEndContainer>
                  </>
                )
              )}
            </DropDetails>
          </DropDetailsContainer>
        </DetailsContainer>
      </CardContainer>
    </>
  );
};
export default Card;
