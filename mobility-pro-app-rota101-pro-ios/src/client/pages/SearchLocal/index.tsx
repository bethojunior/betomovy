// @ts-nocheck

import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import InputIcon from '../../components/form/InputIcon';
import apiMain from '../../api/apiMain';
import LoadView from '../../components/LoadView';
import {useLocal} from '../../contexts/local';
import {styles} from './styles';

let timeOut = null;

export default function SearchLocal({navigation}) {
  const {placeSelected} = useLocal();
  const [listAddress, setListAddress] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (placeSelected) navigation.goBack();
    });

    return unsubscribe;
  });

  function searchPlaces(text) {
    setLoading(true);
    clearTimeout(timeOut);
    // eslint-disable-next-line no-restricted-syntax
    timeOut = setTimeout(async function () {
      const {
        data: {data},
      } = await apiMain.get(`Place/Search?q=${text}`);
      setLoading(false);

      if (!data) return;

      setListAddress(data);
    }, 1000);
  }

  return (
    <View style={styles.container}>
      <InputIcon
        nameIcon="chevron-left"
        inputProps={{
          autoFocus: true,
          onChangeText: searchPlaces,
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
                  if (item.latitude == null && item.longitude == null) {
                    apiMain
                      .get(`geocoding/search?address=${item.address}`)
                      .then(({data: {data}}) => {
                        navigation.navigate('LocalMap', {place: data});
                      });
                  } else {
                    navigation.navigate('LocalMap', {place: item});
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
    </View>
  );
}
