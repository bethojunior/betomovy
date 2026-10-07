import { useState } from "react";

export const useGetMyPosition = () => {
  const [myPosition, setMyPosition] = useState({
    latitude: 0,
    longitude: 0,
  });

  navigator.geolocation.getCurrentPosition(
    ({ coords: { latitude: lat, longitude: lng } }) => {
      setMyPosition({
        latitude: lat,
        longitude: lng,
      });
    }
  );

  return myPosition;
};
