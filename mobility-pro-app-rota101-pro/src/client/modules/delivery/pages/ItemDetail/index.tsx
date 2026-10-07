/* eslint-disable consistent-return */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-shadow */
// @ts-nocheck

import React, {useState, useEffect, useRef} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Text} from 'react-native-elements';
import {InputCountItem} from '../../../../components/form/InputCountItem';
import LoadView from '../../../../components/LoadView';
import {useOrderService} from '../../../../contexts/orderService';
import Helper from '../../../../utils/Helper';
import apiDelivery from '../../../../api/apiDelivery';
import GroupComplement from '../../components/GroupComplement';
import ItemObservation from '../../../../components/ItemObservation';
import Colors from '../../../../components/Colors';
import CleanBagModal from '../../components/CleanBagModal';
import StoreClosedModal from '../../../../components/StoreClosedModal';
import {getCoinType} from '../../../../utils/money';

import {translate} from '../../../../locales';
import {styles} from './styles';
import theme from '../../../../styles/theme';

const windowWidth = Dimensions.get('window').width;

export default function ItemDetail({route, navigation}) {
  const modalRef = useRef();

  const {
    item,
    amountSelected,
    selectedComplements,
    id,
    observationItem,
    restaurant,
  } = route.params;
  const {addItem, establishment, addEstablishment, clearBag, editItem} =
    useOrderService();
  const [visibleCleanBag, setVisibleCleanBag] = useState(false);
  const [amount, setAmount] = useState(1);
  const [complements, setComplements] = useState([]);
  const [groupComplement, setGroupComplement] = useState([]);
  const [observation, setObservation] = useState(observationItem || '');
  const [loading, setLoading] = useState(true);
  const isDisabled = checkItemsRequired();

  function isOpeningStatus(establishment) {
    if (!establishment.company_delivery_order_config) return false;

    return establishment.company_delivery_order_config.isOpen == true;
  }

  useEffect(() => {
    async function getDetailProduct() {
      setLoading(true);
      const {
        data: {response},
      } = await apiDelivery.get(`delivery/product/${item.id}`);

      setLoading(false);

      setGroupComplement(response.delivery_group_complements);
      if (amountSelected != null) setAmount(amountSelected);
      if (selectedComplements) setComplements(selectedComplements);
    }

    getDetailProduct();
  }, []);

  function checkItemsRequired() {
    return (
      groupComplement
        .filter(group => {
          return group.required == true;
        })
        .filter(group => {
          const groupComplementSelected = complements.find(complement => {
            return complement.groupId === group.id;
          });

          if (!groupComplementSelected) return true;

          return groupComplementSelected.items.length < group.minimumQuantity;
        }).length != 0
    );
  }

  function onChangeItems(items, id) {
    const groupComplementSelected = complements.find(complement => {
      return complement.groupId == id;
    });

    if (!groupComplementSelected) {
      setComplements([...complements, {groupId: id, items}]);
    } else {
      setComplements(
        complements.map(item => {
          if (item.groupId === id) item.items = items;
          return item;
        }),
      );
    }
  }

  function addNewItem() {
    if (establishment == null) {
      addEstablishment(restaurant);
      addItem(item, amount, complements, observation);
      navigation.goBack();
    } else {
      if (establishment.company_delivery_config.companyId == item.companyId) {
        addEstablishment(restaurant);
        addItem(item, amount, complements, observation);
        navigation.goBack();
        return;
      }
      setVisibleCleanBag(true);
    }
  }

  function editItemSelected() {
    editItem(id, item, amount, complements, observation);
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <CleanBagModal
        onRequestClose={() => {
          setVisibleCleanBag(false);
        }}
        cleanBag={() => {
          clearBag({item, amount, complements, observation}, restaurant);
          navigation.goBack();
        }}
        visible={visibleCleanBag}
      />
      <ScrollView
        style={styles.containerScroll}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          resizeMode="contain"
          style={styles.logo}
          source={{uri: item.picture}}
        />
        <View style={styles.content}>
          <Text h4>{item.name}</Text>
          <Text style={styles.descriptionItem}>{item.description}</Text>
          <Text style={styles.priceItem}>
            {translate('itemDetail.text_from')} {getCoinType()}{' '}
            {Helper.maskMoney(item.price)}
          </Text>
        </View>
        {loading ? <LoadView /> : null}
        <View style={{marginVertical: 10}}>
          {groupComplement.map((group, index) => {
            return (
              <GroupComplement
                key={index}
                group={group}
                onChangeItems={onChangeItems}
                selectedComplements={selectedComplements}
              />
            );
          })}
        </View>
        {loading ? null : (
          <ItemObservation
            initValue={observation}
            onChange={text => {
              setObservation(text);
            }}
            description={translate(
              'itemDetail.text_description_any_observations',
            )}
          />
        )}
      </ScrollView>
      {loading ? (
        <></>
      ) : (
        <View style={styles.footer}>
          <InputCountItem
            initValue={amountSelected}
            changeValue={value => {
              setAmount(value);
            }}
          />
          <TouchableOpacity
            style={styles.btnContainerAddItem}
            onPress={() => {
              if (!isOpeningStatus(restaurant || establishment))
                return modalRef.current.show();

              if (selectedComplements == null) {
                addNewItem();
              } else {
                editItemSelected();
              }
            }}
            disabled={isDisabled}
          >
            <View
              style={
                isDisabled
                  ? [styles.btnAddItem, {backgroundColor: theme.colors.text_gray}]
                  : styles.btnAddItem
              }
            >
              <Text style={styles.btnTextItemAdd}>
                {amountSelected != null
                  ? translate('itemDetail.text_update')
                  : translate('itemDetail.text_add')}
              </Text>
              <Text style={[styles.btnTextItemAdd, {fontWeight: 'bold'}]}>
                {getCoinType()}{' '}
                {Helper.maskMoney(
                  Helper.calculateValueItem(item, amount, complements),
                )}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      <StoreClosedModal ref={modalRef} />
    </View>
  );
}
