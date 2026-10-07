/* eslint-disable default-case */
/* eslint-disable consistent-return */
// @ts-nocheck

import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import Helper from '../../../../utils/Helper';
import {useOrderService} from '../../../../contexts/orderService';
import {useLocal} from '../../../../contexts/local';
import apiDelivery from '../../../../api/apiDelivery';
import LoadView from '../../../../components/LoadView';
import {getCoinType} from '../../../../utils/money';
import {DELIVERY_TYPE} from '../../../../constants/orderDeliveryType';

import {translate} from '../../../../locales';
import {styles} from './styles';

import theme from '../../../../styles/theme';

export default function OrderDetailValues() {
  const {
    bag,
    establishment,
    deliveryPrice,
    coupon,
    orderDeliveryType,
    setCoupon,
    setDeliveryPrice,
    setLoadingRate,
    setDeliveryRateId,
  } = useOrderService();
  const {placeSelected, placeUser} = useLocal();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDeliveryPrice() {
      if (existLocal()) {
        const place = placeSelected || placeUser;

        setLoading(true);
        setLoadingRate(false);
        const {
          data: {response},
        } = await apiDelivery.post(
          `delivery/company/${establishment.id}/companyDeliveryArea`,
          {
            lat: place.latitude,
            lng: place.longitude,
          },
        );
        setLoadingRate(true);

        if (response) {
          setDeliveryPrice(response.tax);
          setDeliveryRateId(response.id != null ? response.id : null);
        } else {
          setDeliveryPrice(null);
          setDeliveryRateId(null);
        }
      } else {
        setDeliveryRateId(null);
        setDeliveryPrice(null);
      }

      setLoading(false);
    }
    getDeliveryPrice();
  }, [placeSelected]);

  function existLocal() {
    return establishment != null && placeSelected != null;
  }

  function calculateTotalOrder() {
    const valueItems = calculateTotalItems(bag);

    let value = valueItems;

    if (orderDeliveryType === DELIVERY_TYPE)
      value = deliveryPrice ? value + deliveryPrice : value;

    if (coupon !== null) {
      if (valueItems >= coupon.fromValue) {
        value -=
          coupon.valueType === '$'
            ? coupon.value
            : (value * coupon.value) / 100;
        if (value < 0) value = 0;
      } else {
        setCoupon(null);
      }
    }

    return value;
  }

  function getDiscountByValueType(valueType) {
    switch (coupon.valueType) {
      case '$':
        return `${getCoinType()} ${Helper.maskMoney(coupon.value)}`;
      case '%':
        return `${Helper.maskMoney(coupon.value)}%`;
    }
  }

  return (
    <View style={styles.containerTotals}>
      {loading ? (
        <LoadView />
      ) : (
        <>
          <View style={styles.contentItemTotals}>
            <Text style={styles.subtotalsText}>
              {translate('orderDetailValues.text_subtotal')}
            </Text>
            <Text style={styles.subtotalsText}>
              {getCoinType()} {Helper.maskMoney(calculateTotalItems(bag))}
            </Text>
          </View>
          {existLocal() &&
            deliveryPrice != null &&
            orderDeliveryType === DELIVERY_TYPE && (
              <View style={styles.contentItemTotals}>
                <Text style={styles.subtotalsText}>
                  {translate('orderDetailValues.text_standard_delivery')}
                </Text>
                <Text style={styles.subtotalsText}>
                  {deliveryPrice > 0
                    ? `${getCoinType()} ${Helper.maskMoney(deliveryPrice)}`
                    : translate('orderDetailValues.text_free_of_charge')}
                </Text>
              </View>
            )}
          {coupon !== null && (
            <View style={styles.contentItemTotals}>
              <Text style={styles.subtotalsText}>
                {translate('orderDetailValues.text_coupon')}
              </Text>
              <Text style={[styles.subtotalsText, {color: theme.colors.border_green}]}>
                - {getDiscountByValueType(coupon.valueType)}
              </Text>
            </View>
          )}
          <View style={[styles.contentItemTotals, {marginTop: 10}]}>
            <Text style={styles.totalsText}>
              {translate('orderDetailValues.text_total')}
            </Text>
            <Text style={styles.totalsText}>
              {getCoinType()} {Helper.maskMoney(calculateTotalOrder())}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

export function calculateTotalItems(bag) {
  const list = bag.map(({item, amount, complements}) => {
    return Helper.calculateValueItem(item, amount, complements);
  });

  if (list.length > 0)
    return list.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    });

  return 0;
}
