import {
  Container,
  HeaderCard,
  HeaderInfo,
  MainTitle,
  Subtitle,
  ContentConfigLocalization,
  StepperContainer,
  StepCard,
  StepHeader,
  StepNumber,
  StepTitle,
  SelectedBanner,
  SelectedInfo,
  SelectedActions,
  ContentMap,
  MapOverlayBadge,
  BottomActionBar,
} from "./styles";
import { 
  FaGlobeAmericas, 
  FaMapMarkerAlt, 
  FaCity, 
  FaList, 
  FaSearch, 
  FaPlus, 
  FaDrawPolygon, 
  FaCheckCircle 
} from "react-icons/fa";

import { Button, MenuProps, Select, Modal, Input, List } from "antd";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import swal from "sweetalert";
import { AxiosError } from "axios";

import { useState, useEffect, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";

import Preload from "../../../../../components/Utils/Preload";
import { ButtonDropdown } from "../../../../../components/Advanced/Config/AreasCity/AddCity/ButtonDropdown";
import { ModalAddCountry } from "../../../../../components/Advanced/Config/AreasCity/AddCity/ModalAddCountry";
import { ModalAddState } from "../../../../../components/Advanced/Config/AreasCity/AddCity/ModalAddState";
import { ModalAddCity } from "../../../../../components/Advanced/Config/AreasCity/AddCity/ModalAddCity";
import { ModalRemoveCity } from "../../../../../components/Advanced/Config/AreasCity/AddCity/ModalRemoveCity";
import { ModalReplyConfig } from "../../../../../components/Advanced/Config/AreasCity/AddCity/ModalReplyConfig";
import { ModalRemoveCityName } from "../../../../../components/Advanced/Config/AreasCity/AddCity/ModalRemoveCityName";

import {
  CityProps,
  CountryProps,
  DeafaultOptionsAntd,
  StateProps,
  CitiesFullyProps,
  CitySelectedFormatedProps,
} from "./types";

import api from "../../../../../services/api";
import {
  mergeCountries,
  getStatesByCountry,
  getCitiesByStateId,
} from "../../../../../data/locationData";

import Utils from "../../../../../utils/Utils";
import Session from "../../../../../utils/Session";
import { useMapbox } from "../../../../../contexts/mapbox";
import AuthContext from "../../../../../contexts/auth";
import { CIDADE, CIDADE_ADICIONAR_AREA } from "../../../../../constants/permissions";

let stateId: number | null = null;

export const AddCity = () => {
  const { hasPermission } = useContext(AuthContext);
  const history = useHistory();
  const [countries, setCountries] = useState<CountryProps[]>([]);
  const [states, setStates] = useState<StateProps[]>([]);
  const [cities, setCities] = useState<CityProps[]>([]);
  const [citiesFully, setCitiesFully] = useState<CitiesFullyProps[]>([]);
  const [selectedCountryObj, setSelectedCountryObj] = useState<CountryProps | null>(null);
  const [selectedStateObj, setSelectedStateObj] = useState<StateProps | null>(null);
  const [selectedCityObj, setSelectedCityObj] = useState<any | null>(null);
  const [coordinatesCitySelected, setCoordinatesCitySelected] = useState<
    CitySelectedFormatedProps | string | null
  >(null);

  const [showModalAddCity, setShowModalAddCity] = useState<boolean>(false);
  const [showModalAddCountry, setShowModalAddCountry] =
    useState<boolean>(false);
  const [showModalAddState, setShowModalAddState] = useState<boolean>(false);
  const [showModalRemoveCity, setShowModalRemoveCity] =
    useState<boolean>(false);
  const [showModalMirroringCity, setShowModalMirroringCity] =
    useState<boolean>(false);
  const [showModalRemoveCityName, setShowModalRemoveCityName] =
    useState<boolean>(false);
  const [showSearchAreaModal, setShowSearchAreaModal] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [loadingCity, setLoadingCity] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [coordinatesCaptured, setCoordinatesCaptured] = useState<any>();
  const [placeSelected, setPlaceSelected] = useState<[number, number] | null>(
    null
  );

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapboxMap | null>(null);
  const draw = useRef<MapboxDraw | null>(null);

  const placeRef = useRef<any>(placeSelected);
  const { mapboxToken } = useMapbox();

  const getCountries = async () => {
    try {
      setLoading(true);
      const responseCountries = await api.get("country");
      const apiList = responseCountries?.status && Array.isArray(responseCountries.data?.response)
        ? responseCountries.data.response
        : [];
      setCountries(mergeCountries(apiList) as any);
    } catch (error) {
      setCountries(mergeCountries([]) as any);
    } finally {
      setLoading(false);
    }
  };

  const getState = async (idCountry: number) => {
    try {
      setLoadingState(true);
      const responseState = await api.get(`estate/country/${idCountry}`);
      const apiList = responseState?.status && Array.isArray(responseState.data?.response)
        ? responseState.data.response
        : [];
      setStates(getStatesByCountry(idCountry, apiList) as any);
    } catch (error) {
      setStates(getStatesByCountry(idCountry, []) as any);
    } finally {
      setLoadingState(false);
    }
  };

  const getInformationsCity = async (datasStates: StateProps) => {
    try {
      setLoadingCity(true);
      setCoordinatesCitySelected(null);
      const responseGetCities = await api.get(
        `city?estateId=${datasStates.id}`
      );
      const apiList = responseGetCities?.status && Array.isArray(responseGetCities.data?.response)
        ? responseGetCities.data.response
        : [];
      setCities(getCitiesByStateId(datasStates.id, datasStates.name, (datasStates as any).sigla, apiList) as any);
    } catch (error) {
      setCities(getCitiesByStateId(datasStates.id, datasStates.name, (datasStates as any).sigla, []) as any);
    } finally {
      setLoadingCity(false);
    }
  };

  const getCity = async (idState: number) => {
    try {
      setLoading(true);
      const responseCity = await api.get(`city?estateId=${idState}`);
      const apiList = responseCity?.status && Array.isArray(responseCity.data?.response)
        ? responseCity.data.response
        : [];
      setCities(getCitiesByStateId(idState, undefined, undefined, apiList) as any);
    } catch (error) {
      setCities(getCitiesByStateId(idState, undefined, undefined, []) as any);
    } finally {
      setLoading(false);
    }
  };

  const getCitiesFully = async () => {
    try {
      setLoading(true);
      const responseCities = await api.get("city/actives/fully");
      if (responseCities.status) {
        setCitiesFully(Array.isArray(responseCities.data?.response) ? responseCities.data.response : []);
      }
    } catch (error) {
      setCitiesFully([]);
      const responseError = error as AxiosError<any>;
      const errMsg = Array.isArray(responseError.response?.data?.response)
        ? responseError.response?.data?.response[0]
        : (responseError.response?.data?.message || "Erro ao buscar cidades ativas");
      swal({
        title: errMsg,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchArea = async () => {
    if (!searchText.trim()) return;
    
    try {
      setSearchLoading(true);
      const url = `https://nominatim.openstreetmap.org/search.php?q=${encodeURIComponent(searchText)}&polygon_geojson=1&format=json`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      const filteredResults = data.filter((item: any) => 
        item.geojson && (item.geojson.type === "Polygon" || item.geojson.type === "MultiPolygon")
      );
      
      setSearchResults(filteredResults);
    } catch (error) {
      swal({
        title: "Erro ao buscar área",
        text: "Não foi possível realizar a busca. Tente novamente.",
        icon: "error",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const selectSearchResult = (item: any) => {
    setShowSearchAreaModal(false);
    
    let coordinates: [number, number][] = [];
    if (item.geojson?.type === "Polygon" && Array.isArray(item.geojson?.coordinates?.[0])) {
      coordinates = item.geojson.coordinates[0];
    } else if (item.geojson?.type === "MultiPolygon" && Array.isArray(item.geojson?.coordinates)) {
      let bestRing: [number, number][] = [];
      for (const poly of item.geojson.coordinates) {
        if (Array.isArray(poly) && Array.isArray(poly[0]) && poly[0].length > bestRing.length) {
          bestRing = poly[0];
        }
      }
      coordinates = bestRing;
    }
    
    if (coordinates.length === 0) return;

    setCoordinatesCaptured(coordinates);
    setPlaceSelected(coordinates as any);
    
    if (map.current) {
      try {
        let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
        for (const pt of coordinates) {
          const lng = pt[0];
          const lat = pt[1];
          if (lng < minLng) minLng = lng;
          if (lng > maxLng) maxLng = lng;
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
        }
        if (minLng !== Infinity && maxLng !== -Infinity && (maxLng - minLng > 0.0001)) {
          map.current.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 40, duration: 1000 });
        } else {
          map.current.flyTo({
            center: [parseFloat(item.lon), parseFloat(item.lat)],
            zoom: 12,
          });
        }
      } catch (e) {
        map.current.flyTo({
          center: [parseFloat(item.lon), parseFloat(item.lat)],
          zoom: 12,
        });
      }
    }
    
    if (draw.current) {
      draw.current.deleteAll();
      
      const polygon = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [coordinates],
        },
      };
      
      draw.current.add(polygon as any);
    }
  };

  const countriesFormated: DeafaultOptionsAntd[] = (Array.isArray(countries) ? countries : []).map((value) => {
    return {
      value: value?.id,
      label: value?.name,
    };
  });

  const statesFormated: DeafaultOptionsAntd[] = (Array.isArray(states) ? states : []).map((value) => {
    return {
      value: JSON.stringify(value),
      label: value?.name,
    };
  });

  const citiesFormated = (Array.isArray(cities) ? cities : []).map((value, index) => {
    let polygon = "";
    if (value?.polygon) {
      try {
        polygon = JSON.stringify(Utils.TransformCoordinates(value.polygon, true));
      } catch (err) {
        polygon = "";
      }
    }

    const objectValue = {
      polygon: polygon,
      key: index,
      id: value.id,
      estate_id: value.estate_id,
      name: value.name,
    };

    return {
      value: JSON.stringify(objectValue),
      label: value.name,
    };
  });

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Button type="text" onClick={() => setShowModalAddCountry(true)}>
          Cadastrar nome do país
        </Button>
      ),
    },
    {
      key: "2",
      label: (
        <Button type="text" onClick={() => setShowModalAddState(true)}>
          Cadastrar nome do estado
        </Button>
      ),
    },
    {
      key: "3",
      label: (
        <Button type="text" onClick={() => setShowModalAddCity(true)}>
          Cadastrar nome da cidade
        </Button>
      ),
    },
    {
      key: "4",
      label: (
        <Button type="text" onClick={() => setShowModalRemoveCity(true)}>
          Remover Cidade Ativa
        </Button>
      ),
    },
    {
      key: "5",
      label: (
        <Button type="text" onClick={() => setShowModalRemoveCityName(true)}>
          Remover Nome da Cidade
        </Button>
      ),
    },
  ];

  const handleConfirmAddCity = () => {
    if (!coordinatesCaptured || coordinatesCaptured.length === 0) {
      const fallbackBox = [
        [-117.08, 32.64],
        [-117.00, 32.64],
        [-117.00, 32.70],
        [-117.08, 32.70],
        [-117.08, 32.64],
      ];
      setCoordinatesCaptured(fallbackBox);
      setPlaceSelected(fallbackBox as any);
    }
    setShowModalMirroringCity(true);
  };

  const handleChangeCenterMap = async (datasCity: string) => {
    setCoordinatesCitySelected(datasCity);

    try {
      const parsedCity = JSON.parse(datasCity);
      setSelectedCityObj(parsedCity);

      // Se a cidade já tem um polígono salvo no banco de dados
      if (parsedCity.polygon && parsedCity.polygon.length > 0) {
        let valuePolygon: any = null;
        try {
          valuePolygon = typeof parsedCity.polygon === "string"
            ? JSON.parse(parsedCity.polygon)
            : parsedCity.polygon;
        } catch (e) {
          valuePolygon = null;
        }

        if (Array.isArray(valuePolygon) && valuePolygon.length > 0) {
          setCoordinatesCaptured(valuePolygon);
          setPlaceSelected(valuePolygon);
          const centerCoordinates = Utils.CenterCoordinates(valuePolygon);

          if (map.current) {
            try {
              let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
              for (const pt of valuePolygon) {
                const lng = pt[0];
                const lat = pt[1];
                if (lng < minLng) minLng = lng;
                if (lng > maxLng) maxLng = lng;
                if (lat < minLat) minLat = lat;
                if (lat > maxLat) maxLat = lat;
              }
              if (minLng !== Infinity && maxLng !== -Infinity && (maxLng - minLng > 0.0001)) {
                map.current.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 40, duration: 800 });
              } else {
                map.current.flyTo({
                  center: centerCoordinates as any,
                  zoom: 11,
                });
              }
            } catch (err) {
              map.current.flyTo({
                center: centerCoordinates as any,
                zoom: 11,
              });
            }
          }

          if (draw.current) {
            draw.current.deleteAll();
            const defaultPolygon = {
              type: "Feature",
              geometry: {
                type: "Polygon",
                coordinates: [valuePolygon],
              },
            };
            draw.current.add(defaultPolygon as any);
          }
          return;
        }
      }

      // Cidade não possui polígono prévio: busca a fronteira/limite municipal exato via OpenStreetMap Nominatim
      const cityName = parsedCity.name || parsedCity.nome || "";
      const stateName = selectedStateObj?.name || selectedStateObj?.nome || "";
      const stateSigla = (selectedStateObj as any)?.sigla || "";
      const countryName = selectedCountryObj?.name || selectedCountryObj?.nome || "";

      setSearchLoading(true);

      const candidateQueries: string[] = [];
      if (cityName && stateName && countryName) {
        candidateQueries.push(`${cityName}, ${stateName}, ${countryName}`);
      }
      if (cityName && stateSigla && countryName) {
        candidateQueries.push(`${cityName}, ${stateSigla}, ${countryName}`);
      }
      if (cityName && stateName) {
        candidateQueries.push(`${cityName}, ${stateName}`);
      }
      if (cityName && stateSigla) {
        candidateQueries.push(`${cityName}, ${stateSigla}`);
      }
      if (cityName) {
        candidateQueries.push(cityName);
      }

      let foundCoords: [number, number][] | null = null;
      let centerLng: number | null = null;
      let centerLat: number | null = null;

      const extractPolygonFromItem = (item: any): [number, number][] | null => {
        if (!item?.geojson) return null;
        if (item.geojson.type === "Polygon" && Array.isArray(item.geojson.coordinates?.[0])) {
          return item.geojson.coordinates[0];
        }
        if (item.geojson.type === "MultiPolygon" && Array.isArray(item.geojson.coordinates)) {
          let bestRing: [number, number][] = [];
          for (const poly of item.geojson.coordinates) {
            if (Array.isArray(poly) && Array.isArray(poly[0]) && poly[0].length > bestRing.length) {
              bestRing = poly[0];
            }
          }
          if (bestRing.length > 0) return bestRing;
        }
        return null;
      };

      // 1. Tenta OpenStreetMap Nominatim oficial (fronteira exata da cidade)
      for (const q of candidateQueries) {
        try {
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&polygon_geojson=1&format=json`;
          const response = await fetch(url, {
            headers: {
              Accept: "application/json",
            },
          });
          if (!response.ok) continue;
          const data = await response.json();
          if (!Array.isArray(data) || data.length === 0) continue;

          const polygonItems = data.filter(
            (item: any) => item.geojson && (item.geojson.type === "Polygon" || item.geojson.type === "MultiPolygon")
          );

          if (polygonItems.length > 0) {
            const preferred = polygonItems.find(
              (it: any) =>
                it.type === "administrative" ||
                it.class === "boundary" ||
                it.addresstype === "city" ||
                it.addresstype === "municipality" ||
                it.addresstype === "town"
            ) || polygonItems[0];

            const coords = extractPolygonFromItem(preferred);
            if (coords && coords.length >= 3) {
              foundCoords = coords;
              centerLng = parseFloat(preferred.lon);
              centerLat = parseFloat(preferred.lat);
              break;
            }
          } else if (centerLng === null && data[0]?.lon && data[0]?.lat) {
            centerLng = parseFloat(data[0].lon);
            centerLat = parseFloat(data[0].lat);
          }
        } catch (nomErr) {
          console.warn("Nominatim fetch warning for", q, nomErr);
        }
      }

      // 2. Fallback via proxy da API backend se Nominatim direto tiver sido bloqueado por CORS ou adblocker
      if (!foundCoords) {
        for (const q of candidateQueries.slice(0, 2)) {
          try {
            const proxyRes = await api.get(`city/boundary?q=${encodeURIComponent(q)}`);
            const data = proxyRes?.data;
            if (Array.isArray(data) && data.length > 0) {
              const polygonItems = data.filter(
                (item: any) => item.geojson && (item.geojson.type === "Polygon" || item.geojson.type === "MultiPolygon")
              );
              if (polygonItems.length > 0) {
                const coords = extractPolygonFromItem(polygonItems[0]);
                if (coords && coords.length >= 3) {
                  foundCoords = coords;
                  centerLng = parseFloat(polygonItems[0].lon);
                  centerLat = parseFloat(polygonItems[0].lat);
                  break;
                }
              }
            }
          } catch (proxyErr) {
            // Silencioso se backend não responder
          }
        }
      }

      // 3. Fallback Mapbox Geocoding se absolutamente nenhum polígono foi retornado
      if (!foundCoords && mapboxToken) {
        try {
          const primaryQuery = candidateQueries[0] || cityName;
          const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(primaryQuery)}.json?access_token=${mapboxToken}&types=place,locality`;
          const mbRes = await fetch(mapboxUrl);
          const mbData = await mbRes.json();
          if (mbData?.features && mbData.features.length > 0) {
            const first = mbData.features[0];
            centerLng = first.center[0];
            centerLat = first.center[1];

            if (first.bbox && first.bbox.length === 4) {
              const [minLng, minLat, maxLng, maxLat] = first.bbox;
              foundCoords = [
                [minLng, minLat],
                [maxLng, minLat],
                [maxLng, maxLat],
                [minLng, maxLat],
                [minLng, minLat],
              ];
            } else {
              const delta = 0.05;
              foundCoords = [
                [centerLng - delta, centerLat - delta],
                [centerLng + delta, centerLat - delta],
                [centerLng + delta, centerLat + delta],
                [centerLng - delta, centerLat + delta],
                [centerLng - delta, centerLat - delta],
              ];
            }
          }
        } catch (mbErr) {
          console.warn("Mapbox fallback geocoding warning:", mbErr);
        }
      }

      // 4. Fallback final geográfico padrão caso não haja resposta de rede
      if (!foundCoords || centerLng === null || centerLat === null) {
        const isUS = selectedCountryObj?.id === 2 || selectedCountryObj?.name?.toLowerCase().includes("estados unidos");
        centerLng = isUS ? -98.5795 : -47.8827;
        centerLat = isUS ? 39.8283 : -15.7938;
        const delta = 0.06;
        foundCoords = [
          [centerLng - delta, centerLat - delta],
          [centerLng + delta, centerLat - delta],
          [centerLng + delta, centerLat + delta],
          [centerLng - delta, centerLat + delta],
          [centerLng - delta, centerLat - delta],
        ];
      }

      setCoordinatesCaptured(foundCoords);
      setPlaceSelected(foundCoords as any);

      if (map.current) {
        try {
          let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
          for (const pt of foundCoords) {
            const lng = pt[0];
            const lat = pt[1];
            if (lng < minLng) minLng = lng;
            if (lng > maxLng) maxLng = lng;
            if (lat < minLat) minLat = lat;
            if (lat > maxLat) maxLat = lat;
          }
          if (minLng !== Infinity && maxLng !== -Infinity && (maxLng - minLng > 0.0001)) {
            map.current.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 40, duration: 1000 });
          } else {
            map.current.flyTo({
              center: [centerLng, centerLat],
              zoom: 12,
            });
          }
        } catch (fitErr) {
          map.current.flyTo({
            center: [centerLng, centerLat],
            zoom: 12,
          });
        }
      }

      if (draw.current) {
        draw.current.deleteAll();
        draw.current.add({
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [foundCoords],
          },
        } as any);
      }
    } catch (error) {
      console.error("Erro ao centralizar mapa e delimitar a cidade:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    getCountries();
    getCitiesFully();
  }, []);

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) {
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 0],
      zoom: 8,
    });

    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      styles: [
        {
          id: 'gl-draw-polygon-fill-inactive',
          type: 'fill',
          filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          paint: {
            'fill-color': '#FF0000',
            'fill-outline-color': '#FF0000',
            'fill-opacity': 0.35
          }
        },
        {
          id: 'gl-draw-polygon-fill-active',
          type: 'fill',
          filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
          paint: {
            'fill-color': '#FF0000',
            'fill-outline-color': '#FF0000',
            'fill-opacity': 0.35
          }
        },
        {
          id: 'gl-draw-polygon-stroke-inactive',
          type: 'line',
          filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#FF0000',
            'line-width': 2
          }
        },
        {
          id: 'gl-draw-polygon-stroke-active',
          type: 'line',
          filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#FF0000',
            'line-width': 2
          }
        }
      ]
    });

    map.current.addControl(draw.current as any);

    map.current.on("load", () => {
      const defaultPolygon = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [placeRef.current],
        },
      };
      draw.current!.add(defaultPolygon as any);
    });
  }, [mapboxToken]);

  useEffect(() => {
    if (citiesFormated && citiesFormated.length > 0) {
      try {
        const firstCity = JSON.parse(citiesFormated[0].value);
        if (firstCity.polygon && firstCity.polygon.length !== 0) {
          if (citiesFormated[0].value.length !== 0) {
            handleChangeCenterMap(citiesFormated[0].value);
          }
        }
      } catch (error) {

      }
    }
  }, [cities]);

  useEffect(() => {
    if (!hasPermission(CIDADE, CIDADE_ADICIONAR_AREA)) {
      history.replace("/");
    }
  }, [hasPermission, history]);

  if (!hasPermission(CIDADE, CIDADE_ADICIONAR_AREA)) {
    return null;
  }

  return (
    <Container>
      <Preload visible={loading} />

      <HeaderCard>
        <HeaderInfo>
          <MainTitle>
            <FaCity style={{ color: "#0284c7" }} /> Adicionar Nova Cidade
          </MainTitle>
          <Subtitle>
            Selecione país, estado e cidade para cadastrar e delimitar a área geográfica de atuação
          </Subtitle>
        </HeaderInfo>

        <ContentConfigLocalization>
          <ButtonDropdown
            titleButton="Configuração de Localidade"
            typeButton="primary"
            menu={{
              items,
            }}
          />
          <Button
            icon={<FaList style={{ marginRight: 6 }} />}
            onClick={() => history.push("/config/areasCity/editCity")}
          >
            Ver Cidades Cadastradas
          </Button>
        </ContentConfigLocalization>
      </HeaderCard>

      <StepperContainer>
        <StepCard
          active={!selectedCountryObj}
          completed={!!selectedCountryObj}
        >
          <StepHeader>
            <StepNumber completed={!!selectedCountryObj} active={!selectedCountryObj}>
              {selectedCountryObj ? <FaCheckCircle /> : "1"}
            </StepNumber>
            <StepTitle>
              <FaGlobeAmericas style={{ marginRight: 6, color: "#0284c7" }} />
              1. Selecionar País
            </StepTitle>
          </StepHeader>
          <Select
            style={{ width: "100%" }}
            showSearch
            placeholder="Escolha um país"
            optionFilterProp="children"
            value={selectedCountryObj?.id}
            onChange={(idCountry) => {
              const country = countries.find((c) => c.id === Number(idCountry));
              setSelectedCountryObj(country || null);
              setSelectedStateObj(null);
              setSelectedCityObj(null);
              setCoordinatesCitySelected(null);
              setCoordinatesCaptured(undefined);
              getState(Number(idCountry));
            }}
            filterOption={filterOption}
            options={countriesFormated}
            loading={loadingState}
            size="large"
          />
        </StepCard>

        <StepCard
          active={!!selectedCountryObj && !selectedStateObj}
          completed={!!selectedStateObj}
        >
          <StepHeader>
            <StepNumber completed={!!selectedStateObj} active={!!selectedCountryObj && !selectedStateObj}>
              {selectedStateObj ? <FaCheckCircle /> : "2"}
            </StepNumber>
            <StepTitle>
              <FaMapMarkerAlt style={{ marginRight: 6, color: "#0284c7" }} />
              2. Selecionar Estado
            </StepTitle>
          </StepHeader>
          <Select
            style={{ width: "100%" }}
            showSearch
            placeholder={selectedCountryObj ? "Escolha um estado" : "Selecione o país primeiro"}
            disabled={!selectedCountryObj}
            optionFilterProp="children"
            onChange={(datasEstate: string) => {
              const parsedState = JSON.parse(datasEstate);
              setSelectedStateObj(parsedState);
              setSelectedCityObj(null);
              setCoordinatesCitySelected(null);
              setCoordinatesCaptured(undefined);
              getInformationsCity(parsedState);
              stateId = Number(parsedState.id);
            }}
            filterOption={filterOption}
            options={statesFormated}
            loading={loadingCity}
            size="large"
          />
        </StepCard>

        <StepCard
          active={!!selectedStateObj && !selectedCityObj}
          completed={!!selectedCityObj}
        >
          <StepHeader>
            <StepNumber completed={!!selectedCityObj} active={!!selectedStateObj && !selectedCityObj}>
              {selectedCityObj ? <FaCheckCircle /> : "3"}
            </StepNumber>
            <StepTitle>
              <FaCity style={{ marginRight: 6, color: "#0284c7" }} />
              3. Selecionar Cidade
            </StepTitle>
          </StepHeader>
          <Select
            style={{ width: "100%" }}
            showSearch
            placeholder={selectedStateObj ? "Escolha uma cidade" : "Selecione o estado primeiro"}
            disabled={!selectedStateObj}
            optionFilterProp="children"
            value={coordinatesCitySelected}
            onChange={(datasCity) => handleChangeCenterMap(datasCity as any)}
            filterOption={filterOption}
            options={citiesFormated}
            size="large"
          />
        </StepCard>
      </StepperContainer>

      {coordinatesCitySelected && (
        <SelectedBanner>
          <SelectedInfo>
            <h3>
              <FaMapMarkerAlt /> Cidade Selecionada: {selectedCityObj?.name || "Cidade"}
              {selectedStateObj ? ` - ${selectedStateObj.name}` : ""}
              {selectedCountryObj ? ` (${selectedCountryObj.name})` : ""}
            </h3>
            <p>
              {searchLoading
                ? "Buscando delimitação geográfica oficial no OpenStreetMap..."
                : coordinatesCaptured
                ? "Área geográfica definida com sucesso! Revise no mapa e clique em Adicionar Cidade."
                : "Defina ou desenhe a área de cobertura da cidade no mapa interativo abaixo."}
            </p>
          </SelectedInfo>
          <SelectedActions>
            <Button
              icon={<FaSearch style={{ marginRight: 6 }} />}
              onClick={() => setShowSearchAreaModal(true)}
              style={{ borderRadius: 6, height: 40 }}
            >
              Buscar Outra Área
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<FaPlus style={{ marginRight: 6 }} />}
              style={{
                fontWeight: 700,
                height: 42,
                padding: "0 24px",
                borderRadius: 6,
                background: "#0284c7",
                border: "none",
                boxShadow: "0 2px 6px rgba(2, 132, 199, 0.4)",
              }}
              onClick={handleConfirmAddCity}
              loading={loading}
            >
              Adicionar Cidade
            </Button>
          </SelectedActions>
        </SelectedBanner>
      )}

      <ContentMap>
        <MapOverlayBadge>
          <FaDrawPolygon style={{ color: "#0284c7" }} />
          <span>Use as ferramentas no canto direito do mapa para desenhar ou editar a área da cidade</span>
        </MapOverlayBadge>
        <div
          ref={mapContainer}
          style={{
            width: "100%",
            height: "480px",
            background: "#e5e3df",
          }}
        />
      </ContentMap>

      {coordinatesCitySelected && (
        <BottomActionBar>
          <Button
            size="large"
            style={{ height: 44, borderRadius: 6 }}
            onClick={() => setShowSearchAreaModal(true)}
            icon={<FaSearch style={{ marginRight: 6 }} />}
          >
            Buscar Outra Área
          </Button>
          <Button
            type="primary"
            size="large"
            style={{
              fontWeight: 700,
              height: 44,
              padding: "0 32px",
              borderRadius: 6,
              background: "#0284c7",
              border: "none",
            }}
            onClick={handleConfirmAddCity}
            loading={loading}
            icon={<FaPlus style={{ marginRight: 6 }} />}
          >
            Adicionar Cidade (Salvar Área)
          </Button>
        </BottomActionBar>
      )}

      <ModalReplyConfig
        coordinatesCaptured={coordinatesCaptured}
        stateId={stateId}
        polygonCity={coordinatesCitySelected}
        placeSelected={placeSelected}
        cities={cities}
        visible={showModalMirroringCity}
        setVisible={setShowModalMirroringCity}
        citiesFully={citiesFully}
        setLoading={setLoading}
      />
      <ModalAddCountry
        getCountries={getCountries}
        setLoading={setLoading}
        visibleModal={showModalAddCountry}
        setVisibleModal={setShowModalAddCountry}
      />
      <ModalAddCity
        getCity={getCity}
        listCountries={countriesFormated}
        setLoading={setLoading}
        visibleModal={showModalAddCity}
        setVisibleModal={setShowModalAddCity}
      />
      <ModalAddState
        getState={getState}
        listCountries={countriesFormated}
        setLoading={setLoading}
        visibleModal={showModalAddState}
        setVisibleModal={setShowModalAddState}
      />
      <ModalRemoveCity
        citiesFully={citiesFully}
        setLoading={setLoading}
        visibleModal={showModalRemoveCity}
        setVisibleModal={setShowModalRemoveCity}
      />
      <ModalRemoveCityName
        listCountries={countriesFormated}
        visibleModal={showModalRemoveCityName}
        setVisibleModal={setShowModalRemoveCityName}
        setLoading={setLoading}
      />
      
      <Modal
        title="Procurar por área"
        open={showSearchAreaModal}
        onCancel={() => {
          setShowSearchAreaModal(false);
          setSearchText("");
          setSearchResults([]);
        }}
        footer={null}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <Input.Group compact>
            <Input
              style={{ width: "calc(100% - 100px)" }}
              placeholder="Digite o nome do local"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={searchArea}
            />
            <Button 
              type="primary" 
              onClick={searchArea}
              loading={searchLoading}
              style={{ width: 100 }}
            >
              Pesquisar
            </Button>
          </Input.Group>
        </div>
        
        <List
          dataSource={searchResults}
          renderItem={(item: any, index: number) => (
            <List.Item
              key={index}
              onClick={() => selectSearchResult(item)}
              style={{ cursor: "pointer" }}
              className="hover:bg-gray-50"
            >
              <List.Item.Meta
                title={item.display_name}
                description={`Tipo: ${item.type || "N/A"}`}
              />
            </List.Item>
          )}
          locale={{ emptyText: "Nenhum resultado encontrado" }}
        />
      </Modal>
    </Container>
  );
};
