import { Container, ContentSelected } from "./styles";

import { Select } from "antd";
import mapboxgl from "mapbox-gl";
import swal from "sweetalert";

import { useEffect, useRef, useState } from "react";

import Preload from "../../../../components/Utils/Preload";

import Session from "../../../../utils/Session";
import Utils from "../../../../utils/Utils";

import api from "../../../../services/api";
import {TripService} from "../../../../services/TripService";
import { useMapbox } from "../../../../contexts/mapbox";
import { useHeatMap } from "../../../../hooks/useHeatMap";

import { LocationsProps } from "./types";

export const HeatMap = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<any | null>(null);
  const {getAllCustomers, getFilteredCustomers } = useHeatMap();

  const citySelected = Session.getLocal("citySelected");

  const [loading, setLoading] = useState<boolean>(false);
  const [valueSelect, setValueSelect] = useState<string>("customer");
  const {getUnattendedTrips} = TripService

  const { mapboxToken } = useMapbox();

  const updateHeatMapLayers = (
    datas: LocationsProps[],
    mode: "normal" | "exotic"
  ) => {
    if (map.current) {
      const safeDatas = Array.isArray(datas) ? datas : [];
      const locationsFormated = safeDatas.map((value) => {
        return {
          type: "Feature",
          properties: {
            intensity: 20,
          },
          geometry: {
            type: "Point",
            coordinates: [
              mode === "normal"
                ? Number(value.last_lon)
                : Number(value.longitude),
              mode === "normal"
                ? Number(value.last_lat)
                : Number(value.latitude),
            ],
          },
        };
      });

      const sourceData = {
        type: "FeatureCollection",
        crs: {
          type: "name",
          properties: { name: "heatmap" },
        },
        features: locationsFormated,
      };

      if (map.current.getSource("heat-map") !== undefined) {
        map.current.getSource("heat-map").setData(sourceData);
      }
    }
  };

  const handleGetLocations = async () => {
    setLoading(true);
    try {
      const responseLocations = await api.get(
        `customer/${citySelected.cityId}/locations`
      );

      if (responseLocations.status) {
        updateHeatMapLayers(responseLocations.data.response, "normal");
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar os dados do mapa",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetLastDynamicsPlaces = async () => {
    setLoading(true);
    try {
      const responseLastDynamicsPlaces = await api.get(
        `dashboard/lastDynamicsPlaces?limit=30&cityId=${citySelected.cityId}`
      );

      if (responseLastDynamicsPlaces.status) {
        updateHeatMapLayers(responseLastDynamicsPlaces.data.response, "exotic");
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar os dados do mapa",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetExpensiveDynamicsPlaces = async () => {
    setLoading(true);
    try {
      const responseExpensiveDynamicsPlaces = await api.get(
        `dashboard/expensiveDynamicsPlaces?limit=30&cityId=${citySelected.cityId}`
      );

      if (responseExpensiveDynamicsPlaces.status) {
        updateHeatMapLayers(
          responseExpensiveDynamicsPlaces.data.response,
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
      setLoading(false);
    }
  };

  const handleGetPlacesMoreTripsDaysAgo = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleGetPlacesMoreTripsWeekAgo = async () => {
    setLoading(true);
    try {
      const responseMoreTripsWeekAgo = await api.get(
        "dashboard/placesMoreTripsWeekAgo?limit=30"
      );

      if (responseMoreTripsWeekAgo.status) {
        updateHeatMapLayers(responseMoreTripsWeekAgo.data.response, "exotic");
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar os dados do mapa",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetUnattendedTrips = async (dateStart?: string, dateEnd?: string) => {
    setLoading(true);
    try {
      const trips = await getUnattendedTrips(dateStart, dateEnd);
      
      const locationsFormatted: LocationsProps[] = trips
        .filter((trip: any) => {
          const lat = trip.originLatitude || trip.origin?.latitude;
          const lng = trip.originLongitude || trip.origin?.longitude;
          return lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng));
        })
        .map((trip: any) => {
          const lat = trip.originLatitude || trip.origin?.latitude;
          const lng = trip.originLongitude || trip.origin?.longitude;
          return {
            latitude: String(lat),
            longitude: String(lng),
          } as LocationsProps;
        });

      if (locationsFormatted.length > 0) {
        updateHeatMapLayers(locationsFormatted, "exotic");
      } else {
        updateHeatMapLayers([], "exotic");
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar os dados do mapa",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetUnattendedTripsYesterday = async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateString = yesterday.toISOString().split('T')[0];
    await handleGetUnattendedTrips(dateString, dateString);
  };

  const handleGetUnattendedTripsLastWeek = async () => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    
    const dateStart = lastWeek.toISOString().split('T')[0];
    const dateEnd = today.toISOString().split('T')[0];
    
    await handleGetUnattendedTrips(dateStart, dateEnd);
  };

  const handleGetAllActiveUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllCustomers();
      if (response.length > 0) {
        const locationsFormatted: LocationsProps[] = response.map((item: any) => ({
          latitude: item.latitude !== undefined ? String(item.latitude) : undefined,
          longitude: item.longitude !== undefined ? String(item.longitude) : undefined,
        }));
        updateHeatMapLayers(locationsFormatted, "exotic");
      }  else {
        updateHeatMapLayers([], "exotic");
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar os dados do mapa",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecentlyActiveUsers = async () => {
    setLoading(true);
    try {
      const response = await getFilteredCustomers();
      if (response.length > 0) {
        const locationsFormatted: LocationsProps[] = response.map((item: any) => ({
          latitude: item.latitude !== undefined ? String(item.latitude) : undefined,
          longitude: item.longitude !== undefined ? String(item.longitude) : undefined,
        }));
        updateHeatMapLayers(locationsFormatted, "exotic");
      } else {
        updateHeatMapLayers([], "exotic");
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar os dados do mapa",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) {
      return;
    }

    const city = Session.getLocal("citySelected");
    let lng = -46.6333;
    let lat = -23.5505;

    if (city?.polygon) {
      try {
        const center = Utils.CenterCoordinates(
          Utils.TransformCoordinates(city.polygon)
        );
        if (center && center.length >= 2) {
          lat = center[0];
          lng = center[1];
        }
      } catch (e) {
        console.warn("Erro ao calcular centro no HeatMap:", e);
      }
    }

    mapboxgl.accessToken = mapboxToken;

    const pointsCity = Session.getLocal("pointsCity");
    const coordinatesLine = [
      (Array.isArray(pointsCity) ? pointsCity : []).map((value: any) => {
        return [value?.lng, value?.lat];
      }),
    ];

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: 9,
    });

    map?.current.on("load", () => {
      map?.current.addLayer({
        id: "outline",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: coordinatesLine,
            },
          },
        },
        layout: {},
        paint: {
          "line-color": "#000",
          "line-width": 2,
          "line-offset": 0,
        },
      });

      const defaultValue = {
        type: "FeatureCollection",
        crs: {
          type: "name",
          properties: { name: "heatmap" },
        },
        features: [],
      };

      map?.current.addSource("heat-map", {
        type: "geojson",
        data: defaultValue,
      });

      map?.current.addLayer(
        {
          id: "heat-map",
          type: "heatmap",
          source: "heat-map",
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
        },
        "waterway-label"
      );
    });
  }, [mapboxToken]);

  useEffect(() => {
    switch (valueSelect) {
      case "customer":
        handleGetLocations();
        break;
      case "lastDynamicsPlaces":
        handleGetLastDynamicsPlaces();
        break;
      case "expensiveDynamicsPlaces":
        handleGetExpensiveDynamicsPlaces();
        break;
      case "placesMoreTripsDayAgo":
        handleGetPlacesMoreTripsDaysAgo();
        break;
      case "placesMoreTripsWeekAgo":
        handleGetPlacesMoreTripsWeekAgo();
        break;
      case "unattendedTrips":
        handleGetUnattendedTrips();
        break;
      case "unattendedTripsYesterday":
        handleGetUnattendedTripsYesterday();
        break;
      case "unattendedTripsLastWeek":
        handleGetUnattendedTripsLastWeek();
        break;
         case "recentlyActiveUsers":
        handleGetRecentlyActiveUsers();
        break;
          case "allActiveUsers":
          handleGetAllActiveUsers();
          break;
      default:
        handleGetLocations();
        break;
    }
  }, [valueSelect]);

  return (
    <Container>
      <Preload visible={loading} />
      <ContentSelected>
        <Select
          style={{
            width: "100%",
          }}
          value={valueSelect}
          onChange={(value) => setValueSelect(value)}
        >
          <Select.Option value="customer">Áreas de cliente</Select.Option>
          <Select.Option value="lastDynamicsPlaces">
            Últimas dinâmicas do dia
          </Select.Option>
          <Select.Option value="expensiveDynamicsPlaces">
            Dinâmicas mais caras do dia
          </Select.Option>
          <Select.Option value="placesMoreTripsDayAgo">
            Lugares com mais viagens no dia anterior
          </Select.Option>
          <Select.Option value="placesMoreTripsWeekAgo">
            Lugares com mais viagens há uma semana
          </Select.Option>
          <Select.Option value="unattendedTrips">
            Viagens não atendidas hoje
          </Select.Option>
          <Select.Option value="unattendedTripsYesterday">
            Viagens não atendidas no dia anterior
          </Select.Option>
          <Select.Option value="unattendedTripsLastWeek">
            Viagens não atendidas na semana anterior
          </Select.Option>
          <Select.Option value="recentlyActiveUsers">
            Usuarios ativos recentemente
          </Select.Option>
           <Select.Option value="allActiveUsers">
            Todos os Usuarios ativos
          </Select.Option>

        </Select>
      </ContentSelected>

      <div ref={mapContainer} style={{ width: "100%", height: "600px" }} />
    </Container>
  );
};
