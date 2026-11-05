import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome5';
import IconMaterial from '@expo/vector-icons/MaterialCommunityIcons';
import Colors from '../../components/Colors';
import InputIcon from '../../components/form/InputIcon';
import SearchLocalModal from '../SearchLocalModal';
import DetailAddressModal from '../DetailAddressModal';
import { useLocal } from '../../contexts/local';
import apiMain from '../../api/apiMain';
import { translate } from '../../locales/index';
import { useAuth } from '../../../context/auth';
import { ContentLocals, styles } from './styles';
import theme from '../../styles/theme';
import * as Location from 'expo-location';
import { usePlaces } from '../../hooks/place';
import { SavedLocalPlaces } from '../../components/SavedLocalPlaces';

export default function Local({ navigation }) {
  const {
    places,
    placeSelected,
    placeUser,
    updateListPlaces,
    addPlaceSelected,
    setPosition,
  } = useLocal();
  const { getPermissionLocal } = useAuth();
  const { isGuest, permissionLocal } = useAuth();
  const [visible, setVisible] = useState(false);
  const [visibleModalLocal, setVisibleModalLocal] = useState(false);
  const [visibleLastDestinations, setVisibleLastDestinations] = useState(false);
  const [place, setPlace] = useState(null);
  const { removeAllPlaces, requestAllPlaces, places: lastPlaces } = usePlaces();

  const getCustomerPlaces = useCallback(async () => {
    if (isGuest) return;
    try {
      const {
        data: { data },
      } = await apiMain.get('CustomerPlace/getAll');

      if (data && updateListPlaces) {
        updateListPlaces(data);
      }
    } catch (error) {
      console.error('Erro ao buscar lugares do cliente:', error?.message || error);
    }
  }, [isGuest, updateListPlaces]);

  useEffect(() => {
    if (requestAllPlaces) {
      requestAllPlaces().catch(error => {
        console.error('Erro ao buscar lugares salvos:', error?.message || error);
      });
    }
    if (!isGuest) {
      getCustomerPlaces();
    }
  }, []);

  useEffect(() => {
    if (!navigation?.addListener) return;
    const unsubscribe = navigation.addListener('focus', () => {
      if (!isGuest) {
        getCustomerPlaces();
      }
    });
    return unsubscribe;
  }, [navigation, getCustomerPlaces, isGuest]);

  const getPostion = useCallback(() => {
    if (!getPermissionLocal) return;
    getPermissionLocal()
      .then(() => {
        // 1. Posição rápida
        Location.getLastKnownPositionAsync()
          .then(location => {
            if (location) {
              setPosition({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              });
            }
          })
          .catch(() => {});

        // 2. Localização GPS em tempo real (sempre atualizada)
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
          .then(({ coords }) => {
            setPosition({
              latitude: coords.latitude,
              longitude: coords.longitude,
            });
          })
          .catch(error => {
            console.error('Erro ao obter a localização atual:', error?.message || error);
          });
      })
      .catch(error => {
        console.error('Erro ao obter permissão de localização:', error?.message || error);
      });
  }, [getPermissionLocal, setPosition]);

  useEffect(() => {
    getPostion();
  }, [getPostion]);

  const handleShowLastDestinations = () => {
    if (lastPlaces.length === 0) {
      Alert.alert(translate("profile.alert_info_no_have_addresses_to_remove.text_title"), translate("profile.alert_info_no_have_addresses_to_remove.text_message"));
      return;
    }
    setVisibleLastDestinations(true);
  };

  const handleRemoveAllDestinations = () => {
    Alert.alert('', translate("profile.alert_sure_remove_last_destinations.text_message"), [
      {
        text: translate("profile.alert_sure_remove_last_destinations.text_button_cancel"),
        style: 'cancel',
      },
      {
        text: translate("profile.alert_sure_remove_last_destinations.text_button_confirm"),
        onPress: () => {
          if (removeAllPlaces) {
            removeAllPlaces()
              .then(() => {
                setVisibleLastDestinations(false);
                Alert.alert("", translate("profile.alert_addresses_removed_successfully.text_message"));
              })
              .catch(error => {
                console.error('Erro ao remover todos os lugares:', error?.message || error);
                Alert.alert("", translate("profile.alert_error_removing_addresses") || "Erro ao remover endereços");
              });
          }
        }
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <SearchLocalModal
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        onPlace={place => {
          setVisible(false);
          navigation?.navigate('LocalMap', { place });
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
          if (navigation && navigation.navigate) {
            navigation.navigate('LocalMap', { place });
          }
        }}
      />
      <Modal visible={visibleLastDestinations} animationType="slide">
        <View style={{ flex: 1, backgroundColor: theme.colors.background_global }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: theme.colors.border_green }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.secondary }}>
              {translate('trip.last_destinys')}
            </Text>
            <TouchableOpacity onPress={() => setVisibleLastDestinations(false)}>
              <Icon name="times" size={24} color="red" />
            </TouchableOpacity>
          </View>
          <SavedLocalPlaces
            visible={true}
            setVisible={() => { }}
            handleAddressSelected={() => { }}
            type=""
          />
          <View style={{ padding: 20 }}>
            <TouchableOpacity
              style={{ backgroundColor: theme.colors.primary, padding: 15, borderRadius: 8, alignItems: 'center' }}
              onPress={handleRemoveAllDestinations}
            >
              <Text style={{ color: theme.colors.primaryText, fontWeight: 'bold' }}>
                {translate('profile.text_title_remove_last_destinations')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => {
          if (navigation?.navigate) {
            setVisible(true);
          }
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
              if (!navigation?.navigate) return;
              if (isGuest) {
                if (addPlaceSelected && placeUser) {
                  addPlaceSelected(placeUser)
                    .then(() => {
                      navigation.goBack?.();
                    })
                    .catch(error => {
                      console.error('Erro ao adicionar lugar selecionado:', error?.message || error);
                    });
                }
                return;
              }
              const lat = parseFloat(placeUser?.latitude || 0);
              const lng = parseFloat(placeUser?.longitude || 0);
              if (isNaN(lat) || isNaN(lng)) {
                Alert.alert(translate('local.error_invalid_coordinates') || 'Coordenadas inválidas');
                return;
              }
              navigation.navigate('AddAddressMap', {
                place: placeUser,
                position: {
                  latitude: lat,
                  longitude: lng,
                },
              });
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
              update={async () => {
                await getCustomerPlaces();
              }}
              active={active}
              onPress={() => {
                if (!navigation?.goBack || !addPlaceSelected) return;
                addPlaceSelected(item)
                  .then(() => {
                    navigation.goBack();
                  })
                  .catch(error => {
                    console.error('Erro ao adicionar lugar selecionado:', error);
                  });
              }}
            />
          );
        })}

        <TouchableOpacity
          style={styles.removeLastDestinationsButton}
          onPress={handleShowLastDestinations}
        >
          <View style={styles.removeLastDestinationsContainer}>
            <Icon
              name="trash"
              size={20}
              color={theme.colors.primaryText}
              style={styles.iconLocal}
            />
            <View style={styles.contentDescriptionLocal}>
              <Text style={styles.titleLocal}>
                {translate('profile.text_title_remove_last_destinations')}
              </Text>
              <Text style={styles.descriptionLocal}>
                {lastPlaces && lastPlaces.length > 0
                  ? (lastPlaces.length === 1
                    ? translate('profile.one_address_saved', { count: lastPlaces.length })
                    : translate('profile.multiple_addresses_saved', { count: lastPlaces.length })
                  )
                  : translate('profile.no_addresses_saved')
                }
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </ContentLocals>
    </View>
  );
}

function ItemLocal(props) {
  const { id, active, iconName, title, description, update, hideRemove } = props;

  const { isGuest } = useAuth();

  const { places, updateListPlaces } = useLocal();
  const [isDeleting, setIsDeleting] = useState(false);

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
                      setIsDeleting(true);
                      function deletePlace() {
                        apiMain
                          .post('CustomerPlace/delete', {
                            placeId: id,
                          })
                          .then(async ({ data: { status, message } }) => {
                            if (!status) {
                              Alert.alert(message || translate('local.text_error_deleting') || 'Erro ao deletar endereço');
                              return;
                            }

                            if (update) {
                              await update();
                            }
                          })
                          .catch(error => {
                            console.error('Erro ao deletar lugar:', error?.message || error);
                            Alert.alert(translate('local.text_error_deleting') || 'Erro ao deletar endereço');
                          })
                          .finally(() => {
                            setIsDeleting(false);
                          });
                      }

                      if (isGuest) {
                        updateListPlaces(
                          places.filter(item => item.idPlace !== id),
                        )
                          .then(() => {
                            setIsDeleting(false);
                          })
                          .catch(error => {
                            setIsDeleting(false);
                            console.error('Erro ao atualizar lista de lugares:', error?.message || error);
                          });
                      } else {
                        deletePlace();
                      }
                    },
                  },
                  {
                    text: translate('local.text_button_denied_alert'),
                    onPress: () => { },
                  },
                ],
              );
            }}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color={Colors.PRIMARY} />
            ) : (
              <IconMaterial name="delete" size={25} color={Colors.PRIMARY} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}
