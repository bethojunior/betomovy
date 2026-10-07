import {
  Container,
  ContentInput,
  LabelText,
  ContentAreas,
  ContentSuggestions,
  SuggestionsAddresses,
} from "./styles";
import { Button, Input, Modal } from "antd";
import axios from "axios";
import swal from "sweetalert";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
//@ts-ignore
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import { useState, useRef, useEffect, Fragment } from "react";

import Session from "../../../../utils/Session";
import Utils from "../../../../utils/Utils";
import { useMapbox } from "../../../../contexts/mapbox";

import { SearchAddressesProps } from "../../../../pages/Advanced/Configs/Tariffs/DynamicPerArea/types";
import api from "../../../../services/api";

interface ModalMonitoringArea {
  visible: boolean;
  setVisible: (data: boolean) => void;
  setLoading: (data: boolean) => void;
  getMonitoringArea: () => void;
}

export const ModalMonitoringArea = ({
  setVisible,
  visible,
  setLoading,
  getMonitoringArea,
}: ModalMonitoringArea) => {
  const [valueMultiplied] = useState("0,00");
  const [nameNeighborhood, setNameNeighborhood] = useState<string>("");
  const [listAddresses, setListAddresses] = useState<SearchAddressesProps[]>(
    []
  );
  const [timeInit] = useState<string>("");
  const [timeFinal] = useState<string>("");

  const [coordinatesCaptured, setCoordinatesCaptured] = useState<any>();

  const [placeSelected, setPlaceSelected] = useState<SearchAddressesProps>();

  const placeRef = useRef<any>(placeSelected);

  placeRef.current = placeSelected;

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapboxMap | null>(null);
  const draw = useRef<MapboxDraw | null>(null);

  const citySelected = Session.getLocal("citySelected");
  const { mapboxToken } = useMapbox();

  const handleSaveArea = async () => {
    if (nameNeighborhood === "") {
      swal({
        title: "Digite o nome do bairro",
        icon: "info",
      });
      return;
    }

    setLoading(true);
    try {
      let areaFormated;

      if (coordinatesCaptured === undefined) {
        areaFormated = placeSelected?.geojson.coordinates[0].map(
          (value: any) => {
            return {
              lat: value[1],
              lng: value[0],
            };
          }
        );
      } else {
        areaFormated = coordinatesCaptured.map((value: any) => {
          return {
            lat: value[1],
            lng: value[0],
          };
        });
      }

      const objectSend = {
        area: areaFormated,
        cityId: citySelected.cityId,
        endTime: timeFinal,
        multiplierValue: Utils.BrlToNumber(valueMultiplied, "positive"),
        name: nameNeighborhood,
        startTime: timeInit,
      };

      
      const responseDynamicArea = await api.post("monitoringArea", objectSend);

      if (responseDynamicArea.status) {
        swal({
          title: "Área de monitoramento criada com sucesso",
          icon: "success",
        });
        getMonitoringArea();
        setPlaceSelected(undefined);
        setCoordinatesCaptured(undefined);
        setNameNeighborhood("");
        setListAddresses([]);
        setVisible(false);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao salvar área",
        icon: "error",
      });
    }
    setLoading(false);
  };

  const handleSearchAddresses = async () => {
    setLoading(true);
    try {
      const responseAdresses = await axios.get(
        `https://nominatim.openstreetmap.org/search.php?q=${nameNeighborhood}%20${citySelected.nome}&polygon_geojson=1&format=jsonv2`
      );
      if (responseAdresses.status) {
        setListAddresses(responseAdresses.data);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao pesquisar bairros",
        icon: "error",
      });
    }
    setLoading(false);
  };

  const handleSelectPlace = (value: SearchAddressesProps) => {
    setPlaceSelected(value);
  };


  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || !listAddresses.length) {
      return;
    }

    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    mapboxgl.accessToken = mapboxToken;

    const datasCityCoordinates = Utils.CenterCoordinates(
      Utils.TransformCoordinates(citySelected.polygon)
    );
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [datasCityCoordinates[1], datasCityCoordinates[0]],
      zoom: 9,
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
            'fill-color': '#ff0000',
            'fill-outline-color': '#ff0000',
            'fill-opacity': 0.3
          }
        },
        {
          id: 'gl-draw-polygon-fill-active',
          type: 'fill',
          filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
          paint: {
            'fill-color': '#ff0000',
            'fill-outline-color': '#ff0000',
            'fill-opacity': 0.3
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
            'line-color': '#ff0000',
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
            'line-color': '#ff0000',
            'line-width': 2
          }
        },
        {
          id: 'gl-draw-polygon-and-line-vertex-stroke-inactive',
          type: 'circle',
          filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
          paint: {
            'circle-radius': 5,
            'circle-color': '#fff'
          }
        },
        {
          id: 'gl-draw-polygon-and-line-vertex-inactive',
          type: 'circle',
          filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
          paint: {
            'circle-radius': 3,
            'circle-color': '#ff0000'
          }
        }
      ]
    });

    map.current.addControl(draw.current as any);

    map.current.on("draw.create", (event: any) => {
      const feature = event.features[0] as any;
      setCoordinatesCaptured(feature.geometry.coordinates[0] as any);
    });

    map.current.on("draw.update", (event: any) => {
      const feature = event.features[0] as any;
      setCoordinatesCaptured(feature.geometry.coordinates[0] as any);
    });

    map.current.on("draw.delete", () => {
      setCoordinatesCaptured(undefined);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, listAddresses]);

  useEffect(() => {
    if (!placeSelected || !map.current || !draw.current) {
      return;
    }

    const centerMap = Utils.CenterCoordinates(placeSelected.geojson.coordinates[0]);
    
    map.current.flyTo({
      center: centerMap,
      zoom: 12,
    });

    draw.current.deleteAll();
    
    const defaultPolygon = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: placeSelected.geojson.coordinates,
      },
    };

    draw.current.add(defaultPolygon as any);
  }, [placeSelected]);

  return (
    <Modal
      title="Adicionar área"
      open={visible}
      onCancel={() => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
        setVisible(false);
      }}
      footer={[
        <Button type="primary" onClick={handleSaveArea}>
          Salvar
        </Button>,
      ]}
      width={700}
      centered
      destroyOnClose
      maskClosable={false}
    >
      <Container>
        <ContentInput>
          <LabelText>Nome do bairro</LabelText>
          <Input.Search
            type="text"
            enterButton="Pesquisar"
            value={nameNeighborhood}
            onChange={(event) => setNameNeighborhood(event.target.value)}
            onSearch={handleSearchAddresses}
          />
        </ContentInput>
        {listAddresses.length > 0 ? (
          <ContentAreas>
            <div>
              <h2>Sugestões</h2>
              <ContentSuggestions>
                {listAddresses.map((value) => {
                  return (
                    <Fragment key={value.osm_id}>
                      {value.geojson.type === "Polygon" ? (
                        <SuggestionsAddresses
                          selected={value.place_id === placeSelected?.place_id}
                          key={value.place_id}
                          onClick={() => handleSelectPlace(value)}
                        >
                          {value.display_name.substring(0, 55)}...
                        </SuggestionsAddresses>
                      ) : null}
                    </Fragment>
                  );
                })}
              </ContentSuggestions>
            </div>
            <div
              ref={mapContainer}
              style={{ width: "100%", height: "400px" }}
            />
          </ContentAreas>
        ) : null}
      </Container>
    </Modal>
  );
};
