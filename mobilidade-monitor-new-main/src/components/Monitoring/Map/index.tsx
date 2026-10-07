import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { Tooltip, Button, Spin } from "antd";
import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import { FaCar } from "react-icons/fa";
import { AiOutlineUser, AiOutlineReload } from "react-icons/ai";
import { BiShareAlt } from "react-icons/bi";
import { BiTrip } from "react-icons/bi";
import { useHistory } from "react-router-dom";
import { AiOutlineTable } from "react-icons/ai";
import ListModal from "./ListModal";
import MonitoringAreaModal from "./MonitoringAreaModal";
import personIcon from "../../../assets/person.png";
import {
  ContainerOptionsMap,
  ContainerButtons,
  ButtonMap,
  IconArrowLeft,
  IconMenuTrips,
  ContainerMenuDesktopMap,
  ButtonMenuDesktopMap,
  NotificationButtonContainer,
  RouteLoader,
  RouteLoaderContent,
  ClientsButtonContainer,
  DropdownMenu,
  DropdownMenuItem,
  MapRoot,
  MapViewport,
  MobileFabToggle,
  DesktopOnlyNotification,
} from "./styles";
import StateMenuOptionsContext from "../../../contexts/stateMenuOptions";
import SelectAndButtonNotification from "../../Notification/CitiesAndNotifications";
import { Map as MapboxMap, MapRef, Source, Layer } from "react-map-gl";
import api from "../../../services/api";
import swal from "sweetalert";
import { TripMark } from "../Markers/TripMark";
import Session from "../../../utils/Session";
import { CityDelimiter } from "../Markers/CityDelimiter";
import { MonitoringAreaHighlight } from "../Markers/MonitoringAreaHighlight";
import MapService from "../../../services/MapService";
import { STATUS_FINISHED, STATUS_CANCELED } from "../../../utils/TripStatus";
import { SelectedMonitoringArea, MonitoringMapProps, LocationsProps, ActiveCustomerProps } from "src/@types";
import { useHeatMap } from "../../../hooks/useHeatMap";
import { DriversMarkers } from "./DriversMarkers";
import { useMapResizeOnLayoutChange } from "../../../hooks/useMapResizeOnLayoutChange";

 


const MapMonitoring: any = (props: MonitoringMapProps) => {
  const [menuDesktopMap, setMenuDesktopMap] = useState(false);
  const { active, handleShowMenu } = useContext(StateMenuOptionsContext);
  const [modalType, setModalType] = useState<'driver' | 'client' | null>(null);
  const [showMonitoringAreaModal, setShowMonitoringAreaModal] = useState(false);
  const [internalSelectedArea, setInternalSelectedArea] = useState<SelectedMonitoringArea | null>(null);
  const selectedArea = props.selectedArea !== undefined ? props.selectedArea : internalSelectedArea;
  const setSelectedArea = useCallback(
    (area: SelectedMonitoringArea | null) => {
      if (props.onAreaChange) {
        props.onAreaChange(area);
      } else {
        setInternalSelectedArea(area);
      }
    },
    [props.onAreaChange, setInternalSelectedArea]
  );
  const [selectedDriver, setSelectedDriver] = useState<DriverRealtime | null>(null);
  const [routeGeojson, setRouteGeojson] = useState<any>(null);
  const [showClientsDropdown, setShowClientsDropdown] = useState(false);
  const [showTripsDropdown, setShowTripsDropdown] = useState(false);
  const [mobileButtonsExpanded, setMobileButtonsExpanded] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [currentActiveFunction, setCurrentActiveFunction] = useState<(() => Promise<void>) | null>(null);
  const mapRef = useRef<MapRef>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tripsDropdownRef = useRef<HTMLDivElement>(null);
  const selectedDriverRef = useRef<DriverRealtime | null>(null);
  const driversRef = useRef<DriverRealtime[]>(props.driversRef?.current || props.drivers || []);
  const tripStatusByDriverId = React.useMemo(() => {
    const statusPriority: Record<string, number> = {
      in_progress: 3,
      corrida: 3,
      boarding: 2,
      accepted: 2,
      searching: 1,
      searching_favorite: 1,
      scheduled: 0
    };
    const map: Record<number, string> = {};

    if (!Array.isArray(props.trips)) {
      return map;
    }

    props.trips.forEach((trip: TripDto) => {
      const driverId = trip.driver?.idDriver || trip.driverId;
      if (driverId == null || trip.status == null) {
        return;
      }
      const currentStatus = map[Number(driverId)];
      if (!currentStatus) {
        map[Number(driverId)] = trip.status;
        return;
      }
      const currentPriority = statusPriority[currentStatus] ?? 0;
      const nextPriority = statusPriority[trip.status] ?? 0;
      if (nextPriority >= currentPriority) {
        map[Number(driverId)] = trip.status;
      }
    });

    return map;
  }, [props.trips]);
  const { 
    getNotAnsweredYesterday,
    getNotAnsweredToday,
    getFilteredCustomers,
    getAllCustomers,
    getCustomerArea,
    getLastDynamicsPlaces,
    getExpensiveDynamicsPlaces,
    getPlacesMoreTripWeekAgo,
    getNotAnsweredLastWeek,
  } = useHeatMap();
  const effectiveDriversRef = props.driversRef || driversRef;
  const citySelected = Session.getLocal("citySelected");

  const handleAreaSelect = (area: SelectedMonitoringArea) => {
    setSelectedArea(area);
    setSelectedDriver(null);
    setRouteGeojson(null);

    if (mapRef.current && area.area && area.area.length > 0) {
      let minLat = area.area[0].lat;
      let maxLat = area.area[0].lat;
      let minLng = area.area[0].lng;
      let maxLng = area.area[0].lng;

      area.area.forEach((point) => {
        minLat = Math.min(minLat, point.lat);
        maxLat = Math.max(maxLat, point.lat);
        minLng = Math.min(minLng, point.lng);
        maxLng = Math.max(maxLng, point.lng);
      });

      const bounds: [[number, number], [number, number]] = [
        [minLng, minLat],
        [maxLng, maxLat]
      ];

      const windowWidth = window.innerWidth;
      const tripsColumnWidth = menuDesktopMap && windowWidth >= 1200 
        ? windowWidth * 0.29
        : 0;
      
      const leftPadding =  0
      const rightPadding = tripsColumnWidth;
      const topPadding = 100;
      const bottomPadding = 100;

      const map = mapRef.current.getMap();
      if (map) {
        map.fitBounds(bounds, {
          padding: { 
            top: topPadding, 
            bottom: bottomPadding, 
            left: leftPadding, 
            right: rightPadding 
          },
          duration: 1000
        });
      }
    }
  };

  const handleClearArea = () => {
    setSelectedArea(null);
  };

  const handleClearDriver = () => {
    selectedDriverRef.current = null;
    setSelectedDriver(null);
    setRouteGeojson(null);
    setLoadingRoute(false);
  };

  const calculateAndRenderRoute = useCallback(async (driver: DriverRealtime, trip: TripDto) => {
    const lat = Number(driver.latitude);
    const lng = Number(driver.longitude);

    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
      return;
    }

    const driverLocation = `${lat},${lng}`;
    
    const tripStatus = trip.status?.toLowerCase();
    let targetLat: number | string | null = null;
    let targetLng: number | string | null = null;
    
    if (tripStatus === 'accepted' || tripStatus === 'boarding') {
      targetLat = trip.originLatitude || trip.origin?.latitude;
      targetLng = trip.originLongitude || trip.origin?.longitude;
    } else if (tripStatus === 'corrida' || tripStatus === 'in_progress') {
      targetLat = trip.destinationLatitude || 
                  trip.destination?.latitude || 
                  (trip.destination && typeof trip.destination === 'object' && trip.destination.latitude);
      targetLng = trip.destinationLongitude || 
                  trip.destination?.longitude || 
                  (trip.destination && typeof trip.destination === 'object' && trip.destination.longitude);
    }
    
    if (!targetLat || !targetLng) {
      return;
    }

    const target = `${targetLat},${targetLng}`;
    
    try {
      const routeResult = await MapService.searchNative(driverLocation, target, null);
      
      if (routeResult?.data?.overview_polyline?.points) {
        const decodedPoints = MapService.decodePolyline(routeResult.data.overview_polyline.points);
        
        const geojson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: decodedPoints.map((point: any) => [point.lng, point.lat])
          }
        };
        
        setRouteGeojson(geojson);
        
        if (decodedPoints.length > 0 && mapRef.current) {
          let minLat = decodedPoints[0].lat;
          let maxLat = decodedPoints[0].lat;
          let minLng = decodedPoints[0].lng;
          let maxLng = decodedPoints[0].lng;

          decodedPoints.forEach((point: any) => {
            minLat = Math.min(minLat, point.lat);
            maxLat = Math.max(maxLat, point.lat);
            minLng = Math.min(minLng, point.lng);
            maxLng = Math.max(maxLng, point.lng);
          });

          const tripStatus = trip.status?.toLowerCase();
          let targetLat: number | string | null = null;
          let targetLng: number | string | null = null;
          let originLat: number | string | null = null;
          let originLng: number | string | null = null;

          if (tripStatus === 'accepted' || tripStatus === 'boarding') {
            originLat = trip.originLatitude || trip.origin?.latitude;
            originLng = trip.originLongitude || trip.origin?.longitude;
            targetLat = trip.originLatitude || trip.origin?.latitude;
            targetLng = trip.originLongitude || trip.origin?.longitude;
          } else if (tripStatus === 'corrida' || tripStatus === 'in_progress') {
            originLat = trip.originLatitude || trip.origin?.latitude;
            originLng = trip.originLongitude || trip.origin?.longitude;
            targetLat = trip.destinationLatitude || trip.destination?.latitude;
            targetLng = trip.destinationLongitude || trip.destination?.longitude;
          }

          if (originLat && originLng) {
            const originLatNum = Number(originLat);
            const originLngNum = Number(originLng);
            if (!isNaN(originLatNum) && !isNaN(originLngNum)) {
              minLat = Math.min(minLat, originLatNum);
              maxLat = Math.max(maxLat, originLatNum);
              minLng = Math.min(minLng, originLngNum);
              maxLng = Math.max(maxLng, originLngNum);
            }
          }

          if (targetLat && targetLng) {
            const targetLatNum = Number(targetLat);
            const targetLngNum = Number(targetLng);
            if (!isNaN(targetLatNum) && !isNaN(targetLngNum)) {
              minLat = Math.min(minLat, targetLatNum);
              maxLat = Math.max(maxLat, targetLatNum);
              minLng = Math.min(minLng, targetLngNum);
              maxLng = Math.max(maxLng, targetLngNum);
            }
          }

          const driverLatNum = Number(driver.latitude);
          const driverLngNum = Number(driver.longitude);
          if (!isNaN(driverLatNum) && !isNaN(driverLngNum)) {
            minLat = Math.min(minLat, driverLatNum);
            maxLat = Math.max(maxLat, driverLatNum);
            minLng = Math.min(minLng, driverLngNum);
            maxLng = Math.max(maxLng, driverLngNum);
          }

          const bounds: [[number, number], [number, number]] = [
            [minLng, minLat],
            [maxLng, maxLat]
          ];

          const windowWidth = window.innerWidth;
          const tripsColumnWidth = menuDesktopMap && windowWidth >= 1200 
            ? windowWidth * 0.29
            : 0;

          const map = mapRef.current.getMap();
          if (map) {
            setTimeout(() => {
              map.fitBounds(bounds, {
                padding: { 
                  top: 100, 
                  bottom: 100, 
                  left: 100, 
                  right: tripsColumnWidth + 100 
                },
                duration: 1000
              });
            }, 100);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao buscar rota:', error);
    }
  }, [menuDesktopMap]);

  const handleDriverFocus = async (driver: DriverRealtime) => {
    if (!mapRef.current || !driver) return;

    const lat = Number(driver.latitude);
    const lng = Number(driver.longitude);

    if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
      return;
    }

    selectedDriverRef.current = driver;
    setSelectedDriver(driver);
    setSelectedArea(null);

    const driverTrip = props.trips?.find((trip: TripDto) => {
      const tripDriverId = trip.driver?.idDriver || trip.driverId;
      return Number(tripDriverId) === Number(driver.idDriver);
    });

    if (driverTrip) {
      setLoadingRoute(true);
      try {
        await calculateAndRenderRoute(driver, driverTrip);
      } finally {
        setLoadingRoute(false);
      }
    } else {
      setRouteGeojson(null);
    }

    const map = mapRef.current.getMap();
    if (map) {
      const windowWidth = window.innerWidth;
      const tripsColumnWidth = menuDesktopMap && windowWidth >= 1200 
        ? windowWidth * 0.29
        : 0;
      
      const leftPadding = 0;
      const rightPadding = tripsColumnWidth;
      const topPadding = 100;
      const bottomPadding = 100;

      const bounds: [[number, number], [number, number]] = [
        [lng, lat],
        [lng, lat]
      ];

      map.fitBounds(bounds, {
        padding: { 
          top: topPadding, 
          bottom: bottomPadding, 
          left: leftPadding, 
          right: rightPadding 
        },
        maxZoom: 15,
        duration: 1000
      });
    }
  };

  const handleClientSelect = (client: any) => {
    const activeTrip = props.trips?.find((trip: TripDto) => {
      const customerId = trip.customerId || trip.userId;
      const clientId = client.idCustomer || client.idUser;
      return String(customerId) === String(clientId);
    });

    if (!activeTrip) {
      return;
    }

    const driverId = activeTrip.driverId || activeTrip.driver?.idDriver;
    if (!driverId) {
      return;
    }

    const drivers = effectiveDriversRef.current || [];
    const driver = drivers.find((d: DriverRealtime) => {
      return Number(d.idDriver) === Number(driverId);
    });

    if (driver) {
      handleDriverFocus(driver);
    }
  };

  const changeMap = () => {
    handleShowMenu(true);
  };

  // Fecha o dropdown ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowClientsDropdown(false);
      }
      if (tripsDropdownRef.current && !tripsDropdownRef.current.contains(event.target as Node)) {
        setShowTripsDropdown(false);
      }
    };

    if (showClientsDropdown || showTripsDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showClientsDropdown, showTripsDropdown]);

  // Função para verificar se um ponto está dentro de um polígono


  // Remove todas as camadas de clientes e heatmap do mapa
  const removeAllLayers = () => {
    if (!mapRef.current?.getMap()) return;
    const map = mapRef.current.getMap();
    const mapAny = map as any;

    // Remove camadas de clientes
    if (map.getLayer("customers-points")) {
      map.removeLayer("customers-points");
    }
    if (map.getSource("customers-points-source")) {
      map.removeSource("customers-points-source");
    }
    if (map.getLayer("customers-heatmap")) {
      map.removeLayer("customers-heatmap");
    }
    if (map.getSource("customers-heatmap-source")) {
      map.removeSource("customers-heatmap-source");
    }

    // Remove camada de heatmap genérico
    if (map.getLayer("heat-map")) {
      map.removeLayer("heat-map");
    }
    if (map.getSource("heat-map")) {
      map.removeSource("heat-map");
    }

    // Remove event listeners
    // @ts-ignore - mapbox event types
    mapAny.off("click", "customers-points");
    // @ts-ignore - mapbox event types
    mapAny.off("mouseenter", "customers-points");
    // @ts-ignore - mapbox event types
    mapAny.off("mouseleave", "customers-points");
  };

  // Remove apenas camadas de clientes do mapa
  const removeCustomerLayers = () => {
    if (!mapRef.current?.getMap()) return;
    const map = mapRef.current.getMap();
    const mapAny = map as any;

    if (map.getLayer("customers-points")) {
      map.removeLayer("customers-points");
    }
    if (map.getSource("customers-points-source")) {
      map.removeSource("customers-points-source");
    }
    if (map.getLayer("customers-heatmap")) {
      map.removeLayer("customers-heatmap");
    }
    if (map.getSource("customers-heatmap-source")) {
      map.removeSource("customers-heatmap-source");
    }

    // Remove event listeners
    // @ts-ignore - mapbox event types
    mapAny.off("click", "customers-points");
    // @ts-ignore - mapbox event types
    mapAny.off("mouseenter", "customers-points");
    // @ts-ignore - mapbox event types
    mapAny.off("mouseleave", "customers-points");
  };

  // Adiciona pontos individuais no mapa
  const addCustomersPoints = (customers: ActiveCustomerProps[]) => {
    if (!mapRef.current?.getMap()) return;
    const map = mapRef.current.getMap();
    
    if (!map.loaded()) {
      map.once("load", () => {
        removeCustomerLayers();
        addCustomersPointsToMap(customers, map);
      });
      return;
    }

    removeCustomerLayers();
    addCustomersPointsToMap(customers, map);
  };

  const addCustomersPointsToMap = (customers: ActiveCustomerProps[], map: any) => {

    const customersFormated = customers.map((customer) => {
      return {
        type: "Feature" as const,
        properties: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
        geometry: {
          type: "Point" as const,
          coordinates: [
            Number(customer.longitude),
            Number(customer.latitude),
          ] as [number, number],
        },
      };
    });

    const sourceData: GeoJSON.FeatureCollection = {
      type: "FeatureCollection" as const,
      features: customersFormated as GeoJSON.Feature[],
    };

    map.addSource("customers-points-source", {
      type: "geojson",
      data: sourceData,
    });

    map.addLayer({
      id: "customers-points",
      type: "circle",
      source: "customers-points-source",
      paint: {
        "circle-radius": 8,
        "circle-color": "#FF6B6B",
        "circle-opacity": 0.8,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#FFFFFF",
      },
    });

    const mapAny = map as any;
    mapAny.on("click", "customers-points", (e: any) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const properties = e.features[0].properties;

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(
          `<div>
            <strong>${properties.name}</strong><br/>
            ${properties.email ? `Email: ${properties.email}<br/>` : ""}
            ${properties.phone ? `Telefone: ${properties.phone}` : ""}
          </div>`
        )
        .addTo(map);
    });

    mapAny.on("mouseenter", "customers-points", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    mapAny.on("mouseleave", "customers-points", () => {
      map.getCanvas().style.cursor = "";
    });
  };

  // Adiciona heatmap (mancha de calor) no mapa
  const addCustomersHeatmap = (customers: ActiveCustomerProps[]) => {
    if (!mapRef.current?.getMap()) return;
    const map = mapRef.current.getMap();
    
    if (!map.loaded()) {
      map.once("load", () => {
        removeCustomerLayers();
        addCustomersHeatmapToMap(customers, map);
      });
      return;
    }

    removeCustomerLayers();
    addCustomersHeatmapToMap(customers, map);
  };

  const addCustomersHeatmapToMap = (customers: ActiveCustomerProps[], map: any) => {

    const customersFormated = customers.map((customer) => {
      return {
        type: "Feature" as const,
        properties: {
          intensity: 20,
        },
        geometry: {
          type: "Point" as const,
          coordinates: [
            Number(customer.longitude),
            Number(customer.latitude),
          ] as [number, number],
        },
      };
    });

    const sourceData: GeoJSON.FeatureCollection = {
      type: "FeatureCollection" as const,
      features: customersFormated as GeoJSON.Feature[],
    };

    map.addSource("customers-heatmap-source", {
      type: "geojson",
      data: sourceData,
    });

    map.addLayer({
      id: "customers-heatmap",
      type: "heatmap",
      source: "customers-heatmap-source",
      maxzoom: 22,
      paint: {
        "heatmap-weight": {
          property: "intensity",
          type: "exponential",
          stops: [
            [0, 0],
            [10, 1],
          ],
        },
        "heatmap-intensity": 1.5,
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0,
          "rgba(33,102,172,0)",
          0.2,
          "rgba(0, 255, 255, 1)",
          0.4,
          "rgba(0, 63, 255, 1)",
          0.6,
          "rgba(0, 0, 191, 1)",
          0.8,
          "rgba(63, 0, 91, 1)",
          1,
          "rgba(127, 0, 63, 1)",
        ],
        "heatmap-opacity": 1,
        "heatmap-radius": 20,
      },
    }, "waterway-label");
  };


  const handleShowCustomersPoints = async () => {
    // Remove camadas de viagens antes de adicionar clientes
    removeAllLayers();
    setLoadingTrips(false);
    setShowTripsDropdown(false);

    setLoadingCustomers(true);
    setShowClientsDropdown(false);
    setCurrentActiveFunction(() => handleShowCustomersPoints);
    try {
      const customers = await getFilteredCustomers();
      if (mapRef.current?.getMap()) {
        addCustomersPoints(customers);
      }
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleShowCustomersHeatmap = async () => {
    // Remove camadas de viagens antes de adicionar clientes
    removeAllLayers();
    setLoadingTrips(false);
    setShowTripsDropdown(false);

    setLoadingCustomers(true);
    setShowClientsDropdown(false);
    setCurrentActiveFunction(() => handleShowCustomersHeatmap);
    try {
      const customers = await getFilteredCustomers();
      if (mapRef.current?.getMap()) {
        addCustomersHeatmap(customers);
      }
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleShowAllCustomersPoints = async () => {
    // Remove camadas de viagens antes de adicionar clientes
    removeAllLayers();
    setLoadingTrips(false);
    setShowTripsDropdown(false);
    
    setLoadingCustomers(true);
    setShowClientsDropdown(false);
    setCurrentActiveFunction(() => handleShowAllCustomersPoints);
    try {
      const customers = await getAllCustomers();
      if (mapRef.current?.getMap()) {
        addCustomersPoints(customers);
      }
    } finally {
      setLoadingCustomers(false);
    }
  };


  const handleShowAllCustomersHeatmap = async () => {
    // Remove camadas de viagens antes de adicionar clientes
    removeAllLayers();
    setLoadingTrips(false);
    setShowTripsDropdown(false);

    setLoadingCustomers(true);
    setShowClientsDropdown(false);
    setCurrentActiveFunction(() => handleShowAllCustomersHeatmap);
    try {
      const customers = await getAllCustomers();
      if (mapRef.current?.getMap()) {
        addCustomersHeatmap(customers);
      }
    } finally {
      setLoadingCustomers(false);
    }
  };

  // Função genérica para atualizar heatmap no mapa
  const updateHeatMapLayers = (
    datas: LocationsProps[],
    mode: "normal" | "exotic" | "origin",
  ) => {
    if (!mapRef.current?.getMap()) return;
    const map = mapRef.current.getMap();

    if (!map.loaded()) {
      map.once("load", () => {
        removeAllLayers();
        addHeatMapToMap(datas, mode, map);
      });
      return;
    }

    removeAllLayers();
    addHeatMapToMap(datas, mode, map);
  };

  const addHeatMapToMap = (
    datas: LocationsProps[],
    mode: 'normal' | 'exotic' | 'origin',
    map: any,
  ) => {
    const locationsFormated = datas
      .map(value => {
        let latitude: number | null = null;
        let longitude: number | null = null;

        switch (mode) {
          case 'origin':
            latitude = Number(value.originLatitude);
            longitude = Number(value.originLongitude);
            break;

          case 'normal':
            latitude = Number(value.last_lat ?? value.originLatitude);
            longitude = Number(value.last_lon ?? value.originLongitude);
            break;

          case 'exotic':
            latitude = Number(value.latitude ?? value.originLatitude);
            longitude = Number(value.longitude ?? value.originLongitude);
            break;
        }

        if (
          latitude === null ||
          longitude === null ||
          Number.isNaN(latitude) ||
          Number.isNaN(longitude)
        ) {
          return null;
        }

        return {
          type: 'Feature' as const,
          properties: {
            intensity: 20,
          },
          geometry: {
            type: 'Point' as const,
            coordinates: [longitude, latitude] as [number, number],
          },
        };
      })
      .filter(Boolean);

    const sourceData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: locationsFormated as GeoJSON.Feature[],
    };

    if (map.getSource('heat-map')) {
      map.removeLayer('heat-map');
      map.removeSource('heat-map');
    }

    map.addSource('heat-map', {
      type: 'geojson',
      data: sourceData,
    });

    map.addLayer(
      {
        id: 'heat-map',
        type: 'heatmap',
        source: 'heat-map',
        maxzoom: 22,
        paint: {
          'heatmap-weight': {
            property: 'intensity',
            type: 'exponential',
            stops: [
              [0, 0],
              [10, 1],
            ],
          },
          'heatmap-intensity': 1.5,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(33,102,172,0)',
            0.2,
            'rgba(0, 255, 255, 1)',
            0.4,
            'rgba(0, 63, 255, 1)',
            0.6,
            'rgba(0, 0, 191, 1)',
            0.8,
            'rgba(63, 0, 91, 1)',
            1,
            'rgba(127, 0, 63, 1)',
          ],
          'heatmap-opacity': 1,
          'heatmap-radius': 20,
        },
      },
      'waterway-label',
    );
  };


  // Handlers para as opções de viagens
  const handleGetLocations = async () => {
    removeAllLayers();
    setLoadingTrips(false);
    setShowTripsDropdown(false);

    setLoadingCustomers(true);
    setShowClientsDropdown(false);
    setCurrentActiveFunction(() => handleGetLocations);
    const responseLocations = await getCustomerArea()
    if (responseLocations && responseLocations.length > 0) {
      updateHeatMapLayers(responseLocations, "normal");
    }
    setLoadingCustomers(false);


  };

  const handleGetLastDynamicsPlaces = async () => {
    // Remove camadas de clientes antes de adicionar viagens
    removeAllLayers();
    setLoadingCustomers(false);
    setShowClientsDropdown(false);

    setLoadingTrips(true);
    setShowTripsDropdown(false);
    setCurrentActiveFunction(() => handleGetLastDynamicsPlaces);
    try {
      const responseLastDynamicsPlaces = await getLastDynamicsPlaces();

      if (responseLastDynamicsPlaces && responseLastDynamicsPlaces.length > 0) {
        updateHeatMapLayers(responseLastDynamicsPlaces, "exotic");
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar os dados do mapa",
        icon: "error",
      });
    } finally {
      setLoadingTrips(false);
    }
  };

  const handleGetExpensiveDynamicsPlaces = async () => {
    // Remove camadas de clientes antes de adicionar viagens
    removeAllLayers();
    setLoadingCustomers(false);
    setShowClientsDropdown(false);

    setLoadingTrips(true);
    setShowTripsDropdown(false);
    setCurrentActiveFunction(() => handleGetExpensiveDynamicsPlaces);
    try {
      const responseExpensiveDynamicsPlaces = await getExpensiveDynamicsPlaces();

      if (responseExpensiveDynamicsPlaces && responseExpensiveDynamicsPlaces.length > 0) {
        updateHeatMapLayers(
          responseExpensiveDynamicsPlaces,
          "exotic"
        );
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar os dados do mapa",
        icon: "error",
      });
    } finally {
      setLoadingTrips(false);
    }
  };

  const handleGetPlacesMoreTripsDaysAgo = async () => {
    // Remove camadas de clientes antes de adicionar viagens
    removeAllLayers();
    setLoadingCustomers(false);
    setShowClientsDropdown(false);

    setLoadingTrips(true);
    setShowTripsDropdown(false);
    setCurrentActiveFunction(() => handleGetPlacesMoreTripsDaysAgo);
    try {
      const responsePlacesMoreTripsDaysAgo = await api.get(
        "dashboard/placesMoreTripsDayAgo?limit=30"
      );

      if (responsePlacesMoreTripsDaysAgo.status) {
        updateHeatMapLayers(
          responsePlacesMoreTripsDaysAgo.data.response,
          "exotic"
        );
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar os dados do mapa",
        icon: "error",
      });
    } finally {
      setLoadingTrips(false);
    }
  };

  const handleGetNotAnsweredToday = async () => {
    // Remove camadas de clientes antes de adicionar viagens
    removeAllLayers();
    setLoadingCustomers(false);
    setShowClientsDropdown(false);

    setLoadingTrips(true);
    setShowTripsDropdown(false);
    setCurrentActiveFunction(() => handleGetNotAnsweredToday);

    try {
      const responseNotAnswered = await getNotAnsweredToday()

      if (responseNotAnswered && responseNotAnswered.length > 0) {
        updateHeatMapLayers(
          responseNotAnswered,
          "origin"
        );
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar os dados do mapa",
        icon: "error",
      });
    } finally {
      setLoadingTrips(false);
    }
  };

  const handleGetNotAnsweredYesterday = async () => {
    // Remove camadas de clientes antes de adicionar viagens
    removeAllLayers();
    setLoadingCustomers(false);
    setShowClientsDropdown(false);

    setLoadingTrips(true);
    setShowTripsDropdown(false);
    setCurrentActiveFunction(() => handleGetNotAnsweredYesterday);
    try {
      const responseNotAnswered = await getNotAnsweredYesterday();
      if (responseNotAnswered && responseNotAnswered.length > 0) {
        updateHeatMapLayers(
          responseNotAnswered,
          "origin"
        );
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar os dados do mapa",
        icon: "error",
      });
    } finally {
      setLoadingTrips(false);
    }
  };

  const handleGetNotAnsweredLastWeek = async () => {
    removeAllLayers();
    setLoadingCustomers(false);
    setShowClientsDropdown(false);

    setLoadingTrips(true);
    setShowTripsDropdown(false);
    setCurrentActiveFunction(() => handleGetNotAnsweredLastWeek);

    try {
      const responseNotAnswered = await getNotAnsweredLastWeek()


      if (responseNotAnswered && responseNotAnswered.length > 0) {
        updateHeatMapLayers(
          responseNotAnswered,
          'origin'
        );
      }
    } catch (error) {
      console.error(error);
      swal({
        title: 'Erro ao pegar os dados do mapa',
        icon: 'error',
      });
    } finally {
      setLoadingTrips(false);
    }
  };


  const handleGetPlacesMoreTripsWeekAgo = async () => {
    // Remove camadas de clientes antes de adicionar viagens
    removeAllLayers();
    setLoadingCustomers(false);
    setShowClientsDropdown(false);

    setLoadingTrips(true);
    setShowTripsDropdown(false);
    setCurrentActiveFunction(() => handleGetPlacesMoreTripsWeekAgo);
    try {
      const responseMoreTripsWeekAgo = await getPlacesMoreTripWeekAgo();

      if (responseMoreTripsWeekAgo && responseMoreTripsWeekAgo.length > 0) {
        updateHeatMapLayers(responseMoreTripsWeekAgo, "exotic");
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar os dados do mapa",
        icon: "error",
      });
    } finally {
      setLoadingTrips(false);
    }
  };

  // Handler para atualizar a função atual
  const handleRefresh = async () => {
    if (currentActiveFunction) {
      setLoadingRefresh(true);
      try {
        await currentActiveFunction();
      } finally {
        setLoadingRefresh(false);
      }
    }
  };

  // Handler para cancelar e limpar tudo
  const handleCancel = () => {
    removeAllLayers();
    setCurrentActiveFunction(null);
    setLoadingCustomers(false);
    setLoadingTrips(false);
    setLoadingRefresh(false);
  };

  useEffect(() => {
    setMenuDesktopMap(active);
  }, [active]);
  useMapResizeOnLayoutChange({
    mapRef,
    trigger: `${menuDesktopMap}-${props.mobileLayoutKey ?? ''}`,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClearDriver();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!props.driversRef && props.drivers) {
      driversRef.current = props.drivers;
    }
  }, [props.drivers, props.driversRef]);

  useEffect(() => {
    selectedDriverRef.current = selectedDriver;
  }, [selectedDriver]);

  useEffect(() => {
    if (!selectedDriver) {
      return;
    }

    const selectedDriverId = selectedDriver.idDriver;
    if (!selectedDriverId) {
      return;
    }

    const interval = setInterval(() => {
      const activeSelection = selectedDriverRef.current;
      if (!activeSelection || Number(activeSelection.idDriver) !== Number(selectedDriverId)) {
        return;
      }
      const currentDrivers = effectiveDriversRef.current || [];

      const updatedDriver = currentDrivers.find(
        (d: DriverRealtime) => Number(d.idDriver) === Number(selectedDriverId)
      );

      if (!updatedDriver) {
        return;
      }

      const lat = Number(updatedDriver.latitude);
      const lng = Number(updatedDriver.longitude);

      if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
        return;
      }

      const currentLocation = `${lat},${lng}`;
      const previousLocation = `${Number(activeSelection.latitude)},${Number(activeSelection.longitude)}`;

      if (currentLocation !== previousLocation) {
        setSelectedDriver(updatedDriver);
        selectedDriverRef.current = updatedDriver;

        const driverTrip = props.trips?.find((trip: TripDto) => {
          const tripDriverId = trip.driver?.idDriver || trip.driverId;
          return Number(tripDriverId) === Number(selectedDriverId);
        });

        if (driverTrip) {
          calculateAndRenderRoute(updatedDriver, driverTrip);
        } else {
          setRouteGeojson(null);
        }
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedDriver, props.trips, calculateAndRenderRoute, effectiveDriversRef]);

  useEffect(() => {
    if (!selectedDriver) {
      return;
    }

    const selectedDriverId = selectedDriver.idDriver;
    if (!selectedDriverId) {
      return;
    }

    const driverTrip = props.trips?.find((trip: TripDto) => {
      const tripDriverId = trip.driver?.idDriver || trip.driverId;
      return Number(tripDriverId) === Number(selectedDriverId);
    });

    if (!driverTrip || driverTrip.status === STATUS_FINISHED || driverTrip.status === STATUS_CANCELED) {
      setRouteGeojson(null);
      return;
    }

    const lat = Number(selectedDriver.latitude);
    const lng = Number(selectedDriver.longitude);

    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      calculateAndRenderRoute(selectedDriver, driverTrip).catch((error) => {
        console.error('Erro ao recalcular rota:', error);
      });
    }
  }, [selectedDriver?.idDriver, props.trips, selectedDriver?.latitude, selectedDriver?.longitude, calculateAndRenderRoute]);




  function calculateCentroid(points: any) {
    let signedArea = 0;
    let xSum = 0;
    let ySum = 0;

    const n = points.length;

    for (let i = 0; i < n; i++) {
      const x0 = points[i].x;
      const y0 = points[i].y;
      const x1 = points[(i + 1) % n].x;
      const y1 = points[(i + 1) % n].y;

      const a = x0 * y1 - x1 * y0;
      signedArea += a;
      xSum += (x0 + x1) * a;
      ySum += (y0 + y1) * a;
    }

    signedArea *= 0.5;
    const centroidX = xSum / (6 * signedArea);
    const centroidY = ySum / (6 * signedArea);

    return {
      x: centroidX,
      y: centroidY,
    };
  }
  function parsePolygonString(polygonString: string) {
    const coordinates = polygonString
      .replace("POLYGON((", "")
      .replace("))", "")
      .split(",")
      .map((point) => {
        const [x, y] = point.trim().split(" ").map(Number);
        return { x, y };
      });

    return coordinates;
  }
  function parsePolygonStringToArray(polygonString: string | undefined | null) {
    if (!polygonString || typeof polygonString !== 'string') {
      return [];
    }
    
    const coordinates = polygonString
      .replace("POLYGON((", "")
      .replace("))", "")
      .split(",")
      .map((point) => {
        const [x, y] = point.trim().split(" ").map(Number);
        return [x, y];
      });

    return coordinates;
  }

  const history = useHistory();

  const polygon = citySelected?.polygon;

  // Valores padrão para Fortaleza caso polygon não exista
  let cityCoordinatesLatitude = -3.7327;
  let lcityCoordinatesLongitude = -38.5270;

  if (polygon) {
    const points = parsePolygonString(polygon);
    const centroid = calculateCentroid(points);
    cityCoordinatesLatitude = centroid.y;
    lcityCoordinatesLongitude = centroid.x;
  } else {
    console.warn('⚠️ Polygon não encontrado para a cidade selecionada, usando coordenadas padrão de Fortaleza');
  }

  return (
    <MapRoot>
      <ContainerOptionsMap active={menuDesktopMap}>
        <div>
          <ContainerMenuDesktopMap active={menuDesktopMap}>
            <Tooltip title="Mostrar listagem de viagens" placement="right">
              <ButtonMenuDesktopMap
                type="default"
                htmlType="button"
                icon={<IconMenuTrips />}
                size="large"
                onClick={changeMap}
              />
            </Tooltip>
            {modalType && (
              <ListModal
                type={modalType}
                isVisible={true}
                setIsVisible={(visible) => {
                  if (!visible) {
                    setModalType(null);
                  }
                }}
                selectedArea={selectedArea}
                onDriverSelect={handleDriverFocus}
                onClientSelect={handleClientSelect}
                driverRecencyMode={props.driverRecencyMode}
              />
            )}
            <MonitoringAreaModal
              showMonitoringArea={showMonitoringAreaModal}
              setShowMonitoringArea={setShowMonitoringAreaModal}
              onAreaSelect={handleAreaSelect}
            />
            <Tooltip title="Voltar para o dashboard" placement="right">
              <ButtonMenuDesktopMap
                style={{ marginTop: 10 }}
                type="default"
                htmlType="button"
                icon={<IconArrowLeft />}
                onClick={() => history.push("/")}
                size="large"
              />
            </Tooltip>
          </ContainerMenuDesktopMap>
          <MobileFabToggle
            type="button"
            aria-label={mobileButtonsExpanded ? "Fechar opções do mapa" : "Abrir opções do mapa"}
            onClick={() => setMobileButtonsExpanded((prev) => !prev)}
          >
            {mobileButtonsExpanded ? <CloseOutlined /> : <MenuOutlined />}
          </MobileFabToggle>
          <ContainerButtons $expanded={mobileButtonsExpanded}>
            <Tooltip title="Lista de motoristas" placement="right">
              <ButtonMap
                type="default"
                htmlType="button"
                icon={<FaCar style={{ marginTop: 5 }} />}
                onClick={() => setModalType('driver')}
              />
            </Tooltip>
            <Tooltip title="Lista de clientes" placement="right">
              <ButtonMap
                type="default"
                htmlType="button"
                icon={<AiOutlineUser style={{ marginTop: 5 }} />}
                onClick={() => setModalType('client')}
              />
            </Tooltip>
            <Tooltip title="Acompanhar motorista" placement="right">
              <ButtonMap
                type="default"
                htmlType="button"
                icon={<BiShareAlt style={{ marginTop: 5 }} />}
              />
            </Tooltip>

            <Tooltip title="Área de monitoramento" placement="right">
              <ButtonMap
                type="default"
                htmlType="button"
                icon={<AiOutlineTable style={{ marginTop: 5 }} />}
                onClick={() => setShowMonitoringAreaModal(true)}
              />
            </Tooltip>

            <ClientsButtonContainer ref={dropdownRef}>
              <Tooltip title="Clientes" placement="right">
                <ButtonMap
                  type="default"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  icon={
                    loadingCustomers ? (
                      <Spin size="small" />
                    ) : (
                      <img src={personIcon} alt="Clientes" style={{ width: 20, height: 20 }} />
                    )
                  }
                  onClick={() => setShowClientsDropdown(!showClientsDropdown)}
                  loading={loadingCustomers}
                />
              </Tooltip>
              {showClientsDropdown && (
                <DropdownMenu>
                  <DropdownMenuItem
                    onClick={handleGetLocations}
                    style={{ opacity: loadingCustomers ? 0.6 : 1 }}
                  >
                    {loadingCustomers ? "Carregando..." : "Áreas de clientes"}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleShowCustomersPoints}
                    style={{ opacity: loadingCustomers ? 0.6 : 1 }}
                  >
                    {loadingCustomers ? "Carregando..." : "Usuários ativos recentemente"}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleShowCustomersHeatmap}
                    style={{ opacity: loadingCustomers ? 0.6 : 1 }}
                  >
                    {loadingCustomers ? "Carregando..." : "Usuários ativos recentemente mancha"}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleShowAllCustomersPoints}
                    style={{ opacity: loadingCustomers ? 0.6 : 1 }}
                  >
                    {loadingCustomers ? "Carregando..." : "Todos os usuários"}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleShowAllCustomersHeatmap}
                    style={{ opacity: loadingCustomers ? 0.6 : 1 }}
                  >
                    {loadingCustomers ? "Carregando..." : "Todos os usuários mancha"}
                  </DropdownMenuItem>
                </DropdownMenu>
              )}
            </ClientsButtonContainer>

            <ClientsButtonContainer ref={tripsDropdownRef}>
              <Tooltip title="Viagens" placement="right">
                <ButtonMap
                  type="default"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  icon={loadingTrips ? <Spin size="small" /> : <BiTrip />}
                  onClick={() => setShowTripsDropdown(!showTripsDropdown)}
                  loading={loadingTrips}
                />
              </Tooltip>
              {showTripsDropdown && (
                <DropdownMenu>
                  <DropdownMenuItem
                    onClick={handleGetLastDynamicsPlaces}
                    style={{ opacity: loadingTrips ? 0.6 : 1 }}
                  >
                    {loadingTrips ? "Carregando..." : "Últimas dinâmicas do dia"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleGetExpensiveDynamicsPlaces}
                    style={{ opacity: loadingTrips ? 0.6 : 1 }}
                  >
                    {loadingTrips ? "Carregando..." : "Dinâmicas mais caras do dia"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleGetPlacesMoreTripsDaysAgo}
                    style={{ opacity: loadingTrips ? 0.6 : 1 }}
                  >
                    {loadingTrips ? "Carregando..." : "Lugares com mais viagens no dia anterior"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleGetPlacesMoreTripsWeekAgo}
                    style={{ opacity: loadingTrips ? 0.6 : 1 }}
                  >
                    {loadingTrips ? "Carregando..." : "Lugares com mais viagens há uma semana"}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleGetNotAnsweredToday}
                    style={{ opacity: loadingTrips ? 0.6 : 1 }}
                  >
                    {loadingTrips ? "Carregando..." : "Viagens não atendidas hoje"}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleGetNotAnsweredYesterday}
                    style={{ opacity: loadingTrips ? 0.6 : 1 }}
                  >
                    {loadingTrips ? "Carregando..." : "Viagens não atendidas no dia anterior"}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleGetNotAnsweredLastWeek}
                    style={{ opacity: loadingTrips ? 0.6 : 1 }}
                  >
                    {loadingTrips ? "Carregando..." : "Viagens não atendidas na semana anterior"}
                  </DropdownMenuItem>

                </DropdownMenu>
              )}
            </ClientsButtonContainer>
          </ContainerButtons>
        </div>
        <NotificationButtonContainer>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            {selectedDriver && (
              <Button
                type="primary"
                onClick={handleClearDriver}
                size="small"
                style={{ marginBottom: 3 }}
              >
                Limpar seleção de motorista
              </Button>
            )}
            <DesktopOnlyNotification>
              <SelectAndButtonNotification
                selectedArea={selectedArea}
                onClearArea={handleClearArea}
              />
            </DesktopOnlyNotification>
          </div>
          {currentActiveFunction && (
            <>
              <Tooltip title="Atualizar" placement="right">
                <ButtonMap
                  type="default"
                  style={{
                    position: 'absolute',
                    right: 22,
                    top: 36,
                    marginTop: '10px'
                  }}
                  icon={<AiOutlineReload />}
                  onClick={handleRefresh}
                  loading={loadingRefresh}
                />
              </Tooltip>
              <Tooltip title="Cancelar" placement="right">
                <ButtonMap
                  type="default"
                  style={{
                    position: 'absolute',
                    right: 22,
                    top: 76,
                    marginTop: '10px'
                  }}
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                />
              </Tooltip>
            </>
          )}
        </NotificationButtonContainer>
      </ContainerOptionsMap>
      {loadingRoute && (
        <RouteLoader>
          <RouteLoaderContent>
            <Spin size="small" />
            <span>Carregando rota...</span>
          </RouteLoaderContent>
        </RouteLoader>
      )}
      <MapboxMap
        ref={(ref: MapRef) => {
          mapRef.current = ref;
        }}
        mapboxAccessToken="pk.eyJ1IjoidGVzdGViYXlhbm1lZCIsImEiOiJjazd1d2U4OTMxNW9hM2lvNGI3cGFyaGVnIn0.Q4bC04l_8IU6HqONKXbcDA"
        initialViewState={{
          longitude: cityCoordinatesLatitude,
          latitude: lcityCoordinatesLongitude,
          zoom: 12,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onLoad={() => {
          props?.onMapLoaded?.();
        }}
        style={MapViewport}
      >
        <CityDelimiter
          coordinates={polygon ? parsePolygonStringToArray(polygon) : []}
        />
        {selectedArea && selectedArea.area && (
          <MonitoringAreaHighlight area={selectedArea.area} />
        )}
        <DriversMarkers
          driversRef={effectiveDriversRef}
          selectedArea={selectedArea}
          selectedDriver={selectedDriver}
          driversUpdateKey={props.driversUpdateKey}
          tripStatusByDriverId={tripStatusByDriverId}
          tripsLoading={props.tripsLoading}
          onDriverClick={handleDriverFocus}
        />
        {(() => {
          if (!props.trips || props.trips.length === 0) {
            return null;
          }

          let tripsToShow = props.trips;
          if (selectedDriver) {
            const selectedDriverId = selectedDriver.idDriver;
            tripsToShow = props.trips.filter((trip: TripDto) => {
              const tripDriverId = trip.driver?.idDriver || trip.driverId;
              return Number(tripDriverId) === Number(selectedDriverId);
            });
          }

          return tripsToShow.map((trip: TripDto) => {
            const tripKey = `${trip.tripReference}-${trip.status}`;

            return (
              <TripMark
                originLatitude={trip.originLatitude}
                originLongitude={trip.originLongitude}
                destinationLatitude={trip.destinationLatitude}
                destinationLongitude={trip.destinationLongitude}
                tripReference={trip.tripReference}
                key={tripKey}
                tripStatus={trip.status}
                customerPhoto={trip.customerPhoto}
                driverPhoto={trip.driverPhone}
                destination={trip.destination}
                origin={trip.origin}
                driverId={trip.driver?.idDriver || trip.driverId || 0}
                drivers={props.drivers}
                driversCalled={trip.driversCalled}
                driverCalleds={trip.driverCalleds}
              />
            );
          });
        })()}

        {routeGeojson && (
          <Source id="route-source" type="geojson" data={routeGeojson}>
            <Layer
              id="route-layer"
              type="line"
              paint={{
                'line-color': '#000000',
                'line-width': 10,
                'line-opacity': 0.8
              }}
              layout={{
                'line-join': 'round',
                'line-cap': 'round'
              }}
            />
          </Source>
        )}
      </MapboxMap>
    </MapRoot>
  );
};

export default MapMonitoring;
