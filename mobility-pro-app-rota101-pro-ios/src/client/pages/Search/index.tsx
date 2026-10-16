/* eslint-disable eqeqeq */
// @ts-nocheck

import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  TouchableNativeFeedback,
} from 'react-native';
import { FontAwesome, Ionicons, AntDesign } from '@expo/vector-icons';
import apiDelivery from '../../api/apiDelivery';
import Colors from '../../components/Colors';
import InputIcon from '../../components/form/InputIcon';
import LoadView from '../../components/LoadView';
import { useLocal } from '../../contexts/local';

import { translate } from '../../locales';
import { styles } from './styles';
import theme from '../../styles/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;

let timeout = null;

export default function Search({ navigation }) {
  const { placeSelected, placeUser } = useLocal();

  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [visibleFilter, setVisibleFilter] = useState(true);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [list, setList] = useState([]);

  useEffect(() => {
    async function getTypes() {
      try {
        const { data } = await apiDelivery.get(`delivery/typeDeliveryCategory`);
        setTypes(data.response);
      } catch (error) {
        console.error('Erro ao buscar tipos:', error?.message || error);
      } finally {
        setInitialLoading(false);
      }
    }

    getTypes();
  }, []);

  useEffect(() => {
    if (!text.trim() && categories.length === 0) {
      setList([]);
      setLoading(false);
      return;
    }

    clearTimeout(timeout);

    setLoading(true);

    timeout = setTimeout(() => {
      const place = placeSelected || placeUser;

      if (!place) {
        setList([]);
        setLoading(false);
        return;
      }

      apiDelivery
        .get(
          `delivery/company/near?lat=${place.latitude}&lng=${place.longitude
          }&q=${encodeURIComponent(text)}&categories=${categories.join(',')}`,
        )
        .then(({ data: { response } }) => {
          setList(response?.data || []);
          setLoading(false);
        })
        .catch(error => {
          console.error('Erro ao buscar estabelecimentos:', error?.message || error);
          setList([]);
          setLoading(false);
        });
    }, 1500);

    return () => {
      clearTimeout(timeout);
    };
  }, [text, categories, placeSelected, placeUser]);

  function isOpeningStatus(establishment) {
    if (!establishment.company_delivery_order_config) return false;

    return establishment.company_delivery_order_config.isOpen === true;
  }

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadView />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <InputIcon
        nameIcon="chevron-left"
        inputProps={{
          placeholder: translate('search.text_placeholder_find_establishments'),
          autoFocus: true,
        }}
        value={text}
        onChangeText={value => {
          setLoading(true);
          setText(value);
        }}
        iconProps={{ onPress: () => navigation.goBack() }}
      />
      <View style={styles.contentFilter}>
        <TouchableOpacity
          style={styles.buttonFilter}
          onPress={() => setVisibleFilter(true)}
        >
          <Text style={{ color: theme.colors.white }}>
            {translate('search.show_categories_filter')}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ListHeaderComponent={
          <>
            {loading && (
              <View style={styles.containerLoading}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
              </View>
            )}
          </>
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.1}
        data={list}
        renderItem={({ item }) => {
          const { component } = item;
          if (component) {
            return component;
          }
          return (
            <TouchableNativeFeedback
              key={item.id}
              onPress={() => {
                navigation.navigate('Restaurant', { restaurant: item });
              }}
            >
              <View
                style={[
                  styles.containerItem,
                  isOpeningStatus(item) ? null : styles.buttonDisabled,
                ]}
              >
                <ImageBackground
                  style={styles.logoItem}
                  imageStyle={{ borderRadius: 10, resizeMode: 'cover' }}
                  source={{ uri: item.company_delivery_config.picture }}
                />
                <View style={styles.contentItem}>
                  <Text style={styles.nameItem} numberOfLines={2}>
                    {item.fantasyName}
                  </Text>
                  {/* <Text style={styles.detailsItem}>5 - Fast Food</Text> */}

                  <View style={styles.textRating}>
                    <FontAwesome name="star" size={12} color={theme.colors.yellowStrong} />
                    <Text style={{ marginLeft: 5, color: theme.colors.yellowStrong }}>
                      {item.company_delivery_config.deliveryRating.toFixed(2)}
                    </Text>
                  </View>
                  <Text style={styles.estimativeItem}>
                    {item.proximity.toFixed(1)} KM
                  </Text>
                  {!isOpeningStatus(item) && (
                    <Text style={styles.textIsClosed}>
                      {translate('search.text_closed')}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableNativeFeedback>
          );
        }}
        keyExtractor={(item, index) => `${index.toString()}`}
      />
      <Modal
        animationType="slide"
        onRequestClose={() => {
          setVisibleFilter(false);
          setCategories([]);
        }}
        visible={visibleFilter}
        transparent
      >
        <SafeAreaView style={styles.contentFilterModal}>
          <TouchableOpacity
            style={{ margin: 10 }}
            onPress={() => {
              setVisibleFilter(false);
              setCategories([]);
            }}
          >
            <AntDesign name="arrow-left" size={30} color="black" />
          </TouchableOpacity>
          <FlatList
            style={styles.contentFilterModal}
            data={types}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  if (categories.includes(item.id)) {
                    setCategories([...categories.filter(id => item.id !== id)]);
                  } else {
                    setCategories([...categories, item.id]);
                  }
                }}
              >
                <View
                  style={[
                    styles.btnItemFilter,
                    categories.includes(item.id)
                      ? styles.btnItemFilterActive
                      : null,
                  ]}
                >
                  <Text>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => `${item.id}`}
          />
          <TouchableOpacity
            style={styles.btnFilter}
            onPress={() => {
              setVisibleFilter(false);
              setLoading(true);
            }}
          >
            <Text style={{ color: theme.colors.white, fontSize: 14 }}>
              {translate('search.text_filter')}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
