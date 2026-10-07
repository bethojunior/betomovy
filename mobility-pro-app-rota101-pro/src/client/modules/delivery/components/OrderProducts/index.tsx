/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
// @ts-nocheck

import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome5';
import Helper from '../../../../utils/Helper';
import {useOrderService} from '../../../../contexts/orderService';
import OptionItemModal from '../../pages/OptionItemModal';
import Colors from '../../../../components/Colors';
import {getCoinType} from '../../../../utils/money';

import {translate} from '../../../../locales';
import {styles} from './styles';

export default function OrderProducts(props) {
  const {navigation} = props;
  const {bag, removeItem} = useOrderService();
  const [product, setProduct] = useState(null);

  function groupProducts(complements) {
    const listComplements = [];
    complements.map(group => {
      group.items.map(item => {
        const objectSelected = listComplements.find(object => {
          return object.complement.id == item.id;
        });

        if (objectSelected != null) {
          objectSelected.amount++;
        } else {
          listComplements.push({complement: item, amount: 1});
        }
      });
    });
    return listComplements;
  }

  return (
    <>
      <OptionItemModal
        product={product}
        navigation={navigation}
        onEditItem={() => {
          navigation.navigate('ItemDetail', {
            id: product.id,
            amountSelected: product.amount,
            item: product.item,
            selectedComplements: product.complements,
            observationItem: product.observation,
          });
        }}
        onRemove={() => {
          removeItem(product.id);
        }}
        onClose={() => {
          setProduct(null);
        }}
      />
      <View style={styles.listItens}>
        {bag.map(({item, amount, complements, id, observation}, index) => {
          const listComplements = groupProducts(complements);

          return (
            <View key={index} style={styles.containerItem}>
              <View style={styles.contentTitleItem}>
                <View style={styles.titleItem}>
                  <Text style={styles.titleAmountItem}>{amount}x</Text>
                  <Text style={styles.titleItemText}>{item.name}</Text>
                  <Text style={styles.titleAmountItem}>
                    {getCoinType()}{' '}
                    {Helper.maskMoney(
                      Helper.calculateValueItem(item, amount, complements),
                    )}
                  </Text>
                </View>
                {listComplements.map(({complement, amount}) => {
                  return (
                    <View style={styles.titleItem} key={complement.id}>
                      <Text style={styles.textComplementItem}>
                        - {amount}x {complement.name}
                      </Text>
                    </View>
                  );
                })}
                {observation.length > 0 ? (
                  <View style={styles.titleItem}>
                    <Text style={styles.textComplementItem}>
                      {translate('orderProducts.text_observation')}:{' '}
                      {observation}
                    </Text>
                  </View>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.btnOptionItem}
                onPress={() => {
                  setProduct({id, item, amount, complements, observation});
                }}
              >
                <Icon name="ellipsis-v" size={20} color={Colors.PRIMARY} />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </>
  );
}
