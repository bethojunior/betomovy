import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {Map} from '../Map';
import MapView, {
  Marker,
  MarkerAnimated,
  Polygon,
  Polyline,
} from 'react-native-maps';
import {If} from '../If';
import Helper from '../../utils/Helper';
import {useTripProvider} from '../../context/Trip';
import {useAuth} from '../../../../context/auth';
import {useLocalProvider} from '../../context/local';
import {Platform, View, Image} from 'react-native';
import {useZoneDynamic} from '../../context/ZoneDynamic';
import {useConfigLocal} from '../../context/ConfigLocal';
import {ContainerMultiplier} from '../../pages/Home/styles';
import {TextEdit} from '../TextEdit';
import theme from '../../styles/theme';
import {
  calculateDistanceFromLatLonInMeters,
  calculateHeading,
} from '../../../../client/utils/position';
import {NavigationMapConfig} from '../../../constants/map';
import {MapService} from '../Map/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLocal} from '../../hooks/location';
import DriverMarker from '../DriverMarker';
import {MapSettingComponent, useMapSettings} from '../MapSettings';
import {useNetwork} from '../../../../context/ConfigGlobal';
import {useDriversNears} from '../../../../context/driversNears';
import {PolylineChildren} from '../PolylineChildren';
import FastImage from 'react-native-fast-image';

enum MapType {
  standard = 'standard',
  satellite = 'satellite',
  hybrid = 'hybrid',
  terrain = 'terrain',
  none = 'none',
  mutedStandard = 'mutedStandard',
}

type NavigationMapProps = {
  onPress?: () => void;
  mapType: MapType;
  setMapType: (map: any) => void;
};
export type NavigationMapRef = {
  map: MapView;
  handleMyLocation: (isInTrip: boolean) => void;
  toggleMapType: (mapNow: string) => void;
  visibleConfigMap: () => void;
};
type AnimationStateRef = {
  current: boolean;
  timeoutId?: NodeJS.Timeout;
};
const MapAnimation = ({
  onUpdateLocation,
  onMarkerRef,
  markerRotate,
  markerSize,
}) => {
  const {location} = useLocal();
  const {location: cacheLocal} = useLocalProvider();

  const {
    stateTrip,
    calculateAndDisplayRoute,
    // sendPosition,
  } = useTripProvider();
  const {tripAccepted} = stateTrip;

  const {itsNetwork} = useNetwork();
  //@TODO - REMOVER
  const calculateRoute = (condition = false) => {
    if (
      tripAccepted &&
      Object.keys(tripAccepted).length !== 0 &&
      itsNetwork &&
      location?.coords?.latitude &&
      tripAccepted?.tripCallType &&
      tripAccepted?.tripCallType !== 'CHAMADA TAXÍMETRO'
    ) {
      calculateAndDisplayRoute(
        tripAccepted?.origin,
        tripAccepted?.destination,
        {
          lat: location?.coords?.latitude,
          lng: location?.coords?.longitude,
        },
        condition,
      );
    }
  };

  useEffect(() => {
    if (!location?.coords?.latitude) {
    } else {
      if (onUpdateLocation) onUpdateLocation(location);
      //@TODO - REMOVER

      // calculateRoute();
      // if (location?.coords) sendPosition(location.coords);
    }
  }, [location]);

  return (
    <If condition={location?.coords?.latitude || cacheLocal?.coords?.latitude}>
      <DriverMarker
        latitude={
          Platform.OS === 'ios'
            ? location?.coords?.latitude
            : cacheLocal?.coords?.latitude
        }
        longitude={
          Platform.OS === 'ios'
            ? location?.coords?.longitude
            : cacheLocal?.coords?.longitude
        }
        onMarkerRef={onMarkerRef}
        markerSize={markerSize}
        markerRotate={markerRotate}
      />
    </If>
  );
};

const NavigationMapComponent = forwardRef<NavigationMapRef, NavigationMapProps>(
  (props, ref) => {
    const {onPress, mapType, setMapType} = props;
    const [itsDay, setItsDay] = useState(false);
    const timeoutRef = useRef<any>(null);
    const mapRef = useRef<MapView>(null);
    const isTouchMapRef = useRef<boolean>(false);
    const isAnimationMap = useRef<AnimationStateRef>({current: false});
    const markerRef = useRef<MarkerAnimated>(null);
    const [markerRotate, setMarkerRotate] = useState<number>(0);
    const [configMap, setConfigMap] = useState<boolean>(false);

    const {generalSettings, cityConfig} = useAuth();
    const {location} = useLocalProvider();
    if (!location?.coords?.latitude) return null;
    const lastLocation = useRef({});

    const {zonesDynamic} = useZoneDynamic();

    const lastPosition = useRef({
      latitude: 0,
      longitude: 0,
    });

    const lastRotation = useRef<number>(0);

    const {getDriversOnline, driversNears} = useDriversNears();

    useEffect(() => {
      if (location?.coords?.latitude) {
        getDriversOnline(
          Number(location?.coords?.latitude),
          Number(location?.coords?.longitude),
        );
      }
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        map: mapRef.current,
        handleMyLocation: () => {
          isTouchMapRef.current = false;
          handleMyLocation(lastLocation.current, true);
        },
        toggleMapType,
        visibleConfigMap,
      }),
      [],
    );

    const {
      states: {secondsToRedirect, showConfigMap},
    } = useConfigLocal();

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

    const {
      stateTrip: {tripAccepted},
    } = useTripProvider();

    const inTrip = Object.keys(tripAccepted).length > 0;

    const getHourToDayOrNight = () => {
      const date = new Date();
      const hour = date.getHours();
      const hourNow = hour > 6 && hour < 18 ? true : false;
      const conditionalSettings =
        generalSettings?.find(item => item?.key === 'enable_map_dark_driver')
          ?.value === '1'
          ? hourNow
          : true;
      return conditionalSettings;
    };

    const handleMyLocation = (
      location,
      init: boolean = false,
      animationCamera: boolean = true,
    ) => {
      if (isAnimationMap.current?.current) return;
      if (!mapRef?.current?.animateCamera) return;
      if (!location?.coords?.latitude) return;

      const meters = calculateDistanceFromLatLonInMeters(
        lastPosition.current,
        location.coords,
      );

      if (!init && meters < metersToMoveCamera) return;

      if (
        location?.coords?.speed >= speedToMoveCamera &&
        meters >= metersToMoveCamera
      ) {
        const nextEx =
          360 - calculateHeading(lastPosition.current, location?.coords);
        const next = location?.coords?.heading
          ? location?.coords?.heading
          : nextEx;
        if (!animationCamera) {
          mapRef.current.getCamera().then(({heading}) => {
            setMarkerRotate(!animationCamera ? next - heading : 0);
          });
        } else {
          setMarkerRotate(0);
        }

        lastRotation.current = next;
      }

      if (animationCamera) {
        mapRef?.current?.animateCamera(
          {
            zoom: (inTrip ? zoomInTrip : zoomOutTrip) || 12,
            center: {
              latitude: location?.coords?.latitude,
              longitude: location?.coords.longitude,
            },
            // pitch: (inTrip ? pitch : outPitch) || 60,
            pitch: 0,
            heading: lastRotation.current,
          },
          {duration: NavigationMapConfig.duration},
        );
      }

      // animateMarkerToCoordinate, so funciona no Android
      if (
        markerRef?.current &&
        Platform?.OS !== 'ios' &&
        location?.coords?.latitude
      ) {
        if (isAnimationMap.current.timeoutId) {
          clearTimeout(isAnimationMap.current.timeoutId);
        }

        markerRef?.current?.animateMarkerToCoordinate(
          {
            latitude: location?.coords?.latitude,
            longitude: location?.coords.longitude,
          },
          NavigationMapConfig.duration,
        );

        isAnimationMap.current.current = true;

        isAnimationMap.current.timeoutId = setTimeout(() => {
          isAnimationMap.current.current = false;
        }, NavigationMapConfig.duration);
      }

      lastPosition.current = location?.coords;
    };

    const toggleMapType = async (mapNow: string) => {
      const type = MapService.switchMapType(mapNow as MapType);
      setMapType(type);
      await AsyncStorage.setItem('mapType', type);
    };

    const visibleConfigMap = () => {
      setConfigMap(!configMap);
    };

    useEffect(() => {
      setItsDay(getHourToDayOrNight());
    }, []);

    useEffect(() => {
      handleMyLocation(lastLocation.current, true, true);
    }, [
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
    ]);

    const redirectToPoint = () => {
      if (!timeoutRef.current) {
        return (timeoutRef.current = setTimeout(() => {
          isTouchMapRef.current = false;
          handleMyLocation(lastLocation.current, true);
        }, 1000 * secondsToRedirect));
      }
    };
    const clearMapTimeout = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    };

    if (!location && !Object.keys(location).length) return <></>;

    return (
      <If condition={location?.coords?.latitude}>
        {/* <If condition={showConfigMap}> */}
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
        {/* </If> */}
        <Map
          setCenterInBottom={inTrip}
          distanceMapBottom={distanceMap}
          latitude={location?.coords?.latitude}
          longitude={location?.coords?.longitude}
          onTouchMove={() => {
            isTouchMapRef.current = true;
            clearMapTimeout();
          }}
          onTouchEnd={redirectToPoint}
          mapRef={ref => {
            mapRef.current = ref;
          }}
          onMapLoaded={() => handleMyLocation(lastLocation.current, true)}
          mapType={
            mapType === 'terrain' && Platform?.OS === 'ios'
              ? 'standard'
              : mapType
          }
          setCountVisible={onPress}
        >
          {driversNears &&
            Object.keys(tripAccepted).length <= 0 &&
            driversNears.length > 0 &&
            driversNears.map((value, index) => {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: Number(value?.latitude),
                    longitude: Number(value?.longitude),
                  }}
                >
                  <FastImage
                    style={{
                      width: 30,
                      height: 30,
                    }}
                    source={
                      value.iconMapDriver === null
                        ? require('../../../../client/assets/images/car.png')
                        : {
                            uri: value?.iconMapDriver,
                          }
                    }
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </Marker>
              );
            })}
          <MapAnimation
            onUpdateLocation={location => {
              lastLocation.current = location;
              handleMyLocation(location, true, !isTouchMapRef.current);
            }}
            onMarkerRef={ref => {
              markerRef.current = ref;
            }}
            markerRotate={markerRotate}
            markerSize={inTrip ? markerSize : markerSizeOut}
          />
          <PolylineChildren />
          <If condition={cityConfig?.showDynamicAreaInMap === '1'}>
            {zonesDynamic.length > 0 &&
              zonesDynamic
                .filter((item: any) => item.active === '1')
                .map((item: any, index: number) => {
                  return (
                    <View key={item.id}>
                      <Marker
                        style={{
                          zIndex: 1,
                        }}
                        coordinate={Helper.getLatLonCenterFromGeom(item.area)}
                        onPress={() => {
                          mapRef.current?.animateToRegion({
                            latitude: Helper.getLatLonCenterFromGeom(item.area)
                              .latitude,
                            longitude: Helper.getLatLonCenterFromGeom(item.area)
                              .longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                          });
                        }}
                      >
                        <ContainerMultiplier>
                          <TextEdit
                            size="medium"
                            color={theme.colors.background_global}
                          >
                            x{item?.multiplierValue}
                          </TextEdit>
                        </ContainerMultiplier>
                      </Marker>
                      <Polygon
                        coordinates={item.area.map((item: any) => {
                          return {
                            latitude: item.lat,
                            longitude: item.lng,
                          };
                        })}
                        strokeWidth={1}
                        fillColor={Helper.getFillColor(
                          parseFloat(item?.multiplierValue),
                        )}
                        strokeColor={Helper.getFillColor(
                          parseFloat(item?.multiplierValue),
                        )}
                      />
                    </View>
                  );
                })}
          </If>
        </Map>
      </If>
    );
  },
);

const NavigationMap = memo(
  NavigationMapComponent,
  (prevProps, nextProps) => prevProps.mapType === nextProps.mapType,
);

export default NavigationMap;
