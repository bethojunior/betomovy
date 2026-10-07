import { useState, memo } from "react";
import { Marker } from "react-map-gl";
import { DriverPopover } from "./components/PopOver";
import { Route } from "../../Route";
import { VehicleIcon } from "../../../assets/marks/carIcon";
import { useUserTypeContext } from "../../../hooks/useUserTypeContext";
import { useMarkerAnimation } from "../../../hooks/useMarkerAnimation";
import { MarkerContainer, PingRing } from "./styles";

interface DriverMarkerProps {
  driver: any;
  tripStatus?: string;
  onDriverClick?: (driver: any) => void;
}

interface RouteDTO {
  position: { lat: number; lng: number };
  polyline?: any;
}

/** Resolve o ícone do veículo com base no tipo do driver ou no tipo de usuário cadastrado. */
const resolveVehicleIcon = (
  driver: any,
  userTypesById: Record<number, any>
): "car" | "motorcycle" => {
  const raw = String(
    driver?.vehicleType ??
      userTypesById?.[Number(driver?.userTypeId)]?.vehicleType ??
      ""
  )
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  return raw === "bike" ? "motorcycle" : "car";
};

/** Retorna true se as props não mudaram (evita re-render desnecessário). */
const propsAreEqual = (prev: DriverMarkerProps, next: DriverMarkerProps): boolean => {
  if (prev === next) return true;
  if (prev.onDriverClick !== next.onDriverClick || prev.tripStatus !== next.tripStatus) return false;

  const p = prev.driver;
  const n = next.driver;
  if (p === n) return true;
  if (!p || !n) return false;

  const pCar = p.car || {};
  const nCar = n.car || {};

  return (
    Number(p.idDriver) === Number(n.idDriver) &&
    Number(p.latitude) === Number(n.latitude) &&
    Number(p.longitude) === Number(n.longitude) &&
    p.status === n.status &&
    p.profileImage === n.profileImage &&
    p.userName === n.userName &&
    p.name === n.name &&
    pCar.model === nCar.model &&
    pCar.year === nCar.year &&
    pCar.plate === nCar.plate
  );
};

const DriverMarkerComponent = ({ driver, tripStatus, onDriverClick }: DriverMarkerProps) => {
  const [route] = useState<RouteDTO>();
  const { userTypesById } = useUserTypeContext();

  const { animPos, heading, isVisible } = useMarkerAnimation(
    Number(driver.latitude),
    Number(driver.longitude)
  );

  const iconVariant = resolveVehicleIcon(driver, userTypesById);
  const status = tripStatus || driver.status;

  if (!isVisible) return null;

  return (
    <>
      <Marker
        longitude={route?.position.lng || animPos.lng}
        latitude={route?.position.lat || animPos.lat}
        anchor="center"
      >
        <DriverPopover driver={driver} driverDetails={driver.car}>
          <MarkerContainer
            onClick={(e) => {
              e.stopPropagation();
              if (onDriverClick) onDriverClick(driver);
            }}
          >
            <PingRing status={status as any} />
            <VehicleIcon rotation={heading} status={status} variant={iconVariant} />
          </MarkerContainer>
        </DriverPopover>
      </Marker>

      {route && <Route polyline={route.polyline} />}
    </>
  );
};

export const DriverMarker = memo(DriverMarkerComponent, propsAreEqual);
