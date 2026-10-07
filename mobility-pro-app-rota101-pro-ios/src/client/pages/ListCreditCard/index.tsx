// @ts-nocheck

import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from '@expo/vector-icons/Feather';
import apiDelivery from '../../api/apiDelivery';
import apiMain from '../../api/apiMain';
import {useOrderService} from '../../contexts/orderService';
import Guest from '../../modules/delivery/pages/Guest';

import {translate} from '../../locales';
import {styles} from './styles';
import {useAuth} from '../../../context/auth';
import theme from '../../styles/theme';

export default function ListCreditCard({route}) {
  const navigation = useNavigation();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const {isGuest, user} = useAuth();
  const {setChange, setCard, selectedPaymentForm} = useOrderService();

  const {payment} = route.params;

  useEffect(() => {
    getListCards();

    const unsubscribe = navigation.addListener('focus', getListCards);

    return unsubscribe;
  }, []);

  const getListCards = useCallback(async () => {
    if (isGuest) return;

    setLoading(true);

    const {
      data: {status, data},
    } = await apiMain.get('CustomerCard/Get');

    if (status) setCards(data);

    setLoading(false);
  }, []);

  const selectCard = useCallback(
    async card => {
      setLoading(true);
      await apiDelivery.post('delivery/customer/asaas', {
        userId: user.idUser,
        cardId: card.idCard,
      });
      setLoading(false);

      setChange(null);
      setCard(card);
      selectedPaymentForm(payment);
      navigation.navigate('BagDetail');
    },
    [user, payment],
  );

  const removeCard = useCallback(async card => {
    Alert.alert(
      translate('listCreditCard.title_alert_attention'),
      translate('listCreditCard.message_alert_you_want_to_remove_this_card'),
      [
        {
          text: translate('listCreditCard.text_button_confirmed_alert'),
          onPress: async () => {
            try {
              setLoading(true);
              const {data} = await apiMain.post(`CustomerCard/Delete`, {
                cardId: card.idCard,
              });
              getListCards();
            } catch (err) {
              getListCards();
            }
          },
        },
        {
          text: translate('listCreditCard.text_button_denied_alert'),
        },
      ],
    );
  }, []);

  if (isGuest) return <Guest />;

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />
      <TouchableOpacity
        style={styles.buttonAddCard}
        onPress={() => {
          navigation.navigate('AddPlaymentForm');
        }}
      >
        <Text style={styles.textAddCard}>
          {translate('listCreditCard.text_add_card')}
        </Text>
      </TouchableOpacity>
      <FlatList
        data={cards}
        renderItem={({item}) => {
          return (
            <View style={styles.containerItem}>
              <TouchableOpacity
                style={styles.buttonCard}
                onPress={() => {
                  selectCard(item);
                }}
              >
                <Text style={styles.textItemCard}>
                  ****{item.number.substr(-4)}
                </Text>
              </TouchableOpacity>
              <View>
                <TouchableOpacity
                  style={styles.optionItemCard}
                  onPress={() => removeCard(item)}
                >
                  <Icon name="trash-2" size={25} color={theme.colors.grayLight} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        keyExtractor={item => item.idCard}
      />
    </View>
  );
}
