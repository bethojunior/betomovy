import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { TextInputMask } from 'react-native-masked-text';
import { Picker } from '@react-native-picker/picker';
import theme from '../../styles/theme';
import { createStyles } from './styles';
import { CustomerRideService, CustomerRideResponse, BookRideRequest } from '../../services/CustomerRideService';
import { useLocal } from '../../contexts/local';
import { useAuth } from '../../../context/auth';
import ModalFrame from '../../components/form/Modal';
import { customToast } from '../../../utils/FlashMessage';
import apiMain from '../../api/apiMain';
import useTripRealtime from '../../hooks/tripRealtime';
import { TripCallback } from '../../interfaces/tripRealtime';
import { useTrip } from '../../contexts/Trip';
import { STATUS_ACCEPTED, STATUS_IN_PROGRESS, STATUS_SCHEDULED } from '../../constants/trip';
import { useBubbleButton } from '@704apps/react-native-bubble-button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translate } from '../../locales';

type TabType = 'inicio' | 'agenda' | 'historico';
type TabIconName = 'directions' | 'event' | 'history';

const SHARED_TRIPS_TABS: readonly TabType[] = ['inicio', 'agenda', 'historico'];
const SHARED_TRIPS_TAB_ICONS: Record<TabType, TabIconName> = {
    inicio: 'directions',
    agenda: 'event',
    historico: 'history',
};

export default function SharedTrips() {
    const styles = createStyles(theme);
    const navigation: any = useNavigation();
    const insets = useSafeAreaInsets();
    const { position, setPosition } = useLocal();
    const { getPermissionLocal, user } = useAuth();
    const { tripRealtime } = useTripRealtime();
    const { dispatchTripCustomer, handleTripStateChange } = useTrip();
    const { openApp } = useBubbleButton();
    const unsubscribeRefs = useRef<Map<string, string>>(new Map());
    const [activeTab, setActiveTab] = useState<TabType>('inicio');
    const [cancellingRouteId, setCancellingRouteId] = useState<string | null>(null);

    const [routes, setRoutes] = useState<CustomerRideResponse[]>([]);
    const [loadingRoutes, setLoadingRoutes] = useState(true);
    const [error, setError] = useState(false);

    // Estados para agenda
    const [scheduledRoutes, setScheduledRoutes] = useState<CustomerRideResponse[]>([]);
    const [loadingScheduled, setLoadingScheduled] = useState(false);
    const [errorScheduled, setErrorScheduled] = useState(false);

    // Estados para histórico
    const [historyRoutes, setHistoryRoutes] = useState<CustomerRideResponse[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [errorHistory, setErrorHistory] = useState(false);

    const [selectedRoute, setSelectedRoute] = useState<CustomerRideResponse | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingBook, setLoadingBook] = useState(false);

    // Form states
    const [isForMe, setIsForMe] = useState(true); // true = para mim, false = para terceiros
    const [formName, setFormName] = useState('');
    const [formPhone, setFormPhone] = useState('');
    const [formDocument, setFormDocument] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [selectedBoarding, setSelectedBoarding] = useState<string>('');
    const [selectedDisembarkation, setSelectedDisembarkation] = useState<string>('');
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
    const [seatsQuantity, setSeatsQuantity] = useState<number>(1);
    const tabLabels: Record<TabType, string> = {
        inicio: translate('sharedTrips.tab_inicio'),
        agenda: translate('sharedTrips.tab_agenda'),
        historico: translate('sharedTrips.tab_historico'),
    };

    const formatPrice = (price: string) => {
        const priceNum = parseFloat(price);
        return `${priceNum.toFixed(2).replace('.', ',')}`;
    };

    const formatDateTime = (dateTimeString: string) => {
        try {
            const date = new Date(dateTimeString);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        } catch (error) {
            return dateTimeString;
        }
    };

    const formatDate = (dateTimeString: string) => {
        try {
            const date = new Date(dateTimeString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (error) {
            return dateTimeString;
        }
    };

    const getShortAddress = (addressObj: { address?: string; neighborhood?: string | null; complement?: string } | string) => {
        if (typeof addressObj === 'string') {
            const fullAddress = addressObj;
            if (!fullAddress) return translate('sharedTrips.address_unavailable');
            const parts = fullAddress.split(',');
            if (parts.length >= 2) {
                const rua = parts[0].trim();
                const numeroBairro = parts[1].trim();
                const bairro = parts.length >= 3 ? parts[2].trim() : '';
                return `${rua}, ${numeroBairro}${bairro ? `, ${bairro}` : ''}`;
            }
            return parts[0] || fullAddress;
        }

        // Se for objeto
        const address = addressObj.address || '';
        const neighborhood = addressObj.neighborhood || '';
        const complement = addressObj.complement || '';

        if (!address) return translate('sharedTrips.address_unavailable');

        const parts = address.split(',');
        const rua = parts[0]?.trim() || '';

        let numero = '';
        if (parts.length >= 2) {
            const segundaParte = parts[1].trim();
            // Verificar se tem número na segunda parte
            const numeroMatch = segundaParte.match(/\d+/);
            if (numeroMatch) {
                numero = numeroMatch[0];
            }
        }

        if (!numero && complement) {
            const numeroMatch = complement.match(/\d+/);
            if (numeroMatch) {
                numero = numeroMatch[0];
            }
        }

        let enderecoFormatado = rua;
        if (numero) {
            enderecoFormatado += `, ${numero}`;
        }
        if (neighborhood) {
            enderecoFormatado += `, ${neighborhood}`;
        } else if (parts.length >= 3) {
            enderecoFormatado += `, ${parts[2].trim()}`;
        }

        return enderecoFormatado || address;
    };

    const getAvailableRoutes = async () => {
        try {
            setLoadingRoutes(true);
            setError(false);

            let currentLat = position?.latitude;
            let currentLng = position?.longitude;

            if (!currentLat || !currentLng) {
                await getPermissionLocal();
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });
                currentLat = location.coords.latitude;
                currentLng = location.coords.longitude;
                setPosition({
                    latitude: currentLat,
                    longitude: currentLng,
                });
            }

            if (!currentLat || !currentLng) {
                setError(true);
                setLoadingRoutes(false);
                return;
            }

            const data = await CustomerRideService.find(currentLat, currentLng);


            const filteredRoutes = data.filter((route) => {
                const ride = route.ride as any;
                if (!ride || !ride.riders || !Array.isArray(ride.riders)) {
                    return true;
                }

                const userIsRider = ride.riders.some((rider: any) =>
                    rider.userId === user?.idUser?.toString() ||
                    rider.userId === String(user?.idUser) ||
                    rider.userId === user?.idUser
                );

                return !userIsRider;
            });

            setRoutes(filteredRoutes);
        } catch (error) {
            console.error('Erro ao buscar rotas disponíveis:', error);
            setError(true);
        } finally {
            setLoadingRoutes(false);
        }
    };

    const getScheduledRoutes = async () => {
        try {
            setLoadingScheduled(true);
            setErrorScheduled(false);
            const data = await CustomerRideService.getScheduled();
            setScheduledRoutes(data);
        } catch (error) {
            console.error('Erro ao buscar rotas agendadas:', error);
            setErrorScheduled(true);
        } finally {
            setLoadingScheduled(false);
        }
    };

    const getHistoryRoutes = async () => {
        try {
            setLoadingHistory(true);
            setErrorHistory(false);
            const data = await CustomerRideService.getHistory();
            setHistoryRoutes(data);
        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
            setErrorHistory(true);
        } finally {
            setLoadingHistory(false);
        }
    };

    const getPaymentMethods = async () => {
        try {
            const { data } = await apiMain.post('TripPaymentForm/GetAll', {});
            if (data.status && data.data) {
                setPaymentMethods(data.data);
            }
        } catch (error) {
            console.error('Erro ao buscar métodos de pagamento:', error);
        }
    };

    const monitorSharedTripScheduled = useCallback((tripReference: string) => {
        if (unsubscribeRefs.current.has(tripReference)) {
            return;
        }

        const callback: TripCallback = async ({ data: trip, type }) => {
            if (!trip) return;

            const ride = trip?.ride as any;
            const isSharedTrip = ride && Array.isArray(ride.riders) && ride.riders.length > 0;
            if (isSharedTrip) {
                const userIsRider = ride.riders.some((rider: any) =>
                    rider.userId === user?.idUser?.toString() || rider.userId === String(user?.idUser)
                );

                if (!userIsRider) {
                    return;
                }
            }

            if (['added', 'modified'].includes(type)) {
                if (trip.status === STATUS_ACCEPTED || trip.status === STATUS_IN_PROGRESS) {
                    await AsyncStorage.setItem('trip', JSON.stringify(trip));

                    dispatchTripCustomer({ type: 'update', field: 'trip', arg: trip });
                    dispatchTripCustomer({ type: 'update', field: 'hideTravelOptions', arg: true });

                    if (trip?.schedule && trip.status === STATUS_ACCEPTED) {
                        dispatchTripCustomer({ type: 'update', field: 'visibleLookUpAddressesModal', arg: false });
                        dispatchTripCustomer({ type: 'update', field: 'showModalScheduled', arg: true });
                    }

                    navigation.navigate('TripRoutes', { screen: 'Trip' });
                    openApp();
                }
            }
        };

        const unsubscribeId = tripRealtime.getTrip(tripReference, callback);
        unsubscribeRefs.current.set(tripReference, unsubscribeId);
    }, [user?.idUser, tripRealtime, dispatchTripCustomer, navigation, openApp]);

    useEffect(() => {
        const monitorScheduledTrips = async () => {
            try {
                const scheduled = await CustomerRideService.getScheduled();
                scheduled.forEach((route) => {
                    const tripReference = route.ride?.tripReference;
                    if (tripReference) {
                        monitorSharedTripScheduled(tripReference);
                    }
                });
            } catch (error) {
                console.error('Erro ao monitorar viagens agendadas:', error);
            }
        };

        if (user?.idUser) {
            monitorScheduledTrips();
        }

        return () => {
            unsubscribeRefs.current.forEach((unsubscribeId) => {
                tripRealtime.unsubscribe(unsubscribeId);
            });
            unsubscribeRefs.current.clear();
        };
    }, [user?.idUser, tripRealtime, monitorSharedTripScheduled]);

    useEffect(() => {
        getAvailableRoutes();
        getPaymentMethods();
    }, []);

    useEffect(() => {
        if (activeTab === 'agenda') {
            getScheduledRoutes();
        } else if (activeTab === 'historico') {
            getHistoryRoutes();
        }
    }, [activeTab]);

    useEffect(() => {
        if (user && modalVisible) {
            // Preencher com dados do usuário se disponível
            if (isForMe) {
                setFormName(user.nameUser || '');
                setFormDocument(user.document || '');
            } else {
                // Limpar campos se for para terceiros
                setFormName('');
                setFormPhone('');
                setFormDocument('');
                setFormEmail('');
            }
        }
    }, [user, modalVisible, isForMe]);

    const handleRoutePress = (route: CustomerRideResponse) => {
        setSelectedRoute(route);
        setModalVisible(true);
        // Inicializar selects vazios
        setSelectedBoarding('');
        setSelectedDisembarkation('');
        setSeatsQuantity(1);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedRoute(null);
        setIsForMe(true);
        setFormName('');
        setFormPhone('');
        setFormDocument('');
        setFormEmail('');
        setSelectedBoarding('');
        setSelectedDisembarkation('');
        setSelectedPaymentMethod('');
        setSeatsQuantity(1);
    };

    const removeMask = (value: string) => {
        return value.replace(/\D/g, '');
    };

    const handleCancelRide = async (tripReference: string, routeId: string) => {
        try {
            setCancellingRouteId(routeId);
            const response = await CustomerRideService.cancel(tripReference);

            if (response.status) {
                customToast(translate('sharedTrips.toast_cancel_success'), 'success');
                getScheduledRoutes();
            } else {
                customToast(response.message || translate('sharedTrips.toast_cancel_error'), 'error');
            }
        } catch (error: any) {
            console.error('Erro ao cancelar reserva:', error);
            customToast(error?.response?.data?.message || translate('sharedTrips.toast_cancel_error'), 'error');
        } finally {
            setCancellingRouteId(null);
        }
    };

    const handleSendMessage = (tripReference: string) => {
        if (!tripReference || tripReference.trim() === '') {
            return;
        }
        navigation.navigate('TripRoutes', {
            screen: 'SharedTripsChat',
            params: {
                tripReference: tripReference.trim(),
            },
        });
    };

    const findWaypointData = (value: string, type: 'boarding' | 'disembarkation') => {
        if (!selectedRoute) return null;

        // Se for origin ou destination
        if (value === 'origin' && selectedRoute.origin) {
            return {
                address: selectedRoute.origin.address,
                latitude: parseFloat(selectedRoute.origin.latitude),
                longitude: parseFloat(selectedRoute.origin.longitude),
                routePitStopTypeId: 1, // Embarque
            };
        }
        if (value === 'destination' && selectedRoute.destination) {
            return {
                address: selectedRoute.destination.address,
                latitude: parseFloat(selectedRoute.destination.latitude),
                longitude: parseFloat(selectedRoute.destination.longitude),
                routePitStopTypeId: 2, // Desembarque
            };
        }

        // Buscar em routeWayPoints pelo ID ou address
        const waypoint = selectedRoute.routeWayPoints?.find((wp: any) =>
            wp.id === value ||
            wp.idOrigin === value ||
            wp.idDestination === value ||
            wp.address === value
        );

        if (waypoint) {
            return {
                address: waypoint.address || waypoint.name || '',
                latitude: parseFloat(waypoint.latitude || waypoint.lat || '0'),
                longitude: parseFloat(waypoint.longitude || waypoint.lng || '0'),
                routePitStopTypeId: type === 'boarding' ? 1 : 2,
            };
        }

        // Buscar em riders waypoints
        const allRiderWaypoints = selectedRoute.ride?.riders?.flatMap((rider: any) => rider.waypoints || []) || [];
        const riderWaypoint = allRiderWaypoints.find((wp: any) =>
            wp.id === value ||
            wp.address === value
        );

        if (riderWaypoint) {
            return {
                address: riderWaypoint.address,
                latitude: parseFloat(riderWaypoint.latitude),
                longitude: parseFloat(riderWaypoint.longitude),
                routePitStopTypeId: type === 'boarding' ? 1 : 2,
            };
        }

        return null;
    };

    const handleConfirmBooking = async () => {
        if (!selectedRoute) return;

        // Validação básica
        if (!isForMe) {
            if (!formName.trim()) {
                customToast(translate('sharedTrips.toast_name_required'), 'warning');
                return;
            }
            if (!formDocument.trim()) {
                customToast(translate('sharedTrips.toast_cpf_required'), 'warning');
                return;
            }
        }
        if (!selectedBoarding) {
            customToast(translate('sharedTrips.toast_boarding_required'), 'warning');
            return;
        }
        if (!selectedDisembarkation) {
            customToast(translate('sharedTrips.toast_disembarkation_required'), 'warning');
            return;
        }
        if (!selectedPaymentMethod) {
            customToast(translate('sharedTrips.toast_payment_required'), 'warning');
            return;
        }

        try {
            setLoadingBook(true);

            // Buscar dados dos waypoints
            const boardingWaypoint = findWaypointData(selectedBoarding, 'boarding');
            const disembarkationWaypoint = findWaypointData(selectedDisembarkation, 'disembarkation');

            if (!boardingWaypoint || !disembarkationWaypoint) {
                customToast(translate('sharedTrips.toast_waypoint_error'), 'error');
                return;
            }

            // Construir riderTripCustomer
            const riderTripCustomer: any = {
                waypoints: [boardingWaypoint, disembarkationWaypoint],
                anotherPlace: null,
            };

            if (isForMe) {
                // Para o próprio usuário - incluir userId
                riderTripCustomer.userId = user?.idUser?.toString() || '';
            } else {
                // Para terceiros - incluir name e document
                riderTripCustomer.name = formName.trim();
                riderTripCustomer.document = removeMask(formDocument);
            }

            const bookingData: BookRideRequest = {
                tripReference: selectedRoute.ride?.tripReference || '',
                tripPaymentFormId: selectedPaymentMethod,
                value: seatsQuantity,
                riderTripCustomers: [riderTripCustomer],
            };

            const response = await CustomerRideService.book(bookingData);

            if (response.status) {
                customToast(translate('sharedTrips.toast_booking_success'), 'success');
                handleCloseModal();
                getAvailableRoutes();
                if (activeTab === 'agenda') {
                    getScheduledRoutes();
                }

                const tripReference = selectedRoute.ride?.tripReference || response.data?.tripReference;
                if (tripReference) {
                    monitorSharedTripScheduled(tripReference);
                }
            } else {
                customToast(response.message || translate('sharedTrips.toast_booking_error'), 'error');
            }
        } catch (error: any) {
            console.error('Erro ao realizar reserva:', error);
            customToast(error?.response?.data?.message || translate('sharedTrips.toast_booking_error'), 'error');
        } finally {
            setLoadingBook(false);
        }
    };

    return (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                    <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.navigate('TripRoutes', { screen: 'Home' })}>
                        <Ionicons name="arrow-back" size={22} color={theme.colors.primaryText} />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>{translate('sharedTrips.header_title')}</Text>
                        <Text style={styles.headerSubtitle}>{translate('sharedTrips.header_subtitle')}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            if (activeTab === 'inicio') {
                                getAvailableRoutes();
                            } else if (activeTab === 'agenda') {
                                getScheduledRoutes();
                            } else if (activeTab === 'historico') {
                                getHistoryRoutes();
                            }
                        }}
                        style={styles.refreshButton}
                        disabled={loadingRoutes || loadingScheduled || loadingHistory}
                    >
                        <Ionicons
                            name="refresh"
                            size={22}
                            color={(loadingRoutes || loadingScheduled || loadingHistory) ? `${theme.colors.primaryText}66` : theme.colors.primaryText}
                        />
                    </TouchableOpacity>
                </View>

                {/* Tabs — segmented control */}
                <View style={styles.tabsWrapper}>
                    <View style={styles.tabsContainer}>
                        {SHARED_TRIPS_TABS.map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                                <TouchableOpacity
                                    key={tab}
                                    style={[styles.tab, isActive && styles.tabActive]}
                                    onPress={() => setActiveTab(tab)}
                                    activeOpacity={0.8}
                                >
                                    <MaterialIcons
                                        name={SHARED_TRIPS_TAB_ICONS[tab] as any}
                                        size={15}
                                        color={isActive ? theme.colors.primary : theme.colors.grayLight}
                                    />
                                    <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                                        {tabLabels[tab]}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Conteúdo das Abas */}
                <View style={styles.routesContainer}>
                    {activeTab === 'inicio' && (
                        <>
                            {loadingRoutes ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color={theme.colors.primary} />
                                    <Text style={styles.loadingText}>{translate('sharedTrips.loading_routes')}</Text>
                                </View>
                            ) : error ? (
                                <View style={styles.errorContainer}>
                                    <View style={styles.errorIconCircle}>
                                        <MaterialIcons name="wifi-off" size={34} color={theme.colors.red} />
                                    </View>
                                    <Text style={styles.errorTitle}>{translate('sharedTrips.error_title')}</Text>
                                    <Text style={styles.errorText}>
                                        {translate('sharedTrips.error_routes')}
                                    </Text>
                                    <TouchableOpacity style={styles.retryButton} onPress={getAvailableRoutes}>
                                        <Text style={styles.retryButtonText}>{translate('sharedTrips.retry')}</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : routes.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <View style={styles.emptyIconCircle}>
                                        <MaterialIcons name="directions-bus" size={38} color={theme.colors.primaryText} />
                                    </View>
                                    <Text style={styles.emptyTitle}>{translate('sharedTrips.empty_routes_title')}</Text>
                                    <Text style={styles.emptyText}>
                                        {translate('sharedTrips.empty_routes_text')}
                                    </Text>
                                </View>
                            ) : (
                                routes.map((route) => {
                                    const seatsAvailable = parseInt(route.ride?.seatsAvailable || '0', 10);
                                    const scheduleTime = route.ride?.schedule
                                        ? formatDateTime(route.ride.schedule)
                                        : translate('sharedTrips.time_unavailable');
                                    const scheduleDate = route.ride?.schedule
                                        ? formatDate(route.ride.schedule)
                                        : null;
                                    const price = route.ride?.price || route.price || '0';
                                    const originAddress = route.origin || translate('sharedTrips.origin_unavailable');
                                    const destinationAddress = route.destination || translate('sharedTrips.destination_unavailable');
                                    const driverName = route.ride?.driver?.name || route.ride?.driver?.nickname || '';
                                    const driverImage = route.ride?.driver?.profileImage || '';
                                    const carModel = route.ride?.driver?.car?.model || '';
                                    const distanceKm = route.estimatedDistance && !isNaN(parseFloat(route.estimatedDistance))
                                        ? `${parseFloat(route.estimatedDistance).toFixed(1)} km`
                                        : null;

                                    return (
                                        <TouchableOpacity
                                            key={route.id}
                                            style={styles.routeCard}
                                            activeOpacity={0.8}
                                            onPress={() => handleRoutePress(route)}
                                        >
                                            {/* Driver strip */}
                                            {driverName ? (
                                                <View style={styles.driverStrip}>
                                                    {driverImage ? (
                                                        <Image
                                                            source={{ uri: driverImage }}
                                                            style={styles.driverAvatar}
                                                        />
                                                    ) : (
                                                        <View style={styles.driverAvatarFallback}>
                                                            <MaterialIcons name="person" size={18} color={theme.colors.primaryText} />
                                                        </View>
                                                    )}
                                                    <View style={styles.driverInfo}>
                                                        <Text style={styles.driverName} numberOfLines={1}>{driverName}</Text>
                                                        {carModel ? (
                                                            <Text style={styles.driverCar} numberOfLines={1}>{carModel}</Text>
                                                        ) : null}
                                                    </View>
                                                    <View style={styles.seatsBadge}>
                                                        <MaterialIcons name="event-seat" size={13} color={theme.colors.primary} />
                                                        <Text style={styles.seatsBadgeText}>
                                                            {seatsAvailable} {seatsAvailable === 1 ? translate('sharedTrips.seat_singular') : translate('sharedTrips.seat_plural')}
                                                        </Text>
                                                    </View>
                                                </View>
                                            ) : null}

                                            {/* Route timeline */}
                                            <View style={styles.routeBody}>
                                                <View style={styles.timeline}>
                                                    <View style={styles.timelineDotOrigin} />
                                                    <View style={styles.timelineLine} />
                                                    <View style={styles.timelineDotDestination} />
                                                </View>
                                                <View style={styles.routeAddresses}>
                                                    <Text style={styles.routeOrigin} numberOfLines={2}>
                                                        {getShortAddress(originAddress)}
                                                    </Text>
                                                    {distanceKm ? (
                                                        <View style={styles.distanceRow}>
                                                            <MaterialIcons name="straighten" size={12} color={theme.colors.grayLight} />
                                                            <Text style={styles.distanceText}>{distanceKm}</Text>
                                                        </View>
                                                    ) : null}
                                                    <Text style={styles.routeDestination} numberOfLines={2}>
                                                        {getShortAddress(destinationAddress)}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Footer details */}
                                            <View style={styles.routeDetails}>
                                                <View style={styles.routeDetailItem}>
                                                    <MaterialIcons name="calendar-today" size={15} color={theme.colors.grayLight} />
                                                    <Text style={styles.routeDetailText}>{scheduleDate}</Text>
                                                </View>
                                                <View style={styles.routeDetailItem}>
                                                    <MaterialIcons name="schedule" size={15} color={theme.colors.grayLight} />
                                                    <Text style={styles.routeDetailText}>{scheduleTime}</Text>
                                                </View>
                                                <View style={[styles.routeDetailItem, styles.priceBadge]}>
                                                    <MaterialIcons name="attach-money" size={15} color={theme.colors.primary} />
                                                    <Text style={styles.priceText}>{formatPrice(price)}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })
                            )}
                        </>
                    )}

                    {activeTab === 'agenda' && (
                        <>
                            {loadingScheduled ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color={theme.colors.primary} />
                                    <Text style={styles.loadingText}>{translate('sharedTrips.loading_scheduled')}</Text>
                                </View>
                            ) : errorScheduled ? (
                                <View style={styles.errorContainer}>
                                    <View style={styles.errorIconCircle}>
                                        <MaterialIcons name="wifi-off" size={34} color={theme.colors.red} />
                                    </View>
                                    <Text style={styles.errorTitle}>{translate('sharedTrips.error_title')}</Text>
                                    <Text style={styles.errorText}>
                                        {translate('sharedTrips.error_scheduled')}
                                    </Text>
                                    <TouchableOpacity style={styles.retryButton} onPress={getScheduledRoutes}>
                                        <Text style={styles.retryButtonText}>{translate('sharedTrips.retry')}</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : scheduledRoutes.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <View style={styles.emptyIconCircle}>
                                        <MaterialIcons name="event-available" size={38} color={theme.colors.primaryText} />
                                    </View>
                                    <Text style={styles.emptyTitle}>{translate('sharedTrips.empty_scheduled_title')}</Text>
                                    <Text style={styles.emptyText}>
                                        {translate('sharedTrips.empty_scheduled_text')}
                                    </Text>
                                </View>
                            ) : (
                                scheduledRoutes.map((route) => {
                                    const seatsAvailable = parseInt(route.ride?.seatsAvailable || '0', 10);
                                    const scheduleTime = route.ride?.schedule
                                        ? formatDateTime(route.ride.schedule)
                                        : translate('sharedTrips.time_unavailable');
                                    const scheduleDate = route.ride?.schedule
                                        ? formatDate(route.ride.schedule)
                                        : null;
                                    const price = route.ride?.price || route.price || '0';
                                    const originAddress = route.origin || translate('sharedTrips.origin_unavailable');
                                    const destinationAddress = route.destination || translate('sharedTrips.destination_unavailable');
                                    const driverName = route.ride?.driver?.name || route.ride?.driver?.nickname || '';
                                    const driverImage = route.ride?.driver?.profileImage || '';
                                    const distanceKm = route.estimatedDistance && !isNaN(parseFloat(route.estimatedDistance))
                                        ? `${parseFloat(route.estimatedDistance).toFixed(1)} km`
                                        : null;

                                    const tripReference = route.ride?.tripReference || '';
                                    const isCancelling = cancellingRouteId === route.id;

                                    return (
                                        <View key={route.id} style={styles.routeCard}>
                                            {/* Driver strip */}
                                            {driverName ? (
                                                <View style={styles.driverStrip}>
                                                    {driverImage ? (
                                                        <Image source={{ uri: driverImage }} style={styles.driverAvatar} />
                                                    ) : (
                                                        <View style={styles.driverAvatarFallback}>
                                                            <MaterialIcons name="person" size={18} color={theme.colors.primaryText} />
                                                        </View>
                                                    )}
                                                    <View style={styles.driverInfo}>
                                                        <Text style={styles.driverName} numberOfLines={1}>{driverName}</Text>
                                                    </View>
                                                    <View style={styles.seatsBadge}>
                                                        <MaterialIcons name="event-seat" size={13} color={theme.colors.primary} />
                                                        <Text style={styles.seatsBadgeText}>
                                                            {seatsAvailable} {seatsAvailable === 1 ? translate('sharedTrips.seat_singular') : translate('sharedTrips.seat_plural')}
                                                        </Text>
                                                    </View>
                                                </View>
                                            ) : null}

                                            {/* Route timeline */}
                                            <View style={styles.routeBody}>
                                                <View style={styles.timeline}>
                                                    <View style={styles.timelineDotOrigin} />
                                                    <View style={styles.timelineLine} />
                                                    <View style={styles.timelineDotDestination} />
                                                </View>
                                                <View style={styles.routeAddresses}>
                                                    <Text style={styles.routeOrigin} numberOfLines={2}>
                                                        {getShortAddress(originAddress)}
                                                    </Text>
                                                    {distanceKm ? (
                                                        <View style={styles.distanceRow}>
                                                            <MaterialIcons name="straighten" size={12} color={theme.colors.grayLight} />
                                                            <Text style={styles.distanceText}>{distanceKm}</Text>
                                                        </View>
                                                    ) : null}
                                                    <Text style={styles.routeDestination} numberOfLines={2}>
                                                        {getShortAddress(destinationAddress)}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Footer details */}
                                            <View style={styles.routeDetails}>
                                                <View style={styles.routeDetailItem}>
                                                    <MaterialIcons name="calendar-today" size={15} color={theme.colors.grayLight} />
                                                    <Text style={styles.routeDetailText}>{scheduleDate}</Text>
                                                </View>
                                                <View style={styles.routeDetailItem}>
                                                    <MaterialIcons name="schedule" size={15} color={theme.colors.grayLight} />
                                                    <Text style={styles.routeDetailText}>{scheduleTime}</Text>
                                                </View>
                                                <View style={[styles.routeDetailItem, styles.priceBadge]}>
                                                    <MaterialIcons name="attach-money" size={15} color={theme.colors.primary} />
                                                    <Text style={styles.priceText}>{formatPrice(price)}</Text>
                                                </View>
                                            </View>

                                            <View style={styles.routeActions}>
                                                <TouchableOpacity
                                                    style={[styles.actionButton, styles.cancelButton]}
                                                    onPress={() => tripReference && handleCancelRide(tripReference, route.id)}
                                                    disabled={isCancelling || !tripReference}
                                                    activeOpacity={0.7}
                                                >
                                                    {isCancelling ? (
                                                        <ActivityIndicator size="small" color="#fff" />
                                                    ) : (
                                                        <>
                                                            <MaterialIcons
                                                                name="cancel"
                                                                size={18}
                                                                color="#fff"
                                                            />
                                                            <Text style={styles.actionButtonText}>{translate('sharedTrips.action_cancel')}</Text>
                                                        </>
                                                    )}
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[styles.actionButton, styles.messageButton]}
                                                    onPress={() => tripReference && handleSendMessage(tripReference)}
                                                    disabled={!tripReference}
                                                    activeOpacity={0.7}
                                                >
                                                    <Ionicons
                                                        name="chatbubble-outline"
                                                        size={18}
                                                        color={theme.colors.primaryText}
                                                    />
                                                    <Text style={[styles.actionButtonText, styles.messageButtonText]}>{translate('sharedTrips.action_message')}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                })
                            )}
                        </>
                    )}

                    {activeTab === 'historico' && (
                        <>
                            {loadingHistory ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color={theme.colors.primary} />
                                    <Text style={styles.loadingText}>{translate('sharedTrips.loading_history')}</Text>
                                </View>
                            ) : errorHistory ? (
                                <View style={styles.errorContainer}>
                                    <View style={styles.errorIconCircle}>
                                        <MaterialIcons name="wifi-off" size={34} color={theme.colors.red} />
                                    </View>
                                    <Text style={styles.errorTitle}>{translate('sharedTrips.error_title')}</Text>
                                    <Text style={styles.errorText}>
                                        {translate('sharedTrips.error_history')}
                                    </Text>
                                    <TouchableOpacity style={styles.retryButton} onPress={getHistoryRoutes}>
                                        <Text style={styles.retryButtonText}>{translate('sharedTrips.retry')}</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : historyRoutes.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <View style={styles.emptyIconCircle}>
                                        <MaterialIcons name="history" size={38} color={theme.colors.primaryText} />
                                    </View>
                                    <Text style={styles.emptyTitle}>{translate('sharedTrips.empty_history_title')}</Text>
                                    <Text style={styles.emptyText}>
                                        {translate('sharedTrips.empty_history_text')}
                                    </Text>
                                </View>
                            ) : (
                                historyRoutes.map((route) => {
                                    const scheduleTime = route.ride?.schedule
                                        ? formatDateTime(route.ride.schedule)
                                        : translate('sharedTrips.time_unavailable');
                                    const scheduleDate = route.ride?.schedule
                                        ? formatDate(route.ride.schedule)
                                        : translate('sharedTrips.date_unavailable');
                                    const price = route.ride?.price || route.price || '0';
                                    const originAddress = route.origin || translate('sharedTrips.origin_unavailable');
                                    const destinationAddress = route.destination || translate('sharedTrips.destination_unavailable');
                                    const distanceKm = route.estimatedDistance && !isNaN(parseFloat(route.estimatedDistance))
                                        ? `${parseFloat(route.estimatedDistance).toFixed(1)} km`
                                        : null;

                                    return (
                                        <TouchableOpacity
                                            key={route.id}
                                            style={styles.routeCard}
                                            activeOpacity={0.8}
                                        >
                                            {/* Route timeline */}
                                            <View style={styles.routeBody}>
                                                <View style={styles.timeline}>
                                                    <View style={styles.timelineDotOrigin} />
                                                    <View style={styles.timelineLine} />
                                                    <View style={styles.timelineDotDestination} />
                                                </View>
                                                <View style={styles.routeAddresses}>
                                                    <Text style={styles.routeOrigin} numberOfLines={2}>
                                                        {getShortAddress(originAddress)}
                                                    </Text>
                                                    {distanceKm ? (
                                                        <View style={styles.distanceRow}>
                                                            <MaterialIcons name="straighten" size={12} color={theme.colors.grayLight} />
                                                            <Text style={styles.distanceText}>{distanceKm}</Text>
                                                        </View>
                                                    ) : null}
                                                    <Text style={styles.routeDestination} numberOfLines={2}>
                                                        {getShortAddress(destinationAddress)}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={styles.routeDetails}>
                                                <View style={styles.routeDetailItem}>
                                                    <MaterialIcons name="calendar-today" size={15} color={theme.colors.grayLight} />
                                                    <Text style={styles.routeDetailText}>{scheduleDate}</Text>
                                                </View>
                                                <View style={styles.routeDetailItem}>
                                                    <MaterialIcons name="schedule" size={15} color={theme.colors.grayLight} />
                                                    <Text style={styles.routeDetailText}>{scheduleTime}</Text>
                                                </View>
                                                <View style={[styles.routeDetailItem, styles.priceBadge]}>
                                                    <MaterialIcons name="attach-money" size={15} color={theme.colors.primary} />
                                                    <Text style={styles.priceText}>{formatPrice(price)}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })
                            )}
                        </>
                    )}
                </View>
            </View>

            {/* Modal de Reserva */}
            <ModalFrame
                visible={modalVisible}
                setVisible={setModalVisible}
                onClose={handleCloseModal}
                onPressConfirm={handleConfirmBooking}
                isLoading={loadingBook}
                textConfirm={translate('sharedTrips.modal_confirm')}
            >
                <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
                    {selectedRoute && (
                        <View style={styles.routeInfoModal}>
                            <Text style={styles.routeInfoTitle}>{translate('sharedTrips.modal_route_info_title')}</Text>
                            <View style={styles.routeInfoItem}>
                                <MaterialIcons name="location-on" size={16} color={theme.colors.primary} />
                                <Text style={styles.routeInfoText}>
                                    {getShortAddress(selectedRoute.origin || '')}
                                </Text>
                            </View>
                            <View style={styles.routeInfoItem}>
                                <MaterialIcons name="location-on" size={16} color={theme.colors.red} />
                                <Text style={styles.routeInfoText}>
                                    {getShortAddress(selectedRoute.destination || '')}
                                </Text>
                            </View>
                            <View style={styles.routeInfoItem}>
                                <MaterialIcons name="schedule" size={16} color={theme.colors.secondary} />
                                <Text style={styles.routeInfoText}>
                                    {selectedRoute.ride?.schedule ? formatDateTime(selectedRoute.ride.schedule) : translate('sharedTrips.time_unavailable')}
                                </Text>
                            </View>
                            <View style={styles.routeInfoItem}>
                                <MaterialIcons name="attach-money" size={16} color={theme.colors.secondary} />
                                <Text style={styles.routeInfoText}>
                                    {formatPrice(selectedRoute.ride?.price || selectedRoute.price || '0')}
                                </Text>
                            </View>
                        </View>
                    )}


                    {/* Campo de Vagas */}
                    <View style={styles.seatsContainer}>
                        <Text style={styles.inputLabel}>{translate('sharedTrips.modal_seats_label')}</Text>
                        <View style={styles.seatsControl}>
                            <TouchableOpacity
                                style={[styles.seatsButton, seatsQuantity <= 1 && styles.seatsButtonDisabled]}
                                onPress={() => {
                                    if (seatsQuantity > 1) {
                                        setSeatsQuantity(seatsQuantity - 1);
                                    }
                                }}
                                disabled={seatsQuantity <= 1}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.seatsButtonText, seatsQuantity <= 1 && styles.seatsButtonTextDisabled]}>-</Text>
                            </TouchableOpacity>
                            <View style={styles.seatsValueContainer}>
                                <Text style={styles.seatsValue}>{seatsQuantity}</Text>
                            </View>
                            <TouchableOpacity
                                style={[
                                    styles.seatsButton,
                                    selectedRoute && seatsQuantity >= parseInt(selectedRoute.ride?.seatsAvailable || '0', 10) && styles.seatsButtonDisabled
                                ]}
                                onPress={() => {
                                    const maxSeats = selectedRoute ? parseInt(selectedRoute.ride?.seatsAvailable || '0', 10) : 0;
                                    if (seatsQuantity < maxSeats) {
                                        setSeatsQuantity(seatsQuantity + 1);
                                    }
                                }}
                                disabled={selectedRoute ? seatsQuantity >= parseInt(selectedRoute.ride?.seatsAvailable || '0', 10) : true}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.seatsButtonText,
                                    selectedRoute && seatsQuantity >= parseInt(selectedRoute.ride?.seatsAvailable || '0', 10) && styles.seatsButtonTextDisabled
                                ]}>+</Text>
                            </TouchableOpacity>
                        </View>
                        {selectedRoute && (
                            <Text style={styles.seatsInfo}>
                                {translate('sharedTrips.modal_seats_max').replace('%{max}', selectedRoute.ride?.seatsAvailable || '0')}
                            </Text>
                        )}
                    </View>


                    {/* Radio Buttons - Para mim ou Para terceiros */}
                    <View style={styles.radioContainer}>
                        <Text style={styles.radioLabel}>{translate('sharedTrips.modal_trip_for')}</Text>
                        <View style={styles.radioGroup}>
                            <TouchableOpacity
                                style={styles.radioOption}
                                onPress={() => setIsForMe(true)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.radioCircle}>
                                    {isForMe && <View style={styles.radioInner} />}
                                </View>
                                <Text style={styles.radioText}>{translate('sharedTrips.modal_for_me')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.radioOption}
                                onPress={() => setIsForMe(false)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.radioCircle}>
                                    {!isForMe && <View style={styles.radioInner} />}
                                </View>
                                <Text style={styles.radioText}>{translate('sharedTrips.modal_for_third')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Selects de Embarque e Desembarque */}

                    <View style={styles.formContainer}>
                        <Text style={styles.formTitle}>{translate('sharedTrips.modal_passenger_title')}</Text>

                        {!isForMe && (
                            <>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>{translate('sharedTrips.modal_name_label')}</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={translate('sharedTrips.modal_name_placeholder')}
                                        value={formName}
                                        onChangeText={setFormName}
                                        autoCapitalize="words"
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>{translate('sharedTrips.modal_cpf_label')}</Text>
                                    <TextInputMask
                                        type="cpf"
                                        style={styles.input}
                                        placeholder="000.000.000-00"
                                        value={formDocument}
                                        onChangeText={setFormDocument}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </>
                        )}

                        {!isForMe && (
                            <>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>{translate('sharedTrips.modal_phone_label')}</Text>
                                    <TextInputMask
                                        type="cel-phone"
                                        options={{
                                            maskType: 'BRL',
                                            withDDD: true,
                                            dddMask: '(99) ',
                                        }}
                                        style={styles.input}
                                        placeholder="(00) 00000-0000"
                                        value={formPhone}
                                        onChangeText={setFormPhone}
                                        keyboardType="phone-pad"
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>{translate('sharedTrips.modal_email_label')}</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={translate('sharedTrips.modal_email_placeholder')}
                                        value={formEmail}
                                        onChangeText={setFormEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </View>
                            </>
                        )}
                    </View>

                    <View style={styles.selectsContainer}>
                        <View style={styles.selectContainer}>
                            <Text style={styles.inputLabel}>{translate('sharedTrips.modal_boarding_label')}</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedBoarding}
                                    onValueChange={(itemValue) => setSelectedBoarding(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label={translate('sharedTrips.modal_boarding_placeholder')} value="" />
                                    {selectedRoute?.origin && (
                                        <Picker.Item
                                            label={getShortAddress(selectedRoute.origin)}
                                            value="origin"
                                        />
                                    )}
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.selectContainer}>
                            <Text style={styles.inputLabel}>{translate('sharedTrips.modal_disembarkation_label')}</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedDisembarkation}
                                    onValueChange={(itemValue) => setSelectedDisembarkation(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label={translate('sharedTrips.modal_disembarkation_placeholder')} value="" />
                                    {selectedRoute?.destination && (
                                        <Picker.Item
                                            label={getShortAddress(selectedRoute.destination)}
                                            value="destination"
                                        />
                                    )}
                                </Picker>
                            </View>
                        </View>
                    </View>

                    {/* Select de Método de Pagamento */}
                    <View style={styles.selectContainer}>
                        <Text style={styles.inputLabel}>{translate('sharedTrips.modal_payment_label')}</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedPaymentMethod}
                                onValueChange={(itemValue) => setSelectedPaymentMethod(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label={translate('sharedTrips.modal_payment_placeholder')} value="" />
                                {paymentMethods.map((method: any) => (
                                    <Picker.Item
                                        key={method.idTripPaymentForm}
                                        label={method.name || method.description || translate('sharedTrips.modal_payment_fallback')}
                                        value={method.idTripPaymentForm}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>

                </ScrollView>
            </ModalFrame>
        </ScrollView>
    );
}

