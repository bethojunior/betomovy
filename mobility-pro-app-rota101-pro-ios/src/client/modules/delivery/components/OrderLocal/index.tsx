// @ts-nocheck

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome5';
import {Feather} from '@expo/vector-icons';
import {useLocal} from '../../../../contexts/local';

import {translate} from '../../../../locales';
import {styles} from './styles';

export default function OrderLocal(props) {
  const {navigation} = props;
  const {placeSelected} = useLocal();
  return (
    <View style={styles.header}>
      <Text style={styles.titleDeliveryLocal}>
        {translate('orderLocal.text_deliver_in')}
      </Text>
      <TouchableOpacity
        onPress={() => {
          navigation?.navigate('Local');
        }}
      >
        <View style={styles.btnLocation}>
          <Feather
            style={styles.iconLocal}
            name="map-pin"
            size={30}
            color="black"
          />
          <View style={styles.contentLocal}>
            <Text style={styles.titleLocal} numberOfLines={2}>
              {placeSelected
                ? placeSelected.address
                : translate('orderLocal.text_inform_the_delivery_location')}
            </Text>
            <Text style={styles.subtitleLocal} numberOfLines={1}>
              {placeSelected ? placeSelected.neighborhood : ''}
            </Text>
          </View>
          <Icon name="chevron-right" size={25} color="#333" />
        </View>
      </TouchableOpacity>
      <View style={styles.contentDescriptionInfoDelivery}>
        <Text style={styles.descriptionTitleLocal}>
          {translate('orderLocal.text_standard_delivery')}
        </Text>
        <Text style={[styles.subtitleLocal, {display: 'none'}]} />
      </View>
    </View>
  );
}
