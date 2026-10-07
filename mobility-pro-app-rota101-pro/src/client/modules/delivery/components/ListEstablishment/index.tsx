/* eslint-disable eqeqeq */
// @ts-nocheck

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  FlatList,
  ImageBackground,
  Text,
  View,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../../../components/Colors';
import apiDelivery from '../../../../api/apiDelivery';
import InputIcon from '../../../../components/form/InputIcon';

import { translate } from '../../../../locales';
import ListPublicity from '~/components/ListPublicity';
import { usePublicity } from '~/hooks/usePublicity';
import { useAuth } from '~/context/auth';
import { Container, ContainerItem, styles } from './styles';
import theme from '../../../../styles/theme';
import { APP_TYPE } from '~/constants/app';
import { ADVERTISING_APP_SITE_TYPE } from '~/constants/advertisingAppSite';

const windowWidth = Dimensions.get('window').width;

export default function ListEstablishment(props) {
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const {
    position,
    navigation,
    HeaderComponent,
    isWithoutLocal,
    deliverySectionId,
  } = props;

  useEffect(() => {
    if (position) {
      loadPage(position, 1, true);
    } else if (isWithoutLocal) {
      setList([]);
      loadPageRandom();
    }
  }, [position, isWithoutLocal]);

  async function loadPageRandom() {
    try {
      setLoading(true);
      const {
        data: {
          response: { status, data, last_page },
        },
      } = await apiDelivery.get(`delivery/company/random`);
      setList(data);
      setLoading(false);
    } catch (err) {
      setList([
        {
          component: (
            <Container>
              <Text style={styles.labelError}>
                {translate('listEstablishment.text_no_establishments_found')}
              </Text>
              <Text style={styles.labelError}>
                {translate('listEstablishment.text_enter_your_location')}
              </Text>
            </Container>
          ),
        },
      ]);
      setLoading(false);
    }
  }

  async function loadPage(
    currentPosition,
    pageNumber = page,
    shouldRefresh = false,
  ) {
    if (!currentPosition) return;
    try {
      const { latitude, longitude } = currentPosition;
      if (pageNumber > totalPage && !shouldRefresh) return;
      if (loading) return;

      setLoading(true);

      const params = {
        lat: latitude,
        lng: longitude,
        pages: pageNumber,
      };

      if (deliverySectionId) {
        params.deliverySectionId = deliverySectionId;
      }

      const {
        data: {
          response: { status, data, last_page },
        },
      } = await apiDelivery.get(`delivery/company/near`, { params });
      setLoading(false);
      setTotalPage(last_page);
      setPage(pageNumber + 1);

      if (data.length > 0) {
        setList(
          shouldRefresh
            ? [...createListComponent(navigation, currentPosition), ...data]
            : [...list, ...data],
        );
      } else {
        setList([
          {
            component: (
              <Container>
                <Text style={styles.labelError}>
                  {translate('listEstablishment.text_no_establishments_found')}
                </Text>
                <Text style={styles.labelError}>
                  {translate('listEstablishment.text_enter_your_location')}
                </Text>
              </Container>
            ),
          },
        ]);
      }
    } catch (e) {
      setLoading(false);
      setList([
        {
          component: (
            <Text style={styles.labelError}>
              {translate('listEstablishment.text_unable_to_load_data')}
            </Text>
          ),
        },
      ]);
    }
  }

  async function refreshList() {
    setRefresh(true);
    await loadPage(position, 1, true);
    setRefresh(false);
  }

  function isOpeningStatus(establishment) {
    if (!establishment.company_delivery_order_config) return false;

    return establishment.company_delivery_order_config.isOpen == true;
  }

  return (
    <Container>
      <FlatList
        stickyHeaderIndices={[0]}
        ListHeaderComponent={HeaderComponent}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.1}
        onEndReached={() => loadPage(position)}
        ListFooterComponent={loading && <Loading />}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {
              refreshList();
            }}
            tintColor={theme.colors.secondary}
          />
        }
        data={list}
        renderItem={({ item }) => {
          const { component } = item;
          if (component) {
            return component;
          }
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                navigation.navigate('Restaurant', { restaurant: item });
              }}
            >
              <ContainerItem
                style={[isOpeningStatus(item) ? null : styles.buttonDisabled]}
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
                    {isWithoutLocal ? '-' : `${item.proximity.toFixed(1)} KM`}
                  </Text>
                  {!isOpeningStatus(item) && (
                    <Text style={styles.textIsClosed}>
                      {translate('listEstablishment.text_closed')}
                    </Text>
                  )}
                </View>
              </ContainerItem>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => `${index.toString()}`}
      />
    </Container>
  );
}

function EstablishmentAds({ position }) {
  const { user } = useAuth();
  const { data } = usePublicity({
    position,
    typeConst: APP_TYPE.DELIVERY,
    advertisingAppSiteId: ADVERTISING_APP_SITE_TYPE.ABERTURA,
    genderId: user?.genderId
  });

  return <ListPublicity data={data} />;
}

function createListComponent(navigation, position) {
  return [
    {
      component: (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Search');
          }}
        >
          <View>
            <InputIcon
              nameIcon="search"
              inputProps={{
                placeholder: translate(
                  'listEstablishment.text_placeholder_find_establishments',
                ),
                editable: false,
              }}
            />
          </View>
        </TouchableOpacity>
      ),
    },
    {
      component: (
        <View style={{ marginHorizontal: 20 }}>
          <EstablishmentAds position={position} />
        </View>
      ),
    },
  ];
}

function Loading() {
  return <ActivityIndicator size="small" color="#999" />;
}
