import {
  Container,
  ContentInput,
  LabelText,
  ContainerInput,
  ContentMap,
} from "./styles";

import { useEffect, useRef, useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import { Select, Input, Button } from "antd";
import swal from "sweetalert";
import { AxiosError } from "axios";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import api from "../../../../../services/api";

import Preload from "../../../../../components/Utils/Preload";
import Utils from "../../../../../utils/Utils";
import { useMapbox } from "../../../../../contexts/mapbox";
import AuthContext from "../../../../../contexts/auth";
import { CIDADE, CIDADE_EDITAR_AREA } from "../../../../../constants/permissions";

import { CitiesFullyProps } from "../AddCity/types";
import { InformationsCityProps } from "./types";

export const EditCity = () => {
  const { hasPermission } = useContext(AuthContext);
  const history = useHistory();
  const [nameCity, setNameCity] = useState<string>("");
  const [citiesFully, setCitiesFully] = useState<CitiesFullyProps[]>([]);
  const [informationsCity, setInfomationCity] =
    useState<InformationsCityProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapboxMap | null>(null);
  const draw = useRef<MapboxDraw | null>(null);

  const [coordinatesCity, setCoordinatesCity] = useState<
    [number, number] | null
  >(null);
  const [coordinatesCaptured, setCoordinatesCaptured] = useState<any>();

  const placeRef = useRef<any>(coordinatesCity);

  const coordinatesCityFormated = coordinatesCity?.map((value: any) => {
    return [value[1], value[0]];
  });

  placeRef.current = coordinatesCityFormated;

  const getCitiesFully = async () => {
    try {
      setLoading(true);

      const responseCitiesFully = await api.get("city/actives/fully");

      if (responseCitiesFully.status) {
        setCitiesFully(Array.isArray(responseCitiesFully.data?.response) ? responseCitiesFully.data.response : []);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar dados das cidades",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInformationsCity = async (idCity: number) => {
    try {
      setLoading(true);
      setCoordinatesCaptured(undefined);

      const responseInformationsCity = await api.get(`city/${idCity}`);

      if (responseInformationsCity?.status) {
        const cityData =
          responseInformationsCity.data?.response ??
          responseInformationsCity.data?.data;
        if (cityData) {
          setInfomationCity(cityData);
          setNameCity(cityData.nome || "");

          if (!cityData.polygon) {
            swal({
              title: "Aviso",
              text: "Esta cidade ainda não possui área delimitada cadastrada. Você pode desenhar a área no mapa e clicar em Atualizar.",
              icon: "info",
            });
          }
        }
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pegar informações da cidade",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCity = () => {
    swal({
      title: "Deseja realmente atualizar os dados desta cidade?",
      icon: "info",
      buttons: ["Não", "Sim"],
    }).then((isAccept) => {
      if (isAccept) {
        const coordinatesCityInverse = Array.isArray(coordinatesCityFormated)
          ? coordinatesCityFormated.map((value: any) => ({
              lat: value[1],
              lng: value[0],
            }))
          : undefined;

        const coordinatesCityCapturedFormated = Array.isArray(coordinatesCaptured)
          ? coordinatesCaptured.map((value: [number, number]) => ({
              lat: value[1],
              lng: value[0],
            }))
          : undefined;

        const finalPolygon =
          coordinatesCityCapturedFormated && coordinatesCityCapturedFormated.length > 0
            ? coordinatesCityCapturedFormated
            : coordinatesCityInverse;

        if (!finalPolygon || finalPolygon.length === 0) {
          swal({
            title: "Atenção",
            text: "Por favor, desenhe uma área no mapa antes de salvar.",
            icon: "warning",
          });
          return;
        }

        setLoading(true);
        api
          .put(`city/${informationsCity?.id}/area`, {
            estate_id: informationsCity?.estado,
            name: nameCity,
            polygon: finalPolygon,
            short_name: informationsCity?.shortName,
            old_name: informationsCity?.nome,
          })
          .then((response) => {
            if (response.status) {
              swal({
                title: "Dados atualizados com sucesso!",
                icon: "success",
              });
              getCitiesFully();
            } else {
              swal({
                title: "Ocorreu um erro ao tentar atualizar área",
                icon: "error",
              });
            }
          })
          .catch((error: AxiosError) => {
            swal({
              title: error.response?.data?.message || "Erro ao atualizar área da cidade",
              icon: "error",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    });
  };

  useEffect(() => {
    getCitiesFully();
  }, []);

  const { mapboxToken } = useMapbox();

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) {
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-49.27, -16.68],
      zoom: 4,
    });

    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    map.current.addControl(draw.current as any);

    map.current.on("load", () => {
      if (placeRef.current && placeRef.current.length > 0) {
        const defaultPolygon = {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [placeRef.current],
          },
        };
        draw.current?.add(defaultPolygon as any);
      }
    });

    map.current.on("draw.create", (event: any) => {
      const feature = event?.features?.[0];
      if (feature?.geometry?.coordinates?.[0]) {
        const currentCoordinatesId = feature.id;
        const allFeatures = draw.current?.getAll()?.features || [];
        const oldCoordinatesId = allFeatures.find((f: any) => f.id !== currentCoordinatesId)?.id;

        setCoordinatesCaptured(feature.geometry.coordinates[0]);

        if (oldCoordinatesId) {
          draw.current?.delete(oldCoordinatesId as string);
        }
      }
    });

    map.current.on("draw.update", (event: any) => {
      const feature = event?.features?.[0];
      if (feature?.geometry?.coordinates?.[0]) {
        setCoordinatesCaptured(feature.geometry.coordinates[0]);
      }
    });

    map.current.on("draw.delete", () => {
      setCoordinatesCaptured(undefined);
    });
  }, [mapboxToken]);

  useEffect(() => {
    if (informationsCity) {
      const coordinatesCitySelected = informationsCity.polygon
        ? Utils.TransformCoordinates(informationsCity.polygon)
        : [];

      setCoordinatesCity(coordinatesCitySelected);
      setCoordinatesCaptured(undefined);

      const hasCoordinates =
        Array.isArray(coordinatesCitySelected) &&
        coordinatesCitySelected.length > 0;

      if (hasCoordinates) {
        const centerCoordinates = Utils.CenterCoordinates(
          coordinatesCitySelected
        );
        if (centerCoordinates && map.current) {
          const centerMap = [centerCoordinates[1], centerCoordinates[0]];
          map.current.flyTo({
            center: centerMap as any,
            zoom: 9,
          });
        }
      }

      if (draw.current) {
        draw.current.deleteAll();

        if (hasCoordinates) {
          const coordinatesCityFormated = coordinatesCitySelected.map(
            (value: any) => [value[1], value[0]]
          );

          const defaultPolygon = {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [coordinatesCityFormated],
            },
          };

          draw.current.add(defaultPolygon as any);
        }
      }
    }
  }, [informationsCity]);

  const citiesFullyFormated = (Array.isArray(citiesFully) ? citiesFully : []).map((value) => {
    return {
      label: value.nome || (value as any).name || "Cidade",
      value: Number(value.cityId ?? (value as any).id),
    };
  });

  useEffect(() => {
    if (!hasPermission(CIDADE, CIDADE_EDITAR_AREA)) {
      history.replace("/");
    }
  }, [hasPermission, history]);

  if (!hasPermission(CIDADE, CIDADE_EDITAR_AREA)) {
    return null;
  }

  return (
    <Container>
      <Preload visible={loading} />

      <ContainerInput>
        <ContentInput>
          <LabelText>Escolha sua cidade</LabelText>
          <Select
            showSearch
            placeholder="Escolha sua cidade"
            optionFilterProp="label"
            filterOption={(input, option) =>
              (String(option?.label ?? "")).toLowerCase().includes(input.toLowerCase())
            }
            style={{
              width: "100%",
            }}
            onChange={(idCity) => getInformationsCity(Number(idCity))}
            options={citiesFullyFormated}
          />
        </ContentInput>

        <ContentInput>
          <LabelText>Nome da cidade</LabelText>
          <Input
            style={{
              width: "100%",
            }}
            value={nameCity}
            onChange={(event) => setNameCity(event.target.value)}
          />
        </ContentInput>
      </ContainerInput>

      <ContentMap>
        <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />
      </ContentMap>
      {informationsCity && (
        <Button type="primary" onClick={handleUpdateCity}>
          Atualizar
        </Button>
      )}
    </Container>
  );
};
