import { useEffect, useRef, useState } from "react";
import { Map, MapRef, Marker } from "react-map-gl";

import {
  Container,
  DriverMarkerImage,
  MapRouteDestinationDot,
  MapRouteOriginDot,
  MapTripViewport,
} from "./styles";
import { useSliceAnimationStore } from "../../../store/sliceAnimationStore";
import { useRouteStore } from "../../../store/routeStore";
import { Polyline } from "../../Polyline";
import { useCalculateStore } from "../../../store/calculateAllStore";
import { decode } from "@mapbox/polyline";
import { LocationDriver } from "../LocationDriver";
import { useTripStore } from "../../../store/tripStore";
import { useAuthStore } from "../../../store/authStore";
import { useStorage } from "../../../utils/Storage";
import { totem } from "../../../utils/Totem";
import QRCodeModal from "../../QRCodeModal";
import { Notification } from "../../../utils/Notification";
import Helper from "../../../utils/Helper";

const POINT_DRIVER_IMG = require("../../../assets/img/point-driver.png") as string;

export const MapTrip = () => {
  const [polyline, setPolyline] = useState<number[][]>([]);
  const [polylineData, setPolylineData] = useState<number[][]>([]);
  const [positionDriver, setPositionDriver] = useState<number[]>([]);
  const [lastTripPoint, setLastTripPoint] = useState<number[]>([0, 0]);

  const [qrcodeVisible, setQrcodeVisible] = useState(false);

  const { sliceValue } = useSliceAnimationStore();
  const { route, clearRoute } = useRouteStore();
  const { calculate } = useCalculateStore();
  const { devicePosition } = useAuthStore();
  const { trip, clearTrip, clearPosition, clearTripAccepted } = useTripStore();
  const { removeItem } = useStorage();
  const mapRef = useRef<MapRef>();
  const lastPoint = useRef([0, 0]);

  const clearTotemTrip = () => {
    setLastTripPoint([0, 0]);
    removeItem("trip");
    removeItem("tripAccepted");

    clearTrip();
    clearPosition();
    clearTripAccepted();
    clearRoute();
  };

  const transformPolyline = (polylineEncode: string) => {
    const decodePolyline = decode(polylineEncode);
    if (decodePolyline?.length > 0) {
      const invertCoordinates = decodePolyline.map((item) => [
        item[1],
        item[0],
      ]);

      setPolyline(invertCoordinates);
    }
  };

  useEffect(() => {
    const points = calculate?.overview_polyline?.points;
    if (points) {
      transformPolyline(points);
    }
  }, [calculate]);

  useEffect(() => {
    if (Object.keys(route).length === 0) {
      setPolyline([]);
    }
  }, [route]);

  useEffect(() => {
    if (Object.keys(trip).length === 0) {
      setPolylineData([]);
      setPositionDriver([]);
      lastPoint.current = [0, 0];
    }
  }, [trip]);

  useEffect(() => {
    if (
      lastPoint.current[0] != lastTripPoint[0] &&
      totem &&
      trip?.customer?.phone
    ) {
      setLastTripPoint(lastPoint.current);
      setQrcodeVisible(true);
      Notification.SMS(
        Helper.formatPhoneNumber(trip.customer.phone),
        `https://${window.env.REACT_APP_PROJECT_NAME}-mobilidade.prod.704apps.com.br/acompanhamento-de-viagem/${trip.tripReference}`
      );
    }
  }, [lastPoint.current]);

  return (
    <Container>
      {trip?.tripReference && (
        <LocationDriver
          id={trip.tripReference}
          mapRef={mapRef}
          setPolylineData={setPolylineData}
          setPositionDriver={setPositionDriver}
          lastPoint={lastPoint}
        />
      )}
      {trip && (
        <QRCodeModal
          link={`https://${window.env.REACT_APP_PROJECT_NAME}-mobilidade.prod.704apps.com.br/acompanhamento-de-viagem/${trip.tripReference}`}
          visible={qrcodeVisible}
          setVisible={setQrcodeVisible}
          callback={clearTotemTrip}
        />
      )}
      <div className="content-map">
        <MapTripViewport>
          <Map
            ref={(ref: MapRef) => {
              mapRef.current = ref;
            }}
            initialViewState={{
              latitude: devicePosition.latitude,
              longitude: devicePosition.longitude,
              zoom: 12,
            }}
            mapboxAccessToken={window.env.REACT_APP_MAP_KEY}
            mapStyle="mapbox://styles/mapbox/light-v10"
          >
            {positionDriver.length === 0 &&
              route?.origin &&
              String(route?.origin?.lat)?.length > 0 && (
                <Marker
                  longitude={route.origin.lng}
                  latitude={route.origin.lat}
                >
                  <MapRouteOriginDot />
                </Marker>
              )}
            {positionDriver.length === 0 &&
              route?.destination &&
              String(route?.destination?.lat)?.length > 0 && (
                <Marker
                  longitude={route.destination.lng}
                  latitude={route.destination.lat}
                >
                  <MapRouteDestinationDot />
                </Marker>
              )}
            {positionDriver.length > 0 && (
              <Marker longitude={positionDriver[0]} latitude={positionDriver[1]}>
                <DriverMarkerImage
                  src={POINT_DRIVER_IMG}
                  alt="Posição do veículo no mapa"
                />
              </Marker>
            )}
            {polylineData.length > 0 && (
              <Marker
                longitude={lastPoint.current?.[1] || 0}
                latitude={lastPoint.current?.[0] || 0}
              >
                <MapRouteDestinationDot />
              </Marker>
            )}
            <Polyline
              data={polylineData || polyline}
              color="#000"
              width={4}
              opacity={0.8}
            />
          </Map>
        </MapTripViewport>
      </div>
    </Container>
  );
};
