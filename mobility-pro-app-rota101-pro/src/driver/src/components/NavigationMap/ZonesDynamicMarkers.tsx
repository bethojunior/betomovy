import { memo, useMemo } from "react";
import MapView, { Marker, Polygon } from "react-native-maps";
import Helper from "../../utils/Helper";
import { View } from "react-native";
import { ContainerMultiplier } from "../../pages/Home/styles";
import { TextEdit } from "../TextEdit";
import { useTheme } from "styled-components/native";
import { NavigationMapConfig } from "../../../constants/map";
import { ZoneDynamicObject } from "../../context/ZoneDynamic/types";

type ZonesDynamicMarkersProps = {
  zones: ZoneDynamicObject[];
  mapRef: React.RefObject<MapView>;
};

export const ZonesDynamicMarkers: React.FC<ZonesDynamicMarkersProps> = memo(({ zones, mapRef }) => {
  const activeZones = useMemo(() => zones.filter(z => Boolean(z.active)), [zones]);
  const theme = useTheme();

  return (
    <>
      {activeZones.map(item => {
        const coord = Helper.getLatLonCenterFromGeom(item.area);
        const polygonCoords = item.area.map((p: any) => ({ latitude: p.lat, longitude: p.lng }));
        const fillColor = Helper.getFillColor(item.multiplierValue);

        return (
          <View key={item.id}>
            {coord?.latitude !== null && coord?.longitude !== null && (
              <Marker
                style={{ zIndex: 1 }}
                coordinate={coord}
                tracksViewChanges={false}
                onPress={() => {
                  mapRef.current?.animateToRegion({
                    latitude: coord.latitude,
                    longitude: coord.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }, NavigationMapConfig.duration);
                }}
              >
                <ContainerMultiplier>
                  <TextEdit size="medium" color={theme.colors.background_global}>
                    {item.multiplierValue ? Number(item.multiplierValue).toFixed(1) : ''}x
                  </TextEdit>
                </ContainerMultiplier>
              </Marker>
            )}
            <Polygon coordinates={polygonCoords} strokeWidth={1} fillColor={fillColor} strokeColor={fillColor} />
          </View>
        );
      })}
    </>
  );
});
