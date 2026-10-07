/* eslint-disable default-case */
/* eslint-disable consistent-return */
// @ts-nocheck

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {DELIVERY_TYPE} from '../../constants/orderDeliveryType';
import Helper from '../../utils/Helper';
import {getCoinType} from '../../utils/money';

import {translate} from '../../locales';
import {SimpleText, styles} from './styles';

import theme from '../../styles/theme';

export default function TrackOrderReview({order}) {
  function getDiscountByValueType() {
    switch (
      order.user_discount_coupon_delivery.discount_coupon_delivery.valueType
    ) {
      case '$':
        return `${getCoinType()} ${Helper.maskMoney(
          order.user_discount_coupon_delivery.discount_coupon_delivery.value,
        )}`;
      case '%':
        return `${Helper.maskMoney(
          order.user_discount_coupon_delivery.discount_coupon_delivery.value,
        )}%`;
    }
  }

  return (
    <View style={styles.containerOrderTotal}>
      <View style={styles.containerLabelOrderTotal}>
        <SimpleText style={styles.labelOrderTotal}>
          {translate('trackOrderReview.text_subtotal')}
        </SimpleText>
        <SimpleText style={styles.labelOrderTotal}>
          {getCoinType()}
          {Helper.maskMoney(
            order.delivery_order_items
              .map(item => {
                return item.value;
              })
              .reduce((accu, value) => {
                return accu + value;
              }, 0),
          )}
        </SimpleText>
      </View>
      {order.orderDeliveryTypeId === DELIVERY_TYPE && (
        <View style={styles.containerLabelOrderTotal}>
          <SimpleText style={styles.labelOrderTotal}>
            {translate('trackOrderReview.text_delivery_fee')}
          </SimpleText>
          <SimpleText style={styles.labelOrderTotal}>
            {order.deliveryFee
              ? Helper.maskMoney(order.deliveryFee)
              : translate('trackOrderReview.text_free_of_charge')}
          </SimpleText>
        </View>
      )}
      {order.user_discount_coupon_delivery != null && (
        <View style={styles.containerLabelOrderTotal}>
          <SimpleText style={styles.labelOrderTotal}>
            {translate('trackOrderReview.text_coupon')}
          </SimpleText>
          <Text style={[styles.labelOrderTotal, {color: theme.colors.border_green}]}>
            - {getDiscountByValueType()}
          </Text>
        </View>
      )}
      <View style={[styles.containerLabelOrderTotal, {marginTop: 15}]}>
        <SimpleText style={[styles.labelOrderTotal, {fontWeight: 'bold'}]}>
          {translate('trackOrderReview.text_total')}
        </SimpleText>
        <SimpleText style={[styles.labelOrderTotal, {fontWeight: 'bold'}]}>
          {getCoinType()}
          {Helper.maskMoney(order.value)}
        </SimpleText>
      </View>
    </View>
  );
}
