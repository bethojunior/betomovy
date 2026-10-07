import { useCallback, useRef } from 'react';
import { Alert, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { translate } from '../../locales';
import theme from '../../styles/theme';
import DriverMarker from '../DriverMarker';
import DestinationRoute from '../DestinationRoute';
import { useIsFocused } from '@react-navigation/native';
import MapAddressMarker, { MapAddressMarkerRef } from '../MapAddressMarker';
import { useMapAddressMarker } from '../../hooks/useMapAddressMarker';
import { useTrip } from '../../contexts/Trip';
import { useLocal } from '../../contexts/local';

const MAP_PADDING = { bottom: 0, top: 80, left: 20, right: 20 };
const MAP_PITCH = 0;
const MAP_ZOOM = 20;
const MAP_ALTITUDE = 500;

const TripMap = ({
  mapRef,
  firstLoad,
  position,
  setFirstLoad,
  polylineCoordinates,
  setVisibleProtect,
  region,
  handleChangeRegionMap,
  loadingDestinationFree,
  trip,
  switchsTrue,
  regionChangeMap,
  hideTravelOptions,
  destinationPerson,
  waypoints,
  pitch = MAP_PITCH,
  zoom = MAP_ZOOM,
  altitude = MAP_ALTITUDE,
}: any) => {
  const isFocused = useIsFocused();
  const { dispatchTripCustomer, stateTripCustomer } = useTrip();
  const { setLastPlaceSelected } = useLocal();
  const { calculateAllData, origin, destination } = stateTripCustomer;

  const destinationMarkerRef = useRef<MapAddressMarkerRef>(null);
  const originMarkerRef = useRef<MapAddressMarkerRef>(null);
  const { onRegionChange: syncDestination } = useMapAddressMarker(destinationMarkerRef);
  const { onRegionChange: syncOrigin } = useMapAddressMarker(originMarkerRef);

  const syncMarkers = useCallback(() => {
    syncDestination();
    syncOrigin();
  }, [syncDestination, syncOrigin]);

  const handleDestinationPress = useCallback(() => {
    Alert.alert(
      translate('tripDriver.do_you_want_to_change_the_destination'),
      translate('tripDriver.when_changing_the_destination_the_route_will_recalculated'),
      [
        {
          text: translate('tripDriver.cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: translate('tripDriver.accept'),
          onPress: () => {
            setLastPlaceSelected({});
            dispatchTripCustomer({ type: 'editTrip' });
          },
        },
      ],
      { cancelable: false },
    );
  }, [dispatchTripCustomer, setLastPlaceSelected]);

  const firstPolylinePoint = polylineCoordinates?.[0];
  const lastPolylinePoint = polylineCoordinates?.[polylineCoordinates.length - 1];

  const originMarkerCoordinate = firstPolylinePoint
    ? {
        latitude: Number(firstPolylinePoint.latitude),
        longitude: Number(firstPolylinePoint.longitude),
      }
    : null;

  const markerCoordinate = lastPolylinePoint
    ? {
        latitude: Number(lastPolylinePoint.latitude),
        longitude: Number(lastPolylinePoint.longitude),
      }
    : null;

  return (
    isFocused && (
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          mapPadding={MAP_PADDING}
          showsCompass={false}
          onLayout={() => {
            if (!firstLoad) {
              mapRef?.current?.animateCamera({
                center: {
                  latitude: position.latitude,
                  longitude: position.longitude,
                },
                zoom,
                altitude,
                heading: 0,
                pitch,
              });
              setFirstLoad(true);
            }
          }}
          initialCamera={{
            center: {
              latitude: position.latitude,
              longitude: position.longitude,
            },
            zoom,
            altitude,
            heading: 0,
            pitch,
          }}
          onPress={() => setVisibleProtect(false)}
          initialRegion={region}
          onRegionChange={(r) => {
            if (destinationPerson) handleChangeRegionMap(r);
            syncMarkers();
          }}
          onRegionChangeComplete={(r) => {
            loadingDestinationFree(r);
            syncMarkers();
          }}
          style={{ flex: 1 }}
          showsUserLocation={false}
          showsMyLocationButton={false}
          userInterfaceStyle="light"
          rotateEnabled={false}
          pitchEnabled={false}
          scrollEnabled={true}
        >
          {trip && !trip?.driverId && !firstPolylinePoint && (
            <Marker
              coordinate={{
                latitude: switchsTrue('latitude'),
                longitude: switchsTrue('longitude'),
              }}
              pinColor="green"
            />
          )}

          {regionChangeMap.latitude !== undefined &&
            hideTravelOptions &&
            destinationPerson &&
            Object.keys(destination).length === 0 && (
              <Marker
                coordinate={{
                  latitude: Number(regionChangeMap?.latitude),
                  longitude: Number(regionChangeMap?.longitude),
                }}
                title={translate('trip.text_your_local')}
                description={translate('trip.text_your_local')}
                pinColor="red"
              />
            )}

          {waypoints?.length > 0 &&
            waypoints?.map(
              (waypoint: any) =>
                waypoint?.latitude && (
                  <Marker
                    key={waypoint?.id}
                    coordinate={{
                      latitude: Number(waypoint?.latitude),
                      longitude: Number(waypoint?.longitude),
                    }}
                    pinColor="red"
                  />
                ),
            )}
          <Polyline
            coordinates={polylineCoordinates ?? []}
            strokeColor={theme.colors.black}
            strokeWidth={3}
          />
          <DriverMarker />
          {trip && trip?.driverId && <DestinationRoute />}
        </MapView>

        {trip && !trip?.driverId && originMarkerCoordinate && (
          <MapAddressMarker
            ref={originMarkerRef}
            mapRef={mapRef}
            coordinate={originMarkerCoordinate}
            variant="origin"
            title={origin?.address}
          />
        )}

        {trip && !trip?.driverId && markerCoordinate && (
          <MapAddressMarker
            ref={destinationMarkerRef}
            mapRef={mapRef}
            coordinate={markerCoordinate}
            variant="destination"
            eta={Number(calculateAllData.duration)}
            title={destination?.address}
            onPress={() => !hideTravelOptions && handleDestinationPress()}
            conflictCoordinate={originMarkerCoordinate}
            showNavigationIcon={!hideTravelOptions}
          />
        )}
      </View>
    )
  );
};

export default TripMap;
