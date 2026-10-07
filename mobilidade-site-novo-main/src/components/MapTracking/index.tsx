import { useEffect, useRef, useState } from "react";
import { Map, MapRef, Marker } from "react-map-gl";
import { decode } from "@mapbox/polyline";

import AppSocket from "../../config/socket";

import { Polyline } from "../Polyline";

import {
  Container,
  DestinyMarkerImage,
  DriverMarkerImage,
  MapViewport,
} from "./styles";
import { colors } from "../../theme/colors";

interface MapTrackingProps {
  id: string;
}

export const MapTracking = ({ id }: MapTrackingProps) => {
  const mapRef = useRef<MapRef>();
  const hasMounted = useRef(false);

  const [polylineData, setPolylineData] = useState<number[][]>([]);
  const [positionDriver, setPositionDriver] = useState<[number, number] | null>(
    null
  );

  const socket = new AppSocket(
    window.env.REACT_APP_API_APP_HOST?.replace("php", "node"),
    {
      query: `tripReference=${id}`,
    }
  );

  useEffect(() => {
    const handleLocationUpdate = (result: LocationTripProps) => {
      if (result) {
        const { polyline, position } = result;
        const arrayFormatted: number[][] = decode(polyline).map((value) =>
          value.reverse()
        );

        if (!hasMounted.current) {
          mapRef.current?.setZoom(13);
          mapRef.current?.setCenter([position.lng, position.lat]);
        }

        setPositionDriver([position.lng, position.lat]);
        setPolylineData(arrayFormatted);

        hasMounted.current = true;
      }
    };

    socket.onEvent(`location-${id}`, handleLocationUpdate);

    return () => {
      socket.onOff(`location-${id}`, handleLocationUpdate);
    };
  }, [id, socket]);

  return (
    <Container>
      <div className="content-map">
        <MapViewport>
          <Map
            ref={(ref: MapRef) => {
              mapRef.current = ref;
            }}
            mapboxAccessToken={
              process.env.REACT_APP_MAP_KEY ||
              "pk.eyJ1IjoidGVzdGViYXlhbm1lZCIsImEiOiJjazd1d2U4OTMxNW9hM2lvNGI3cGFyaGVnIn0.Q4bC04l_8IU6HqONKXbcDA"
            }
            mapStyle="mapbox://styles/mapbox/light-v10"
          >
            {polylineData.length > 0 && (
              <>
                <Polyline
                  data={polylineData}
                  width={5}
                  color={colors.black}
                  opacity={0.7}
                />
                {positionDriver && (
                  <Marker
                    longitude={positionDriver[0]}
                    latitude={positionDriver[1]}
                  >
                    <DriverMarkerImage
                      src={require("../../assets/img/point-driver.png")}
                      alt="Posição do veículo no mapa"
                    />
                  </Marker>
                )}

                <Marker
                  longitude={polylineData[polylineData.length - 1][0]}
                  latitude={polylineData[polylineData.length - 1][1]}
                >
                  <DestinyMarkerImage
                    src={require("../../assets/img/point-destiny.png")}
                    alt="Ponto de destino da rota"
                  />
                </Marker>
              </>
            )}
          </Map>
        </MapViewport>
      </div>
    </Container>
  );
};
