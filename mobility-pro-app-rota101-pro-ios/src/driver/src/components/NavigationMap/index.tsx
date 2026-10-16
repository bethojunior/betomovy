import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Map } from '../Map';
import MapView, { AnimatedRegion, MapMarker, Marker } from 'react-native-maps';
import { View } from 'react-native';
import { If } from '../If';
import { useTripProvider } from '../../context/Trip';
import { useAuth } from '../../../../context/auth';
import { useLocalProvider } from '../../context/local';
import { useZoneDynamic } from '../../context/ZoneDynamic';
import {
  calculateDistanceFromLatLonInMeters,
  calculateBearing,
} from '../../../../client/utils/position';
import { NavigationMapConfig } from '../../../constants/map';
import { MapSettingComponent, useMapSettings } from '../MapSettings';
import { DriverPositionMarker } from './DriverPositionMarker';
import { ZonesDynamicMarkers } from './ZonesDynamicMarkers';
import { LocationObject } from 'expo-location';
import { ILocation } from '~/interfaces/location';
import { PolylineComponent } from '../PolylineComponent';
import { useDevTools, SIMULATION_ROUTE } from '../../context/DevTools';
import { NavigationPolyline } from '../../../../client/components/NavigationPolyline';

const MAX_POINTS = 10;

const zoomToAltitude = (zoom: number) => Math.max(400, 35200000 / Math.pow(2, zoom));

type NavigationMapProps = {
  onPress?: () => void;
};

export type NavigationMapRef = {
  map: MapView;
  handleMyLocation: (isInTrip: boolean) => void;
  visibleConfigMap: () => void;
  zoomToMapMarker: (zoom?: number) => void;
};

type AnimationStateRef =
  | { active: true; timeoutId: NodeJS.Timeout }
  | { active: false; timeoutId: null };

const NavigationMap = forwardRef<NavigationMapRef, NavigationMapProps>(
  (props, ref) => {
    const { onPress } = props;

    const mapRef = useRef<MapView>(null);
    const markerRef = useRef<MapMarker>(null);
    const isTouchMapRef = useRef(false);
    const isAnimationMap = useRef<AnimationStateRef>({ active: false, timeoutId: null });
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastLocation = useRef<LocationObject | null>(null);
    const lastPosition = useRef({ latitude: 0, longitude: 0 });
    const lastRotation = useRef(0);
    const isMountedRef = useRef(true);

    const animatedLocations = useRef<ILocation[]>([]);

    const [configMap, setConfigMap] = useState(false);

    const { location } = useLocalProvider();
    const { zonesDynamic } = useZoneDynamic();
    const { cityConfig } = useAuth();
    const { stateTrip: { tripAccepted } } = useTripProvider((context) => context);
    const { simulation } = useDevTools();
    const isSimulatingRef = useRef(false);
    isSimulatingRef.current = simulation.active;

    const animatedCoordinate: any = useRef(
      new AnimatedRegion({
        latitude: location?.coords?.latitude ?? 0,
        longitude: location?.coords?.longitude ?? 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      })
    );

    const {
      speedToMoveCamera,
      zoomInTrip,
      pitch,
      metersToMoveCamera,
      saveSettingMap,
      outPitch,
      zoomOutTrip,
      markerSize,
      markerSizeOut,
      polylineWidth,
      distanceMap,
    } = useMapSettings();

    const inTrip = useMemo(() => Object.keys(tripAccepted || {}).length > 0, [tripAccepted]);

    const moveMarker = useCallback((lat: number, lng: number) => {
      animatedCoordinate.current.timing({
        latitude: lat,
        longitude: lng,
        duration: NavigationMapConfig.duration,
        useNativeDriver: false,
      }).start();
    }, []);

    const handleMyLocation = useCallback(
      (location: LocationObject | null, init = false, animationCamera = true) => {
        if (!isMountedRef.current || !location || !location?.coords || !mapRef.current) {
          return;
        }

        const meters = calculateDistanceFromLatLonInMeters(
          lastPosition.current,
          location.coords
        );

        if (!init && meters < metersToMoveCamera) return;

        // iOS: CLLocation returns speed=-1 and heading=-1 when values are unavailable
        const speed = location.coords.speed < 0 ? speedToMoveCamera : location.coords.speed;
        if (speed >= speedToMoveCamera && meters >= metersToMoveCamera) {
          const nextEx = calculateBearing(lastPosition.current, location.coords);
          const rawHeading = location.coords.heading;
          const next = rawHeading != null && rawHeading >= 0 ? rawHeading : nextEx;
          lastRotation.current = next;
        }

        if (animationCamera && mapRef.current) {
          try {
            const zoom = (inTrip || isSimulatingRef.current) ? zoomInTrip : zoomOutTrip || 12;

            mapRef.current.animateCamera(
              {
                zoom,
                altitude: zoomToAltitude(zoom),
                center: {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                },
                pitch: 0,
                heading: lastRotation.current,
              },
              { duration: NavigationMapConfig.duration }
            );
          } catch (error) {
            // Ignore errors if map is being destroyed
            console.log('Map animation error:', error);
          }
        }

        const canAnimate = animatedLocations.current.length >= 2;

        if (canAnimate) {
          if (isAnimationMap.current.timeoutId) {
            clearTimeout(isAnimationMap.current.timeoutId);
          }

          moveMarker(location.coords.latitude, location.coords.longitude);

          isAnimationMap.current = {
            active: true,
            timeoutId: setTimeout(() => {
              isAnimationMap.current = { active: false, timeoutId: null };
            }, NavigationMapConfig.duration),
          };
        } else {
          animatedCoordinate.current.setValue({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0,
            longitudeDelta: 0,
          } as any);
        }

        lastPosition.current = location.coords;
      },
      [speedToMoveCamera, zoomInTrip, metersToMoveCamera, zoomOutTrip, inTrip]
    );


    const visibleConfigMap = useCallback(() => setConfigMap(prev => !prev), []);
    const visibleDynamicMap = useMemo(() => cityConfig?.showDynamicAreaInMap === '1', [cityConfig]);

    const handleAnimatedLocations = (coords: ILocation) => {
      if (!coords?.latitude || !coords?.longitude) return;

      const list = animatedLocations.current;

      list.push(coords);

      if (list.length > MAX_POINTS) {
        list.splice(0, list.length - MAX_POINTS);
      }
    };

    const zoomToMapMarker = (zoom?: number) => {
      if (!lastLocation.current?.coords || !mapRef.current) return;

      const zoomLevel = zoom ?? (zoomInTrip || 13);
      mapRef.current.animateCamera(
        {
          zoom: zoomLevel,
          altitude: zoomToAltitude(zoomLevel),
          center: lastLocation.current.coords,
          pitch: 0,
          heading: lastRotation.current,
        },
        { duration: NavigationMapConfig.duration }
      );
    };

    const onMapReady = () => {
      handleMyLocation(lastLocation.current, true, true);
    }

    useImperativeHandle(
      ref,
      () => ({
        map: mapRef.current,
        handleMyLocation: () => {
          if (isMountedRef.current) {
            isTouchMapRef.current = false;
            handleMyLocation(lastLocation.current, true);
          }
        },
        visibleConfigMap,
        zoomToMapMarker,
      }),
      [visibleConfigMap, handleMyLocation],
    );

    useEffect(() => {
      handleMyLocation(lastLocation.current, true, true);
    }, [handleMyLocation]);

    const redirectToPoint = useCallback(() => {
      if (!isMountedRef.current || (timeoutRef.current && isAnimationMap.current.active)) return;

      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          isTouchMapRef.current = false;
          handleMyLocation(lastLocation.current, true, true);
        }
        timeoutRef.current = null;
      }, 3000);
    }, [handleMyLocation]);

    const clearMapTimeout = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }, []);

    // Cleanup all timeouts and animations when component unmounts
    useEffect(() => {
      isMountedRef.current = true;

      return () => {
        isMountedRef.current = false;

        // Clear all timeouts
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        if (isAnimationMap.current.timeoutId) {
          clearTimeout(isAnimationMap.current.timeoutId);
          isAnimationMap.current = { active: false, timeoutId: null };
        }

        // Clear map ref to prevent operations on destroyed map
        mapRef.current = null;
      };
    }, []);

    const onDriverLocationUpdate = useCallback((location: LocationObject) => {
      lastLocation.current = location;
      handleAnimatedLocations(location.coords);
      handleMyLocation(location, true, !isTouchMapRef.current);
    }, [handleMyLocation]);

    return (
      <If condition={location?.coords?.latitude}>
        <MapSettingComponent
          metersToMoveCamera={metersToMoveCamera}
          pitch={pitch}
          saveSettingMap={saveSettingMap}
          speedToMoveCamera={speedToMoveCamera}
          zoomInTrip={zoomInTrip}
          outPitch={outPitch}
          zoomOutTrip={zoomOutTrip}
          markerSize={markerSize}
          markerSizeOut={markerSizeOut}
          polylineWidth={polylineWidth}
          distanceMap={distanceMap}
          visible={configMap}
          setVisible={setConfigMap}
        />

        <Map
          ref={mapRef}
          setCenterInBottom={inTrip}
          distanceMapBottom={distanceMap}
          onTouchMove={() => {
            isTouchMapRef.current = true;
            clearMapTimeout();
          }}
          onTouchEnd={redirectToPoint}
          onMapReady={onMapReady}
          setCountVisible={onPress}
        >
          <DriverPositionMarker
            ref={markerRef}
            coordinate={animatedCoordinate.current}
            onUpdateLocation={onDriverLocationUpdate}
          />
          <PolylineComponent />
          {simulation.active && (
            <>
              <NavigationPolyline coordinates={SIMULATION_ROUTE.slice(simulation.index)} />
              <Marker coordinate={SIMULATION_ROUTE[SIMULATION_ROUTE.length - 1]} anchor={{ x: 0.5, y: 1 }} />
            </>
          )}
          {visibleDynamicMap && (
            <ZonesDynamicMarkers zones={zonesDynamic} mapRef={mapRef} />
          )}
        </Map>
      </If>
    );
  },
);

export default NavigationMap;
