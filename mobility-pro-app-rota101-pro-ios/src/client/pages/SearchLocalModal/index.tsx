// @ts-nocheck

import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import InputIcon from '../../components/form/InputIcon';
import apiMain from '../../api/apiMain';
import LoadView from '../../components/LoadView';
import {useAuth} from '../../../context/auth';
import {ItemPlace, ListPlace, styles} from './styles';

let timeOut = null;

export default function SearchLocalModal(props) {
  const [position, setPosition] = useState(null);
  const [listAddress, setListAddress] = useState([]);
  const [loading, setLoading] = useState(false);
  const {permissionLocal} = useAuth();

  const {visible, onClose, onPlace} = props;

  useEffect(() => {
    async function getLastPosition() {
      if (!permissionLocal) return;
      if (!position)
        Location.getCurrentPositionAsync({accuracy: 1}).then(({coords}) => {
          setPosition({lat: coords.latitude, lng: coords.longitude});
        });
    }

    getLastPosition();

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  function searchPlaces(text) {
    setLoading(true);
    clearTimeout(timeOut);
    // eslint-disable-next-line no-restricted-syntax
    timeOut = setTimeout(async function () {
      const {
        data: {data},
      } = await apiMain.get(`Place/Search?q=${text}${getLocalString()}`);
      setLoading(false);

      if (!data) return;

      setListAddress(data);
    }, 1000);

    function getLocalString() {
      if (!permissionLocal) return '';

      return `&latlng=${`${position.lat},${position.lng}`}`;
    }
  }

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}
    >
      <View style={styles.container}>
        <View style={{marginTop: 20}}>
          <InputIcon
            nameIcon="chevron-left"
            inputProps={{
              autoFocus: true,
              onChangeText: searchPlaces,
            }}
            iconProps={{
              onPress: () => {
                onClose();
              },
            }}
          />
        </View>
        {!loading ? (
          <ListPlace keyboardShouldPersistTaps="handled">
            {listAddress.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (item.latitude == null && item.longitude == null) {
                      apiMain
                        .get(`geocoding/search?address=${item.address}`)
                        .then(({data: {data}}) => {
                          onPlace(data);
                        });
                    } else {
                      onPlace(item);
                    }
                  }}
                  accessible
                >
                  <ItemPlace>
                    <Text style={styles.simpleName}>{item.address}</Text>
                    <Text style={styles.fullAddress}>
                      {item.neighborhood || ''}
                    </Text>
                  </ItemPlace>
                </TouchableOpacity>
              );
            })}
          </ListPlace>
        ) : (
          <LoadView />
        )}
      </View>
    </Modal>
  );
}
