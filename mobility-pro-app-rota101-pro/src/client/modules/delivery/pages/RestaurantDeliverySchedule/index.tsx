// @ts-nocheck

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import moment from 'moment';
import {styles} from './styles';

export default function RestaurantDeliverySchedule({route}) {
  const {restaurant} = route.params;

  return (
    <ScrollView style={styles.container}>
      {restaurant.company_open_hours.map((item, key) => {
        return (
          <View style={styles.contentItem} key={key}>
            <Text style={styles.textItem}>{item.description}</Text>
            <Text style={styles.textItem}>{`${moment(
              item.hourStart,
              'HH:mm',
            ).format('HH:mm')} às ${moment(item.hourStop, 'HH:mm').format(
              'HH:mm',
            )}`}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}
