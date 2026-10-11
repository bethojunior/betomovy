import { Button, Input, Modal, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "mapbox-gl/dist/mapbox-gl.css";
import swal from "sweetalert";

import {
  Container,
  ContentMap,
  ContentSearch,
  ContentNeighborhoods,
  ContentPlaces,
  ContentBtnSave,
  ContentTable,
  PlaceCard,
  PlaceName,
  PlaceDetails,
} from "./styles";

import api from "../../../services/api";
 
import Alert from "../../../components/Utils/Alert";
import Utils from "../../../utils/Utils";
import Session from "../../../utils/Session";
import { useMapbox } from "../../../contexts/mapbox";

interface NeighborhoodsTypes {
  cityId: number;
  id: number;
  name: string;
}

let citySelected = Session.getLocal("citySelected");

export const Neighborhoods = () => {
       
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");
  const [typeAlert, setTypeAlert] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const [list, setList] = useState<NeighborhoodsTypes[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [listSearch, setListSearch] = useState<any>([]);
  const [searchValue, setSearchValue] = useState("");
  const [coordinatesCaptured, setCoordinatesCaptured] = useState<any>();

  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapboxMap | null>(null);
  const draw = useRef<MapboxDraw | null>(null);

  const [placeSelected, setPlaceSelected] = useState<any>();
  const placeRef = useRef<any>(placeSelected);
  placeRef.current = placeSelected;

  const columns = [
    {
      title: "Zona",
      dataIndex: "name",
      key: "name",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Excluir",
      dataIndex: "",
      key: "",
      width: 100,
      render: (item: NeighborhoodsTypes) => (
        <Button
          onClick={() => remove(item.id)}
          icon={<AiFillDelete style={{ color: "red" }} />}
        ></Button>
      ),
    },
  ];

  const get = async () => {
    setLoadingTable(true);
    const { data } = await api("central/neighborhood");

    setLoadingTable(false);
    if (!data.status) {
      setMessageAlert(
        "Ocorreu um erro ao carregar as informações, tente novamente"
      );
      setTypeAlert("error");
      setShowAlert(true);
      return;
    }

    setList(data.response);
  };

  const remove = async (id: number) => {
    swal({
      title: "Você deseja demover essa zona?",
      icon: "warning",
      dangerMode: true,
      buttons: ["Cancelar", "Confirmar"],
    }).then(async (answer) => {
      if (!answer) {
        return;
      }

      setLoadingTable(true);
      const { data } = await api.delete(`central/neighborhood/${id}`);

      if (!data.status) {
        setLoadingTable(false);
        setMessageAlert(
          "Ocorreu um erro ao deletar essa zona, tente novamente"
        );
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      get();
      setMessageAlert("Zona deletada com sucesso!");
      setTypeAlert("success");
      setShowAlert(true);
    });
  };

  const search = async () => {
    if (!searchValue.trim()) {
      swal({
        title: "Digite o nome do bairro para pesquisar.",
        icon: "warning",
      });
      return;
    }

    try {
      setLoadingSearch(true);
      const host = `https://nominatim.openstreetmap.org/search.php?q=${searchValue} ${citySelected.nome}&polygon_geojson=1&format=jsonv2`;
      const response = await fetch(host, {
        headers: {
          'User-Agent': 'MobilidadeMonitor/1.0'
        }
      });
      const result = await response.json();
      const neighborhoodFormated = result.filter(
        (data: any) => data.geojson.type === "Polygon"
      );
      if (neighborhoodFormated.length <= 0) {
        swal({
          title: "Nenhum bairro encontrado.",
          icon: "info",
        });
        setListSearch([]);
        return;
      }
      setListSearch(neighborhoodFormated);
    } catch (error) {
      console.error("Erro ao buscar bairro:", error);
      swal({
        title: "Erro ao buscar bairro. Tente novamente.",
        icon: "error",
      });
      setListSearch([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const formatPlaceName = (displayName: string) => {
    const parts = displayName.split(", ");
    const name = parts[0] || displayName;
    const details = parts.slice(1, 3).join(", ");
    return { name, details };
  };

  const handleSelectPlace = (value: any) => {
    setPlaceSelected(value);
    setCoordinatesCaptured(value.geojson.coordinates);
    const centerMap = Utils.CenterCoordinates(value.geojson.coordinates[0]);
    if (map.current) {
      map.current.flyTo({
        center: centerMap,
        zoom: 13,
      });
      if (draw.current) {
        draw.current.deleteAll();
        const defaultPolygon = {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: value.geojson.coordinates,
          },
        };
        draw.current.add(defaultPolygon as any);
      }
    }
  };

  const save = async () => {
    if (searchValue.length <= 0) {
      swal({
        title: "Preencha o nome do bairro",
        icon: "warning",
      });
      return;
    }
    setLoadingSave(true);
    //setLoadingTable(true);
    let areaFormated: any = [];

    if (coordinatesCaptured === undefined) {
      areaFormated = placeSelected?.geojson.coordinates[0].map((value: any) => {
        return {
          lat: value[1],
          lng: value[0],
        };
      });
    } else {
      const coords = coordinatesCaptured.length === 1 ? coordinatesCaptured[0] : coordinatesCaptured;
      areaFormated = (Array.isArray(coords) ? coords : []).map((value: any) => {
        return {
          lat: value[1],
          lng: value[0],
        };
      });
    }

    try {
      const result = await api.post(`central/neighborhood`, {
        area: areaFormated,
        cityId: citySelected.cityId,
        name: searchValue,
      });
      if (!result.data.status) {
        setLoadingTable(false);
        setMessageAlert(
          "Ocorreu um erro ao salvar o bairro, tente novamente"
        );
        setTypeAlert("error");
        setShowAlert(true);
        return;
      }

      get();
      setMessageAlert("Bairro adicionado com sucesso!");
      setTypeAlert("success");
      setShowModal(false);
      setListSearch([]);
      setSearchValue("");
      setShowAlert(true);
    } catch (error) {
      console.error("Erro ao salvar bairro:", error);
      setMessageAlert("Erro ao salvar bairro, tente novamente");
      setTypeAlert("error");
      setShowAlert(true);
    } finally {
      setLoadingSave(false);
      //setLoadingTable(false);
    }
  };

  const { mapboxToken } = useMapbox();

  const initializeMap = () => {
    if (!mapboxToken || !mapContainer.current || map.current) {
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    const datasCityCoordinates = Utils.CenterCoordinates(
      Utils.TransformCoordinates(citySelected.polygon)
    );
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
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
      id: "gl-draw-polygon-stroke-active",
      type: "line",
      filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#FF0000",
        "line-width": 2,
      },
    },
    {
      id: "gl-draw-polygon-stroke-inactive",
      type: "line",
      filter: ["all", ["==", "active", "false"], ["==", "$type", "Polygon"]],
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#FF0000",
        "line-width": 2,
      },
    },
    {
      id: "gl-draw-polygon-fill",
      type: "fill",
      filter: ["all", ["==", "$type", "Polygon"],
        ["!=", "mode", "static"]
      ],
      paint: {
        "fill-color": "#FF0000",
        "fill-opacity": 0.3,
      },
    },
    {
      id: "gl-draw-polygon-midpoint",
      type: "circle",
      filter: ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
      paint: {
        "circle-radius": 3,
        "circle-color": "#FF0000",
      },
    },
    {
      id: "gl-draw-polygon-and-line-vertex-halo-active",
      type: "circle",
      filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"]],
      paint: {
        "circle-radius": 10,
        "circle-color": "#FFF",
      },
    },
    {
      id: "gl-draw-polygon-and-line-vertex-active",
      type: "circle",
      filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"]],
      paint: {
        "circle-radius": 6,
        "circle-color": "#FF0000",
      },
    },
  ],
    });

    map.current.addControl(draw.current as any);

    map.current.on("draw.create", (event: any) => {
      const feature = event.features[0] as any;
      const currentCoordinatesId = feature.id;
      const oldCoordinatesId = draw.current?.getAll().features[0]?.id;
      setCoordinatesCaptured(feature.geometry.coordinates[0] as any);
      if (currentCoordinatesId !== oldCoordinatesId && oldCoordinatesId) {
        draw.current?.delete(oldCoordinatesId as string);
      }
    });

    map.current.on("draw.update", (event: any) => {
      const feature = event.features[0] as any;
      setCoordinatesCaptured(feature.geometry.coordinates[0] as any);
    });

    map.current.on("draw.delete", () => {
      setCoordinatesCaptured(undefined);
    });
  };
  
  useEffect(() => {
    if (showModal && mapboxToken) {
      setTimeout(() => {
        initializeMap();
      }, 100);
    }
  }, [showModal, mapboxToken]);

  useEffect(() => {
    if (!showModal) {
      if (map.current) {
        map.current.remove();
        map.current = null;
        draw.current = null;
      }
      setCoordinatesCaptured(undefined);
      setPlaceSelected(undefined);
      setListSearch([]);
      setSearchValue("");
    }
  }, [showModal]);

  useEffect(() => {
    get();
  }, []);

  return (
    <Container>
       
      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />

      <Button
        style={{
          marginBottom: 10,
        }}
        type="primary"
        onClick={() => setShowModal(true)}
      >
        Adicionar zona
      </Button>

      <ContentTable>
        <Table dataSource={list} columns={columns} loading={loadingTable}/>
      </ContentTable>

      <Modal
        title="Adicionar bairro"
        open={showModal}
        footer={null}
        onCancel={() => {
          setShowModal(false);
        }}
        destroyOnClose
        width={800}
        afterOpenChange={(open) => {
          if (open && mapboxToken) {
            setTimeout(() => {
              initializeMap();
            }, 200);
          }
        }}
      >
        <div>
          <p>Nome do bairro</p>
          <ContentSearch>
            <Input.Search
              type="text"
              onChange={(e) => setSearchValue(e.target.value)}
              enterButton="Pesquisar"
              onSearch={() => search()}
              loading={loadingSearch}
              disabled={loadingSearch}
            />
          </ContentSearch>
          <div style={{ marginTop: 20 }}>
            <p>Bairros encontrados</p>
            <ContentNeighborhoods>
              <ContentPlaces>
                {listSearch?.map((item: any, index: number) => {
                  const { name, details } = formatPlaceName(item.display_name);
                  return (
                    <PlaceCard
                      key={index}
                      onClick={() => handleSelectPlace(item)}
                    >
                      <PlaceName>{name}</PlaceName>
                      {details && <PlaceDetails>{details}</PlaceDetails>}
                    </PlaceCard>
                  );
                })}
              </ContentPlaces>
              <ContentMap>
                <div
                  ref={mapContainer}
                  style={{ width: "100%", height: "400px" }}
                />
              </ContentMap>
            </ContentNeighborhoods>
          </div>
        </div>
        <ContentBtnSave>
          <Button
            style={{
              width: "100%",
            }}
            type="primary"
            loading={loadingSave}
            onClick={save}
          >
            Salvar
          </Button>
        </ContentBtnSave>
      </Modal>
    </Container>
  );
};
