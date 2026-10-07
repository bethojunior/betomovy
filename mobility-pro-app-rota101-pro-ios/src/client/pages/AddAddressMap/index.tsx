// @ts-nocheck

import React, {useState} from 'react';
import {View, TouchableOpacity, Text, ScrollView, Alert} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Icon from '@expo/vector-icons/FontAwesome5';
import {Input} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import styleMap from '../../assets/styles/map.json';
import Colors from '../../components/Colors';
import {useLocal} from '../../contexts/local';

import {translate} from '../../locales';
import {styles} from './styles';

export default function AddAddressMap(props) {
  const [loading, setLoading] = useState(false);
  const {addLocal, addPlaceSelected} = useLocal();
  const [numberAddress, setNumberAddress] = useState('');
  const [complement, setComplement] = useState('');
  const [referencePoint, setReferencePoint] = useState('');
  const {route, navigation} = props;

  const {place, position} = route.params;

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />
      <View style={styles.header}>
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
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          pitchEnabled={false}
          rotateEnabled={false}
          scrollEnabled={false}
          zoomEnabled={false}
          customMapStyle={styleMap}
          region={{
            latitude: position.latitude,
            longitude: position.longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          }}
        />
      </View>
      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={{paddingVertical: 10}}>
          <Text style={styles.simpleAddress}>{place.address}</Text>
          <Text style={styles.fullName}>{place.neighborhood || ''}</Text>
          <View style={styles.contentInputs}>
            <View style={{width: '40%'}}>
              <Text style={styles.textInput}>
                {translate('addAddressMap.text_number')}
              </Text>
              <Input
                value={numberAddress}
                onChangeText={text => {
                  setNumberAddress(text);
                }}
                placeholder={translate(
                  'addAddressMap.text_placeholder_example_number',
                )}
                style={{flex: 1}}
              />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.textInput}>
                {translate('addAddressMap.text_complement')}
              </Text>
              <Input
                value={complement}
                placeholder={translate(
                  'addAddressMap.text_placeholder_apt_block_home',
                )}
                onChangeText={text => {
                  setComplement(text);
                }}
                style={{flex: 1}}
              />
            </View>
          </View>
          <View style={styles.contentInputs}>
            <View style={{flex: 1}}>
              <Text style={styles.textInput}>
                {translate('addAddressMap.text_reference_point')}
              </Text>
              <Input
                value={referencePoint}
                placeholder=""
                onChangeText={text => {
                  setReferencePoint(text);
                }}
                style={{flex: 1}}
              />
            </View>
          </View>
          <TouchableOpacity
            // eslint-disable-next-line consistent-return
            onPress={async () => {
              const requestObject = {
                address: place.address,
                alias: 'favorite-customer',
                number: numberAddress,
                complement,
                referencePoint,
                latitude: position.latitude,
                longitude: position.longitude,
              };

              if (requestObject.number.length <= 0) delete requestObject.number;

              setLoading(true);

              const {data, message, status, errors} = await addLocal(
                requestObject,
              );

              setLoading(false);

              if (!status) return Alert.alert(message, errors.message);

              await addPlaceSelected(data);

              navigation.goBack();
              navigation.goBack();
            }}
          >
            <View style={styles.btnSaveAddress}>
              <Text style={styles.btnSaveAddressText}>
                {translate('addAddressMap.text_save_address')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
