// @ts-nocheck

import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome5';
import IconMaterial from '@expo/vector-icons/MaterialCommunityIcons';
import Colors from '../../components/Colors';
import InputIcon from '../../components/form/InputIcon';
import SearchLocalModal from '../SearchLocalModal';
import DetailAddressModal from '../DetailAddressModal';
import {useLocal} from '../../contexts/local';
import apiMain from '../../api/apiMain';
import {translate} from '../../locales/index';
import {useAuth} from '../../../context/auth';
import {ContentLocals, styles} from './styles';
import theme from '../../styles/theme';

export default function Local({navigation}) {
  const {places, placeSelected, placeUser, updateListPlaces, addPlaceSelected} =
    useLocal();
  const {isGuest, permissionLocal} = useAuth();
  const [visible, setVisible] = useState(false);
  const [visibleModalLocal, setVisibleModalLocal] = useState(false);
  const [place, setPlace] = useState(null);

  useEffect(() => {
    getCustomerPlaces();
    const unsubscribe = navigation.addListener('focus', () => {
      getCustomerPlaces();
    });

    return unsubscribe;
  }, [navigation]);

  async function getCustomerPlaces() {
    if (isGuest) return;
    const {
      data: {data},
    } = await apiMain.get('CustomerPlace/getAll');

    updateListPlaces(data);
  }

  return (
    <View style={styles.container}>
      <SearchLocalModal
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        // eslint-disable-next-line @typescript-eslint/no-shadow
        onPlace={place => {
          setVisible(false);
          navigation.navigate('LocalMap', {place});
        }}
      />
      <DetailAddressModal
        visible={visibleModalLocal}
        place={place}
        onClose={() => {
          setVisibleModalLocal(false);
        }}
        onConfirm={() => {
          setVisibleModalLocal(false);
          navigation.navigate('LocalMap', {place});
        }}
      />
      <TouchableOpacity
        onPress={() => {
          setVisible(true);
        }}
      >
        <View>
          <InputIcon
            nameIcon="search"
            inputProps={{
              editable: false,
              placeholder: translate(
                'local.text_placeholder_search_your_location',
              ),
            }}
          />
        </View>
      </TouchableOpacity>
      <ContentLocals keyboardShouldPersistTaps="handled">
        {permissionLocal ? (
          <ItemLocal
            iconName="map-marker"
            title={translate('local.text_title_your_location')}
            description={placeUser ? placeUser.address : ''}
            active={false}
            onPress={() => {
              if (isGuest) {
                addPlaceSelected(placeUser).then(() => {
                  navigation.goBack();
                });

                return;
              }
              navigation.navigate('AddAddressMap', {
                place: placeUser,
                position: {
                  latitude: parseFloat(placeUser.latitude),
                  longitude: parseFloat(placeUser.longitude),
                },
              });
              // addPlaceSelected(null);
              // navigation.goBack();
            }}
            hideRemove
          />
        ) : null}
        {places.map((item, index) => {
          const active = placeSelected
            ? placeSelected.idPlace === item.idPlace
            : false;

          return (
            <ItemLocal
              iconName="map-marker"
              key={index}
              id={item.idPlace}
              title={item.address}
              description={item.neighborhood || ''}
              update={() => {
                getCustomerPlaces();
              }}
              active={active}
              onPress={() => {
                addPlaceSelected(item);
                navigation.goBack();
              }}
            />
          );
        })}
      </ContentLocals>
    </View>
  );
}

function ItemLocal(props) {
  const {id, active, iconName, title, description, update, hideRemove} = props;

  const {isGuest} = useAuth();

  const {places, updateListPlaces} = useLocal();

  return (
    <TouchableOpacity {...props}>
      <View
        style={
          active ? styles.containerItemLocalActive : styles.containerItemLocal
        }
      >
        <Icon
          name={iconName}
          size={20}
          color={active ? Colors.PRIMARY : theme.colors.primaryText}
          style={styles.iconLocal}
        />
        <View style={styles.contentDescriptionLocal}>
          <Text style={styles.titleLocal}>{title}</Text>
          <Text style={styles.descriptionLocal}>{description}</Text>
        </View>
        {!hideRemove ? (
          <TouchableOpacity
            style={styles.iconOptionLocal}
            onPress={() => {
              Alert.alert(
                translate('local.title_alert_you_want_to_remove_this_location'),
                '',
                [
                  {
                    text: translate('local.text_button_confirmed_alert'),
                    onPress: () => {
                      // eslint-disable-next-line consistent-return
                      async function deletePlace() {
                        const {
                          data: {status, message},
                        } = await apiMain.post('CustomerPlace/delete', {
                          placeId: id,
                        });

                        if (!status) return Alert.alert(message);

                        if (update) update();
                      }

                      if (isGuest) {
                        updateListPlaces(
                          places.filter(item => item.idPlace !== id),
                        );
                      } else {
                        deletePlace();
                      }
                    },
                  },
                  {
                    text: translate('local.text_button_denied_alert'),
                    onPress: () => {},
                  },
                ],
              );
            }}
          >
            <IconMaterial name="delete" size={25} color={Colors.PRIMARY} />
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}
