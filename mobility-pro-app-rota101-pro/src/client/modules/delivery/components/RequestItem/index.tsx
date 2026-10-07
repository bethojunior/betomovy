// @ts-nocheck

import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Avatar} from 'react-native-elements';
import Colors from '../../../../components/Colors';
import OrderTimeline from '../OrderTimeline';
import theme from '../../../../styles/theme';

import {translate} from '../../../../locales';
import {
  styles,
  OptionButtonText,
  ResumeEstablishment,
  ContainerItem,
  SimpleText,
} from './styles';

export default function RequestItemRequestItem(props) {
  const {order, onPress} = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{backgroundColor: theme.colors.background_global}}
    >
      <ContainerItem>
        <View style={styles.infoEstablishment}>
          <Avatar
            size="medium"
            rounded
            source={{uri: order.company.company_delivery_config.picture}}
            containerStyle={styles.logoEstablishment}
          />
          <View style={{flex: 1}}>
            <SimpleText>{order.company.fantasyName}</SimpleText>
            <ResumeEstablishment>
              #{order.id} - {order.delivery_order_status.description}
            </ResumeEstablishment>
          </View>
        </View>
        <OrderTimeline order={order} />
        <View style={styles.requestOptions}>
          <View style={styles.contentOptionButton}>
            <OptionButtonText>
              {translate('requestItem.text_view_more')}
            </OptionButtonText>
          </View>
        </View>
      </ContainerItem>
    </TouchableOpacity>
  );
}
