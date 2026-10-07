import React, { useEffect, useRef, useState } from "react";
import { DriverMarker } from "../../Driver/Marker";
import Utils from "../../../utils/Utils";
import { DriversMarkersProps } from "src/@types";

const normalizeDriver = (d: any): DriverRealtime => {
  const lat = d.latitude ?? d.lat ?? d.lastLat ?? d.last_lat ?? d.position?.lat ?? d.position?.latitude;
  const lng = d.longitude ?? d.lng ?? d.lastLon ?? d.last_lon ?? d.position?.lng ?? d.position?.longitude;

  return {
    ...d,
    latitude: lat,
    longitude: lng
  };
};

const isValidDriver = (d: DriverRealtime) => {
  if (!d || d.idDriver == null) {
    return false;
  }
  
  const lat = Number(d.latitude);
  const lng = Number(d.longitude);
  
  const isValid = !isNaN(lat) && !isNaN(lng) && 
                 d.latitude != null && 
                 d.longitude != null &&
                 d.latitude !== '' &&
                 d.longitude !== '' &&
                 lat !== 0 &&
                 lng !== 0;
  
  return isValid;
};

const isSameDriverData = (prev: DriverRealtime, next: DriverRealtime) => {
  if (prev === next) {
    return true;
  }

  const prevLat = Number(prev.latitude);
  const prevLng = Number(prev.longitude);
  const nextLat = Number(next.latitude);
  const nextLng = Number(next.longitude);

  const samePosition = prevLat === nextLat && prevLng === nextLng;
  const sameStatus = prev.status === next.status;
  const sameProfile = prev.profileImage === next.profileImage;
  const sameName = prev.userName === next.userName && prev.name === next.name;

  const prevCar = prev.car || {};
  const nextCar = next.car || {};
  const sameCar =
    prevCar.model === nextCar.model &&
    prevCar.year === nextCar.year &&
    prevCar.plate === nextCar.plate;

  return samePosition && sameStatus && sameProfile && sameName && sameCar;
};

export const DriversMarkers = ({ driversRef, selectedArea, selectedDriver, driversUpdateKey, tripStatusByDriverId, tripsLoading, onDriverClick }: DriversMarkersProps) => {
  const [drivers, setDrivers] = useState<DriverRealtime[]>(() => {
    const initial = driversRef.current || [];
    return Array.isArray(initial) ? initial : [];
  });
  const [smoothedTripStatusByDriverId, setSmoothedTripStatusByDriverId] = useState<Record<number, string>>(
    () => tripStatusByDriverId || {}
  );
  const statusTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const updateDrivers = React.useCallback(() => {
    const currentDrivers = driversRef.current || [];
    if (!Array.isArray(currentDrivers)) return;

    const validDrivers = currentDrivers
      .map(normalizeDriver)
      .filter(isValidDriver);

    setDrivers((prev) => {
      const prevById = new Map<number, DriverRealtime>();
      prev.forEach((d) => {
        if (d?.idDriver != null) {
          prevById.set(Number(d.idDriver), d);
        }
      });

      let changed = false;
      const nextDrivers: DriverRealtime[] = [];

      validDrivers.forEach((d) => {
        const id = Number(d.idDriver);
        const prevDriver = prevById.get(id);

        if (prevDriver && isSameDriverData(prevDriver, d)) {
          nextDrivers.push(prevDriver);
        } else {
          changed = true;
          nextDrivers.push({ ...d });
        }
        prevById.delete(id);
      });

      if (prevById.size > 0) {
        changed = true;
      }

      if (!changed && nextDrivers.length === prev.length) {
        return prev;
      }

      return nextDrivers;
    });
  }, [driversRef]);

  useEffect(() => {
    updateDrivers();
  }, [driversUpdateKey, updateDrivers]);

  useEffect(() => {
    if (!tripStatusByDriverId) {
      setSmoothedTripStatusByDriverId({});
      return;
    }

    const nextIds = new Set<number>();
    Object.entries(tripStatusByDriverId).forEach(([key, status]) => {
      const id = Number(key);
      if (!id) {
        return;
      }
      nextIds.add(id);

      const currentStatus = smoothedTripStatusByDriverId[id];
      if (currentStatus === status) {
        return;
      }

      const existingTimer = statusTimersRef.current.get(id);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = setTimeout(() => {
        setSmoothedTripStatusByDriverId((prev) => {
          if (prev[id] === status) {
            return prev;
          }
          return {
            ...prev,
            [id]: status
          };
        });
        statusTimersRef.current.delete(id);
      }, 350);

      statusTimersRef.current.set(id, timer);
    });

    Object.keys(smoothedTripStatusByDriverId).forEach((key) => {
      const id = Number(key);
      if (!nextIds.has(id)) {
        const existingTimer = statusTimersRef.current.get(id);
        if (existingTimer) {
          clearTimeout(existingTimer);
          statusTimersRef.current.delete(id);
        }
        setSmoothedTripStatusByDriverId((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
    });
  }, [tripStatusByDriverId]);

  useEffect(() => {
    return () => {
      statusTimersRef.current.forEach((timer) => clearTimeout(timer));
      statusTimersRef.current.clear();
    };
  }, []);

  const filteredDrivers = React.useMemo(() => {
    if (selectedDriver) {
      return drivers.filter((driver) => Number(driver.idDriver) === Number(selectedDriver.idDriver));
    }

    if (!selectedArea || !selectedArea.area || selectedArea.area.length === 0) {
      return drivers;
    }

    return drivers.filter((driver) => {
      const lat = Number(driver.latitude);
      const lng = Number(driver.longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        return false;
      }

      return Utils.pointInPolygon({ lat, lng }, selectedArea.area);
    });
  }, [drivers, selectedArea, selectedDriver]);

  if (!filteredDrivers || !Array.isArray(filteredDrivers) || filteredDrivers.length === 0) {
    return null;
  }

  return (
    <>
      {filteredDrivers.map((driver: DriverRealtime) => {
        if (!driver || !driver.idDriver || !driver.latitude || !driver.longitude) {
          return null;
        }
        const resolvedStatus =
          (driver.idDriver != null
            ? smoothedTripStatusByDriverId[Number(driver.idDriver)]
            : undefined) || (tripsLoading ? undefined : driver.status);
        return (
          <DriverMarker
            key={`driver-${driver.idDriver}`}
            driver={driver}
            tripStatus={resolvedStatus}
            onDriverClick={onDriverClick}
          />
        );
      })}
    </>
  );
};
