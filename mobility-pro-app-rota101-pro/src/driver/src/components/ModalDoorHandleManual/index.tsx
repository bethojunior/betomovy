import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { Keyboard, LayoutAnimation, Platform, ScrollView, View } from 'react-native';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

import {
  AddressCard,
  AddressFieldBox,
  AddressIconCol,
  AddressInputWrap,
  AddressRow,
  AddressValueOverlay,
  AddressValueText,
  AddWaypointIconButton,
  BackBtn,
  Card,
  PriceSaveBtn,
  PriceTouchable,
  SectionHeader,
  SuggestionDivider,
  SuggestionIconWrap,
  SuggestionItem,
  SuggestionList,
  SuggestionMainText,
  SuggestionSubText,
  SuggestionTextWrap,
  ConfirmButton,
  ConfirmText,
  Container,
  DestinationSquare,
  FieldContent,
  FieldIconCircle,
  FieldLabel,
  FieldLine,
  FieldRow,
  FieldTextInput,
  Header,
  HeaderTitle,
  InputAddress,
  InputInRow,
  InputMask,
  InputWithButton,
  OriginDot,
  PickerContainer,
  PriceCard,
  PriceCardRow,
  PriceLargeText,
  RemoveWaypointButton,
  RouteLine,
  ScrollContent,
  SectionLabel,
  StopDot,
  StyledPicker,
  WaypointRow,
  ZafiraButton,
  ZafiraButtonIcon,
  ZafiraButtonText,
} from './styles';
import { ModalDoorHandleManualProps } from './types';
import { useTripProvider } from '../../context/Trip';
import apiMainDriver from '../../api/apiMain';
import { useLocalProvider } from '../../context/local';
import theme from '../../styles/theme';
import Helper from '../../../../client/utils/Helper';
import { useAuth } from '../../../../context/auth';
import { useNetwork } from '../../../../context/ConfigGlobal';
import { offlineTripQueue } from '~/hooks/useOfflineTripActions';
import { TripType } from '../../context/Trip/types';
import Preload from '../Preload';
import { IfLoaderInsideScreen } from '../IfLoaderInsideScreen';
import { useUserDriver } from '../../context/userDriver';
import { translate } from '../../../../client/locales';
import { customToast } from '../../../../utils/FlashMessage';
import { Picker } from '@react-native-picker/picker';
import { useWaypoints } from '../../hooks/useWaypoints';
import { useInputSelection } from '../../hooks/useInputSelection';
import { useKeyboardHeight } from '../../hooks/useKeyboardHeight';
import { maskPhone } from '../../utils/format';
import { SkeletonAddressSuggestions, SkeletonDoorHandleForm } from '../SkeletonLoader';
import { TripTypePickerModal } from '../TripTypePickerModal';
import {
  pickMobilidadeApiErrorMessage,
  resolveZafiraDisplayMessage,
  validateRegistration,
} from '../../services/zafiraService';
import { ZafiraValidationResultModal } from '../Modal/ZafiraValidationResult';
import { resolveZafiraValidationErrorMessage } from '../Modal/ZafiraValidationResult/constants';
import { isCityConfigFlagEnabled, getCityConfigValue } from '../../../../utils/city-config';

const t = (key: string, options?: any) => {
  return translate(key, { locale: 'en_US', ...options });
};

const DEFAULT_ZAFIRA_VALIDATION_PRICE = 0.99;
const CPF_MIN_LENGTH = 11;
const DOOR_HANDLE_VALIDATION_ERROR_KEY = 'doorHandle.validation_error';

const formatZafiraValidationPrice = (
  value: string | number | null | undefined,
): string => {
  const num =
    value != null && value !== '' && !Number.isNaN(Number(value))
      ? Number(value)
      : DEFAULT_ZAFIRA_VALIDATION_PRICE;
  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const ModalDoorHandleManual = ({ setVisible, visible }: ModalDoorHandleManualProps) => {
  const calculateAllDoorHandle: any = useTripProvider(
    (context: any) => context.calculateAllDoorHandle,
  );
  const newTripDoorHandle: any = useTripProvider(
    (context: any) => context.newTripDoorHandle,
  );
  const getPaymentFormInVehicle: any = useTripProvider(
    (context: any) => context.getPaymentFormInVehicle,
  );
  const getTripTypes: any = useTripProvider(
    (context: any) => context.getTripTypes,
  );
  const dispatchTrip: any = useTripProvider(
    (context: any) => context.dispatchTrip,
  );
  const origin: any = useTripProvider((context: any) => context.stateTrip.origin);
  const destination: any = useTripProvider((context: any) => context.stateTrip.destination);
  const dataCalculate: any = useTripProvider((context: any) => context.stateTrip.dataCalculate);

  const { userDriverFind } = useUserDriver();
  const { location } = useLocalProvider();
  const { cityConfig } = useAuth();
  const { itsNetwork } = useNetwork();

  const [originValue, setOriginValue] = useState<string>('');
  const [destinationValue, setDestinationValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const [loadingCalculate, setLoadingCalculate] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);
  const [listAddresses, setListAddresses] = useState<any[]>([]);
  const [listAddressesDestiny, setListAddressesDestiny] = useState<any[]>([]);
  const [paymentForm, setPaymentForm] = useState<any[]>([]);
  const [tripTypes, setTripTypes] = useState<TripType[]>([]);
  const [selectedTripType, setSelectedTripType] = useState<TripType>({} as TripType);
  const [visibleModal, setVisibleModal] = useState<boolean>(true);
  const [visibleEditPrice, setVisibleEditPrice] = useState<boolean>(false);
  const [newPrice, setNewPrice] = useState<string>();
  const [selectedPaymentForm, setSelectedPaymentForm] = useState(null);
  const [activeWaypointId, setActiveWaypointId] = useState<string | null>(null);
  const timeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});
  const scrollRef = useRef<ScrollView>(null);
  const scrollOffsetRef = useRef(0);
  const keyboardScreenYRef = useRef<number | null>(null);
  const pendingRowRef = useRef<RefObject<any> | null>(null);
  const nameRowRef = useRef<any>(null);
  const phoneRowRef = useRef<any>(null);
  const emailRowRef = useRef<any>(null);
  const priceInputRef = useRef<any>(null);

  const [loadingZafira, setLoadingZafira] = useState<boolean>(false);
  const [zafiraModalVisible, setZafiraModalVisible] = useState<boolean>(false);
  const [zafiraResult, setZafiraResult] = useState<{
    isMatch: boolean;
    apiData?: {
      nome: string;
      cpf: string;
      nascimento: string;
      mae: string;
    };
    error?: string | null;
  } | null>(null);

  const enableZafiraValidation = isCityConfigFlagEnabled(
    cityConfig,
    'enableZafiraValidationApp',
  );
  const requireCustomerDataKnobTrip = isCityConfigFlagEnabled(
    cityConfig,
    'requireCustomerDataKnobTrip',
  );

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, e => {
      keyboardScreenYRef.current = e.endCoordinates.screenY;
    });
    const hide = Keyboard.addListener(hideEvent, () => {
      keyboardScreenYRef.current = null;
    });
    return () => { show.remove(); hide.remove(); };
  }, []);

  // measureInWindow nos dois views dá coords absolutas de tela.
  // O scrollOffset cancela na subtração, então targetY é independente
  // do offset atual — não há race com animação em curso.
  const performScroll = useCallback((rowRef: RefObject<any>, kbScreenY: number) => {
    if (!rowRef.current || !scrollRef.current) return;
    scrollRef.current.measureInWindow((_sx: number, svY: number, _sw: number, svH: number) => {
      rowRef.current?.measureInWindow((_rx: number, rowY: number, _rw: number, rowH: number) => {
        const effectiveBottom = Math.min(svY + svH, kbScreenY);
        const delta = rowY + rowH - effectiveBottom + 24;
        if (delta > 0) {
          scrollRef.current?.scrollTo({
            y: scrollOffsetRef.current + delta,
            animated: true,
          });
        }
      });
    });
  }, []);

  const scrollToRow = useCallback((rowRef: RefObject<any>) => {
    if (!rowRef.current || !scrollRef.current) return;
    if (keyboardScreenYRef.current !== null) {
      performScroll(rowRef, keyboardScreenYRef.current);
      return;
    }
    pendingRowRef.current = rowRef;
  }, [performScroll]);

  useEffect(() => {
    return () => { Object.values(timeoutsRef.current).forEach(clearTimeout); };
  }, []);

  const keyboardHeight = useKeyboardHeight();

  // Após o re-render que aplica paddingBottom, aguarda 150ms para o native
  // layer commitar o layout expandido antes de medir e chamar scrollTo.
  useEffect(() => {
    if (keyboardHeight > 0 && pendingRowRef.current !== null && keyboardScreenYRef.current !== null) {
      const row = pendingRowRef.current;
      const kbY = keyboardScreenYRef.current;
      pendingRowRef.current = null;
      const id = setTimeout(() => performScroll(row, kbY), 150);
      return () => clearTimeout(id);
    }
  }, [keyboardHeight, performScroll]);

  const originSel = useInputSelection();
  const destinationSel = useInputSelection();
  const [originFocused, setOriginFocused] = useState(false);
  const [destinationFocused, setDestinationFocused] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    cpf: '',
    email: '',
    paymentForm: '',
    idTripPaymentForm: '',
  });

  const {
    waypoints,
    showAddButton,
    addWaypoint,
    removeWaypoint,
    updateValue: updateWaypointValue,
    updateSuggestions,
    selectAddress: selectWaypointAddress,
    reset: resetWaypoints,
    waypointsForApi,
  } = useWaypoints(cityConfig);


  const isLocked =
    Object.keys(dataCalculate).length > 0 && destinationValue && originValue;

  useEffect(() => {
    if (originValue === '') setOriginValue(origin?.address || '');
  }, [origin]);

  useEffect(() => {
    if (isLocked) {
      Keyboard.dismiss();
      setOriginFocused(false);
      setDestinationFocused(false);
      setActiveWaypointId(null);
    }
  }, [isLocked]);

  const onChangeAddress = useCallback(
    (text, setState, setList) => {
      setState(text);
      const key = setState === setOriginValue ? 'origin' : 'destination';
      if (timeoutsRef.current[key]) clearTimeout(timeoutsRef.current[key]);

      if (!text.trim()) {
        setList([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      timeoutsRef.current[key] = setTimeout(async () => {
        try {
          const { data: { data } } = await apiMainDriver.get(
            `place/search?q=${text}&latlng=${location?.coords?.latitude || 0},${location?.coords?.longitude || 0}`,
          );
          setList(data || []);
        } catch {
          setList([]);
        } finally {
          setLoading(false);
        }
      }, 1500);
    },
    [location],
  );

  const onChangeWaypointAddress = useCallback(
    (id: string, text: string) => {
      updateWaypointValue(id, text);
      setActiveWaypointId(id);
      setLoading(true);
      if (timeoutsRef.current[id]) clearTimeout(timeoutsRef.current[id]);
      timeoutsRef.current[id] = setTimeout(async () => {
        if (!text.trim()) {
          updateSuggestions(id, []);
          setLoading(false);
          return;
        }
        try {
          const { data: { data } } = await apiMainDriver.get(
            `place/search?q=${text}&latlng=${location?.coords?.latitude || 0},${location?.coords?.longitude || 0}`,
          );
          updateSuggestions(id, data || []);
        } catch {
          updateSuggestions(id, []);
        } finally {
          setLoading(false);
        }
      }, 1500);
    },
    [location, updateWaypointValue, updateSuggestions],
  );

  const handleSelectWaypointAddress = useCallback(
    (id: string, item: any) => {
      selectWaypointAddress(id, item);
      setActiveWaypointId(null);
    },
    [selectWaypointAddress],
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
    dispatchTrip({ type: 'update', field: type, arg: item });
    setList([]);
    if (type === 'origin') originSel.reset();
    if (type === 'destination') destinationSel.reset();
  }, [originSel, destinationSel]);

  const waypointsSerialized = JSON.stringify(waypointsForApi);

  useEffect(() => {
    if (
      Object.keys(origin).length > 0 &&
      Object.keys(destination).length > 0 &&
      selectedTripType?.tripTypeId
    ) {
      setLoadingCalculate(true);
      calculateAllDoorHandle(
        origin,
        destination,
        selectedTripType.tripTypeId,
        waypointsForApi,
      )
        .catch(() => {
          customToast(t('driverTrip.text_error_update_trip') || 'Error updating trip', 'danger');
        })
        .finally(() => setLoadingCalculate(false));
      Keyboard.dismiss();
    }
  }, [origin, destination, waypointsSerialized, selectedTripType?.tripTypeId]);

  useEffect(() => {
    if (dataCalculate?.data?.price) setNewPrice(dataCalculate?.data?.price?.price);
  }, [dataCalculate]);

  useEffect(() => {
    if (visibleEditPrice) {
      const id = setTimeout(() => priceInputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [visibleEditPrice]);

  const getPaymentForms = async () => {
    const response = await getPaymentFormInVehicle();
    const data = response?.data;
    if (data && data.length > 0) {
      setPaymentForm(data);
      setForm(f => ({ ...f, paymentForm: data[0]?.name, idTripPaymentForm: data[0]?.idTripPaymentForm }));
      setSelectedPaymentForm(data[0]);
    } else {
      setPaymentForm([]);
      setSelectedPaymentForm(null);
    }
  };

  const getTripTypesDoorHandle = async () => {
    setLoadingInitial(true);
    const response = await getTripTypes(location);
    setLoadingInitial(false);
    if (!response?.data) return;
    setTripTypes(
      response.data.filter(item =>
        userDriverFind?.tripTypes?.some(type => item.tripTypeId === type.tripTypeId),
      ),
    );
    setLoadingInitial(false);
  };

  const handlePaymentFormChange = (itemValue) => {
    const selectedForm = paymentForm.find(item => item.idTripPaymentForm === itemValue);
    if (!selectedForm) return;
    setSelectedPaymentForm(selectedForm);
    setForm(f => ({ ...f, paymentForm: selectedForm.name, idTripPaymentForm: selectedForm.idTripPaymentForm }));
  };

  const handleBack = () => {
    setVisible?.(false);
    setOriginValue('');
    setDestinationValue('');
    setListAddresses([]);
    setListAddressesDestiny([]);
    resetWaypoints();
    setActiveWaypointId(null);
    setLoadingCalculate(false);
    dispatchTrip({ type: 'update', field: 'dataCalculate', arg: {} });
    dispatchTrip({ type: 'update', field: 'destination', arg: {} });
  };

  const buildOfflinePayload = () => {
    const cleanPrice = newPrice ?? dataCalculate?.data?.price?.price;

    return {
      destination,
      distance: dataCalculate?.data?.distance,
      driverId: userDriverFind?.idDriver,
      estimatedTripTime: dataCalculate?.data?.duration,
      origin,
      price: cleanPrice,
      priceId: dataCalculate?.data?.price?.idPrice,
      recalculatedTrip: newPrice
        ? { oldPrice: dataCalculate?.data?.price?.price, newPrice: cleanPrice }
        : null,
      tripCustomer: {
        name: form.name,
        phone: form.phone,
        document: '',
        email: form.email,
      },
      tripPaymentFormId: form.idTripPaymentForm,
      tripTypeId:
        selectedTripType?.tripTypeId ??
        dataCalculate?.data?.price?.tripType?.idTripType,
      userId: userDriverFind?.userId,
      multiplierDynamic: dataCalculate?.data?.price?.multiplierPriceDynamic
        ? parseFloat(dataCalculate?.data?.price?.multiplierPriceDynamic)
        : null,
      waypoints: waypointsForApi.length > 0 ? waypointsForApi : null,
    };
  };

  const handleOfflineDoorHandle = () => {
    offlineTripQueue.addDoorHandleManual(buildOfflinePayload());
    customToast(
      t('doorHandle.queued_offline') || 'Trip saved offline. Will sync when reconnected.',
      'success',
    );
    setSelectedTripType({} as TripType);
    setVisible?.(false);
  };

  const handleValidateZafira = async () => {
    const normalizedName = form.name.trim();
    const normalizedEmail = form.email.trim();
    const phoneDigits = form.phone;
    if (!normalizedName || !phoneDigits || !normalizedEmail) {
      return customToast(
        t('doorHandle.fill_in_the_fields_for_validation'),
        'warning',
      );
    }

    setZafiraResult(null);
    setLoadingZafira(true);
    try {
      const payloadZafira = {
        name: normalizedName,
        phone: form.phone,
        document: '',
        email: normalizedEmail,
      };
      const result = await validateRegistration(payloadZafira);

      if (result.status && result.data) {
        const isMatch = result.data.match === true;
        const apiError = result.data.error;
        setZafiraResult({
          isMatch,
          apiData: isMatch ? result.data.api_data : undefined,
          error: isMatch
            ? apiError || null
            : resolveZafiraValidationErrorMessage(apiError),
        });
        setZafiraModalVisible(true);
      } else {
        setZafiraResult({
          isMatch: false,
          error: resolveZafiraValidationErrorMessage(
            result.message ?? pickMobilidadeApiErrorMessage(result),
          ),
        });
        setZafiraModalVisible(true);
      }
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: unknown };
        message?: string;
      };
      setZafiraResult({
        isMatch: false,
        error: resolveZafiraValidationErrorMessage(
          pickMobilidadeApiErrorMessage(err?.response?.data) || err?.message,
        ),
      });
      setZafiraModalVisible(true);
    } finally {
      setLoadingZafira(false);
    }
  };

  const ensureZafiraMatchIfRequired = async (): Promise<boolean> => {
    if (!requireCustomerDataKnobTrip || !enableZafiraValidation) {
      return true;
    }
    const result = await validateRegistration({
      name: form.name.trim(),
      phone: form.phone,
      document: '',
      email: form.email.trim(),
    });
    if (result.status && result.data?.match) {
      return true;
    }
    const rawMessage =
      result.message ??
      pickMobilidadeApiErrorMessage(result) ??
      DOOR_HANDLE_VALIDATION_ERROR_KEY;
    customToast(resolveZafiraDisplayMessage(rawMessage), 'warning');
    return false;
  };

  const activeWaypointSuggestions = activeWaypointId
    ? (waypoints.find(wp => wp.id === activeWaypointId)?.suggestions || [])
    : [];

  const hasDataCalculate = Object.keys(dataCalculate).length > 0 && destinationValue && originValue;

  if (!visible) return null;

  return (
    <>
      <Container
        from={{ opacity: 0, transform: [{ translateY: 100 }] }}
        animate={{ opacity: 1, transform: [{ translateY: 0 }] }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* Header */}
        <Header>
          <BackBtn onPress={handleBack}>
            <Ionicons name="chevron-back-sharp" size={RFValue(20)} color={theme.colors.secondary} />
          </BackBtn>
          <HeaderTitle>{t('doorHandle.manual_doorknob_trip') || 'Manual Trip'}</HeaderTitle>
        </Header>

        <ScrollContent
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: keyboardHeight }}
          onScroll={e => { scrollOffsetRef.current = e.nativeEvent.contentOffset.y; }}
          scrollEventThrottle={16}
        >
          {/* Card de endereços */}
          <AddressCard pointerEvents={isLocked ? 'box-only' : 'auto'}>
            {/* Origem */}
            <AddressRow>
              <AddressIconCol>
                <OriginDot />
                <RouteLine />
              </AddressIconCol>
              <AddressInputWrap>
                <AddressFieldBox>
                  {isLocked ? (
                    <AddressValueOverlay>
                      <AddressValueText numberOfLines={1} ellipsizeMode="tail">
                        {originValue}
                      </AddressValueText>
                    </AddressValueOverlay>
                  ) : (
                    <>
                      <InputAddress
                        ref={originSel.ref}
                        value={originValue}
                        placeholder={t('trip.a11y_origin') || 'Origin'}
                        placeholderTextColor={theme.colors.input_placeholder}
                        onChangeText={text => onChangeAddress(text, setOriginValue, setListAddresses)}
                        onFocus={() => setOriginFocused(true)}
                        onBlur={() => {
                          originSel.onBlur();
                          setOriginFocused(false);
                        }}
                      />
                      {!originFocused && !!originValue && (
                        <AddressValueOverlay pointerEvents="none">
                          <AddressValueText numberOfLines={1} ellipsizeMode="tail">
                            {originValue}
                          </AddressValueText>
                        </AddressValueOverlay>
                      )}
                    </>
                  )}
                </AddressFieldBox>
              </AddressInputWrap>
            </AddressRow>

            {/* Waypoints */}
            {waypoints.map((waypoint, index) => (
              <WaypointRow key={waypoint.id}>
                <AddressIconCol>
                  <StopDot />
                  <RouteLine />
                </AddressIconCol>
                <AddressInputWrap>
                  <InputWithButton>
                    <AddressFieldBox>
                      {isLocked ? (
                        <AddressValueOverlay>
                          <AddressValueText numberOfLines={1} ellipsizeMode="tail">
                            {waypoint.value}
                          </AddressValueText>
                        </AddressValueOverlay>
                      ) : (
                        <>
                          <InputInRow
                            value={waypoint.value}
                            placeholder={t('trip.a11y_waypoint', { n: index + 1 }) || `Stop ${index + 1}`}
                            placeholderTextColor={theme.colors.input_placeholder}
                            onChangeText={text => onChangeWaypointAddress(waypoint.id, text)}
                            onFocus={() => setActiveWaypointId(waypoint.id)}
                            onBlur={() =>
                              setActiveWaypointId(current => (current === waypoint.id ? null : current))
                            }
                          />
                          {activeWaypointId !== waypoint.id && !!waypoint.value && (
                            <AddressValueOverlay pointerEvents="none">
                              <AddressValueText numberOfLines={1} ellipsizeMode="tail">
                                {waypoint.value}
                              </AddressValueText>
                            </AddressValueOverlay>
                          )}
                        </>
                      )}
                    </AddressFieldBox>
                    <RemoveWaypointButton
                      onPress={() => {
                        Keyboard.dismiss();
                        setActiveWaypointId(current => (current === waypoint.id ? null : current));
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        removeWaypoint(waypoint.id);
                      }}
                    >
                      <MaterialIcons name="close" size={RFValue(14)} color="#fff" />
                    </RemoveWaypointButton>
                  </InputWithButton>
                </AddressInputWrap>
              </WaypointRow>
            ))}

            {/* Destino */}
            <AddressRow>
              <AddressIconCol>
                <DestinationSquare />
              </AddressIconCol>
              <AddressInputWrap style={{ paddingBottom: 0 }}>
                <InputWithButton>
                  <AddressFieldBox>
                    {isLocked ? (
                      <AddressValueOverlay>
                        <AddressValueText numberOfLines={1} ellipsizeMode="tail">
                          {destinationValue}
                        </AddressValueText>
                      </AddressValueOverlay>
                    ) : (
                      <>
                        <InputInRow
                          ref={destinationSel.ref}
                          value={destinationValue}
                          placeholder={t('trip.a11y_destination') || 'Destination'}
                          placeholderTextColor={theme.colors.input_placeholder}
                          onChangeText={text => onChangeAddress(text, setDestinationValue, setListAddressesDestiny)}
                          onFocus={() => setDestinationFocused(true)}
                          onBlur={() => {
                            destinationSel.onBlur();
                            setDestinationFocused(false);
                          }}
                        />
                        {!destinationFocused && !!destinationValue && (
                          <AddressValueOverlay pointerEvents="none">
                            <AddressValueText numberOfLines={1} ellipsizeMode="tail">
                              {destinationValue}
                            </AddressValueText>
                          </AddressValueOverlay>
                        )}
                      </>
                    )}
                  </AddressFieldBox>
                  {!isLocked && showAddButton && (
                    <AddWaypointIconButton
                      onPress={() => {
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        addWaypoint();
                      }}
                    >
                      <MaterialIcons name="add" size={RFValue(14)} color="#fff" />
                    </AddWaypointIconButton>
                  )}
                </InputWithButton>
              </AddressInputWrap>
            </AddressRow>
          </AddressCard>

          {/* Sugestões */}
          {(listAddresses.length > 0 || activeWaypointSuggestions.length > 0 ||
            (Object.keys(dataCalculate).length === 0 && listAddressesDestiny.length > 0) ||
            loading) && (
            <SuggestionList>
              {[
                ...listAddresses.map(item => ({
                  item,
                  onPress: () => handleSelectAddress(item, setOriginValue, setListAddresses, 'origin'),
                })),
                ...activeWaypointSuggestions.map(item => ({
                  item,
                  onPress: () => handleSelectWaypointAddress(activeWaypointId, item),
                })),
                ...(Object.keys(dataCalculate).length === 0
                  ? listAddressesDestiny.map(item => ({
                      item,
                      onPress: () => handleSelectAddress(item, setDestinationValue, setListAddressesDestiny, 'destination'),
                    }))
                  : []),
              ].map(({ item, onPress }, index, arr) => {
                const address = item?.address || '';
                const normalized = address
                  .replace(/, Brasil$/i, '')
                  .replace(/, \d{5}-\d{3}$/, '')
                  .trim();
                const lastComma = normalized.lastIndexOf(', ');
                const main = lastComma > -1 ? normalized.slice(0, lastComma) : normalized;
                const sub = lastComma > -1 ? normalized.slice(lastComma + 2) : '';
                return (
                  <View key={index}>
                    <SuggestionItem onPress={onPress} activeOpacity={0.7}>
                      <SuggestionIconWrap>
                        <Ionicons name="location" size={RFValue(14)} color={theme.colors.primary} />
                      </SuggestionIconWrap>
                      <SuggestionTextWrap>
                        <SuggestionMainText numberOfLines={1}>{main}</SuggestionMainText>
                        {!!sub && <SuggestionSubText numberOfLines={1}>{sub}</SuggestionSubText>}
                      </SuggestionTextWrap>
                    </SuggestionItem>
                    {index < arr.length - 1 && <SuggestionDivider />}
                  </View>
                );
              })}

              {loading && <SkeletonAddressSuggestions rows={3} />}
            </SuggestionList>
          )}

          {/* Skeleton enquanto calcula */}
          {loadingCalculate && !!destinationValue && !!originValue && (
            <SkeletonDoorHandleForm />
          )}

          {/* Preço e formulário */}
          {hasDataCalculate && (
            <>
              {/* Card preço */}
              <PriceCard>
                {visibleEditPrice ? (
                  <PriceCardRow>
                    <InputMask
                      refInput={ref => { priceInputRef.current = ref; }}
                      value={newPrice}
                      type="money"
                      options={{ unit: cityConfig?.typeMoney }}
                      includeRawValueInChangeText
                      onChangeText={(_masked, raw) => {
                        const rawNumber = Number(raw);
                        if (!Number.isNaN(rawNumber)) setNewPrice(rawNumber.toFixed(2));
                      }}
                    />
                    <PriceSaveBtn onPress={() => setVisibleEditPrice(false)}>
                      <Ionicons name="checkmark-circle" size={RFValue(24)} color={theme.colors.primary} />
                    </PriceSaveBtn>
                  </PriceCardRow>
                ) : (
                  <PriceTouchable
                    activeOpacity={0.75}
                    onPress={() => {
                      Keyboard.dismiss();
                      setVisibleEditPrice(true);
                    }}
                  >
                    <PriceLargeText>
                      {cityConfig?.typeMoney}
                      {Helper.maskMoney(parseFloat(newPrice))}
                    </PriceLargeText>
                    <Ionicons name="pencil" size={RFValue(13)} color={theme.colors.text_gray} />
                  </PriceTouchable>
                )}
              </PriceCard>

              {/* Formulário do passageiro */}
              <Card>
                <SectionHeader>
                  <Ionicons name="person-circle-outline" size={RFValue(20)} color={theme.colors.primary} />
                  <SectionLabel>{t('sharedTrips.modal_passenger_title') || 'Passenger Information'}</SectionLabel>
                </SectionHeader>

                {/* Forma de pagamento */}
                <FieldRow>
                  <FieldIconCircle>
                    <Ionicons name="wallet-outline" size={RFValue(18)} color={theme.colors.placeholder} />
                  </FieldIconCircle>
                  <FieldContent>
                    <FieldLabel>{t('doorHandle.payment_method') || 'Payment Method'}</FieldLabel>
                    <PickerContainer>
                      <StyledPicker
                        selectedValue={selectedPaymentForm?.idTripPaymentForm}
                        onValueChange={handlePaymentFormChange}
                      >
                        {paymentForm.map((item, index) => (
                          <Picker.Item key={index} label={item.name} value={item.idTripPaymentForm} />
                        ))}
                      </StyledPicker>
                    </PickerContainer>
                  </FieldContent>
                </FieldRow>

                {/* Nome */}
                <FieldRow ref={nameRowRef}>
                  <FieldIconCircle focused={focusedField === 'name'}>
                    <Ionicons
                      name="person-outline"
                      size={RFValue(18)}
                      color={focusedField === 'name' ? theme.colors.primary : theme.colors.placeholder}
                    />
                  </FieldIconCircle>
                  <FieldContent>
                    <FieldLabel focused={focusedField === 'name'}>{t('doorHandle.name') || 'Name'}</FieldLabel>
                    <FieldTextInput
                      value={form.name}
                      onChangeText={text => setForm(f => ({ ...f, name: text }))}
                      onFocus={() => setFocusedField('name')}
                      onPressIn={() => scrollToRow(nameRowRef)}
                      onBlur={() => setFocusedField(null)}
                      placeholder={t('sharedTrips.modal_name_placeholder') || "Passenger's name"}
                      placeholderTextColor={theme.colors.input_placeholder}
                    />
                    <FieldLine focused={focusedField === 'name'} />
                  </FieldContent>
                </FieldRow>

                {/* Telefone */}
                <FieldRow ref={phoneRowRef}>
                  <FieldIconCircle focused={focusedField === 'phone'}>
                    <Ionicons
                      name="call-outline"
                      size={RFValue(18)}
                      color={focusedField === 'phone' ? theme.colors.primary : theme.colors.placeholder}
                    />
                  </FieldIconCircle>
                  <FieldContent>
                    <FieldLabel focused={focusedField === 'phone'}>{t('doorHandle.phone') || 'Phone'}</FieldLabel>
                    <FieldTextInput
                      value={maskPhone(form.phone)}
                      onChangeText={text => setForm(f => ({ ...f, phone: text.replace(/\D/g, '') }))}
                      onFocus={() => setFocusedField('phone')}
                      onPressIn={() => scrollToRow(phoneRowRef)}
                      onBlur={() => setFocusedField(null)}
                      placeholder={t('sharedTrips.modal_phone_placeholder') || '(00) 00000-0000'}
                      placeholderTextColor={theme.colors.input_placeholder}
                      keyboardType="phone-pad"
                    />
                    <FieldLine focused={focusedField === 'phone'} />
                  </FieldContent>
                </FieldRow>

                {/* E-mail */}
                <FieldRow ref={emailRowRef}>
                  <FieldIconCircle focused={focusedField === 'email'}>
                    <Ionicons
                      name="mail-outline"
                      size={RFValue(18)}
                      color={focusedField === 'email' ? theme.colors.primary : theme.colors.placeholder}
                    />
                  </FieldIconCircle>
                  <FieldContent>
                    <FieldLabel focused={focusedField === 'email'}>{t('doorHandle.email') || 'Email'}</FieldLabel>
                    <FieldTextInput
                      value={form.email}
                      onChangeText={text => setForm(f => ({ ...f, email: text }))}
                      onFocus={() => setFocusedField('email')}
                      onPressIn={() => scrollToRow(emailRowRef)}
                      onBlur={() => setFocusedField(null)}
                      placeholder={t('sharedTrips.modal_email_placeholder') || 'example@email.com'}
                      placeholderTextColor={theme.colors.input_placeholder}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    <FieldLine focused={focusedField === 'email'} />
                  </FieldContent>
                </FieldRow>

                {enableZafiraValidation && (
                  <ZafiraButton
                    onPress={handleValidateZafira}
                    disabled={loadingZafira}
                    activeOpacity={0.8}
                  >
                    <ZafiraButtonIcon
                      source={require('../../../../../assets/zafira/zafira-logo-white.png')}
                      resizeMode="contain"
                    />
                    <ZafiraButtonText>
                      {loadingZafira
                        ? (t('doorHandle.validating') || 'Validating...')
                        : `${t('doorHandle.check_registration') || 'Check Registration'} (${formatZafiraValidationPrice(
                            getCityConfigValue(cityConfig, 'zafiraValidationPrice') as
                              | string
                              | number
                              | undefined,
                          )})`}
                    </ZafiraButtonText>
                  </ZafiraButton>
                )}
              </Card>

            </>
          )}
        </ScrollContent>

        {hasDataCalculate && (
          <IfLoaderInsideScreen loading={loadingConfirm}>
            <ConfirmButton
              activeOpacity={0.85}
              onPress={async () => {
                if (!form.name || !form.paymentForm || !form.idTripPaymentForm) {
                  return customToast(t('doorHandle.fill_in_the_fields') || 'Fill in required fields', 'warning');
                }

                if (
                  requireCustomerDataKnobTrip &&
                  (!form.phone || !form.email)
                ) {
                  return customToast(t('doorHandle.fill_in_the_fields') || 'Fill in required fields', 'warning');
                }

                const hasZafiraMatch = await ensureZafiraMatchIfRequired();
                if (!hasZafiraMatch) {
                  return;
                }

                setLoadingConfirm(true);
                try {
                  if (!itsNetwork) {
                    handleOfflineDoorHandle();
                    return;
                  }
                  await newTripDoorHandle(form, newPrice, waypointsForApi);
                  setSelectedTripType({} as TripType);
                  handleBack();
                } catch (error) {
                  console.error('newTripDoorHandle failed', error);
                  customToast(
                    (error as Error)?.message || t('driverTrip.text_error_update_trip') || 'Error updating trip',
                    'danger',
                  );
                } finally {
                  setLoadingConfirm(false);
                }
              }}
            >
              <ConfirmText>{t('doorHandle.confirm') || 'Confirm'}</ConfirmText>
            </ConfirmButton>
          </IfLoaderInsideScreen>
        )}
      </Container>

      <TripTypePickerModal
        visible={visibleModal && !loadingInitial}
        tripTypes={tripTypes}
        onSelect={item => {
          setVisibleModal(false);
          setSelectedTripType(item);
        }}
        onClose={() => {
          setVisibleModal(false);
          setVisible?.(false);
        }}
      />

      <ZafiraValidationResultModal
        visible={zafiraModalVisible}
        setVisible={setZafiraModalVisible}
        isMatch={zafiraResult?.isMatch ?? false}
        apiData={zafiraResult?.apiData}
        error={zafiraResult?.error}
      />

      <Preload visible={loadingInitial} />
    </>
  );
};
