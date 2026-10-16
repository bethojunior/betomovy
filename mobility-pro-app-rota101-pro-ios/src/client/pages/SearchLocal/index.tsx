// @ts-nocheck

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import InputIcon from '../../components/form/InputIcon';
import apiMain from '../../api/apiMain';
import LoadView from '../../components/LoadView';
import { useLocal } from '../../contexts/local';
import {translate} from '../../locales';
import { styles } from './styles';

let timeOut = null;

export default function SearchLocal({ navigation }) {
  const { placeSelected } = useLocal();
  const [listAddress, setListAddress] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  useEffect(() => {
    if (!navigation?.addListener) return;
    const unsubscribe = navigation.addListener('focus', () => {
      if (placeSelected && navigation?.goBack) {
        navigation.goBack();
      }
    });

    return unsubscribe;
  }, [navigation, placeSelected]);

  function getAddressWithoutKeywords(address) {
    return address.toUpperCase().replace(/(\bAVENIDA)|(\bAV)|(\bAV\.)|(\bRUA)|(\bTV)|(\bTRAVESSA)|(\bTRV)\w+/g, "");
  }

  function searchPlaces(text) {
    if (!text || text.trim().length === 0) {
      setListAddress([]);
      return;
    }
    setLoading(true);
    clearTimeout(timeOut);
    const value = getAddressWithoutKeywords(text);
    const { latitude, longitude } = placeSelected || {};
    if (!latitude || !longitude) {
      setLoading(false);
      return;
    }
    timeOut = setTimeout(() => {
      apiMain
        .get(`Place/Search?latlng=${latitude},${longitude}&q=${encodeURIComponent(value)}`)
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <InputIcon
        nameIcon="chevron-left"
        inputProps={{
          autoFocus: true,
          onChangeText: searchPlaces,
          placeholder: translate('searchModal.search_address'),
        }}
        iconProps={{
          onPress: () => {
            navigation.goBack();
          },
        }}
      />
      {!loading ? (
        <ScrollView
          style={styles.listPlace}
          keyboardShouldPersistTaps="handled"
        >
          {listAddress.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (item.latitude === null && item.longitude === null) {
                    apiMain
                      .get(`geocoding/search?address=${encodeURIComponent(item.address)}`)
                      .then(({ data: { status, data } }) => {
                        if (status && data && navigation?.navigate) {
                          navigation.navigate('LocalMap', { place: data });
                        }
                      })
                      .catch(error => {
                        console.error('Erro ao buscar geocodificação:', error?.message || error);
                      });
                  } else {
                    if (navigation?.navigate) {
                      navigation.navigate('LocalMap', { place: item });
                    }
                  }
                }}
                accessible
              >
                <View style={styles.itemPlace}>
                  <Text style={styles.simpleName}>{item.address}</Text>
                  <Text style={styles.fullAddress}>
                    {item.neighborhood || ''}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <LoadView />
      )}
    </SafeAreaView>
  );
}
