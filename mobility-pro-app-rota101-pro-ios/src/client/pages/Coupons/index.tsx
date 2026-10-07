// @ts-nocheck

import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import moment from 'moment';
import apiDelivery from '../../api/apiDelivery';
import AddCoupon from '../../components/AddCoupon';
import Helper from '../../utils/Helper';
import Colors from '../../components/Colors';
import {getCoinType} from '../../utils/money';

import {translate} from '../../locales';
import {styles} from './styles';
import {useAuth} from '../../../context/auth';

moment.locale('pt-br');

export default function Coupons() {
  const {user} = useAuth();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  const listCoupons = useCallback(async () => {
    const {
      data: {response},
    } = await apiDelivery.get(`delivery/coupon/${user.idUser}`);

    setList(response);
    setLoading(false);
  }, []);

  useEffect(() => {
    listCoupons();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <AddCoupon onAddCoupon={listCoupons} />
            {loading && (
              <View style={styles.containerLoading}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
              </View>
            )}
          </>
        }
        keyboardShouldPersistTaps="handled"
        data={list}
        keyExtractor={item => `${item.id}`}
        style={styles.list}
        renderItem={({item}) => {
          return (
            <View style={styles.containerItem}>
              <View style={styles.groupDescription}>
                <Text>#{item.code}</Text>
                <Text style={styles.valueText}>
                  {item.valueType === '$' ? getCoinType() : item.valueType}
                  {Helper.maskMoney(item.value)}
                </Text>
              </View>
              <Text style={styles.smallInfo}>
                {translate('coupons.text_valid_only_at_the_establishment')}{' '}
                <Text style={{fontWeight: 'bold'}}>{item.fantasyName}</Text>
              </Text>
              <Text style={styles.smallInfo}>
                {translate('coupons.text_promotion')}{' '}
                {moment(item.dateStart).format('DD/MM/YYYY')}{' '}
                {translate('coupons.text_until')}{' '}
                {moment(item.dateEnd).format('DD/MM/YYYY')}
              </Text>
              {item.fromValue > 0 && (
                <Text style={styles.smallInfo}>
                  {translate('coupons.text_from')} {getCoinType()}
                  {Helper.maskMoney(item.fromValue)}
                </Text>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}
