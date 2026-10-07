import { Header } from "../../../components/Trip/Header";
import { MapTrip } from "../../../components/Trip/MapTrip/index";
import { Container, SearchContainer } from "./styles";
import { LeftContainer } from "../../../components/Trip/LeftContainer";
import { useEffect } from "react";
import { InitFirebaseConfig } from "../../../config/firebase";
import api from "../../../api/apiAxios";
import { useStorage } from "../../../utils/Storage";
import { useTripStore } from "../../../store/tripStore";
import { AxiosError } from "axios";
import { usePaymentFormStore } from "../../../store/paymentFormStore";
import { getTrips } from "../../../collections/firebase/TripRealtime";
import swal from "sweetalert";
import { totem } from "../../../utils/Totem";
import { useSliceAnimationStore } from "../../../store/sliceAnimationStore";

export const HomeTrip = () => {
  const {
    setTrip,
    setPosition,
    setTripAccepted,
    clearTrip,
    clearTripAccepted,
  } = useTripStore();
  const { setPaymentForm } = usePaymentFormStore();
  const { getItem, removeItem, setItem } = useStorage();

  const getLocalData = () => {
    const trip = getItem("trip");
    const tripAccepted = getItem("tripAccepted");
    if (trip && trip.length > 0) {
      setTrip(JSON.parse(trip));
    }
    if (tripAccepted && tripAccepted.length > 0) {
      setPosition([0, 0]);
      setTripAccepted(JSON.parse(tripAccepted));
    }
  };

  const initFarebase = async () => {
    const responseConfigFirestore = await api.post("Support/GetConfig", {
      configKey: "firebase_cloud_firestore_key",
    });

    if (responseConfigFirestore.status) {
      const configFirestore: FirestoreProps | undefined = JSON.parse(
        responseConfigFirestore.data.data
      );
      InitFirebaseConfig(configFirestore);
    }
  };

  const getPaymentForm = async () => {
    try {
      const { data } = await api.post("TripPaymentForm/GetAll");
      if (!data.status) return;
      setPaymentForm(data.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(axiosError);
    }
  };

  const checkTrip = async () => {
    if (!totem) {
      try {
        const result = await api.get("Partner/GetActiveTrips");
        const { data } = result.data;
        if (data && data.length > 0) {
          const tripActive = data[0];
          const tripLocal: any = getItem("trip");
          if (
            tripLocal &&
            JSON.parse(tripLocal).tripReference === tripActive.tripReference
          )
            return;

          getTrips(tripActive.tripReference, (type: string, trip: any) => {
            if (type === "removed") {
              removeItem("trip");
              removeItem("tripAccepted");
            }

            if (type === "added" || type === "modified") {
              setTrip(trip);
              setTripAccepted(trip);
              setItem("tripAccepted", JSON.stringify(trip));
              setItem("trip", JSON.stringify(trip));
            }
          });
        } else {
          removeItem("trip");
          removeItem("tripAccepted");
          clearTrip();
          clearTripAccepted();
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError.request);
      }
    }
  };

  useEffect(() => {
    getPaymentForm();
    getLocalData();
    initFarebase();
    checkTrip();
  }, []);

  return (
    <Container>
      <div className="body">
        <Header />
        <div className="colors-cont">
          <SearchContainer width={"40em"}>
            <LeftContainer />
          </SearchContainer>
          <div className="red-cont">
            <MapTrip />
          </div>
        </div>
      </div>
    </Container>
  );
};
