/* eslint-disable radix */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable consistent-return */
// @ts-nocheck

import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Platform,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {useNavigation} from '@react-navigation/native';
import {useOrderService} from '../../../../contexts/orderService';
import {calculateTotalItems} from '../OrderDetailValues';
import Helper from '../../../../utils/Helper';
import Colors from '../../../../components/Colors';
import apiDelivery from '../../../../api/apiDelivery';
import {useLocal} from '../../../../contexts/local';
import DataAdditionalUserToOrder from '../../../../components/DataAdditionalUserToOrder';
import {CREDIT_CARD_APP} from '../../../../constants/paymentFormType';

import {getCoinType} from '../../../../utils/money';
import {
  DELIVERY_TYPE,
  WITHDRAWAL_TYPE,
} from '../../../../constants/orderDeliveryType';
import OptionSignInModal from '../../../../components/OptionSignInModal';

import {translate} from '../../../../locales';
import {styles} from './styles';
import {useAuth} from '../../../../../context/auth';

export default function OrderFooter(props) {
  const [loading, setLoading] = useState(false);
  const {placeSelected} = useLocal();
  const dataAdditionalUserToOrderRef = useRef();
  const {isGuest} = useAuth();

  const {
    bag,
    establishment,
    paymentForm,
    deliveryPrice,
    coupon,
    change,
    card,
    loadingRate,
    deliveryRateId,
    orderDeliveryType,
    clearOrder,
    updateListOrdersActive,
  } = useOrderService();
  const {navigation} = props;

  function checkOrderMinPrice() {
    if (establishment.company_delivery_order_config != null) {
      if (
        establishment.company_delivery_order_config.minimumOrderValue >
        calculateTotalItems(bag)
      )
        return false;
    }

    return true;
  }

  async function handleOrder() {
    if (!checkOrderMinPrice()) {
      return Alert.alert(
        translate('orderFooter.title_alert_minimum_value'),
        `${translate(
          'orderFooter.message_alert_minimum_order_for_this_restaurant_is',
        )} ${getCoinType()} ${Helper.maskMoney(
          establishment.company_delivery_order_config.minimumOrderValue,
        )}, ${translate(
          'orderFooter.message_alert_does_not_include_delivery_fee',
        )}`,
        [
          {
            text: translate('orderFooter.text_button_alert_add_more_items'),
            onPress: () => {
              navigation.navigate('Restaurant', {restaurant: establishment});
            },
          },
          {
            text: translate('orderFooter.text_button_alert_cancel'),
          },
        ],
      );
    }

    if (placeSelected == null)
      return Alert.alert(
        translate('orderFooter.title_alert_please'),
        translate('orderFooter.message_alert_inform_the_delivery_location'),
      );
    if (paymentForm == null)
      return Alert.alert(
        translate('orderFooter.title_alert_please'),
        translate('orderFooter.message_alert_inform_the_payment_method'),
      );

    // if (!dataAdditionalUserToOrderRef.current.validateDataUser())
    //  return dataAdditionalUserToOrderRef.current.show();

    let value = calculateTotalItems(bag);

    if (orderDeliveryType === DELIVERY_TYPE) {
      value = deliveryPrice ? value + deliveryPrice : value;
    }

    if (coupon !== null) {
      value -=
        coupon.valueType === '$' ? coupon.value : (value * coupon.value) / 100;
      if (value < 0) value = 0;
    }

    const request = {
      companyId: establishment.id,
      value,
      deliveryPaymentFormId: paymentForm.id,
      deliveryFee: deliveryPrice,
      placeId: placeSelected.idPlace,
      deliveryItems: [
        ...bag.map(({amount, complements, item, observation}) => {
          return {
            quantity: amount,
            deliveryProductId: item.id,
            value: Helper.calculateValueItem(item, amount, complements),
            obs: observation,
            complements: Helper.getComplementByQuantity(complements),
          };
        }),
      ],
      orderDeliveryTypeId: orderDeliveryType,
    };

    if (coupon !== null) {
      request.userDiscountCouponDeliveryId = coupon.id;
    }

    if (change !== null) {
      request.changeValue = change;
    }

    if (paymentForm.paymentFormTypeId === CREDIT_CARD_APP) {
      request.cardId = card.idCard;
      request.holderDocument = card.holderDocument;
    }

    if (deliveryRateId) request.deliveryRateId = deliveryRateId;

    if (request.orderDeliveryTypeId === WITHDRAWAL_TYPE) {
      delete request.deliveryFee;
      delete request.placeId;
      if (request.deliveryRateId) delete request.deliveryRateId;
    }

    setLoading(true);

    apiDelivery
      .post('delivery/order', request)
      .then(result => {
        const {
          data: {status, message, response},
        } = result;
        setLoading(false);

        if (!status)
          return Alert.alert(
            translate('orderFooter.title_alert_attention'),
            message,
          );

        clearOrder();
        setTimeout(() => {
          updateListOrdersActive();
          // changeIndexSelectRequest(1);
          navigation.push('TrackOrder', {order: response});
        }, 500);
      })
      .catch(() => {
        setLoading(false);
        Alert.alert(
          translate('orderFooter.title_alert_attention'),
          translate('orderFooter.message_alert_unable_to_place_the_order'),
        );
      });
  }

  if (isGuest) return <ButtonGuest />;

  return (
    loadingRate && (
      <View style={styles.footer}>
        <Spinner visible={loading} />
        {deliveryPrice != null ? (
          <TouchableOpacity
            onPress={() => {
              handleOrder();
            }}
          >
            <View style={styles.btnFinish}>
              <Text style={styles.btnFinishText}>
                {translate('orderFooter.text_continue')}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <Text style={styles.textOutArea}>
            {translate('orderFooter.text_out_of_delivery_area')}
          </Text>
        )}
        <DataAdditionalUserToOrder
          onSuccess={handleOrder}
          ref={dataAdditionalUserToOrderRef}
        />
      </View>
    )
  );
}

function ButtonGuest() {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const {disablePhoneLogin} = useAuth();

  return (
    <>
      <View style={styles.containerGuest}>
        <Text style={styles.labelGuest}>
          {translate('orderFooter.text_identify_yourself_continue')}
        </Text>
        <TouchableOpacity
          style={styles.buttonGuest}
          onPress={() => {
            if (Platform.OS === 'ios' || parseInt(disablePhoneLogin.value)) {
              navigation.navigate('Login');
              return;
            }

            setVisible(true);
          }}
        >
          <Text style={styles.buttonTextGuest}>
            {translate('orderFooter.text_login_or_register')}
          </Text>
        </TouchableOpacity>
      </View>
      <OptionSignInModal
        visible={visible}
        onRequestClose={() => setVisible(false)}
      />
    </>
  );
}
