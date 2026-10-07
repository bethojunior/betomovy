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
import {SafeAreaView} from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import InputIcon from '../../components/form/InputIcon';
import apiMain from '../../api/apiMain';
import LoadView from '../../components/LoadView';
import {useAuth} from '../../../context/auth';
import {translate} from '../../locales';
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
    if (!text || text.trim().length === 0) {
      setListAddress([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    clearTimeout(timeOut);

    function getLocalString() {
      if (!permissionLocal || !position) return '';
      return `&latlng=${position.lat},${position.lng}`;
    }

    timeOut = setTimeout(() => {
      apiMain
        .get(`Place/Search?q=${encodeURIComponent(text)}${getLocalString()}`)
        .then(({ data: { data } }) => {
          setLoading(false);
          if (!data) {
            setListAddress([]);
            return;
          }
          setListAddress(data);
        })
        .catch(error => {
          console.error('Erro ao buscar lugares:', error?.message || error);
          setLoading(false);
          setListAddress([]);
        });
    }, 1000);
  }

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}
    >
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={{marginTop: 20}}>
          <InputIcon
            nameIcon="chevron-left"
            inputProps={{
              autoFocus: true,
              onChangeText: searchPlaces,
              placeholder: translate('searchModal.search_address'),
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
                    if (item.latitude === null && item.longitude === null) {
                      apiMain
                        .get(`geocoding/search?address=${encodeURIComponent(item.address)}`)
                        .then(({ data: { status, data } }) => {
                          if (status && data && onPlace) {
                            onPlace(data);
                          }
                        })
                        .catch(error => {
                          console.error('Erro ao buscar geocodificação:', error?.message || error);
                        });
                    } else {
                      if (onPlace) {
                        onPlace(item);
                      }
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
      </SafeAreaView>
    </Modal>
  );
}
