// @ts-nocheck

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {styles} from './styles';

export default function RestaurantDeliveryLocations({route}) {
  const {restaurant} = route.params;

  return (
    <ScrollView style={styles.container}>
      {restaurant.company_delivery_neighborhoods.map((item, key) => {
        return (
          <View style={styles.contentItem} key={key}>
            <Text style={styles.textItem}>{item.name}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}
