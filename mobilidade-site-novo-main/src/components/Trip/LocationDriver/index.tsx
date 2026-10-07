import { useEffect, useRef } from "react";
import AppSocket from "../../../config/socket";
import { decode } from "@mapbox/polyline";
import { LocationDriverProps } from "./types";
import { useTripStore } from "../../../store/tripStore";

export const LocationDriver = ({
  id,
  mapRef,
  setPositionDriver,
  setPolylineData,
  lastPoint,
}: LocationDriverProps) => {
  const hasMounted = useRef(false);
  const socketRef = useRef<AppSocket | null>(null);

  const { setPosition } = useTripStore();

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = new AppSocket(
        window.env.REACT_APP_API_APP_HOST?.replace("php", "node"),
        {
          query: `tripReference=${id}`,
        }
      );
    }

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
        setPosition([position.lng, position.lat]);
        setPositionDriver([position.lng, position.lat]);
        setPolylineData(arrayFormatted);

        lastPoint.current = decode(polyline).pop();

        hasMounted.current = true;
      }
    };

    socketRef.current.onEvent(`location-${id}`, handleLocationUpdate);

    return () => {
      if (socketRef.current) {
        socketRef.current.onOff(`location-${id}`, handleLocationUpdate);
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [id, mapRef, setPositionDriver, setPolylineData, lastPoint, setPosition]);

  return null;
};
