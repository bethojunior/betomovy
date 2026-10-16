// @ts-nocheck

import React, {useCallback, useEffect, useState} from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import apiDelivery from '../../api/apiDelivery';
import {order_finished} from '../../constants';
import EvaluateField from '../EvaluateField';

import {translate} from '../../locales';
import {WITHDRAWAL_TYPE} from '../../constants/orderDeliveryType';
import {styles} from './styles';

export default function EvaluateOrder({order}) {
  const [visible, setVisible] = useState(false);
  const [rated, setRated] = useState(null);
  const [ratingOfTheEstablishment, setRatingOfTheEstablishment] = useState(5);
  const [priceRange, setPriceRange] = useState(5);
  const [deliveryQuality, setDeliveryQuality] = useState(5);

  const handleEvaluate = useCallback(async () => {
    const data = {
      deliveryOrderId: order.id,
      ratingOfTheEstablishment,
      priceRange,
      deliveryQuality,
    };

    setRated(true);
    setVisible(false);

    const {
      data: {response},
    } = await apiDelivery.post(`delivery/order/evaluate`, data);
  }, [ratingOfTheEstablishment, priceRange, deliveryQuality]);

  useEffect(() => {
    setRated(order.delivery_rating != null);
    setVisible(order.delivery_rating == null);
  }, []);

  if (
    order.delivery_order_status.id !== order_finished ||
    order.orderDeliveryTypeId === WITHDRAWAL_TYPE
  )
    return null;

  if (rated == null) return null;

  if (rated)
    return (
      <View style={styles.containerRated}>
        <Text style={styles.textRated}>
          {translate('evaluateOrder.text_rated')}
        </Text>
      </View>
    );

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.message}>
          {translate('evaluateOrder.text_how_was_your_delivery')}
        </Text>
        <TouchableOpacity onPress={() => setVisible(true)}>
          <Text style={styles.textButton}>
            {translate('evaluateOrder.text_to_evaluate')}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        transparent
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.containerModal}>
          <SafeAreaView edges={['bottom']} style={styles.contentModal}>
            <Text style={styles.title}>
              {translate('evaluateOrder.text_what_did_you_think_of_your_order')}
            </Text>
            <EvaluateField
              title={translate('evaluateOrder.title_opinion_good_quality')}
              value={ratingOfTheEstablishment}
              onChange={value => setRatingOfTheEstablishment(value)}
            />
            <EvaluateField
              title={translate('evaluateOrder.title_opinion_arrived_fast')}
              value={priceRange}
              onChange={value => setPriceRange(value)}
            />
            <EvaluateField
              title={translate('evaluateOrder.title_opinion_fair_price')}
              value={deliveryQuality}
              onChange={value => setDeliveryQuality(value)}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleEvaluate()}
            >
              <Text style={styles.textColor}>
                {translate('evaluateOrder.text_send')}
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
}
