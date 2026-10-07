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
        setCitiesFully(responseCitiesFully.data.response);
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

      const responseInformationsCity = await api.get(`city/${idCity}`);

      if (responseInformationsCity.status) {
        setInfomationCity(responseInformationsCity.data.response);
        setNameCity(responseInformationsCity.data.response.nome);
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
        const coordinatesCityInverse = coordinatesCityFormated?.map((value) => {
          return {
            lat: value[1],
            lng: value[0],
          };
        });

        const coordinatesCityCapturedFormated = coordinatesCaptured?.map(
          (value: [number, number]) => {
            return {
              lat: value[1],
              lng: value[0],
            };
          }
        );

        setLoading(true);
        api
          .put(`city/${informationsCity?.id}/area`, {
            estate_id: informationsCity?.estado,
            name: nameCity,
            polygon: coordinatesCityCapturedFormated
              ? coordinatesCityCapturedFormated
              : coordinatesCityInverse,
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
                title: "Ocorreu um erro tentar atualizar area",
                icon: "error",
              });
            }
          })
          .catch((error: AxiosError) => {
            swal({
              title: error.response?.data.message,
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
      center: [0, 0],
      zoom: 8,
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
    if (informationsCity) {
      const coordinatesCitySelected = Utils.TransformCoordinates(
        informationsCity.polygon
      );
      const centerCoordinates = Utils.CenterCoordinates(
        coordinatesCitySelected
      );
      const centerMap = [centerCoordinates[1], centerCoordinates[0]];
      setCoordinatesCity(coordinatesCitySelected);

      if (map.current) {
        map.current.flyTo({
          center: centerMap as any,
          zoom: 9,
        });

        if (draw.current) {
          const coordinatesCityFormated = coordinatesCitySelected?.map(
            (value: any) => {
              return [value[1], value[0]];
            }
          );
          draw.current.deleteAll();

          const defaultPolygon = {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [coordinatesCityFormated],
            },
          };

          draw.current.add(defaultPolygon as any);

          map.current!.on("draw.create", (event: any) => {
            const feature = event.features[0] as any;
            const currentCoordinatesId = feature.id;
            const oldCoordinatesId = draw.current?.getAll().features[0].id;

            setCoordinatesCaptured(feature.geometry.coordinates[0] as any);

            if (currentCoordinatesId !== oldCoordinatesId) {
              draw.current?.delete(oldCoordinatesId as string);
            }
          });

          map.current!.on("draw.update", (event) => {
            const feature = event.features[0] as any;
            setCoordinatesCaptured(feature.geometry.coordinates[0] as any);
          });

          map.current!.on("draw.delete", (_) => {
            setInfomationCity(null);
          });
        }
      }
    }
  }, [informationsCity]);

  const citiesFullyFormated = citiesFully.map((value) => {
    return {
      label: value.nome,
      value: value.cityId,
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
            style={{
              width: "100%",
            }}
            onChange={(idCity) => getInformationsCity(idCity)}
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
