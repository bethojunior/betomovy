// @ts-nocheck

import React, {useState} from 'react';

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  Text,
} from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome5';
import Colors from '../../components/Colors';
import styleMap from '../../assets/styles/map.json';
import {useLocal} from '../../contexts/local';

import {translate} from '../../locales';
import {styles} from './styles';
import {useAuth} from '../../../context/auth';

export default function LocalMap({route, navigation}) {
  const {isGuest} = useAuth();
  const {places, addPlaceSelected, updateListPlaces} = useLocal();
  const {place} = route.params;
  const [position, setPosition] = useState(null);

  return (
    <View style={styles.container}>
      <MapView
        customMapStyle={styleMap}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: position ? position.latitude : parseFloat(place.latitude),
          longitude: position
            ? position.longitude
            : parseFloat(place.longitude),
          latitudeDelta: position ? position.latitudeDelta : 0.0025,
          longitudeDelta: position ? position.longitudeDelta : 0.0025,
        }}
        onRegionChangeComplete={result => {
          setPosition(result);
        }}
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
          <View style={{padding: 15, paddingHorizontal: 20, left: 0}}>
            <Icon name="angle-left" size={30} color={Colors.PRIMARY} />
          </View>
        </TouchableOpacity>
        <View style={{marginRight: 25, paddingRight: 25}}>
          <Text style={styles.simpleAddress}>{place.address}</Text>
          <Text style={styles.fullName}>{place.neighborhood || ''}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableNativeFeedback
          onPress={() => {
            const positionSelected = position || {
              latitude: parseFloat(place.latitude),
              longitude: parseFloat(place.longitude),
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
