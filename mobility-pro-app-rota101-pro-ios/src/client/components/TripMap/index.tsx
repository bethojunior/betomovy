import {memo} from 'react';
import {Image} from 'react-native-elements';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {translate} from '../../locales';
import {MarkerLabel} from '../MarkerLabel';
import theme from '../../styles/theme';
import DriverMarker from '../DriverMarker';
import DestinationRoute from '../DestinationRoute';
import {useIsFocused} from '@react-navigation/native';

const TripMap = memo(
  ({
    mapRef,
    firstLoad,
    position,
    setFirstLoad,
    polylineCoordinates,
    setVisibleProtect,
    region,
    handleChangeRegionMap,
    loadingDestinationFree,
    mapStyle,
    trip,
    switchsTrue,
    regionChangeMap,
    hideTravelOptions,
    destinationPerson,
    destination,
    waypoints,
  }: any) => {
    const isFocused = useIsFocused();

    return (
      isFocused && (
        <MapView
          ref={mapRef}
          mapPadding={{
            bottom: 20,
            top: 80,
            left: 20,
            right: 20,
          }}
          showsCompass={false}
          onLayout={() => {
            if (!firstLoad) {
              mapRef?.current?.animateCamera({
                center: {
                  latitude: position.latitude,
                  longitude: position.longitude,
                },
                zoom: 19,
                heading: 0,
                pitch: 90,
              });
              setFirstLoad(true);
            }
          }}
          minZoomLevel={polylineCoordinates ? null : 15}
          initialCamera={{
            center: {
              latitude: position.latitude,
              longitude: position.longitude,
            },
            altitude: 0,
            zoom: 19,
            heading: 0,
            pitch: 90,
          }}
          onPress={() => setVisibleProtect(false)}
          initialRegion={region}
          onRegionChange={region => {
            destinationPerson ? handleChangeRegionMap(region) : null;
          }}
          onRegionChangeComplete={region => {
            loadingDestinationFree(region);
          }}
          style={{flex: 1}}
          showsUserLocation={false}
          showsMyLocationButton={false}
          customMapStyle={mapStyle}
        >
          {trip && !trip?.driverId && (
            <Marker
              coordinate={{
                latitude: switchsTrue('latitude'),
                longitude: switchsTrue('longitude'),
              }}
              importantForAccessibility="no-hide-descendants"
            >
              <Image
                style={{
                  width: 35,
                  height: 35,
                }}
                source={require('../../assets/images/pinGreen3D.png')}
              />
            </Marker>
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
                importantForAccessibility="no-hide-descendants"
              >
                <Image
                  style={{
                    width: 35,
                    height: 35,
                  }}
                  source={require('../../assets/images/pin3d.png')}
                />
              </Marker>
            )}
          {waypoints?.length > 0 &&
            waypoints?.map(
              waypoint =>
                waypoint?.latitude && (
                  <Marker
                    key={waypoint?.id}
                    coordinate={{
                      latitude: Number(waypoint?.latitude),
                      longitude: Number(waypoint?.longitude),
                    }}
                  >
                    <Image
                      style={{
                        width: 35,
                        height: 35,
                      }}
                      source={require('../../assets/images/pin3d.png')}
                    />
                  </Marker>
                ),
            )}
          {destination.latitude && !hideTravelOptions && (
            <MarkerLabel local={destination} address={destination?.address} />
          )}
          {polylineCoordinates && (
            <Polyline
              coordinates={polylineCoordinates}
              strokeColor={theme.colors.black}
              strokeWidth={3}
            />
          )}
          <DriverMarker />
          <DestinationRoute />
        </MapView>
      )
    );
  },
);

export default TripMap;
