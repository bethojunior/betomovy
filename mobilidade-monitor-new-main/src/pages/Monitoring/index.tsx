import { FC, useContext, useEffect, useLayoutEffect, useRef, useState, useCallback, useMemo } from "react";
import { Tooltip, Button, Spin } from "antd";
import { useHistory } from "react-router-dom";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import {
  IconArrowLeft,
  ColumnTrips,
  Container,
  ColumnMap,
  IconMenuTrips,
  ContainerTrips,
  ContainerMenuDesktop,
  MenuMobile,
  OptionMenuMobile,
  ContentColumnTrips,
  LoadingTripContainer,
  LoadingMoreTripsContainer,
  TripCardWrapper,
  GroupMenuMobile,
  FilterButton,
  ScheduledCounter,
  MobileScheduledBar,
  MobileNavGrid,
  MobileNavBackSlot,
  MobileNavTabsSlot,
  ActiveTripsActions,
} from "./styles";
import TripCard from "../../components/Monitoring/Card/TripCard";
import MapMonitoring from "../../components/Monitoring/Map";
import StateMenuOptionsContext from "../../contexts/stateMenuOptions";
import { STATUS_CANCELED, STATUS_FINISHED, STATUS_SCHEDULED } from "../../utils/TripStatus";
import TripContext from "../../contexts/trip";
import { TripService, ActiveTripsFilters } from "../../services/TripService";
import TripRealtime from "../../services/realtime/TripRealtime";
import { isRealtimeSocketEnabled } from "../../utils/realtime/realtimeSocketFlag";
import ActiveTripsFilter from "./_components/ActiveTripsFilter";
import TripFooterStats from "./_components/TripFooterStats";
import api from "../../services/api";
import AppSocket from "../../services/socket";
import Session from "../../utils/Session";
import Utils from "../../utils/Utils";
import { shouldShowDriverByOfflineRecency } from "../../utils/driverPosition";
import SelectAndButtonNotification from "../../components/Notification/CitiesAndNotifications";
import { SelectedMonitoringArea } from "../../@types";
import { MOBILE_BREAKPOINT } from "../../styles/layout-tokens";

const DEFAULT_ACTIVE_TRIPS_POLLING_INTERVAL_MS = 15000;

const resolveIfNotNull = <T,>(incoming?: T, existing?: T) => {
  if (incoming === null) return existing;
  return incoming !== undefined ? incoming : existing;
};

const extractDateValue = (date: any): string | number | undefined => {
  if (date && typeof date === 'object') return date.date;
  return date;
};

const normalizeCallingDriver = (value: any): string[] => {
  if (Array.isArray(value)) return value.map(String).sort();
  if (typeof value === 'string') return value.split(',').filter(Boolean).sort();
  return [];
};

const compareTripOrder = (a: TripDto, b: TripDto): number => {
  const aScheduled = a?.status === 'scheduled';
  const bScheduled = b?.status === 'scheduled';

  if (aScheduled !== bScheduled) {
    return aScheduled ? -1 : 1;
  }

  if (aScheduled) {
    const aTime = extractDateValue(a?.schedule?.schedule);
    const bTime = extractDateValue(b?.schedule?.schedule);
    const aMs = aTime ? new Date(aTime).getTime() : Infinity;
    const bMs = bTime ? new Date(bTime).getTime() : Infinity;
    return aMs - bMs;
  }

  const aDate = extractDateValue(a?.date);
  const bDate = extractDateValue(b?.date);
  return new Date(bDate ?? 0).getTime() - new Date(aDate ?? 0).getTime();
};

interface RealtimeFilterSnapshot {
  filterType: string;
  customerName?: string;
  driverName?: string;
}

const matchesSearchFilters = (trip: TripDto, filters: RealtimeFilterSnapshot): boolean => {
  if (filters.customerName) {
    const name = String(trip?.customerName ?? '').toLowerCase();
    if (!name.includes(filters.customerName.toLowerCase())) return false;
  }

  if (filters.driverName) {
    const name = String(trip?.driverName ?? '').toLowerCase();
    if (!name.includes(filters.driverName.toLowerCase())) return false;
  }

  return true;
};

const matchesActiveFilters = (trip: TripDto, filters: RealtimeFilterSnapshot): boolean => {
  const isScheduled = trip?.status === 'scheduled';

  if (filters.filterType === 'scheduled') {
    if (!isScheduled) return false;
  } else if (isScheduled) {
    return false;
  }

  return matchesSearchFilters(trip, filters);
};

const Monitoring: FC = () => {
  const { active, handleShowMenu } = useContext(StateMenuOptionsContext);
  const { trips, removingTripReferences, handleSetTrips, handleUpdateTrip, handleRemoveTrip } = useContext(TripContext);
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [existTrips, setExistTrips] = useState(true);
  const [menuMobile, setMenuMobile] = useState(false);
  const [tabActive, setTabActive] = useState(1);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [filterType, setFilterType] = useState('running');
  const [activeTripsFilters, setActiveTripsFilters] = useState<ActiveTripsFilters>({});
  const [filterLoading, setFilterLoading] = useState(false);
  const [scheduledTotal, setScheduledTotal] = useState(0);
  const scheduledCountedRef = useRef<Set<string>>(new Set());
  const [hasMoreTrips, setHasMoreTrips] = useState(true);
  const [loadingMoreTrips, setLoadingMoreTrips] = useState(false);
  const pageRef = useRef(1);
  const loadingMoreRef = useRef(false);
  const setLoadingMore = useCallback((value: boolean) => {
    loadingMoreRef.current = value;
    setLoadingMoreTrips(value);
  }, []);
  const tripsContainerRef = useRef<HTMLDivElement>(null);
  const [driverRecencyMode, setDriverRecencyMode] = useState<'all' | 'recent'>('recent');
  const [selectedArea, setSelectedArea] = useState<SelectedMonitoringArea | null>(null);
  const handleClearArea = useCallback(() => setSelectedArea(null), []);
  const driversRef = useRef<DriverRealtime[]>([]);
  const [driversUpdateKey, setDriversUpdateKey] = useState(0);
  const history = useHistory();
  const keysApp = Session.getLocal('keysApp');
  const realTimeSocket = isRealtimeSocketEnabled();
  const gestorKey = Array.isArray(keysApp)
    ? keysApp.find((key: any) => key.type === 'GESTOR')
    : undefined;
  const intervalConfig = Array.isArray(gestorKey?.config)
    ? gestorKey.config.find((config: any) => config.key === 'interval-to-get-trips')
    : undefined;
  const activeTripsPollingIntervalSeconds = Number(intervalConfig?.value);
  const activeTripsPollingIntervalMs = activeTripsPollingIntervalSeconds > 0
    ? activeTripsPollingIntervalSeconds * 1000
    : DEFAULT_ACTIVE_TRIPS_POLLING_INTERVAL_MS;
  const tripsRef = useRef<TripDto[]>([]);
  const selectedCityId = Session.getLocal("citySelected")?.cityId;
  const selectedCityPolygon = useMemo(() => {
    const polygon = Session.getLocal("citySelected")?.polygon;
    if (!polygon || typeof polygon !== "string") {
      return null;
    }

    const points = polygon
      .replace("POLYGON((", "")
      .replace("))", "")
      .split(",")
      .map((point: string) => {
        const [lng, lat] = point.trim().split(" ").map(Number);
        return { lat, lng };
      })
      .filter((point: { lat: number; lng: number }) => !isNaN(point.lat) && !isNaN(point.lng));
    if (points.length < 3) {
      return null;
    }

    const swappedPoints = points.map((point) => ({
      lat: point.lng,
      lng: point.lat,
    }));

    return {
      lngLat: points,
      latLng: swappedPoints,
    };
  }, [selectedCityId]);
  const updateTripsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleSetTripsRef = useRef<((trips: TripDto[]) => void) | null>(null);
  const handleUpdateTripRef = useRef<((trip: TripDto) => void) | null>(null);
  const handleRemoveTripRef = useRef<((tripReference: string) => void) | null>(null);

  const firstLoadRef = useRef(true);
  const normalizeDriversForMap = useCallback((drivers: DriverRealtime[]): DriverRealtime[] => {
    return drivers
      .map((driver: any) => {
        const lat =
          driver.latitude ??
          driver.lat ??
          driver.last_lat ??
          driver.lastLat ??
          driver.position?.lat ??
          driver.position?.latitude;
        const lng =
          driver.longitude ??
          driver.lng ??
          driver.last_lon ??
          driver.lastLon ??
          driver.position?.lng ??
          driver.position?.longitude;

        return {
          ...driver,
          latitude: lat,
          longitude: lng,
        };
      })
      .filter((driver: DriverRealtime) => {
        if (!driver || driver.idDriver == null) {
          return false;
        }

        if (driverRecencyMode === 'recent' && !shouldShowDriverByOfflineRecency(driver)) {
          return false;
        }

        const lat = Number(driver.latitude);
        const lng = Number(driver.longitude);

        const hasCityIdMatch =
          selectedCityId != null &&
          driver.cityId != null &&
          Number(driver.cityId) === Number(selectedCityId);

        const hasPolygonMatch =
          selectedCityPolygon &&
          !isNaN(lat) &&
          !isNaN(lng) &&
          (Utils.pointInPolygon({ lat, lng }, selectedCityPolygon.lngLat) ||
          Utils.pointInPolygon({ lat, lng }, selectedCityPolygon.latLng));

        const shouldFilterByCity =
          selectedCityId != null || selectedCityPolygon != null;

        if (shouldFilterByCity) {
          if (hasCityIdMatch || hasPolygonMatch) {
            // Match válido
          } else if (driver.cityId == null && !selectedCityPolygon) {
            // Aceita se o backend filtrou pela cidade
          } else {
            return false;
          }
        }

        return (
          !isNaN(lat) &&
          !isNaN(lng) &&
          driver.latitude != null &&
          driver.longitude != null &&
          driver.latitude !== "" &&
          driver.longitude !== "" &&
          lat !== 0 &&
          lng !== 0
        );
      })
      .map((driver: DriverRealtime) => ({
        ...driver,
        latitude: Number(driver.latitude),
        longitude: Number(driver.longitude),
      }));
  }, [selectedCityId, selectedCityPolygon, driverRecencyMode]);

  const handleWindowSizeChange = useCallback((): void => {
    setWidth(window.innerWidth);
  }, []);

  const changeOptionMenuMobile = (buttonSelected: number) => {
    setTabActive(buttonSelected);
  };

  const shouldHideTrip = (trip: TripDto) => {
    if (filterType === 'scheduled') {
      return trip.status !== "scheduled";
    }
    return trip.status === "scheduled";
  };


  const handleRenderCardTripByStatus = (trip: TripDto) => {
    return <TripCard tripReference={trip.tripReference} tripData={trip} />;
  };

  useEffect(() => {    
    setExistTrips(active);
  }, [active]);



  const visibilityMenuDesktop = () => {
    handleShowMenu(false);
  };

  useEffect(() => {
    handleSetTripsRef.current = handleSetTrips;
    handleUpdateTripRef.current = handleUpdateTrip;
    handleRemoveTripRef.current = handleRemoveTrip;
  }, [handleSetTrips, handleUpdateTrip, handleRemoveTrip]);

  useEffect(() => {
    tripsRef.current = trips;
  }, [trips]);

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, [handleWindowSizeChange]);

  useEffect(() => {
    if (width < MOBILE_BREAKPOINT) {
      setMenuMobile(true);
      return;
    }

    setExistTrips(true);
    setMenuMobile(false);
  }, [width]);

  const updateTripsInRef = useCallback((updatedTrips: TripDto[]) => {
    tripsRef.current = updatedTrips;
    
    if (updateTripsTimeoutRef.current) {
      clearTimeout(updateTripsTimeoutRef.current);
    }
    
    updateTripsTimeoutRef.current = setTimeout(() => {
      if (handleSetTripsRef.current) {
        handleSetTripsRef.current([...tripsRef.current]);
      }
      updateTripsTimeoutRef.current = null;
    }, 200);
  }, []);

  const updateSingleTripInRef = useCallback((updatedTrip: TripDto) => {
    const currentTrips = tripsRef.current;
    const tripIndex = currentTrips.findIndex(
      trip => trip.tripReference === updatedTrip.tripReference
    );
    
    const existingTrip = currentTrips[tripIndex];
    const hasChanged = !existingTrip || 
      JSON.stringify(existingTrip) !== JSON.stringify(updatedTrip);
    
    if (!hasChanged) {
      return;
    }
    
    const newTrips = tripIndex === -1
      ? [...currentTrips, updatedTrip]
      : currentTrips.map((trip, index) => (index === tripIndex ? updatedTrip : trip));

    tripsRef.current = newTrips.sort(compareTripOrder);

    if (updateTripsTimeoutRef.current) {
      clearTimeout(updateTripsTimeoutRef.current);
    }
    
    updateTripsTimeoutRef.current = setTimeout(() => {
      if (handleSetTripsRef.current) {
        handleSetTripsRef.current([...tripsRef.current]);
      }
      updateTripsTimeoutRef.current = null;
    }, 300);
  }, []);

  const page1TripReferencesRef = useRef<Set<string>>(new Set());

  const tripDetailSequenceRef = useRef<Map<string, number>>(new Map());

  const activeFiltersSnapshotRef = useRef<RealtimeFilterSnapshot>({ filterType });
  useLayoutEffect(() => {
    activeFiltersSnapshotRef.current = {
      filterType,
      customerName: activeTripsFilters.customerName,
      driverName: activeTripsFilters.driverName,
    };
  }, [filterType, activeTripsFilters]);

  const removeTripFromRef = useCallback((tripReference: string) => {
    tripsRef.current = tripsRef.current.filter(
      trip => trip.tripReference !== tripReference
    );
    
    if (handleRemoveTripRef.current) {
      handleRemoveTripRef.current(tripReference);
    }
  }, []);

  const handleGetAllTrip = useCallback(async (options?: { silent?: boolean; page?: number; reset?: boolean }) => {
    const silent = options?.silent ?? true;
    const page = options?.page ?? 1;
    const reset = options?.reset ?? false;
    if (!silent) setFilterLoading(true);
    if (page > 1) setLoadingMore(true);

    try {
      const requestFilters: ActiveTripsFilters = {
        ...activeTripsFilters,
        page,
        ...(filterType === 'scheduled' ? { status: 'scheduled' } : { excludeScheduled: true }),
      };

      const result = await TripService.getActiveAllTrip(requestFilters);
      const tripActiveArray = Array.isArray(result?.data) ? result.data : (Array.isArray(result) ? (result as any) : []);

      setScheduledTotal(result?.scheduledTotal ?? 0);
      setHasMoreTrips(Boolean(result?.next_page_url));
      pageRef.current = page;

      if (page === 1) {
        const tripMap = new Map(
          (reset ? [] : tripsRef.current).map((trip) => [trip.tripReference, trip])
        );
        const freshPage1Refs = new Set(tripActiveArray.map((trip) => trip.tripReference));

        tripActiveArray.forEach((apiTrip) => {
          const existingTrip = tripMap.get(apiTrip.tripReference);
          tripMap.set(apiTrip.tripReference, existingTrip ? { ...existingTrip, ...apiTrip } : apiTrip);
        });

        if (!reset) {
          page1TripReferencesRef.current.forEach((ref) => {
            if (!freshPage1Refs.has(ref)) tripMap.delete(ref);
          });
        }

        page1TripReferencesRef.current = freshPage1Refs;
        updateTripsInRef(Array.from(tripMap.values()));

        if (filterType === 'scheduled') {
          scheduledCountedRef.current = new Set(tripActiveArray.map((trip) => trip.tripReference));
        } else {
          // A aba atual exclui agendadas da lista, então não dá pra saber
          // quais tripReferences contam pro badge só com essa resposta —
          // busca à parte, só pra manter o contador correto em realtime
          // depois de um F5 (sem isso, remover uma agendada existente não
          // decrementa, já que o Set de tracking nasce vazio a cada reload).
          TripService.getActiveAllTrip({
            customerName: activeTripsFilters.customerName,
            driverName: activeTripsFilters.driverName,
            status: 'scheduled',
            perPage: 200,
          }).then((scheduledResult) => {
            const scheduledTrips = Array.isArray(scheduledResult?.data) ? scheduledResult.data : (Array.isArray(scheduledResult) ? (scheduledResult as any) : []);
            scheduledCountedRef.current = new Set(scheduledTrips.map((trip) => trip.tripReference));
          }).catch(() => {});
        }
      } else {
        const currentTrips = tripsRef.current;
        const existingRefs = new Set(currentTrips.map((trip) => trip.tripReference));
        const newTrips = tripActiveArray.filter((trip) => !existingRefs.has(trip.tripReference));
        updateTripsInRef([...currentTrips, ...newTrips]);

        if (filterType === 'scheduled') {
          tripActiveArray.forEach((trip) => scheduledCountedRef.current.add(trip.tripReference));
        }
      }

    } catch (error) {
      console.error('handleGetAllTrip - Erro:', error);
    } finally {
      if (firstLoadRef.current) {
        firstLoadRef.current = false;
        setLoadingTrips(false);
      }
      if (!silent) setFilterLoading(false);
      if (page > 1) setLoadingMore(false);
    }
  }, [updateTripsInRef, activeTripsFilters, filterType, setLoadingMore]);

  const handleTripsScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;

    const scrollableDistance = target.scrollHeight - target.clientHeight;
    const nearBottom = scrollableDistance <= 0 || target.scrollTop >= scrollableDistance * 0.6;

    if (nearBottom && hasMoreTrips && !loadingMoreRef.current) {
      handleGetAllTrip({ silent: true, page: pageRef.current + 1 });
    }
  }, [hasMoreTrips, handleGetAllTrip]);

  const getDrivers = useCallback(async () => {
    try {
      const cityId = Session.getLocal("citySelected")?.cityId;
      const response = await api.get('driver/positions', {
        params: {
          status: 'disponivel,online,available,corrida,busy,boarding,in_progress,accepted,desligado',
          cityId: cityId || undefined,
        },
      });
      const driversData = Array.isArray(response.data)
        ? response.data
        : (Array.isArray(response.data?.response)
            ? response.data.response
            : (Array.isArray(response.data?.data) ? response.data.data : []));
      if (driversData) {
        const normalizedDrivers = normalizeDriversForMap(driversData);
        driversRef.current = normalizedDrivers;
        setDriversUpdateKey(prev => prev + 1);
      }
    } catch (error) {
      console.error('getDrivers - Erro:', error);
    }
  }, [normalizeDriversForMap]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const handleGetAllTripRef = useRef(handleGetAllTrip);

  useEffect(() => {
    handleGetAllTripRef.current = handleGetAllTrip;
  }, [handleGetAllTrip]);

  useEffect(() => {
    const fetchTrips = async () => {
      await handleGetAllTripRef.current();
    };
    fetchTrips();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      fetchTrips();
    }, activeTripsPollingIntervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [activeTripsPollingIntervalMs]);

  // Refetch com loading visível quando o operador aplica/limpa um filtro —
  // o mount inicial já é coberto pelo effect de polling acima, por isso pula
  // a primeira execução aqui.
  const isFirstFilterRun = useRef(true);

  useEffect(() => {
    if (isFirstFilterRun.current) {
      isFirstFilterRun.current = false;
      return;
    }

    setHasMoreTrips(true);
    handleGetAllTrip({ silent: false, page: 1, reset: true });
  }, [activeTripsFilters, filterType, handleGetAllTrip]);

  const driversIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getDrivers();

    if (driversIntervalRef.current) {
      clearInterval(driversIntervalRef.current);
    }

    driversIntervalRef.current = setInterval(() => {
      getDrivers();
    }, 10000);

    return () => {
      if (driversIntervalRef.current) {
        clearInterval(driversIntervalRef.current);
        driversIntervalRef.current = null;
      }
    };
  }, [getDrivers]);

  const buildMappedTripFromRealtimeData = (tripData: any, existingTrip: TripDto | undefined, eventStatus: any): TripDto => {
    return {
      ...existingTrip,
      ...tripData,
      idTrip: tripData.idTrip ?? existingTrip?.idTrip,
      tripReference: tripData.tripReference,
      date: tripData.date?.date || tripData.date || existingTrip?.date || '',
      price: tripData.price ?? existingTrip?.price,
      driverId: tripData.driver?.driverId ?? tripData.driverId ?? existingTrip?.driverId,
      driverUserId: tripData.driver?.driverUserId ?? tripData.driverUserId ?? existingTrip?.driverUserId,
      driverAppVersion: resolveIfNotNull(
        tripData.driverAppVersion ?? tripData?.driver?.appVersion,
        existingTrip?.driverAppVersion ?? existingTrip?.driver?.appVersion
      ),
      driverName: tripData.driver?.name ?? tripData.driverName ?? existingTrip?.driverName,
      driverPhoto: tripData.driver?.profileImage ?? tripData.driverPhoto ?? existingTrip?.driverPhoto,
      userId: tripData.userId ?? existingTrip?.userId,
      customerAppVersion: resolveIfNotNull(
        tripData.customerAppVersion ?? tripData?.customer?.appVersion,
        existingTrip?.customerAppVersion ?? existingTrip?.customer?.appVersion
      ),
      customerId: tripData.customer?.idCustomer ?? tripData.customerId ?? existingTrip?.customerId,
      customerPhoto: tripData.customer?.profileImage ?? tripData.customerPhoto ?? existingTrip?.customerPhoto,
      zoneId: tripData.zoneId ?? existingTrip?.zoneId,
      tripTypeId: tripData.tripTypeId ?? existingTrip?.tripTypeId,
      customerName: tripData.customer?.name ?? tripData.customerName ?? existingTrip?.customerName,
      status: eventStatus,
      canceledBy: tripData.canceledBy ?? existingTrip?.canceledBy,
      paymentForm: typeof tripData.tripPaymentForm === 'object' && tripData.tripPaymentForm?.name
        ? tripData.tripPaymentForm.name
        : typeof tripData.paymentForm === 'object' && tripData.paymentForm?.name
        ? tripData.paymentForm.name
        : typeof tripData.paymentForm === 'string'
        ? tripData.paymentForm
        : typeof tripData.tripPaymentForm === 'string'
        ? tripData.tripPaymentForm
        : existingTrip?.paymentForm ?? null,
      tripType: typeof tripData.tripType === 'object' && tripData.tripType?.type
        ? tripData.tripType.type
        : typeof tripData.tripType === 'object' && tripData.tripType?.name
        ? tripData.tripType.name
        : typeof tripData.tripType === 'string'
        ? tripData.tripType
        : existingTrip?.tripType ?? null,
      favoriteDrivers: tripData.favoriteDrivers ?? existingTrip?.favoriteDrivers,
      situation: tripData.situation ?? existingTrip?.situation,
      originLatitude: tripData.originLatitude ?? tripData.origin?.latitude ?? existingTrip?.originLatitude,
      originLongitude: tripData.originLongitude ?? tripData.origin?.longitude ?? existingTrip?.originLongitude,
      originAddress: tripData.origin?.address ?? tripData.originAddress ?? existingTrip?.originAddress,
      destinationLatitude: tripData.destinationLatitude ?? tripData.destination?.latitude ?? existingTrip?.destinationLatitude,
      destinationLongitude: tripData.destinationLongitude ?? tripData.destination?.longitude ?? existingTrip?.destinationLongitude,
      destinationAddress: tripData.destination?.name ?? tripData.destinationAddress ?? existingTrip?.destinationAddress,
      driverTypeId: tripData.driverTypeId ?? existingTrip?.driverTypeId,
      driverType: tripData.driverType ?? existingTrip?.driverType,
      schedule: tripData.schedule ?? existingTrip?.schedule,
      driversCalled: tripData.driversCalled ?? tripData.driverCalleds ?? existingTrip?.driversCalled,
    };
  };

  const processRealtimeTripEvent = useCallback(async (eventType: string | undefined, tripData: any) => {
    if (!tripData || !tripData.tripReference) {
      return;
    }

    const syncScheduledCount = (tripReference: string, shouldCount: boolean) => {
      const wasCounted = scheduledCountedRef.current.has(tripReference);
      if (shouldCount === wasCounted) return;

      if (shouldCount) {
        scheduledCountedRef.current.add(tripReference);
        setScheduledTotal(prev => prev + 1);
      } else {
        scheduledCountedRef.current.delete(tripReference);
        setScheduledTotal(prev => Math.max(0, prev - 1));
      }
    };

    if (eventType === 'removed' || tripData.status === STATUS_FINISHED || tripData.status === STATUS_CANCELED) {
      syncScheduledCount(tripData.tripReference, false);
      removeTripFromRef(tripData.tripReference);
      return;
    }

    const currentTrips = tripsRef.current;
    const existingTrip = currentTrips.find(
      trip => trip.tripReference === tripData.tripReference
    );

    if (existingTrip && tripData.status === existingTrip.status && tripData.callingDriver !== undefined) {
      const callingDriverChanged = normalizeCallingDriver(tripData.callingDriver).join(',')
        !== normalizeCallingDriver(existingTrip.callingDriver).join(',');

      if (callingDriverChanged) {
        updateSingleTripInRef({ ...existingTrip, callingDriver: tripData.callingDriver });
        return;
      }
    }

    const sequence = (tripDetailSequenceRef.current.get(tripData.tripReference) ?? 0) + 1;
    tripDetailSequenceRef.current.set(tripData.tripReference, sequence);

    let resolvedTrip: TripDto | null = null;
    try {
      resolvedTrip = await TripService.getActiveTripDetail(tripData.tripReference);
    } catch (error) {
      console.error('[realtime] Erro ao buscar detalhes completos da viagem:', error);
    }

    if (tripDetailSequenceRef.current.get(tripData.tripReference) !== sequence) {
      return;
    }

    if (!resolvedTrip) {
      const eventStatus = tripData.status !== undefined && tripData.status !== null
        ? tripData.status
        : existingTrip?.status;
      resolvedTrip = buildMappedTripFromRealtimeData(tripData, existingTrip, eventStatus);
    }

    const isScheduled = resolvedTrip.status === STATUS_SCHEDULED;
    const shouldCountAsScheduled = isScheduled && matchesSearchFilters(resolvedTrip, activeFiltersSnapshotRef.current);
    syncScheduledCount(tripData.tripReference, shouldCountAsScheduled);

    if (!matchesActiveFilters(resolvedTrip, activeFiltersSnapshotRef.current)) {
      removeTripFromRef(tripData.tripReference);
      return;
    }

    updateSingleTripInRef(resolvedTrip);
  }, [removeTripFromRef, updateSingleTripInRef]);

  useEffect(() => {
    const socket = AppSocket.getInstance({
      query: {
        cityId: Session.getLocal("citySelected")?.cityId,
      },
      transports: [realTimeSocket ? 'websocket' : 'polling'],
    });

    socket.on('connect', () => {
      socket.emit('join-room', {
        cityId: Session.getLocal("citySelected")?.cityId,
      });
    });

    socket.on('driver.positions', (data: DriverRealtime | DriverRealtime[]) => {
      const driversArray = Array.isArray(data) ? data : (data ? [data] : []);
      const normalizedDrivers = normalizeDriversForMap(driversArray);

      const currentDrivers = driversRef.current || [];
      const updatedDrivers = [...currentDrivers];

      normalizedDrivers.forEach((newDriver: DriverRealtime) => {
        if (!newDriver || !newDriver.idDriver) {
          return;
        }

        const existingIndex = updatedDrivers.findIndex(
          (d) => d.idDriver === newDriver.idDriver
        );

        if (existingIndex >= 0) {
          updatedDrivers[existingIndex] = {
            ...updatedDrivers[existingIndex],
            ...newDriver,
          };
        } else {
          updatedDrivers.push(newDriver);
        }
      });

      driversRef.current = updatedDrivers;
      setDriversUpdateKey(prev => prev + 1);
    });
    
    return () => {
      socket.off('driver.positions');
      AppSocket.clearInstance();
    };
  }, [realTimeSocket]);

  useEffect(() => {
    if (!selectedCityId) return;

    const realtime = TripRealtime.getInstance();
    const id = realtime.getActiveTrips(String(selectedCityId), ({ data, type }) => {
      processRealtimeTripEvent(type, data);
    });

    return () => {
      realtime.unsubscribe(id);
    };
  }, [selectedCityId, processRealtimeTripEvent]);

  const showTripsColumn = menuMobile ? tabActive === 2 : existTrips;


  return (
    <Container>
      <MenuMobile $active={menuMobile}>
        <MobileNavGrid>
          <MobileNavBackSlot>
            <Button
              type="text"
              onClick={() => history.push("/")}
              icon={<IconArrowLeft style={{ fontSize: 20, color: "#fff" }} />}
              size="middle"
              style={{ flexShrink: 0 }}
            />
          </MobileNavBackSlot>
          <MobileNavTabsSlot>
            <GroupMenuMobile>
              <OptionMenuMobile
                $active={tabActive === 1}
                onClick={() => {
                  changeOptionMenuMobile(1);
                }}
                type="text"
              >
                Mapa
              </OptionMenuMobile>
              <OptionMenuMobile
                $active={tabActive === 2}
                onClick={() => {
                  changeOptionMenuMobile(2);
                }}
                type="text"
              >
                Viagens
              </OptionMenuMobile>
            </GroupMenuMobile>
          </MobileNavTabsSlot>
          <SelectAndButtonNotification
            monitoringMobileNavGrid
            selectedArea={selectedArea}
            onClearArea={handleClearArea}
          />
        </MobileNavGrid>
      </MenuMobile>
      {menuMobile && tabActive === 2 && (
        <MobileScheduledBar>
          <Tooltip title={filterType === 'running' ? "Mostrar Agendadas" : "Ocultar Agendadas"}>
            <FilterButton
              type="text"
              size="small"
              onClick={() => setFilterType(filterType === 'running' ? 'scheduled' : 'running')}
            >
              <ScheduledCounter>{scheduledTotal}</ScheduledCounter>
              Agendadas
              {filterType === 'scheduled' ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </FilterButton>
          </Tooltip>
        </MobileScheduledBar>
      )}
      <ContentColumnTrips>
        <ColumnTrips
          $active={menuMobile ? tabActive === 2 : existTrips}
          xs={24}
          md={24}
          xl={menuMobile ? 24 : existTrips ? 7 : 0}
        >
          <ContainerMenuDesktop>
            <Tooltip title="Voltar para o dashboard" placement="right">
              <Button
                onClick={() => {
                  history.push("/");
                }}
                type="text"
                icon={<IconArrowLeft style={{ fontSize: 25 }} />}
                size="large"
              />
            </Tooltip>
            
            <Tooltip title={filterType === 'running' ? "Mostrar Agendadas" : "Ocultar Agendadas"} placement="left">
              <FilterButton
                type="text"
                onClick={() => setFilterType(filterType === 'running' ? 'scheduled' : 'running')}
                size="large"
              >
                <ScheduledCounter>
                  {scheduledTotal}
                </ScheduledCounter>
                Agendadas
                {filterType === 'scheduled' ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </FilterButton>
            </Tooltip>

            <ActiveTripsActions>
              <ActiveTripsFilter onApply={setActiveTripsFilters} />

              <Tooltip title="Fechar listagem de viagens" placement="left">
                <Button
                  type="text"
                  icon={<IconMenuTrips style={{ fontSize: 25 }} />}
                  size="large"
                  onClick={visibilityMenuDesktop}
                />
              </Tooltip>
            </ActiveTripsActions>
          </ContainerMenuDesktop>
          <ContainerTrips ref={tripsContainerRef} onScroll={handleTripsScroll}>
            {(loadingTrips || filterLoading) && (
              <LoadingTripContainer>
                <Spin size="small" style={{ color: "red" }} />
              </LoadingTripContainer>
            )}
            {(trips || []).length > 0 && (trips || []).map(trip => (
              <TripCardWrapper
                key={trip.tripReference}
                $removing={removingTripReferences.has(trip.tripReference)}
                style={{ display: shouldHideTrip(trip) ? 'none' : 'block' }}
              >
                {handleRenderCardTripByStatus(trip)}
              </TripCardWrapper>
            ))}
            {loadingMoreTrips && (
              <LoadingMoreTripsContainer>
                <Spin size="small" />
              </LoadingMoreTripsContainer>
            )}
          </ContainerTrips>
        </ColumnTrips>

        <ColumnMap
          $active={menuMobile ? tabActive === 1 : true}
          xs={24}
          md={24}
          xl={menuMobile ? 24 : existTrips ? 19 : 24}
        >
          <MapMonitoring
            trips={trips}
            // onMapLoaded={getDrivers}
            drivers={driversRef.current}
            driversRef={driversRef}
            driversUpdateKey={driversUpdateKey}
            tripsLoading={loadingTrips}
            driverRecencyMode={driverRecencyMode}
            mobileLayoutKey={`${menuMobile ? 'mobile' : 'desktop'}-${tabActive}`}
            selectedArea={selectedArea}
            onAreaChange={setSelectedArea}
          />
        </ColumnMap>
      </ContentColumnTrips>
      <TripFooterStats
        showTripsColumn={showTripsColumn}
        driverRecencyMode={driverRecencyMode}
        onDriverRecencyModeChange={setDriverRecencyMode}
      />
    </Container>
  );
};

export default Monitoring;
