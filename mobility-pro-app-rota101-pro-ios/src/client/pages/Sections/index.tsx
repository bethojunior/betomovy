// @ts-nocheck

import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Location from 'expo-location';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLocal} from '../../contexts/local';
import PermissionLocal from '../PermissionLocal';
import LocalInput from '../../components/form/LocalInput';
import {translate} from '../../locales';
import InputIcon from '../../components/form/InputIcon';
import apiDelivery from '../../api/apiDelivery';
import LoadView from '../../components/LoadView';
import ListRestaurant from '../../modules/delivery/pages/ListRestaurants';
import CardPublicity from '../../components/CardPublicty';
import ContactUsBySection from '../../components/ContactUsBySection';
import {
  Container,
  ContainerItem,
  ContentItem,
  IconItem,
  List,
  TextItem,
  Title,
} from './styles';
import {useAuth} from '../../../context/auth';
import {AppTypeConst} from '../../constants/app';

export default function Sections() {
  const {permissionLocal} = useAuth();
  const {placeSelected, getLocalByPosition} = useLocal();

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadTest, setLoadTest] = useState(false);
  const [position, setPosition] = useState(null);
  const [isWithoutLocal, setIsWithoutLocal] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    async function getSections() {
      const {
        data: {response},
      } = await apiDelivery.get('delivery/section');
      setSections(response);
      setLoading(true);
    }

    getSections();
  }, []);

  useEffect(() => {
    async function getEstablishment() {
      if (placeSelected == null) {
        getByLocal();
      } else {
        getDeliveryCompanys(placeSelected.latitude, placeSelected.longitude);
      }
    }

    // eslint-disable-next-line eqeqeq
    if (permissionLocal == true || placeSelected != null) getEstablishment();
  }, [placeSelected, permissionLocal]);

  async function getByLocal() {
    const permissions = JSON.parse(await AsyncStorage.getItem('permissions'));
    const {status} = await Location.getForegroundPermissionsAsync({
      accuracy: 1,
    });

    if (status === 'granted') {
      const {coords} = await Location.getCurrentPositionAsync({accuracy: 1});
      const {latitude, longitude} = coords;
      getLocalByPosition(latitude, longitude);
      getDeliveryCompanys(latitude, longitude);
      permissions.location = true;
      await AsyncStorage.setItem('permissions', JSON.stringify(permissions));
    }
  }

  function getDeliveryCompanys(latitude, longitude) {
    setPosition({latitude, longitude});
  }

  if (!loading) return <LoadView />;

  if (sections.length === 0) return <ListRestaurant />;

  return (
    <Container>
      <PermissionLocal
        visible={!permissionLocal}
        onWithoutLocal={status => {
          setIsWithoutLocal(status);
        }}
      />
      <List
        ListHeaderComponent={() => {
          return (
            <>
              <LocalInput
                onPress={() => {
                  navigation.navigate('Local');
                }}
              />
              <Pressable
                onPress={() => {
                  navigation.navigate('Search');
                }}
              >
                <InputIcon
                  nameIcon="search"
                  inputProps={{
                    placeholder: translate(
                      'listEstablishment.text_placeholder_find_establishments',
                    ),
                    editable: false,
                  }}
                />
              </Pressable>
              <View
                style={{
                  marginHorizontal: 20,
                }}
              >
                <CardPublicity
                  setLoading={setLoadTest}
                  appConstPublicity={AppTypeConst}
                />
              </View>
              <Title>Seções</Title>
            </>
          );
        }}
        showsVerticalScrollIndicator={false}
        data={sections}
        numColumns={3}
        renderItem={({item}) => {
          return (
            <ContainerItem
              onPress={() =>
                navigation.navigate('ListRestaurantSection', {
                  deliverySectionId: item.id,
                })
              }
            >
              <ContentItem>
                <IconItem height={41} width={41} source={{uri: item.icon}} />
                <TextItem>{item.name}</TextItem>
              </ContentItem>
            </ContainerItem>
          );
        }}
        keyExtractor={item => `${item.id.toString()}`}
      />
      <ContactUsBySection />
    </Container>
  );
}
