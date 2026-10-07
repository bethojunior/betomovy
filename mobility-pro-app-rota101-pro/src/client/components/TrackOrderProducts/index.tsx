// @ts-nocheck

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import NavBarEventOrder from '../NavBarEventOrder';
import Helper from '../../utils/Helper';
import {getCoinType} from '../../utils/money';

import {translate} from '../../locales';
import {HeaderOrderText, SimpleText, styles} from './styles';

import theme from '../../styles/theme';

export default function TrackOrderProducts({order}) {
  return (
    <View>
      <View style={styles.headerOrder}>
        <HeaderOrderText>
          {translate('trackOrderProducts.text_order')} #{order.id}
        </HeaderOrderText>
        <NavBarEventOrder order={order} />
      </View>
      <View style={styles.containerItem}>
        {order.delivery_order_items.map((item, key) => {
          return (
            <View key={key}>
              <View style={[styles.dataItem]}>
                <View style={styles.descriptionItem}>
                  <View style={styles.containerQuantityItem}>
                    <Text style={{fontWeight: 'bold'}}>{item.quantity}</Text>
                  </View>
                  <SimpleText style={styles.nameItemText} numberOfLines={1}>
                    {item.delivery_product.name}
                  </SimpleText>
                </View>
                <SimpleText style={styles.priceItem}>
                  {getCoinType()} {Helper.maskMoney(item.value)}
                </SimpleText>
              </View>
              {item.delivery_order_complements.map(complement => {
                return (
                  <View style={[styles.dataItem]} key={complement.id}>
                    <View style={styles.descriptionItem}>
                      <View
                        style={[
                          styles.containerQuantityItem,
                          {backgroundColor: theme.colors.white, borderColor: theme.colors.black},
                        ]}
                      >
                        <SimpleText style={{fontWeight: 'bold'}}>
                          {complement.quantity}
                        </SimpleText>
                      </View>
                      <SimpleText
                        style={[styles.nameItemText, {fontSize: 12}]}
                        numberOfLines={1}
                      >
                        {complement.delivery_complement.name}
                      </SimpleText>
                    </View>
                    <Text style={[styles.priceItem, {fontSize: 12}]} />
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    </View>
  );
}
