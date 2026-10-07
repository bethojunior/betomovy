/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable array-callback-return */
// @ts-nocheck

import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import {Text} from 'react-native-elements';
import Icon from '@expo/vector-icons/FontAwesome5';
import Colors from '../../../../components/Colors';
import apiDelivery from '../../../../api/apiDelivery';
import Helper from '../../../../utils/Helper';
import LoadView from '../../../../components/LoadView';
import {useTabbar} from '../../../../contexts/tabBar';
import {getCoinType} from '../../../../utils/money';

import {translate} from '../../../../locales';
import {styles} from './styles';
import {useAuth} from '../../../../../context/auth';

let scrollPage = null;
let scrollTab = null;
let itemsPage = {};
let itemsTab = {};
const timeoutScroll = null;

import theme from '../../../../styles/theme';

export default function Restaurant({route, navigation}) {
  const activeAnimation = useRef(false);
  const {singleDelivery} = useAuth();
  const {setVisibleTabbar} = useTabbar();
  const [products, setProducts] = useState([]);
  const {restaurant} = route.params;
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProducts() {
      const {
        data: {response},
      } = await apiDelivery.get(
        `delivery/company/${restaurant.company_delivery_config.companyId}/products`,
      );

      setLoading(false);
      setProducts(
        response.map(item => {
          return {
            id: item.id,
            title: item.name,
            data: item.delivery_products,
          };
        }),
      );
    }

    itemsPage = {};
    itemsTab = {};
    getProducts();
    setVisibleTabbar(false);

    return () => {
      clearTimeout(timeoutScroll);
      setVisibleTabbar(true);
    };
  }, []);

  function isOrderMinPrice() {
    if (restaurant.company_delivery_order_config) {
      if (restaurant.company_delivery_order_config.minimumOrderValue > 0)
        return true;
    }

    return false;
  }

  const statusOpenEstablishment = checkOpenEstablishment(restaurant);
  return (
    <SafeAreaView style={styles.container}>
      {/* <NavBar
        restaurant={restaurant}
        navigation={navigation}
        singleDelivery={singleDelivery}
      /> */}
      <ScrollView
        ref={ref => {
          scrollPage = ref;
        }}
        scrollEventThrottle={16}
        onScroll={event => {
          if (activeAnimation.current) return;
          const position = event.nativeEvent.contentOffset.y;
          let component = null;
          let index = 0;
          Object.keys(itemsPage).map((attribute, indexPosition) => {
            const value = itemsPage[attribute];
            if (component == null || position >= value - 200) {
              component = {id: attribute, position: value};
              index = indexPosition;
            }
          });

          if (component) {
            if (active !== index) {
              if (scrollTab == null) return;
              scrollTab.scrollTo({
                x: itemsTab[component.id],
                y: 0,
                animated: true,
              });
            }
            setActive(index);
          }
        }}
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator
      >
        <>
          <View style={styles.contentRestaurant}>
            <ButtonOptionRestaurant
              title={translate('restaurant.text_title_view_delivery_area')}
              onPress={() => {
                navigation.navigate('RestaurantDeliveryLocations', {
                  restaurant,
                });
              }}
            />
            <ButtonOptionRestaurant
              title={statusOpenEstablishment.value}
              color={statusOpenEstablishment.isClose ? 'red' : '#00b345'}
              onPress={() => {
                navigation.navigate('RestaurantDeliverySchedule', {
                  restaurant,
                });
              }}
            />
          </View>
          {isOrderMinPrice() ? (
            <View style={styles.containerMinPrice}>
              <Text style={styles.textMinPrice}>
                {translate('restaurant.text_minimum_order')}:{' '}
                <Text style={{fontWeight: 'bold'}}>
                  {getCoinType()}
                  {Helper.maskMoney(
                    restaurant.company_delivery_order_config.minimumOrderValue,
                  )}
                </Text>
              </Text>
            </View>
          ) : null}
        </>
        {products.length === 0 && !loading ? <WithoutMenu /> : null}
        {loading ? <LoadView /> : null}
        <TabHeader
          products={products}
          activeSelected={active}
          onChangeActive={() => {
            activeAnimation.current = true;
            setTimeout(() => {
              activeAnimation.current = false;
            }, 500);
          }}
        />
        <ListItem
          products={products}
          navigation={navigation}
          restaurant={restaurant}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function WithoutMenu() {
  return (
    <View style={styles.contentWithoutMenu}>
      <Text style={styles.labelWithoutMenu}>
        {translate('restaurant.text_does_not_have_a_menu')}
      </Text>
    </View>
  );
}

function TabHeader(props) {
  const {products, activeSelected, onChangeActive} = props;
  const [active, setActive] = useState(null);

  useEffect(() => {
    setActive(activeSelected);
  }, [activeSelected]);
  return (
    <ScrollView
      horizontal
      style={styles.containerTab}
      ref={ref => {
        scrollTab = ref;
      }}
      showsHorizontalScrollIndicator={false}
    >
      {products.map((item, index) => {
        return (
          <TouchableOpacity
            onLayout={event => {
              const {layout} = event.nativeEvent;
              itemsTab[item.id] = layout.x;
            }}
            onPress={() => {
              scrollTab.scrollTo({
                x: itemsTab[item.id],
                y: 0,
                animated: true,
              });
              scrollPage.scrollTo({
                x: 0,
                y: itemsPage[item.id],
                animated: true,
              });
              setActive(index);
              onChangeActive();
            }}
            key={index}
          >
            <View
              style={[
                styles.tabItem,
                active === index
                  ? {borderBottomColor: '#000', borderBottomWidth: 1}
                  : {},
              ]}
            >
              <Text
                style={{
                  color: active === index ? Colors.PRIMARY : '#666',
                  fontSize: 16,
                }}
              >
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function ListItem({products, navigation, restaurant}) {
  return products.map(({id, data, title}, index) => {
    return (
      <View
        style={styles.containeItem}
        key={index}
        onLayout={event => {
          const {layout} = event.nativeEvent;
          itemsPage[id] = layout.y;
        }}
      >
        <View style={styles.headerCategory}>
          <Text style={styles.headerTextCategory}>{title}</Text>
        </View>
        {data.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (item.active == true) {
                  navigation.navigate('ItemDetail', {item, restaurant});
                } else {
                  Alert.alert(
                    'Produto indisponível',
                    'Esse item está indisponível no momento',
                  );
                }
              }}
            >
              <View
                style={[
                  item.active == true
                    ? styles.infoProduct
                    : styles.infoProductOffline,
                ]}
              >
                <View style={styles.containerInfoProduct}>
                  <Text style={styles.titleProduct} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.descriptionProduct} numberOfLines={3}>
                    {item.description}
                  </Text>
                  <Text style={styles.priceProduct}>
                    {item.isOpenValue == false
                      ? `${getCoinType()} ${Helper.maskMoney(item.price)}`
                      : `A partir de ${getCoinType()} ${Helper.maskMoney(
                          item.price,
                        )}`}
                  </Text>
                  {item.active == false && (
                    <View style={styles.contentOffline}>
                      <Text style={{color: theme.colors.white}}>
                        {translate('restaurant.text_offline')}
                      </Text>
                    </View>
                  )}
                </View>
                <Image
                  source={{uri: item.picture}}
                  style={styles.logoProduct}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  });
}

function NavBar(props) {
  const {restaurant, navigation, singleDelivery} = props;
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY,
      }}
    >
      {!singleDelivery ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.btnBackNavBar}>
            <Icon name="chevron-left" size={25} color={theme.colors.primaryText} />
          </View>
        </TouchableOpacity>
      ) : null}
      <Text
        style={{
          color: theme.colors.primaryText,
          fontSize: 18,
          top: 15,
          position: 'absolute',
          textAlign: 'center',
          width: '100%',
          zIndex: -1,
        }}
      >
        {restaurant.fantasyName}
      </Text>
    </View>
  );
}

function checkOpenEstablishment(restaurant) {
  if (!restaurant.company_delivery_order_config.isOpen)
    return {isClose: true, value: translate('restaurant.text_closed')};

  return {
    isClose: false,
    value: `${translate('restaurant.text_open_util')}`,
  };
}

function ButtonOptionRestaurant(props) {
  const {title, color, onPress} = props;
  return (
    <View style={styles.contentOptionBtn}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.optionBtn}>
          <Text
            style={{color: color || '#666', fontWeight: 'bold', fontSize: 12}}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
