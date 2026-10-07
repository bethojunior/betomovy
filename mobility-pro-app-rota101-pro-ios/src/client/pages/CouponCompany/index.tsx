// @ts-nocheck

import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import apiDelivery from '../../api/apiDelivery';
import Helper from '../../utils/Helper';
import Colors from '../../components/Colors';
import {useOrderService} from '../../contexts/orderService';
import {calculateTotalItems} from '../../modules/delivery/components/OrderDetailValues';
import Guest from '../../modules/delivery/pages/Guest';
import {getCoinType} from '../../utils/money';

import {translate} from '../../locales';
import {styles} from './styles';
import {useAuth} from '../../../context/auth';

moment.locale('pt-br');

export default function CouponCompany() {
  const {user, isGuest} = useAuth();
  const {coupon, bag, establishment, setCoupon} = useOrderService();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  const navigation = useNavigation();

  const listCoupons = useCallback(async () => {
    if (isGuest) return;
    const {
      data: {response},
    } = await apiDelivery.get(
      `delivery/coupon/${user.idUser}/company/${establishment.company_delivery_config.companyId}`,
    );

    setList(response);
    setLoading(false);
  }, []);

  useEffect(() => {
    listCoupons();
  }, []);

  function isCouponSelected(id) {
    if (coupon == null) return false;

    return coupon.id === id;
  }

  if (isGuest) return <Guest />;

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            {!loading && (
              <TouchableOpacity
                onPress={() => {
                  setCoupon(null);
                  navigation.navigate('BagDetail');
                }}
              >
                <View
                  style={[
                    styles.containerItem,
                    coupon === null && styles.itemActive,
                  ]}
                >
                  <Text style={{fontSize: 16}}>
                    {translate('couponCompany.text_no_coupon')}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            {loading && (
              <View style={styles.containerLoading}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
              </View>
            )}
          </>
        }
        data={list}
        keyExtractor={item => `${item.id}`}
        style={styles.list}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                if (calculateTotalItems(bag) < item.fromValue) {
                  ToastAndroid.showWithGravity(
                    `${translate(
                      'couponCompany.text_valid_coupon_for_orders_above',
                    )} ${getCoinType()}${Helper.maskMoney(item.fromValue)}`,
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                  );
                } else {
                  setCoupon(item);
                  navigation.navigate('BagDetail');
                }
              }}
            >
              <View
                style={[
                  styles.containerItem,
                  isCouponSelected(item.id) && styles.itemActive,
                ]}
              >
                <View style={styles.groupDescription}>
                  <Text>#{item.code}</Text>
                  <Text style={styles.valueText}>
                    {item.valueType === '$' ? getCoinType() : item.valueType}
                    {Helper.maskMoney(item.value)}
                  </Text>
                </View>
                <Text style={styles.smallInfo}>
                  {translate(
                    'couponCompany.text_valid_only_at_the_establishment',
                  )}{' '}
                  <Text style={{fontWeight: 'bold'}}>{item.fantasyName}</Text>
                </Text>
                <Text style={styles.smallInfo}>
                  {translate('couponCompany.text_promotion')}{' '}
                  {moment(item.dateStart).format('DD/MM/YYYY')} até{' '}
                  {moment(item.dateEnd).format('DD/MM/YYYY')}
                </Text>
                {item.fromValue > 0 && (
                  <Text style={styles.smallInfo}>
                    {translate('couponCompany.text_from')} {getCoinType()}
                    {Helper.maskMoney(item.fromValue)}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
