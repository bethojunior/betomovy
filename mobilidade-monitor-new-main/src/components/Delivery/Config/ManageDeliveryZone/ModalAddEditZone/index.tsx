import { Button, Input, Modal } from "antd";
import swal from "sweetalert";
import { AxiosError } from "axios";
import mapboxgl, { Map }  from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useEffect, useRef, useState } from "react";

import {
  Container,
  ContentInput,
  Label,
  CardSuggestion,
  ContentSuggestion,
  ContentMapAndSuggestion,
} from "./styles";

import api from "../../../../../services/api";
import Session from "../../../../../utils/Session";
import Utils from "../../../../../utils/Utils";
import { useMapbox } from "../../../../../contexts/mapbox";

import { DeliveryNeighborhoodProps } from "../../../../../pages/Delivery/Config/ManageDeliveryZone/types";

interface ModalAddEditZoneProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  getDeliveryNeighborhood: () => void;
  deliveryNeighborhoodSelected: DeliveryNeighborhoodProps | null;
  setDeliveryNeighborhoodSelected: (
    data: DeliveryNeighborhoodProps | null
  ) => void;
}

export const ModalAddEditZone = ({
  visible,
  setVisible,
  getDeliveryNeighborhood,
  deliveryNeighborhoodSelected,
  setDeliveryNeighborhoodSelected,
}: ModalAddEditZoneProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingNeighborhood, setLoadingNeighborhood] =
    useState<boolean>(false);

  const [nameNeighborhood, setNameNeighborhood] = useState<string>("");
  const [suggestionsNeighborhood, setSuggestionNeighborhood] = useState<
    NeighboorhoodProps[]
  >([]);

  const [coordinatesSelected, setCoordinatesSelected] = useState<
    number[][] | null
  >(null);

  const [neighboorhoodSelected, setNeighboorhoodSelected] =
    useState<NeighboorhoodProps | null>(null);

  const citySelected = Session.getLocal("citySelected");

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);

  const { mapboxToken } = useMapbox();

  const handleCloseModal = () => {
    setVisible(false);
    setSuggestionNeighborhood([]);
    setNameNeighborhood("");
    setCoordinatesSelected(null);
    setNeighboorhoodSelected(null);
    setDeliveryNeighborhoodSelected(null);
  };

  const formatCoordinates = (coordinatesIsDeformated: boolean) => {
    let areaFormated: any = [];

    if (coordinatesIsDeformated) {
      areaFormated =
        coordinatesSelected &&
        coordinatesSelected[0].map((value: any) => {
          return {
            lat: value[1],
            lng: value[0],
          };
        });
    } else {
      areaFormated =
        coordinatesSelected &&
        coordinatesSelected.map((value: any) => {
          return {
            lat: value[1],
            lng: value[0],
          };
        });
    }
    return areaFormated;
  };

  const handleSaveNewZone = async () => {
    if (nameNeighborhood.length <= 0) {
      swal({
        title: "Preencha o nome do bairro",
        icon: "warning",
      });
      return;
    }

    const areaCoordinates = formatCoordinates(
      coordinatesSelected?.length === 1
    );

    try {
      setLoading(true);

      const responseSaveNewZone = await api.post("deliveryNeighborhood", {
        area: areaCoordinates,
        cityId: citySelected.cityId,
        deliveryPrice: 0,
        name: nameNeighborhood,
      });

      if (responseSaveNewZone.status) {
        swal({
          title: "Zona de entrega criado com sucesso!",
          icon: "success",
        });
        handleCloseModal();
        getDeliveryNeighborhood();
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.response,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditZone = async () => {
    const areaCoordinates = formatCoordinates(
      coordinatesSelected?.length === 1
    );

    try {
      setLoading(true);

      const responseEditZone = await api.put(
        `deliveryNeighborhood/${deliveryNeighborhoodSelected?.id}`,
        {
          area: areaCoordinates,
          cityId: citySelected.cityId,
          deliveryPrice: 0,
          name: nameNeighborhood,
        }
      );

      if (responseEditZone.status) {
        swal({
          title: "Zona de entrega editada com sucesso!",
          icon: "success",
        });
        handleCloseModal();
        getDeliveryNeighborhood();
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.response,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchNeighborhood = async () => {
    try {
      setLoadingNeighborhood(true);
      const responseNeighborhood = await api.get(
        `https://nominatim.openstreetmap.org/search.php?q=${nameNeighborhood} ${citySelected.nome}&polygon_geojson=1&format=jsonv2`
      );

      if (responseNeighborhood.status) {
        const neighborhoodFormated = responseNeighborhood.data.filter(
          (data: NeighboorhoodProps) => data.geojson.type === "Polygon"
        );

        if (neighborhoodFormated.length <= 0) {
          swal({
            title: "Nenhum bairro encontrado.",
            icon: "info",
          });
          return;
        }

        setSuggestionNeighborhood(neighborhoodFormated);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: responseError.response?.data.message,
        icon: "error",
      });
    } finally {
      setLoadingNeighborhood(false);
    }
  };

  const handleSelectPlace = (value: NeighboorhoodProps) => {
    setNeighboorhoodSelected(value);
    setCoordinatesSelected(value.geojson.coordinates);
    const centerMap = Utils.CenterCoordinates(value.geojson.coordinates[0]);
    if (map.current) {
      map.current.flyTo({
        center: centerMap,
        zoom: 13,
      });
    }

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

      map.current?.on("draw.create", (event) => {
        const feature = event.features[0] as any;
        const currentCoordinatesId = feature.id;
        const oldCoordinatesId = draw.current?.getAll().features[0].id;

        if (currentCoordinatesId !== oldCoordinatesId) {
          draw.current?.delete(oldCoordinatesId as string);
        }
        setCoordinatesSelected(feature.geometry.coordinates[0] as any);
      });

      map.current?.on("draw.update", (event) => {
        const feature = event.features[0] as any;
        setCoordinatesSelected(feature.geometry.coordinates[0] as any);
      });
    }
  };

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current || !visible) {
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    const datasCityCoordinates = Utils.CenterCoordinates(
      Utils.TransformCoordinates(citySelected.polygon)
    );

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [datasCityCoordinates[1], datasCityCoordinates[0]],
      zoom: 10,
    });

    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: false,
      },
    });

    map.current.addControl(draw.current as any);

    if (draw.current) {
      map.current?.on("draw.create", (event) => {
        const feature = event.features[0] as any;
        const currentCoordinatesId = feature.id;
        const oldCoordinatesId = draw.current?.getAll().features[0].id;

        if (currentCoordinatesId !== oldCoordinatesId) {
          draw.current?.delete(oldCoordinatesId as string);
        }

        setCoordinatesSelected(feature.geometry.coordinates as any);
      });

      map.current?.on("draw.update", (event) => {
        const feature = event.features[0] as any;
        setCoordinatesSelected(feature.geometry.coordinates as any);
      });
    }
  }, [mapboxToken, visible]);

  useEffect(() => {
    if (deliveryNeighborhoodSelected) {
      setNameNeighborhood(deliveryNeighborhoodSelected.name);

      const coordinatesArea = deliveryNeighborhoodSelected.area.map((value) => {
        return [value.lng, value.lat];
      });
      setCoordinatesSelected(coordinatesArea);

      const centerMap = Utils.CenterCoordinates(coordinatesArea);
      if (map.current) {
        map.current.flyTo({
          center: centerMap,
          zoom: 13,
        });
      }

      if (draw.current) {
        draw.current.deleteAll();

        const defaultPolygon = {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [coordinatesArea],
          },
        };

        draw.current.add(defaultPolygon as any);

        map.current?.on("draw.create", (event) => {
          const feature = event.features[0] as any;
          const currentCoordinatesId = feature.id;
          const oldCoordinatesId = draw.current?.getAll().features[0].id;

          if (currentCoordinatesId !== oldCoordinatesId) {
            draw.current?.delete(oldCoordinatesId as string);
          }
          setCoordinatesSelected(feature.geometry.coordinates[0] as any);
        });

        map.current?.on("draw.update", (event) => {
          const feature = event.features[0] as any;
          setCoordinatesSelected(feature.geometry.coordinates[0] as any);
        });
      }
    } else {
      const datasCityCoordinates = Utils.CenterCoordinates(
        Utils.TransformCoordinates(citySelected.polygon)
      );

      if (map.current) {
        map.current.flyTo({
          center: [datasCityCoordinates[1], datasCityCoordinates[0]],
          zoom: 10,
        });
      }

      if (draw.current) {
        draw.current.deleteAll();
      }
    }
  }, [deliveryNeighborhoodSelected, visible]);

  return (
    <Modal
      title={
        deliveryNeighborhoodSelected ? "Editar Bairro" : "Adicionar Bairro"
      }
      open={visible}
      onCancel={handleCloseModal}
      width={800}
      footer={[
        <Button key={1} onClick={handleCloseModal}>
          Cancelar
        </Button>,
        <Button
          key={2}
          type="primary"
          disabled={coordinatesSelected === null}
          onClick={
            deliveryNeighborhoodSelected ? handleEditZone : handleSaveNewZone
          }
          loading={loading}
        >
          {deliveryNeighborhoodSelected ? "Editar" : "Confirmar"}
        </Button>,
      ]}
    >
      <Container>
        <ContentInput>
          <Label htmlFor="name-neighboord">Nome do Bairro</Label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Input
              id="name-neighboord"
              placeholder="Nome do Bairro"
              onChange={(event) => setNameNeighborhood(event.target.value)}
              value={nameNeighborhood}
            />
            <Button
              type="primary"
              onClick={handleSearchNeighborhood}
              loading={loadingNeighborhood}
            >
              Pesquisar
            </Button>
          </div>
        </ContentInput>

        <ContentMapAndSuggestion>
          {suggestionsNeighborhood.length > 0 && (
            <ContentSuggestion>
              {suggestionsNeighborhood.map((value, index) => {
                return (
                  <CardSuggestion
                    selected={
                      neighboorhoodSelected?.place_id === value.place_id
                    }
                    key={index}
                    onClick={() => handleSelectPlace(value)}
                  >
                    <span>{value.display_name}</span>{" "}
                  </CardSuggestion>
                );
              })}
            </ContentSuggestion>
          )}

          <div ref={mapContainer} style={{ width: "100%", height: "300px" }} />
        </ContentMapAndSuggestion>
      </Container>
    </Modal>
  );
};
