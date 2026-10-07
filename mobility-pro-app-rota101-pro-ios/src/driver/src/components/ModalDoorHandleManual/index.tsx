import SearchableDropdown from 'react-native-searchable-dropdown';
import {Ionicons} from '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useCallback, useEffect, useRef, useState} from 'react';
import {If} from '../If';
import {TextEdit} from '../TextEdit';

import {
  BackPage,
  ButtonConfirm,
  ButtonEdit,
  Container,
  ContainerPrice,
  ContentInput,
  InputAddress,
  InputMask,
  PickerContainer,
  ScrollViewAddress,
  TextConfirm,
} from './styles';
import {CardAddress} from '../CardAddress';
import {useTripProvider} from '../../context/Trip';
import apiMainDriver from '../../api/apiMain';
import {useLocalProvider} from '../../context/local';
import theme from '../../styles/theme';
import Helper from '../../../../client/utils/Helper';
import {useAuth} from '../../../../context/auth';
import {InputWithLabel} from '../InputWithLabel';
import {TripType} from '../../context/Trip/types';
import Preload from '../Preload';
import ModalFrame from '../Modal/ModalFrame';
import {CardButtonText} from '../CardButtonText';
import {IfLoaderInsideScreen} from '../IfLoaderInsideScreen';
import {useUserDriver} from '../../context/userDriver';
import {translate} from '../../../../client/locales';
import {customToast} from '../../../../utils/FlashMessage';
import {useTheme} from 'styled-components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Picker} from '@react-native-picker/picker';

interface Props {
  setVisible?: (value: boolean) => void;
  visible?: boolean;
}

let searchTimeout;

export const ModalDoorHandleManual = ({setVisible, visible}: Props) => {
  const {
    calculateAllDoorHandle,
    newTripDoorHandle,
    getPaymentFormInVehicle,
    getTripTypes,
    dispatchTrip,
    stateTrip,
  } = useTripProvider();

  const {origin, destination, dataCalculate} = stateTrip;
  const {userDriverFind} = useUserDriver();
  const {location} = useLocalProvider();
  const {cityConfig} = useAuth();

  const inputRef = useRef(null);

  const {colors} = useTheme();

  const [originValue, setOriginValue] = useState<string>('');
  const [destinationValue, setDestinationValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const [listAddresses, setListAddresses] = useState<any[]>([]);
  const [listAddressesDestiny, setListAddressesDestiny] = useState<any[]>([]);
  const [paymentForm, setPaymentForm] = useState<any[]>([]);
  const [tripTypes, setTripTypes] = useState<TripType[]>([]);
  const [selectedTripType, setSelectedTripType] = useState<TripType>(
    {} as TripType,
  );
  const [visibleModal, setVisibleModal] = useState<boolean>(true);
  const [visibleEditPrice, setVisibleEditPrice] = useState<boolean>(false);
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);
  const [newPrice, setNewPrice] = useState<string>();
  const [selectedPaymentForm, setSelectedPaymentForm] = useState(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    cpf: '',
    email: '',
    paymentForm: '',
    idTripPaymentForm: '',
  });

  useEffect(() => {
    if (originValue === '') {
      setOriginValue(origin?.address || '');
    }
  }, [origin]);

  const onChangeAddress = useCallback(
    (text, setState, setList) => {
      setState(text);
      setLoading(true);
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(async () => {
        const {
          data: {data},
        } = await apiMainDriver.get(
          `place/search?q=${text}&latlng=${location?.coords.latitude || 0},${
            location?.coords.longitude || 0
          }`,
        );
        setList(data);
        setLoading(false);
      }, 1500);
    },
    [location],
  );

  useEffect(() => {
    if (location?.coords?.latitude && location?.coords?.longitude) {
      setOriginValue(origin?.address || '');
      getPaymentForms();
      getTripTypesDoorHandle();
    }
  }, []);

  const handleSelectAddress = useCallback((item, setState, setList, type) => {
    setState(item.address);
    dispatchTrip({type: 'update', field: type, arg: item});
    setList([]);
  }, []);

  useEffect(() => {
    if (Object.keys(origin).length > 0 && Object.keys(destination).length > 0) {
      calculateAllDoorHandle(origin, destination, selectedTripType?.tripTypeId);
      // remove focus from input
      inputRef.current.blur();
    }
  }, [origin, destination]);

  const dataInput = [
    {
      label: translate('doorHandle.name'),
      value: form.name,
      onChangeText: text => setForm({...form, name: text}),
    },
    {
      label: translate('doorHandle.phone'),
      value: form.phone,
      onChangeText: text => setForm({...form, phone: text}),
    },
    {
      label: translate('doorHandle.document'),
      value: form.cpf,
      onChangeText: text => setForm({...form, cpf: text}),
    },
    {
      label: translate('doorHandle.email'),
      value: form.email,
      onChangeText: text => setForm({...form, email: text}),
    },
  ];

  const getPaymentForms = async () => {
    const {data} = await getPaymentFormInVehicle();
    setPaymentForm(data);

    setForm({
      ...form,
      paymentForm: data[0]?.name,
      idTripPaymentForm: data[0]?.idTripPaymentForm,
    });
  };

  const getTripTypesDoorHandle = async () => {
    setLoadingInitial(true);
    const response = await getTripTypes(location);
    setLoadingInitial(false);
    if (!response?.data) {
      return;
    }
    setTripTypes(
      response.data.filter(item => {
        return (
          userDriverFind.tripTypes.filter(type => {
            return item.tripTypeId == type.tripTypeId;
          }).length > 0
        );
      }),
    );
    setLoadingInitial(false);
  };

  useEffect(() => {
    if (dataCalculate?.price) {
      setNewPrice(dataCalculate?.price?.price);
    }
  }, [dataCalculate]);

  const handlePaymentFormChange = (itemValue, itemIndex) => {
    const selectedForm = paymentForm[itemIndex];
    setSelectedPaymentForm(selectedForm);

    setForm({
      ...form,
      paymentForm: selectedForm.name,
      idTripPaymentForm: selectedForm.idTripPaymentForm,
    });
  };

  return (
    <If condition={visible}>
      <Container
        from={{
          opacity: 0,
          transform: [{translateY: 100}],
        }}
        animate={{
          opacity: 1,
          transform: [{translateY: 0}],
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
      >
        <KeyboardAwareScrollView>
          <BackPage
            onPress={() => {
              setVisible(false);
              dispatchTrip({type: 'update', field: 'dataCalculate', arg: {}});
              dispatchTrip({type: 'update', field: 'destination', arg: {}});
            }}
          >
            <Ionicons name="chevron-back-sharp" size={RFValue(20)} />
            <View
              style={{
                marginLeft: RFValue(10),
              }}
            >
              <TextEdit color={colors.secondary}>
                {translate('doorHandle.manual_doorknob_trip')}
              </TextEdit>
            </View>
          </BackPage>
          <ContentInput
            pointerEvents={
              Object.keys(dataCalculate).length > 0 &&
              destinationValue &&
              originValue
                ? 'box-only'
                : null
            }
          >
            <InputAddress
              value={originValue}
              onChangeText={text =>
                onChangeAddress(text, setOriginValue, setListAddresses)
              }
            />
          </ContentInput>
          <ContentInput
            pointerEvents={
              Object.keys(dataCalculate).length > 0 &&
              destinationValue &&
              originValue
                ? 'box-only'
                : null
            }
          >
            <InputAddress
              value={destinationValue}
              ref={inputRef}
              onChangeText={text =>
                onChangeAddress(
                  text,
                  setDestinationValue,
                  setListAddressesDestiny,
                )
              }
            />
          </ContentInput>
          <ScrollViewAddress>
            {listAddresses &&
              listAddresses.length > 0 &&
              listAddresses.map((item, index) => {
                return (
                  <CardAddress
                    key={index}
                    onPress={() =>
                      handleSelectAddress(
                        item,
                        setOriginValue,
                        setListAddresses,
                        'origin',
                      )
                    }
                    text={item?.address}
                  />
                );
              })}
            <If condition={Object.keys(dataCalculate).length === 0}>
              {listAddressesDestiny &&
                listAddressesDestiny.length > 0 &&
                listAddressesDestiny.map((item, index) => {
                  return (
                    <CardAddress
                      key={index}
                      onPress={() =>
                        handleSelectAddress(
                          item,
                          setDestinationValue,
                          setListAddressesDestiny,
                          'destination',
                        )
                      }
                      text={item?.address}
                    />
                  );
                })}
              {loading && (
                <ActivityIndicator size="large" color={theme.colors.primary} />
              )}
            </If>

            <If
              condition={
                Object.keys(dataCalculate).length > 0 &&
                destinationValue &&
                originValue
              }
            >
              <ContainerPrice>
                <If condition={visibleEditPrice}>
                  <InputMask
                    value={newPrice}
                    type={'money'}
                    options={{
                      unit: cityConfig?.typeMoney,
                    }}
                    onChangeText={e => setNewPrice(e)}
                  />
                </If>
                <If condition={!visibleEditPrice}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}
                  >
                    <TextEdit size="large" color={theme.colors.secondary}>
                      {cityConfig?.typeMoney}
                      {Helper.maskMoney(
                        parseFloat(dataCalculate?.data?.price?.price),
                      )}
                    </TextEdit>
                    <ButtonEdit
                      onPress={() => {
                        setVisibleEditPrice(true);
                        setNewPrice(dataCalculate?.data?.price?.price);
                      }}
                    >
                      <Ionicons
                        name="ios-pencil-sharp"
                        size={RFValue(12)}
                        color={theme.colors.primary}
                      />
                    </ButtonEdit>
                  </View>
                </If>
              </ContainerPrice>
              <View>
                <TextEdit color={theme.colors.secondary}>
                  {translate('doorHandle.payment_method')}
                </TextEdit>
                <PickerContainer>
                  <Picker
                    selectedValue={selectedPaymentForm?.name}
                    onValueChange={handlePaymentFormChange}
                  >
                    {paymentForm.map((form, index) => (
                      <Picker.Item
                        key={index}
                        label={form.name}
                        value={form.name}
                      />
                    ))}
                  </Picker>
                </PickerContainer>
                {dataInput.map((item, index) => {
                  return (
                    <InputWithLabel
                      key={index}
                      title={item.label}
                      onChange={item.onChangeText}
                      value={item.value}
                      placeholder={
                        item.label === 'Phone' ? '(00) 0 0000 0000' : ''
                      }
                    />
                  );
                })}
                <IfLoaderInsideScreen loading={loadingConfirm}>
                  <ButtonConfirm
                    onPress={async () => {
                      if (
                        !form.name ||
                        !form.paymentForm ||
                        !form.idTripPaymentForm
                      ) {
                        return customToast(
                          translate('doorHandle.fill_in_the_fields'),
                          'warning',
                        );
                      }
                      setLoadingConfirm(true);
                      await newTripDoorHandle(form, newPrice);
                      setLoadingConfirm(false);
                      setSelectedTripType({} as TripType);
                      setVisible(false);
                    }}
                  >
                    <TextConfirm>{translate('doorHandle.confirm')}</TextConfirm>
                  </ButtonConfirm>
                </IfLoaderInsideScreen>
              </View>
            </If>
          </ScrollViewAddress>
        </KeyboardAwareScrollView>
      </Container>
      <ModalFrame
        visible={visibleModal && !loadingInitial}
        onClose={() => {}}
        hideCancel
        hideConfirm
        setVisible={setVisibleModal}
      >
        {tripTypes.length > 0 &&
          tripTypes.map((item, index) => {
            return (
              <CardButtonText
                key={index}
                text={item?.name}
                onPress={() => {
                  setVisibleModal(false);
                  setSelectedTripType(item);
                }}
              />
            );
          })}
      </ModalFrame>
      <Preload visible={loadingInitial} />
    </If>
  );
};
