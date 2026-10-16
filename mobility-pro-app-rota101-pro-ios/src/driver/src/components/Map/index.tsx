import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MapView, { MapStyleElement, MapViewProps } from 'react-native-maps';
import { useTripProvider } from '../../context/Trip';
import { mapAubergine } from '../../styles/mapNight';
import { mapLight } from '../../styles/mapLight';
import { useAuth } from '../../../../context/auth';
import { useFocusEffect } from '@react-navigation/native';
import { useInitialCoordsByLocale } from '~/hooks/useInitialCoordsByLocale';

interface Props extends MapViewProps {
  setCountVisible: (value: boolean) => void;
  noDriver?: boolean;
  setCenterInBottom?: boolean;
  distanceMapBottom?: number;
}

type MapTheme = 'light' | 'dark';

export const Map = forwardRef<MapView, Props>(
  ({ setCountVisible, noDriver, ...props }, ref) => {
    const tripAccepted: any = useTripProvider((context: any) => context.stateTrip.tripAccepted);
    const [customMapStyle, setCustomMapStyle] = useState<MapStyleElement[]>(mapLight);
    const [mapUserInterfaceStyle, setMapUserInterfaceStyle] = useState<MapTheme>('light');
    const { generalSettings, } = useAuth();
    const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
    const isMountedRef = useRef(true);

    const { initialCoords: region } = useInitialCoordsByLocale();

    const darkMapEnabled = useMemo(() =>
      generalSettings?.find(item => item.key === "enable_map_dark_driver")
      , [generalSettings]);

    const updateMapMode = () => {
      const date = new Date();
      const hour = date.getHours();
      const hourNow = hour >= 6 && hour < 18;

      const isDarkModeActive = darkMapEnabled?.value === "1" && !hourNow;

      setCustomMapStyle(isDarkModeActive ? mapAubergine : mapLight);
      setMapUserInterfaceStyle(isDarkModeActive ? 'dark' : 'light');
    }


    const scheduleMapModeUpdate = () => {
      const now = new Date();
      let nextChange = new Date();

      if (now.getHours() >= 18) {
        nextChange.setDate(now.getDate() + 1);
        nextChange.setHours(6, 0, 0, 0);
      } else if (now.getHours() >= 6) {
        nextChange.setHours(18, 0, 0, 0);
      } else {
        nextChange.setHours(6, 0, 0, 0);
      }

      const msUntilNextChange = nextChange.getTime() - now.getTime();

      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);

      timeoutIdRef.current = setTimeout(() => {
        updateMapMode();
        scheduleMapModeUpdate();
      }, msUntilNextChange);
    };

    useFocusEffect(useCallback(() => {
      updateMapMode();

      if (darkMapEnabled?.value === "1") scheduleMapModeUpdate();

      return () => {
        if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      };
    }, [darkMapEnabled]));

    // Cleanup when component unmounts
    useEffect(() => {
      isMountedRef.current = true;

      return () => {
        isMountedRef.current = false;
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
          timeoutIdRef.current = null;
        }
      };
    }, []);

    return (
      <MapView
        ref={ref}
        style={{ flex: 1 }}
        initialRegion={region}
        onPress={() => {
          if (isMountedRef.current) {
            setCountVisible(false);
          }
        }}
        showsUserLocation={!!noDriver}
        showsCompass={false}
        showsMyLocationButton={false}
        zoomEnabled
        maxZoomLevel={19}
        minZoomLevel={5}
        showsBuildings={false}
        mapType={'standard'}
        rotateEnabled={!!tripAccepted}
        customMapStyle={customMapStyle}
        {...props}
        userInterfaceStyle={mapUserInterfaceStyle}
        onMapReady={() => {
          // Map is ready, safe to use
        }}
      />
    );
  });
