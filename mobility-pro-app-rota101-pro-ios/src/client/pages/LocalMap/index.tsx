// @ts-nocheck

import React, { useState, useEffect } from 'react';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome5';
import Colors from '../../components/Colors';
import styleMap from '../../assets/styles/map.json';
import { useLocal } from '../../contexts/local';

import { translate } from '../../locales';
import { styles } from './styles';
import { useAuth } from '../../../context/auth';
import * as Location from 'expo-location';

export default function LocalMap({ route, navigation }) {
  const { isGuest } = useAuth();
  const { places, addPlaceSelected, updateListPlaces, position: contextPosition } = useLocal();
  const { place } = route.params;
  const [position, setPosition] = useState(null);
  const [loadingGps, setLoadingGps] = useState(true);

  // Inicializa posição a partir do place recebido ou do contexto ou do GPS
  useEffect(() => {
    const initPosition = async () => {
      // 1. Se o place já tem coordenadas válidas, use-as
      const placeLat = parseFloat(place?.latitude);
      const placeLng = parseFloat(place?.longitude);
      if (!isNaN(placeLat) && !isNaN(placeLng) && placeLat !== 0 && placeLng !== 0) {
        setPosition({ latitude: placeLat, longitude: placeLng, latitudeDelta: 0.0025, longitudeDelta: 0.0025 });
        setLoadingGps(false);
        return;
      }

      // 2. Se o contexto já tem posição, use-a
      if (contextPosition?.latitude && contextPosition?.longitude) {
        setPosition({ latitude: contextPosition.latitude, longitude: contextPosition.longitude, latitudeDelta: 0.0025, longitudeDelta: 0.0025 });
        setLoadingGps(false);
        return;
      }

      // 3. Obter posição do GPS
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const last = await Location.getLastKnownPositionAsync().catch(() => null);
          if (last?.coords) {
            setPosition({ latitude: last.coords.latitude, longitude: last.coords.longitude, latitudeDelta: 0.0025, longitudeDelta: 0.0025 });
            setLoadingGps(false);
            return;
          }
          const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }).catch(() => null);
          if (current?.coords) {
            setPosition({ latitude: current.coords.latitude, longitude: current.coords.longitude, latitudeDelta: 0.0025, longitudeDelta: 0.0025 });
          }
        }
      } catch (e) {
        console.warn('LocalMap: erro GPS', e);
      } finally {
        setLoadingGps(false);
      }
    };

    initPosition();
  }, []);

  const getValidLatitude = () => position?.latitude ?? 0;
  const getValidLongitude = () => position?.longitude ?? 0;

  const latitude = getValidLatitude();
  const longitude = getValidLongitude();

  if (loadingGps) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (!position || isNaN(latitude) || isNaN(longitude) || latitude === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ padding: 20, textAlign: 'center' }}>
          {translate('localMap.error_invalid_coordinates') || 'Não foi possível obter sua localização. Verifique as permissões de GPS.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        customMapStyle={styleMap}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude,
          longitude,
          latitudeDelta: position?.latitudeDelta || 0.0025,
          longitudeDelta: position?.longitudeDelta || 0.0025,
        }}
        onRegionChangeComplete={result => {
          setPosition(result);
        }}
        userInterfaceStyle="light"
        showsUserLocation={true}
        showsMyLocationButton={false}
      />

      <Icon
        name="map-marker-alt"
        style={{
          zIndex: 3,
          position: 'absolute',
          marginTop: -37,
          marginLeft: -11,
          left: '50%',
          top: '50%',
        }}
        size={40}
        color={Colors.PRIMARY}
      />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <View style={{ padding: 15, paddingHorizontal: 20, left: 0 }}>
            <Icon name="angle-left" size={30} color={Colors.PRIMARY} />
          </View>
        </TouchableOpacity>
        <View style={{ marginRight: 25, paddingRight: 25 }}>
          <Text style={styles.simpleAddress}>{place.address}</Text>
          <Text style={styles.fullName}>{place.neighborhood || ''}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableNativeFeedback
          onPress={() => {
            const positionSelected = position || {
              latitude: getValidLatitude(),
              longitude: getValidLongitude(),
            };

            if (isGuest) {
              const requestObject = {
                idPlace: new Date().getTime(),
                address: place.address,
                alias: 'favorite-customer',
                ...positionSelected,
              };

              updateListPlaces([...places, requestObject]);

              addPlaceSelected(requestObject).then(() => {
                navigation.goBack();
              });

              return;
            }

            navigation.navigate('AddAddressMap', {
              place,
              position: positionSelected,
            });
          }}
        >
          <View style={styles.btn}>
            <Text style={styles.btnText}>
              {translate('localMap.text_save_address')}
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  );
}
