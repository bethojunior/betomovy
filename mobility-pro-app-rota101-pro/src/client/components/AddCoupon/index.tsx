// @ts-nocheck
import React, {useCallback, useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {useAuth} from '../../../context/auth';
import apiDelivery from '../../api/apiDelivery';

import {translate} from '../../locales';
import {styles} from './styles';

import theme from '../../styles/theme';

export default function AddCoupon({onAddCoupon}) {
  const {user} = useAuth();

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');

  const handleAddCoupon = useCallback(async () => {
    setLoading(true);

    try {
      const {data} = await apiDelivery.post('delivery/coupon/add', {
        code: value,
        userId: user.idUser,
      });

      setLoading(false);

      setValue('');

      if (onAddCoupon) onAddCoupon();
    } catch (e) {
      ToastAndroid.showWithGravity(
        translate('addCoupon.message_error_adding_coupon'),
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      setLoading(false);
    }
  }, [value]);

  return (
    <View style={styles.containerInput}>
      <TextInput
        autoCapitalize="characters"
        autoCompleteType="off"
        value={value}
        onChangeText={text => setValue(text)}
        style={styles.input}
        placeholder={translate('addCoupon.placeholder_enter_coupon_code')}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddCoupon}>
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.primaryText} />
        ) : (
          <Text style={styles.textButton}>
            {translate('addCoupon.text_button_add')}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
