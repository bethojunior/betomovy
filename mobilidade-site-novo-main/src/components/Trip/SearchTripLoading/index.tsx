import { Container } from "./styles";
import carAnimation from "../../../assets/animation/car-animation.json";
import loadingAnimation from "../../../assets/animation/loading-line.json";
import Lottie from "lottie-react";
import { useTripStore } from "../../../store/tripStore";
import { formatDate } from "../../../utils/DateFormat";
import { useState } from "react";
import { AxiosError } from "axios";
import LoadingBackdrop from "../../LoadingBackdrop";
import { useRouteStore } from "../../../store/routeStore";
import { useStorage } from "../../../utils/Storage";
import api from "../../../api/apiAxios";

export const SearchTripLoading = () => {
  const [loading, setLoading] = useState(false);
  const { trip, clearTrip, clearTripAccepted, clearPosition } = useTripStore();
  const { clearRoute } = useRouteStore();
  const { removeItem } = useStorage();

  const cancelTrip = async () => {
    try {
      setLoading(true);
      const payload = {
        stdObject: [
          {
            status: "canceled",
            userId: trip.customer.idUser,
            tripReference: trip.tripReference,
            dateEnd: formatDate(),
            cancellationReasonsId: null,
          },
        ],
      };

      const { data } = await api.post("Customer/CancelTrip", payload);

      if (data.message === "Viagem não foi atendida") {
        clearTrip();
        clearPosition();
        clearTripAccepted();
        clearRoute();
      }
      if (!data.status) return;

      removeItem("trip");
      removeItem("tripAccepted");

      clearTrip();
      clearPosition();
      clearTripAccepted();
      clearRoute();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(axiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoadingBackdrop loading={loading} />
      <div className="animation-container">
        <Lottie animationData={carAnimation} loop={true} />
        <div>
          <Lottie animationData={loadingAnimation} loop={true} />
        </div>
      </div>
      <div className="button-container">
        <button
          onClick={cancelTrip}
          className="button pointer"
          style={{ backgroundColor: "red" }}
        >
          <span className="bolder">CANCELAR</span>
        </button>
      </div>
    </Container>
  );
};
