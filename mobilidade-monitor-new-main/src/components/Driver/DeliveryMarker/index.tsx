import { useEffect, useRef, useState } from "react";
import { Marker } from "react-map-gl";
import { CarIcon } from "../../../assets/marks/carIcon";
import { DriverPopover } from "../Marker/components/PopOver";
import api from "../../../services/api";

interface DeliveryDriverMarkerProps {
  driver: any;
}

interface Location {
  latitude: number;
  longitude: number;
}

export const DeliveryDriverMarker = ({ driver }: DeliveryDriverMarkerProps) => {
  const [rotation, setRotation] = useState<number>(0);
  const [driverDetails, setDriverDetails] = useState<any>();
  const [currentLocation, setCurrentLocation] = useState<Location>({
    latitude: driver?.latitude,
    longitude: driver?.longitude,
  });
  const lastLocationRef = useRef<Location | null>(null);

  useEffect(() => {
    if (lastLocationRef.current) {
      const deltaLat = driver.latitude - lastLocationRef.current.latitude;
      const deltaLng = driver.longitude - lastLocationRef.current.longitude;

      if (deltaLat === 0 && deltaLng === 0) return;

      if (Math.abs(deltaLat) > Math.abs(deltaLng)) {
        setRotation(deltaLat > 0 ? -180 : 0);
      } else {
        setRotation(deltaLng > 0 ? -90 : 90);
      }
    }

    lastLocationRef.current = currentLocation;
    setCurrentLocation({
      latitude: driver?.latitude,
      longitude: driver?.longitude,
    });
  }, [driver.latitude, driver.longitude]);

  const getDrivers = async () => {
    try {
      const response = await api.get(`driver/${driver.idDriver}`);
      setDriverDetails(response.data.response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!driver?.idDriver) return;
    getDrivers();
  }, [driver?.idDriver]);

  return (
    <Marker
      longitude={Number(driver?.longitude)}
      latitude={Number(driver?.latitude)}
      anchor="bottom"
      rotation={0}
    >
      <DriverPopover driver={driver} driverDetails={driverDetails}>
        <CarIcon status={driver.status} rotation={rotation} />
      </DriverPopover>
    </Marker>
  );
};