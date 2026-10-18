import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Passenger from "../pages/Passenger";
import Driver from "../pages/Driver";
import { TravelTracking } from "../pages/TravelTracking";
import NotFound from "../pages/NotFound";
import Audit from "../pages/Audit";
import api from "../api/apiAxios";
import { Login } from "../pages/Trip/Login";
import { useAuthStore } from "../store/authStore";
import { HomeTrip } from "../pages/Trip/Home";
import swal from "sweetalert";
import { useStorage } from "../utils/Storage";
import Home from "../pages/Home";
import Share from "../pages/Share";
import Privacy from "../pages/Privacy";
import DriverExemptionRequest from "../pages/DriverExemptionRequest";

const RoutesApplication = () => {
  const { authenticated, setAuthenticated } = useAuthStore();
  const { setDevicePosition } = useAuthStore();
  const { removeItem } = useStorage();

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        swal({
          title: "Sua sessão expirou. Por favor, faça login novamente",
          icon: "warning",
        }).then(() => {
          removeItem("user");
          setAuthenticated(false);
        });
      }

      return Promise.reject(error);
    }
  );

  const getLocation = () => {
    if (
      window.location.pathname.includes("/passageiro") ||
      window.location.pathname.includes("/motorista")
    ) {
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDevicePosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Aviso ao obter a localização:", error.message);
        },
        { timeout: 5000, maximumAge: 60000, enableHighAccuracy: false }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/audit" element={<Audit />} />
      <Route path="/trip" element={authenticated ? <HomeTrip /> : <Login />} />
      <Route path="/passageiro" element={<Passenger />} />
      <Route path="/passageiro/preregister" element={<Passenger />} />
      <Route path="/passageiro/preregister/:userId" element={<Passenger />} />
      <Route path="/motorista/signUp/:whoIndicatedId" element={<Driver />} />
      <Route path="/motorista" element={<Driver />} />
      <Route path="/motorista/indicacao/:whoIndicatedId" element={<DriverExemptionRequest />} />
      <Route
        path="/acompanhamento-de-viagem/:id"
        element={<TravelTracking />}
      />
      <Route path="/trip/:id/share" element={<TravelTracking onlyTracking />} />
      <Route path="/share" element={<Share />} />
      <Route path="/privacidade" element={<Privacy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesApplication;
