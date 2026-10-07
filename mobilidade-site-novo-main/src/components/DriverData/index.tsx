import { FaStar } from "react-icons/fa";
import { CharLimited } from "../../utils/CharLimited";
import { Container } from "./styles";
import { useEffect, useState } from "react";
import { getTrips } from "../../collections/firebase/TripRealtime";
import { AxiosError } from "axios";
import { useTripStore } from "../../store/tripStore";
import swal from "sweetalert";
import { IoChatboxEllipses } from "react-icons/io5";
import { formatDate } from "../../utils/DateFormat";
import { useRouteStore } from "../../store/routeStore";
import LoadingBackdrop from "../LoadingBackdrop";
import { useStorage } from "../../utils/Storage";
import Mask from "../../utils/Masks";
import { ProgressBar } from "../Trip/ProgressBar";
import { Chat } from "../Trip/Chat";
import { ChatRealtime } from "../../collections/service/chatRealtime";
import { MessageProps } from "../Trip/Chat/types";
import api from "../../api/apiAxios";

export const DriverData = () => {
  const {
    setTripAccepted,
    tripAccepted,
    trip,
    clearPosition,
    clearTripAccepted,
    clearTrip,
  } = useTripStore();
  const { clearRoute } = useRouteStore();
  const { setItem, removeItem } = useStorage();

  const getKeyFirestore = async () => {
    if (Object.keys(trip).length > 0) {
      try {
        getTrips(trip.tripReference as string, (type: string, trip: any) => {
          if (type === "added" || type === "modified") {
            setTripAccepted(trip);
            setItem("tripAccepted", JSON.stringify(trip));
          }

          if (type === "removed") {
            removeItem("tripAccepted");
            removeItem("trip");

            clearPosition();
            clearTripAccepted();
            clearTrip();
            clearRoute();
          }
        });
      } catch (error) {
        const responseError = error as AxiosError<any, any>;
        swal({
          title: responseError.response?.data.message,
          icon: "error",
        });
      }
    }
  };

  useEffect(() => {
    getKeyFirestore();
  }, []);

  return (
    <Container>
      {Object.keys(tripAccepted).length > 0 && (
        <ProgressTrip tripAccepted={tripAccepted} />
      )}
    </Container>
  );
};

const ProgressTrip = ({ tripAccepted }: any) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<MessageProps[]>([]);

  const { clearTrip, clearPosition, clearTripAccepted } = useTripStore();
  const { clearRoute } = useRouteStore();
  const { removeItem } = useStorage();
  const { getCurrentMessages } = ChatRealtime();

  const clearData = () => {
    clearTrip();
    clearPosition();
    clearTripAccepted();
    clearRoute();
  };

  const cancelTrip = async () => {
    try {
      const payload = {
        stdObject: [
          {
            status: "canceled",
            userId: tripAccepted.customer.idUser,
            tripReference: tripAccepted.tripReference,
            dateEnd: formatDate(),
            cancellationReasonsId: null,
          },
        ],
      };
      setLoading(true);
      const { data } = await api.post("Customer/CancelTrip", payload);

      if (data.message === "Viagem não foi atendida") {
        clearData();
      }
      if (!data.status) return;

      removeItem("trip");
      removeItem("tripAccepted");

      clearData();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(axiosError);
    } finally {
      setLoading(false);
    }
  };

  const statusCase = (status: string) => {
    switch (status) {
      case "pre_accepted":
        return "O motorista está finalizando outra viagem e irá buscá-lo em seguida";
      case "accepted":
        return "Seu motorista vai chegar em breve";
      case "boarding":
        return "Seu carro está te aguardando";
      case "in_progress":
        return "Você está no percurso do seu destino";
      case "scheduled":
        return "Aguardando o horário da viagem agendada iniciar";
      default:
        return "";
    }
  };

  const handleChatMessageFirebase = () => {
    setTimeout(() => {
      getCurrentMessages(
        tripAccepted.tripReference,
        (type: string, currentMessages: any) => {
          if (type === "added" && currentMessages?.message?.length > 0) {
            setMessages((prev) => [
              ...prev,
              {
                message: currentMessages.message,
                userId: Number(currentMessages.userId),
              },
            ]);
          }
        }
      );
    }, 1000 * 3);
  };

  useEffect(() => {
    if (tripAccepted.status !== "boarding") {
      removeItem("startedCounting");
    }
    if (tripAccepted.status === "boarding") {
      swal({
        title: "Seu motorista já está à sua espera.",
        icon: "warning",
      });
    }
  }, [tripAccepted]);

  useEffect(() => {
    if (Object.keys(tripAccepted).length > 0 && tripAccepted.tripReference) {
      handleChatMessageFirebase();
    }
  }, []);

  return (
    <>
      <LoadingBackdrop loading={loading} />
      <div className="driverDataContainer">
        <div className="chat-container">
          <IoChatboxEllipses
            onClick={() => setOpen(true)}
            className="pointer"
            fontSize={30}
          />
        </div>
        <div className="trip-status">
          <span className="status-title bolder">
            {statusCase(tripAccepted?.status)}
          </span>
        </div>
        <section className="content-travel">
          <div className="content-icons-origin-and-destiny">
            <div className="ball"></div>
            <div className="retangule"></div>
            <div className="squad"></div>
          </div>

          <div className="content-addresses">
            <span className="origin-address">
              <small>Local de origem</small>
              {CharLimited(tripAccepted?.origin.address, 84)}
            </span>
            <span className="destiny-address">
              <small>Local de destino</small>
              {CharLimited(tripAccepted?.destination.name, 84)}
            </span>
          </div>
        </section>

        <section>
          <div className="container-driver">
            <div className="content-informations-driver">
              <div className="content-driver-photo">
                <img
                  src={
                    tripAccepted?.driver
                      ? `${window.env.REACT_APP_BUCKET_URL}driver/profile/${tripAccepted?.driver?.profileImage}`
                      : require("../../assets/img/driver-not-found.jpg")
                  }
                  alt="photo-driver"
                />
              </div>

              {tripAccepted?.driver && (
                <div className="information-driver">
                  <h4 className="plate-car">
                    {tripAccepted?.driver?.car?.plate}
                  </h4>
                  <span className="name-car">
                    {`${tripAccepted?.driver?.car?.brand} ${tripAccepted?.driver?.car?.model} - ${tripAccepted?.driver?.car?.color}`}
                  </span>
                </div>
              )}
            </div>
            {tripAccepted?.driver && (
              <span className="name-driver">
                {tripAccepted?.driver?.name} -{" "}
                {tripAccepted &&
                  parseFloat(tripAccepted?.driver?.rating).toFixed(1)}{" "}
                <FaStar />
              </span>
            )}
          </div>
        </section>
        <div className="diviser" />
        <div className="price-container">
          <span className="price-title">
            {tripAccepted.tripPaymentForm.toUpperCase()}
          </span>
          <span className="bolder price">
            R$ {Mask.setMoneyMask(tripAccepted?.price || "0")}
          </span>
        </div>
      </div>
      {tripAccepted?.status === "boarding" ? <ProgressBar /> : <></>}
      {tripAccepted?.status === "accepted" ||
      tripAccepted?.status === "pre_accepted" ||
      tripAccepted?.status === "boarding" ? (
        <div className="button-container">
          <button
            onClick={cancelTrip}
            className="button pointer"
            style={{ backgroundColor: "red" }}
          >
            <span className="bolder">CANCELAR</span>
          </button>
        </div>
      ) : (
        <></>
      )}
      <Chat
        open={open}
        close={() => setOpen(false)}
        trip={tripAccepted}
        messages={messages}
      />
    </>
  );
};
