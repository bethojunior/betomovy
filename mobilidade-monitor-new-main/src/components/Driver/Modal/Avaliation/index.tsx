import { useState, FC } from "react";
import { Button, Rate, Tooltip } from "antd";
import { AiOutlineArrowRight } from "react-icons/ai";
import {
  AvaliationGlobal,
  ContainerOfAvaliation,
  DataOfAvaliation,
  AvaliationItem,
  Content,
  AvaliationStarContainer,
  ContentButton,
  ButtonDetailsTrip,
} from "./styles";

interface DriverOfHistoric extends Array<RaceData> {}

interface RaceData {
  comment: string;
  created_at: string;
  driverName: string;
  idDriver: number;
  idUser: number;
  rating: number;
  tripReference: string;
  userName: string;
}

interface ModalProps {
  visibility: boolean;
  handleCloseModal: () => void;
  raceHistory: DriverOfHistoric;
  driverId: number;
  page: number;
  driverAvaliation: (idDriver: number, page?: number) => void;
  nextPageAvaliation: string;
}

const AvaliationModal: FC<ModalProps> = ({
  visibility,
  handleCloseModal,
  raceHistory,
  driverId,
  page,
  driverAvaliation,
  nextPageAvaliation,
}) => {

  const [loadingMore, setLoadingMore] = useState(false);

  return (
    <Content
      title="Histórico de notas"
      visible={visibility}
      width={500}
      onCancel={handleCloseModal}
      footer={[
        <Button key="back" onClick={handleCloseModal}>
          Fechar
        </Button>,
      ]}
    >
      <AvaliationGlobal>
        {raceHistory?.map((item) => {
          return (
            <ContainerOfAvaliation key={item.idDriver}>
              <DataOfAvaliation>
                <AvaliationItem style={{ fontSize: "14px", fontWeight: "bold" }}>{item.userName}</AvaliationItem>
                <AvaliationItem>
                  {item.comment ? `Comentario: ${item.comment}` : ""}
                </AvaliationItem>
                <AvaliationItem style={{ fontSize: "14px" }}>
                  Data: {new Date(item.created_at).toLocaleDateString()}
                </AvaliationItem>
              </DataOfAvaliation>
              <AvaliationStarContainer>
                <Rate disabled defaultValue={item.rating} style={{ whiteSpace: "nowrap" }} />
                <Tooltip placement="left" title="Mais detalhes sobre a corrida">
                  <ButtonDetailsTrip
                    href={`/trip/list/details/${item.tripReference}`}
                    target="_blank"
                  >
                    <AiOutlineArrowRight
                      style={{
                        fontSize: 20,
                        color: "#666666",
                        marginTop: 3,
                      }}
                    />
                  </ButtonDetailsTrip>
                </Tooltip>
              </AvaliationStarContainer>
            </ContainerOfAvaliation>
          );
        })}
        {nextPageAvaliation !== "" && nextPageAvaliation !== null && (
          <ContentButton>
            <Button
              type="primary"
              loading={loadingMore}
              onClick={ async () => {
                setLoadingMore(true);
                await driverAvaliation(driverId, page + 1)
                setTimeout(() => setLoadingMore(false), 4000);
              }}
            >
              Mostrar mais
            </Button>
          </ContentButton>
        )}
      </AvaliationGlobal>
    </Content>
  );
};

export default AvaliationModal;
