/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable eqeqeq */
// @ts-nocheck

import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import Helper from '../../../../utils/Helper';
import Colors from '../../../../components/Colors';
import {getCoinType} from '../../../../utils/money';

import {translate} from '../../../../locales';
import {styles} from './styles';
import {If} from '../../../../components/If';

import theme from '../../../../styles/theme';

export default function GroupComplement(props) {
  const {group, onChangeItems, selectedComplements} = props;
  const [isStart, setStart] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function getSelectedComplements() {
      if (isStart) return;

      if (selectedComplements) {
        const groupComplements = selectedComplements.find(item => {
          return item.groupId == group.id;
        });

        if (groupComplements) setItems([...groupComplements.items]);

        setStart(true);
      }
    }

    getSelectedComplements();
  }, [items]);

  return (
    <>
      <View style={styles.contentGroup} key={group.id}>
        <Text style={styles.nameGroup}>{group.name}</Text>
        <View style={styles.contentRequiredItem}>
          <Text style={styles.textAmountItem}>
            {items.length} {translate('groupComplement.text_of')}{' '}
            {group.maximumQuantity}
          </Text>
          {group.required == true ? (
            <View style={styles.tagRequired}>
              <Text style={styles.tagRequiredText}>
                {translate('groupComplement.text_required')}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      <View style={styles.contentComplementOption}>
        {group.delivery_complements.map(product => {
          const count = checkCountItemEdit(product, selectedComplements);
          return (
            <If condition={product?.active == 1} key={product.id}>
              <View style={styles.complementItem}>
                <View style={{flex: 1}}>
                  <Text style={styles.complementItemText}>{product.name}</Text>
                  <Text style={styles.complementItemPrice}>
                    + {getCoinType()} {Helper.maskMoney(product.price)}
                  </Text>
                </View>
                <OptionQuantity
                  value={count}
                  onValidate={() => {
                    return items.length < group.maximumQuantity;
                  }}
                  onAdd={() => {
                    const newItems = [...items, product];
                    onChangeItems(newItems, group.id);
                    setItems(newItems);
                  }}
                  onRemove={() => {
                    const newItems = [
                      ...items.filter((item, index) => {
                        return items.length != index + 1;
                      }),
                    ];

                    onChangeItems(newItems, group.id);
                    setItems(newItems);
                  }}
                  isLimit={items.length == group.maximumQuantity}
                />
              </View>
            </If>
          );
        })}
      </View>
    </>
  );
}

function checkCountItemEdit(product, selectedComplements) {
  if (!selectedComplements) return null;

  const groupSelected = selectedComplements.find(groupSelected => {
    return groupSelected.groupId == product.deliveryGroupComplementId;
  });

  if (!groupSelected) return null;

  const count = groupSelected.items.filter(item => {
    return item.id === product.id;
  }).length;

  return count;
}

function OptionQuantity(props) {
  const [count, setCount] = useState(0);
  const [isStart, setIsStart] = useState(false);

  const {onValidate, onAdd, onRemove, isLimit, value} = props;

  useEffect(() => {
    async function checkValueDefault() {
      if (isStart) return;
      if (value) {
        setCount(value);

        setIsStart(true);
      }
    }

    checkValueDefault();
  }, []);

  return (
    <View style={styles.containerOptionQuantity}>
      {count > 0 ? (
        <TouchableOpacity
          onPress={() => {
            if (onRemove) onRemove();
            setCount(count - 1);
          }}
        >
          <Icon
            name="ios-remove"
            color={Colors.PRIMARY}
            size={30}
            style={{padding: 5}}
          />
        </TouchableOpacity>
      ) : null}
      {count > 0 ? (
        <Text style={styles.textOptionQuantity}>{count}</Text>
      ) : null}
      <TouchableOpacity
        onPress={() => {
          if (onValidate) {
            if (onValidate(count + 1)) {
              if (onAdd) onAdd(count + 1);
              setCount(count + 1);
            }
          } else {
            if (onAdd) onAdd(count + 1);
            setCount(count + 1);
          }
        }}
      >
        <Icon
          name="ios-add"
          color={isLimit ? theme.colors.white_light : Colors.PRIMARY}
          size={30}
          style={{padding: 5}}
        />
      </TouchableOpacity>
    </View>
  );
}
