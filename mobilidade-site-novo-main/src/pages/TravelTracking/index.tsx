import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import swal from "sweetalert";
import { AxiosError } from "axios";
import { FaStar } from "react-icons/fa";
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
} from "react-icons/io";

import { ModalTripEnded } from "../../components/ModalTripEnded";
import { MapTracking } from "../../components/MapTracking";

import { InitFirebaseConfig } from "../../config/firebase";

import api from "../../api/apiAxios";

import { CharLimited } from "../../utils/CharLimited";

import { getTrips } from "../../collections/firebase/TripRealtime";

import { getPathImageDefault, LogoMovyDefault } from "../../config/configApp";

import { ShareTripDriverCard } from "./share-trip-driver-card";
import { ShareTripOverlay } from "./share-trip-overlay";
import { Container } from "./styles";

document.title = "Acompanhamento de Viagem";

export const TravelTracking = ({
  onlyTracking,
}: {
  onlyTracking?: boolean;
}) => {
  const [tripInformations, setTripInformations] = useState<TripProps | null>(
    null
  );
  const [urlRegisterApp, setUrlRegisterApp] = useState<string | null>(null);
  const [configTrip, setConfigTrip] = useState<ConfigTripProps | null>(null);
  const [tripNotExists, setTripNotExists] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(true);

  const { id } = useParams();

  const handleRecallModalInformations = () => {
    setShowModal(!showModal);
  };

  const getCoordinates = async (lat: number, lng: number) => {
    try {
      const responseCoordinates = await api.post(`City/GetConfig`, {
        lat,
        lng,
      });

      if (responseCoordinates.status) {
        setConfigTrip(responseCoordinates.data.data);
      }
    } catch (error) {
      const responseError = error as AxiosError<any, any>;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    }
  };

  const getInformationsTrip = async () => {
    try {
      const responseInformationsTrip = await api.post("Trip/Share", {
        tripReference: id,
      });

      if (responseInformationsTrip.status) {
        if (responseInformationsTrip.data.message === "VIAGEM NÃO ENCONTRADA") {
          swal({
            title: responseInformationsTrip.data.message,
            icon: "error",
          });
          setTripNotExists(true);

          return;
        }

        setTripInformations(responseInformationsTrip.data.data);
      }
    } catch (error) {
      const responseError = error as AxiosError<any, any>;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    }
  };

  const getLinkRegisterApp = async () => {
    try {
      const responseLinkRegister = await api.post("Support/GetConfig", {
        configKey: "link_customer_pre_register",
      });

      if (responseLinkRegister.status) {
        setUrlRegisterApp(responseLinkRegister.data.data);
      }
    } catch (error) {
      const responseError = error as AxiosError<any, any>;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    }
  };

  const getKeyFirestore = async () => {
    try {
      const responseConfigFirestore = await api.post("Support/GetConfig", {
        configKey: "firebase_cloud_firestore_key",
      });

      if (responseConfigFirestore.status) {
        const configFirestore: FirestoreProps | undefined = JSON.parse(
          responseConfigFirestore.data.data
        );

        InitFirebaseConfig(configFirestore);
        getTrips(id as string, (type: string) => {
          if (type === "removed") {
            getInformationsTrip();
          }
        });
      }
    } catch (error) {
      const responseError = error as AxiosError<any, any>;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    }
  };

  useEffect(() => {
    getLinkRegisterApp();
    getKeyFirestore();
    getInformationsTrip();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (tripInformations) {
      getCoordinates(
        Number(tripInformations.origin.latitude),
        Number(tripInformations.origin.longitude)
      );
    }
  }, [tripInformations]);

  const showModalTripEnded =
    tripInformations?.status === "finished" ||
    tripInformations?.status === "canceled";

  const shareRegisterHref = useMemo((): string | null => {
    if (!urlRegisterApp) return null;
    const userId = tripInformations?.customer?.idUser;
    if (
      userId != null &&
      userId !== "" &&
      urlRegisterApp.includes("{userId}")
    ) {
      return urlRegisterApp.replace("{userId}", btoa(String(userId)));
    }
    return urlRegisterApp;
  }, [urlRegisterApp, tripInformations?.customer?.idUser]);

  return (
    <Container isOpen={showModal}>
      {!tripNotExists && (
        <>
          {!onlyTracking && (
            <>
              <nav className="content-nav">
                {/* <h3 className="title-status">Renner está te aguardando</h3> */}

                <div className="content-logo">
                  <img
                    src={getPathImageDefault()}
                    alt={`logo-${process.env.REACT_APP_PROJECT_NAME}`}
                    onError={(e) => {
                      e.currentTarget.src = LogoMovyDefault;
                    }}
                  />
                </div>
                <section className="content-travel">
                  <div className="content-icons-origin-and-destiny">
                    <div className="ball"></div>
                    <div className="retangule"></div>
                    <div className="squad"></div>
                  </div>

                  <div className="content-addresses">
                    <span className="origin-address">
                      {CharLimited(tripInformations?.origin.address, 84)}
                    </span>
                    <span className="destiny-address">
                      <small>Local de destino</small>
                      {CharLimited(tripInformations?.destination.name, 84)}
                    </span>
                  </div>
                </section>

                <section>
                  <div className="container-driver">
                    <div className="content-informations-driver">
                      <div className="content-driver-photo">
                        <img
                          src={
                            tripInformations?.driver
                              ? `${window.env.REACT_APP_BUCKET_URL}driver/profile/${tripInformations?.driver?.profileImage}`
                              : require("../../assets/img/driver-not-found.jpg")
                          }
                          alt="photo-driver"
                        />
                      </div>

                      {tripInformations?.driver && (
                        <div className="information-driver">
                          <h4 className="plate-car">
                            {tripInformations?.driver?.car?.plate}
                          </h4>
                          <span className="name-car">
                            {`${tripInformations?.driver?.car?.brand} ${tripInformations?.driver?.car?.model} - ${tripInformations?.driver?.car?.color}`}
                          </span>
                        </div>
                      )}
                    </div>
                    {tripInformations?.driver && (
                      <span className="name-driver">
                        {tripInformations?.driver?.name} -{" "}
                        {tripInformations &&
                          parseFloat(tripInformations?.driver?.rating).toFixed(
                            1
                          )}{" "}
                        <FaStar />
                      </span>
                    )}
                  </div>
                </section>
              </nav>

              <div className="content-btn-show-informations-trip">
                <button onClick={handleRecallModalInformations}>
                  {showModal ? (
                    <IoIosArrowDropupCircle />
                  ) : (
                    <IoIosArrowDropdownCircle />
                  )}
                </button>
              </div>
            </>
          )}

          <MapTracking id={id as string} />

          {onlyTracking && tripInformations ? (
            <ShareTripOverlay trip={tripInformations} />
          ) : null}

          {onlyTracking &&
          (tripInformations?.driver || shareRegisterHref) ? (
            <div className="content-share-register-stack">
              {tripInformations?.driver ? (
                <ShareTripDriverCard trip={tripInformations} />
              ) : null}
              {shareRegisterHref ? (
                <div className="content-btn-register">
                  <a href={shareRegisterHref} target="_blank" rel="noreferrer">
                    Cadastre-se na(o) {window.env.REACT_APP_PROJECT_NAME}
                  </a>
                </div>
              ) : null}
            </div>
          ) : (
            shareRegisterHref && (
              <div className="content-btn-register">
                <a href={shareRegisterHref} target="_blank" rel="noreferrer">
                  Cadastre-se na(o) {window.env.REACT_APP_PROJECT_NAME}
                </a>
              </div>
            )
          )}

          {showModalTripEnded && (
            <ModalTripEnded linkApp={shareRegisterHref ?? ""} />
          )}
        </>
      )}
    </Container>
  );
};
