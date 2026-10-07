// @ts-nocheck

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {Audio} from 'expo-av';
import * as Speech from 'expo-speech';
import {Modal, View} from 'react-native';
import {AntDesign, MaterialIcons} from '@expo/vector-icons';
import apiMain from '../../api/apiMain';
import {useLocal} from '../../contexts/local';
import {
  AddressItemContent,
  AddressList,
  AddressText,
  ButtonBack,
  Container,
  Input,
  Loading,
  ButtonSearch,
  ButtonAddress,
} from './styles';
import {SavedLocals} from '../SavedLocals';
import {WebViewVoiceRecognition} from '../WebViewVoiceRecognition';
import {SavedLocalPlaces} from '../SavedLocalPlaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TextEdit} from '../TextEdit';
import theme from '../../styles/theme';
import {useAuth} from '../../../context/auth';
import {translate} from '../../locales';
import {useModules} from '../../contexts/modules';
import {Button} from '../Button';
import {RFValue} from 'react-native-responsive-fontsize';
import {If} from '../If';
import {useTrip} from '../../contexts/Trip';

const AddressItem = ({item, onPress}) => {
  return (
    <AddressItemContent key={item.id} onPress={onPress}>
      <MaterialIcons name="place" size={24} color={theme.colors.secondary} />
      <AddressText>{item.address}</AddressText>
    </AddressItemContent>
  );
};

let searchTimeout;

const SearchAddressModal = forwardRef(
  ({handleAddressSelected, handleBackButtonOnAddress}: any, ref) => {
    const [listAddresses, setListAddresses] = useState([]);
    const {user} = useAuth();
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('');
    const [text, setText] = useState('');
    const [savedLocals, setSavedLocals] = useState(true);
    const [value, setValue] = useState('');
    const {stateTripCustomer} = useTrip();
    const {trip} = stateTripCustomer;
    const {position} = useLocal();
    const inputRef = useRef(null);

    const {init} = useModules();

    useEffect(() => {
      setValue('');
    }, [visible]);

    const getLocalByCache = async text => {
      if (text == '') {
        return false;
      }
      let getPlacesAll = await AsyncStorage.getItem('allPlaces');
      let allPlaces = JSON.parse(getPlacesAll);
      if (allPlaces) {
        let filterPlaces = allPlaces.filter(item => {
          return item.address.toUpperCase().includes(text.toUpperCase());
        });
        setListAddresses(
          filterPlaces &&
            filterPlaces.map((item, index) => {
              return {...item, id: `${index}`};
            }),
        );
        if (filterPlaces.length > 0) {
          setLoading(false);
          return true;
        }
        return false;
      }
      return false;
    };

    const onChangeAddress = useCallback(
      async text => {
        setValue(text);
        setLoading(true);
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
          const response = await getLocalByCache(text);
          text !== ''
            ? setSavedLocals(false)
            : setSavedLocals(true) && setListAddresses([]);
          if (response) {
            return '';
          }
          const {
            data: {data},
          } = await apiMain.get(
            `place/search?q=${text}&latlng=${position.latitude},${position.longitude}`,
          );

          {
            init !== 'Speedmob' && (await speakUnicMessage(data));
          }

          setListAddresses(
            data.map((item, index) => {
              return {...item, id: `${index}`};
            }),
          );
          setLoading(false);
        }, 1500);
      },
      [position, getLocalByCache, text, AsyncStorage],
    );

    const speakMessage = (message: string) => {
      console.log(message);
      Speech.speak(`${message} `, {
        language: 'pt-BR',
      });
    };

    const speakUnicMessage = async listAddresses => {
      await Speech.speak(
        `${user?.nickname} Achei ${listAddresses?.length} locais similares`,
        {
          language: 'pt-BR',
          // rate: rate,
        },
      );
    };

    useEffect(() => {
      if (text.length > 6) {
        onChangeAddress(text);
      }
    }, [text]);

    const prepareAddressResult = useCallback(async item => {
      if (item.latitude == null && item.longitude == null) {
        const {
          data: {data},
        } = await apiMain.get(`geocoding/search?address=${item.address}`);
        return data;
      }

      return item;
    }, []);

    useImperativeHandle(ref, () => ({
      show: () => {
        setVisible(true);
        setListAddresses([]);
      },
      hide: () => {
        setListAddresses([]);
        setVisible(false);
      },
      setTypeOfAddress: typeAddress => {
        setType(typeAddress);
      },
      valueVoice: (text: string, typeAddress) => {
        setVisible(true);
        setListAddresses([]);
        setText(text);
        setType(typeAddress);
      },
    }));

    useLayoutEffect(() => {
      if (visible) setTimeout(() => inputRef?.current?.focus(), 150);
    }, [inputRef, visible]);

    return (
      <Modal visible={visible} animationType="slide">
        <Container>
          <ButtonBack
            onPress={() => {
              setVisible(false);
              setLoading(false);
              setSavedLocals(true);
              setListAddresses([]);
            }}
          >
            <AntDesign name="arrowleft" size={35} color="black" />
          </ButtonBack>
          <Input
            ref={inputRef}
            value={value}
            disabled={!value}
            onSubmitEditing={() => {
              onChangeAddress(value);
            }}
            /* onChangeText={onChangeAddress} */ onChangeText={e => setValue(e)}
          />
          {init !== 'Speedmob' && (
            <WebViewVoiceRecognition text={text} setText={setText} />
          )}
        </Container>
        {loading ? (
          <Loading />
        ) : (
          <View
            style={{
              backgroundColor: theme.colors.background_global,
            }}
          >
            <ButtonSearch
              onPress={() => {
                onChangeAddress(value);
              }}
              disabled={value.length < 3}
              backgroundColor={theme.colors.primary}
            >
              <TextEdit color={theme.colors.primaryText} transform="uppercase">
                {translate('searchModal.search_address')}
              </TextEdit>
            </ButtonSearch>
            <If condition={handleBackButtonOnAddress && !trip?.origin}>
              <ButtonAddress
                onPress={() => {
                  setVisible(false);
                  handleBackButtonOnAddress && handleBackButtonOnAddress(type);
                }}
              >
                <MaterialIcons
                  name="place"
                  size={RFValue(24)}
                  color={theme.colors.primary}
                />
                <TextEdit color={theme.colors.primary}>
                  {translate('trip.text_set_location_on_map')}
                </TextEdit>
              </ButtonAddress>
            </If>

            <AddressList
              keyboardShouldPersistTaps="handled"
              data={listAddresses}
              renderItem={({item}) => (
                <AddressItem
                  item={item}
                  onPress={async () => {
                    const result = await prepareAddressResult(item);
                    handleAddressSelected(result, type);
                    setValue('');
                    setVisible(false);
                    setSavedLocals(true);
                    setValue('');
                  }}
                />
              )}
              keyExtractor={item => item.id}
            />
            {init !== 'Speedmob' && (
              <>
                <SavedLocalPlaces
                  visible={savedLocals}
                  setVisible={setVisible}
                  handleAddressSelected={handleAddressSelected}
                  type={type}
                />
                <SavedLocals
                  visible={savedLocals}
                  setVisible={setVisible}
                  handleAddressSelected={handleAddressSelected}
                  type={type}
                />
              </>
            )}
          </View>
        )}
      </Modal>
    );
  },
);

export default SearchAddressModal;
