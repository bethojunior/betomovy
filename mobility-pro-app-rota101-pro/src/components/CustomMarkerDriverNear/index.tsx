import { memo } from "react";
import { Marker } from "react-native-maps";
import icCar from '~/assets/map-pins/car.png';
import { CustomImage } from "./styles";
import React from "react";
import { DriverNear } from "~/interfaces/driverNear";

interface Props {
  data: DriverNear;
}

const CustomMarkerDriverNear: React.FC<Props> = ({ data }) => {
  const [tracksViewChanges, setTracksViewChanges] = React.useState(true);

  const stopTrackingViewChanges = () => {
    setTracksViewChanges(false);
  };

  return (
    <Marker
      tracksViewChanges={tracksViewChanges}
      anchor={{ x: 0.5, y: 0.5 }}
      coordinate={{
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
      }}
    >
      <CustomImage
        onLoad={stopTrackingViewChanges}
        resizeMode="contain"
        source={!data?.iconMapDriver ? icCar : { uri: data.iconMapDriver }}
      />
    </Marker>
  );
};

export default memo(CustomMarkerDriverNear);
