// @ts-nocheck

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import * as Speech from 'expo-speech';
import { Modal, View } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import apiMain from '../../api/apiMain';
import { useLocal } from '../../contexts/local';
import { customToast } from '../../../utils/FlashMessage';
import { TIMEOUT_SHORT } from '~/common/constants/timeouts';
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
  ShowMoreButton,
  ShowMoreText,
  ShowMoreContent,
  ButtonMic,
  EmptyListText,
  EmptyListContainer,
} from './styles';
import { SavedLocals } from '../SavedLocals';
import { WebViewVoiceRecognition } from '../WebViewVoiceRecognition';
import { SavedLocalPlaces } from '../SavedLocalPlaces';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextEdit } from '../TextEdit';
import theme from '../../styles/theme';
import { useAuth } from '../../../context/auth';
import { translate } from '../../locales';
import { useModules } from '../../contexts/modules';
import { RFValue } from 'react-native-responsive-fontsize';
import { If } from '../If';
import { useTrip } from '../../contexts/Trip';
import { usePlaces } from '../../hooks/place';

const AddressItem = ({ item, onPress }) => {
  const hasCacheAddress = !!item.amountOfUse;
  return (
    <AddressItemContent key={item.id} onPress={onPress}>
      <MaterialIcons
        name={hasCacheAddress ? 'watch-later' : 'place'}
        size={24}
        color={theme.colors.secondary}
      />
      <AddressText>{item.address}</AddressText>
    </AddressItemContent>
  );
};

const EmptyList = ({ message }) => {
  if (!message) return null;

  return (
    <EmptyListContainer>
      <MaterialIcons name="error-outline" size={24} color={theme.colors.secondary} />
      <EmptyListText>{message}</EmptyListText>
    </EmptyListContainer>
  );
};

let searchTimeout;

const SearchAddressModal = forwardRef(
  (
    {
      handleAddressSelected,
      handleBackButtonOnAddress,
      setTripNoDestinationAnother,
      tripNoDestinationAnother,
    }: any,
    ref,
  ) => {
    const [listAddresses, setListAddresses] = useState([]);
    const { user } = useAuth();
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('');
    const [text, setText] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [savedLocals, setSavedLocals] = useState(true);
    const [value, setValue] = useState('');
    const { stateTripCustomer, dispatchTripCustomer } = useTrip();
    const { trip } = stateTripCustomer;
    const { position } = useLocal();
    const inputRef = useRef(null);
    const [currentAddressIndex, setCurrentAddressIndex] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [enableShowMore, setEnableShowMore] = useState<boolean>(false);
    const [isTester, setIsTester] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { init } = useModules();
    const { filterPlaces } = usePlaces();
    const topInset = initialWindowMetrics?.insets?.top ?? 0;

    useEffect(() => {
      setValue('');
    }, [visible]);

    const onChangeAddress = useCallback(
      async (text: string) => {
        if (!text.length) {
          setSavedLocals(true);
          setLoading(false);
          setErrorMessage(null);
          return;
        }

        setValue(text);
        setLoading(true);
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
          const places = await filterPlaces(text);

          if (places.length > 0) {
            setListAddresses(places);
            setSavedLocals(false);
            setLoading(false);
            setEnableShowMore(true);
            return;
          }

          requestNewAddress(text);
        }, 1500);
      },
      [position, text, AsyncStorage],
    );

    const requestNewAddress = async (text: string, concat = false) => {
      if (!text?.trim()) return;

      setLoading(true);
      setSavedLocals(true);
      setIsTester(false);

      try {
        const { latitude, longitude } = position;

        const response = await apiMain.get<ApiResponse<any>>(
          `place/search?q=${encodeURIComponent(text)}&latlng=${latitude},${longitude}`,
          { timeout: TIMEOUT_SHORT },
        );

        const { data, status } = response.data;

        if (!status || !Array.isArray(data)) {
          setErrorMessage(translate('searchModal.error_loading'));
          return;
        }

        if (data.length === 0) {
          setListAddresses([]);
          setErrorMessage(translate('searchModal.empty_list'));
          return;
        }

        setErrorMessage(null);

        if (init !== 'Speedmob') {
          await speakUnicMessage(data);
        }

        setListAddresses((oldPlaces) => {
          const newPlaces = data.map((item, index) => ({
            ...item,
            id: `${concat ? oldPlaces.length + index : index}`,
          }));

          return concat ? [...oldPlaces, ...newPlaces] : newPlaces;
        });
      } catch (error) {
        setErrorMessage(translate('searchModal.error_loading'));
      } finally {
        setLoading(false);
      }
    };

    const speakMessage = async (message: string) => {
      const language = await AsyncStorage.getItem('@language');
      const formatedLanguage = language.replace('_', '-');

      return new Promise((resolve) => {
        Speech.speak(`${message} `, {
          language: formatedLanguage,
          onDone: resolve,
        });
      });
    };

    const speakUnicMessage = async (listAddresses) => {
      const language = await AsyncStorage.getItem('@language');
      const formatedLanguage = language.replace('_', '-');

      await Speech.speak(
        `${user?.nickname} ${translate('searchModal.finded_address')} ${
          listAddresses?.length
        } ${translate('searchModal.locals_similar')}`,
        {
          language: formatedLanguage,
        },
      );
    };

    useEffect(() => {
      if (text.length > 6) {
        onChangeAddress(text);
      }
    }, [text]);

    useEffect(() => {
      const speakListAddress = () => {
        // CONDIÇÃO INSERIDA PARA NÃO CORRER RISCO DE FALAR ENQUANTO O USUÁRIO ESCOLHE O TIPO DA CORRIDA
        if (!visible) return;

        if (
          listAddresses.length > 0 &&
          currentAddressIndex < listAddresses.length &&
          isListening === false &&
          init !== 'Speedmob' &&
          text.length > 0 &&
          selectedOption === ''
        ) {
          speakMessage(listAddresses[currentAddressIndex]?.address);
          speakMessage(translate('searchModal.select_this_address')).then(() => {
            setIsListening(true);
          });
        }
      };

      speakListAddress();
    }, [currentAddressIndex, isListening, listAddresses, selectedOption, visible]);

    useEffect(() => {
      const speakNoMoreAddress = () => {
        // CONDICIONAL PARA AVISAR QUE NÃO EXISTE MAIS NENHUMA CIDADE PARA SER FALADA/APRESENTADA
        if (listAddresses.length > 0 && currentAddressIndex >= listAddresses.length) {
          speakMessage(translate('searchModal.no_more_addresses'));
          setIsListening(false);
        }
      };

      speakNoMoreAddress();
    }, [currentAddressIndex]);

    const prepareAddressResult = useCallback(async (item) => {
      if (item.latitude != null && item.longitude != null) {
        return item;
      }

      try {
        const {
          data: { data: address },
        } = await apiMain.get(`geocoding/search?address=${item.address}`, {
          timeout: TIMEOUT_SHORT,
        });
        return address;
      } catch (error) {
        customToast(translate('searchModal.error_loading'), 'error');
        return;
      }
    }, []);

    const switchAnswerQuestionsByLanguage = async () => {
      const language = await AsyncStorage.getItem('@language');
      const formatedLanguage = language.replace('_', '-');

      switch (formatedLanguage) {
        case 'pt-BR':
          return {
            accept: 'sim',
            no_accept: 'não',
          };

        case 'fr-FR':
          return {
            accept: 'oui',
            no_accept: 'non',
          };

        case 'es-US':
          return {
            accept: 'sí',
            no_accept: 'no',
          };

        case 'en-US':
          return {
            accept: 'yes',
            no_accept: 'no',
          };
      }
    };

    useImperativeHandle(ref, () => ({
      show: () => {
        setVisible(true);
        setListAddresses([]);
      },
      hide: () => {
        setListAddresses([]);
        setVisible(false);
      },
      setTypeOfAddress: (typeAddress) => {
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

    useEffect(() => {
      const handleSpeechResult = () => {
        if (isListening && selectedOption) {
          switchAnswerQuestionsByLanguage().then((responseLanguage) => {
            if (selectedOption === responseLanguage.accept) {
              handleAddressSelected(listAddresses[currentAddressIndex], type);
              setVisible(false);
              setSavedLocals(true);
              setValue('');
              setIsListening(false);
              setSelectedOption('');
            } else if (selectedOption === responseLanguage.no_accept) {
              setCurrentAddressIndex(currentAddressIndex + 1);
              setIsListening(false);
              setSelectedOption('');
            } else {
              speakMessage(translate('searchModal.options_no_valid'));
              setValue('');
              setIsListening(false);
              setSelectedOption('');
            }
          });
        }
      };
      handleSpeechResult();
    }, [selectedOption]);

    return (
      <Modal visible={visible} animationType="slide">
        <Container style={{ paddingTop: topInset }}>
          <ButtonBack
            onPress={async () => {
              Speech.stop();
              setVisible(false);
              setLoading(false);
              setSavedLocals(true);
              setListAddresses([]);
              await AsyncStorage.removeItem('@app:tripNoDestination');
              await AsyncStorage.removeItem('@app:tripNoDestinationAnother');
              setTripNoDestinationAnother(null);
              setValue('');
              setText('');
              setIsListening(false);
            }}
          >
            <AntDesign name="arrow-left" size={35} color="black" />
          </ButtonBack>
          <Input
            ref={inputRef}
            value={value}
            disabled={!value}
            onSubmitEditing={() => {
              onChangeAddress(value);
            }}
            onChangeText={(e) => setValue(e)}
            returnKeyType="search"
            autoFocus
          />
          <ButtonMic>
            <FontAwesome
              name="microphone"
              size={30}
              color={isTester || isListening ? theme.colors.off : theme.colors.primary}
              onPress={() => {
                setIsTester(!isTester);
              }}
            />
          </ButtonMic>
          {isListening && (
            <WebViewVoiceRecognition
              text={selectedOption}
              setText={setSelectedOption}
              showModalVoiceRecord={isListening}
              setShowModalVoiceRecord={setIsListening}
            />
          )}
          {init !== 'Speedmob' && !isListening && (
            <WebViewVoiceRecognition
              text={text}
              setText={setText}
              showModalVoiceRecord={isTester}
              setShowModalVoiceRecord={setIsTester}
            />
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
              <TextEdit color={theme.colors.primaryText} change="uppercase">
                {isListening
                  ? translate('searchModal.recording_message')
                  : translate('searchModal.search_address')}
              </TextEdit>
            </ButtonSearch>
            <If
              condition={
                handleBackButtonOnAddress && !trip?.origin && !tripNoDestinationAnother
              }
            >
              <ButtonAddress
                onPress={async () => {
                  setVisible(false);
                  handleBackButtonOnAddress && handleBackButtonOnAddress(type);
                }}
              >
                <MaterialIcons name="place" size={24} color={theme.colors.primary} />
                <TextEdit color={theme.colors.primary}>
                  {translate('trip.text_set_location_on_map')}
                </TextEdit>
              </ButtonAddress>
            </If>

            <AddressList
              keyboardShouldPersistTaps="handled"
              data={listAddresses}
              ListEmptyComponent={<EmptyList message={errorMessage} />}
              renderItem={({ item }) => (
                <AddressItem
                  item={item}
                  onPress={async () => {
                    const isTripNoDestinationAnother = JSON.parse(
                      await AsyncStorage.getItem('@app:tripNoDestinationAnother'),
                    );

                    const result = await prepareAddressResult(item);
                    handleAddressSelected(result, type);
                    setValue('');
                    setVisible(false);
                    setSavedLocals(true);
                    setValue('');

                    if (isTripNoDestinationAnother) {
                      dispatchTripCustomer({
                        type: 'update',
                        field: 'hideTravelOptions',
                        arg: false,
                      });

                      dispatchTripCustomer({
                        type: 'update',
                        field: 'visibleLookUpAddressesModal',
                        arg: false,
                      });
                    }
                  }}
                />
              )}
              ListFooterComponent={() =>
                enableShowMore ? (
                  <ShowMoreContent>
                    <ShowMoreButton
                      onPress={() => {
                        setEnableShowMore(false);
                        requestNewAddress(value, true);
                      }}
                    >
                      <ShowMoreText>{translate('trip.show_more_button')}</ShowMoreText>
                    </ShowMoreButton>
                  </ShowMoreContent>
                ) : null
              }
              keyExtractor={(item) => item.id}
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
