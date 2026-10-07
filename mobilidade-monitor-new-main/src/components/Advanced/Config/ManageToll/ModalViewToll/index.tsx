import { Button, Modal } from "antd";
import mapboxgl, { Map } from "mapbox-gl";

import { Container } from "./styles";
import { TollItemsProps } from "../../../../../pages/Advanced/Configs/ManageToll/types";
import { theme_colors } from "../../../../../theme/theme";
import { useEffect, useRef } from "react";
import Utils from "../../../../../utils/Utils";
import { useMapbox } from "../../../../../contexts/mapbox";

interface ModalViewTollProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  tollSelected: TollItemsProps | null;
}

const { getCenterCoordinates, calculateRadiusFromCoordinates } = Utils;

export const ModalViewToll = ({
  visible,
  setVisible,
  tollSelected,
}: ModalViewTollProps) => {
  const handleCloseModal = () => {
    setVisible(false);
  };

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const { mapboxToken } = useMapbox();

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current || !tollSelected) {
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    const lat = getCenterCoordinates(tollSelected?.polygon).lat;
    const lng = getCenterCoordinates(tollSelected?.polygon).lng;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: 9,
    });

    const jsonToll = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)],
          },
        },
      ],
    };

    map.current?.on("load", () => {
      map.current?.addSource("toll-source", {
        type: "geojson",
        data: jsonToll as any,
      });

      map.current?.addLayer({
        id: "toll-area",
        type: "circle",
        source: "toll-source",
        layout: {
          visibility: "visible",
        },
        paint: {
          "circle-radius": 30,
          "circle-color": theme_colors.red_crismon,
          "circle-opacity": 0.5,
          "circle-stroke-width": 2,
          "circle-stroke-color": theme_colors.red_crismon,
        },
      });
    });
  }, [mapboxToken, visible, tollSelected]);

  useEffect(() => {
    if (tollSelected && map.current) {
      const lat = getCenterCoordinates(tollSelected?.polygon).lat;
      const lng = getCenterCoordinates(tollSelected?.polygon).lng;

      const radius = calculateRadiusFromCoordinates(
        [lng, lat],
        [tollSelected.polygon[0].lng, tollSelected.polygon[0].lat]
      );

      map.current?.flyTo({
        center: [lng, lat],
      });

      map.current.on("zoomend", () => {
        const jsonToll = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [lng, lat],
              },
            },
          ],
        };

        // @ts-ignore
        map.current.getSource("toll-source").setData(jsonToll);
        map.current?.setPaintProperty("toll-area", "circle-radius", radius);
      });
    }
  }, [tollSelected]);

  return (
    <Modal
      title="Pedágio"
      open={visible}
      onCancel={handleCloseModal}
      footer={[<Button onClick={handleCloseModal}>Fechar</Button>]}
    >
      <Container>
        <div ref={mapContainer} style={{ width: "100%", height: "250px" }} />
      </Container>
    </Modal>
  );
};
