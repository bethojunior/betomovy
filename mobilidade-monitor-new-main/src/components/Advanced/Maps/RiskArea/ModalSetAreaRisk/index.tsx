// @ts-nocheck

import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import { Modal, Button, Input } from "antd";
import swal from "sweetalert";

import { Container, ContentInput, LabelText } from "./styles";

import { RiskAreaProps } from "../../../../../pages/Advanced/Maps/RiskArea/types";

import api from "../../../../../services/api";
import { useMapbox } from "../../../../../contexts/mapbox";

interface ModalSetAreaRiskProps {
  setShowModal: (data: boolean) => void;
  showModal: boolean;
  setLoading: (data: boolean) => void;
  riskAreaSelected: RiskAreaProps | null;
  setRiskAreaSelected: (data: RiskAreaProps | null) => void;
  getRiskAreaAndWebMapKey: () => void;
}

export const ModalSetAreaRisk = ({
  setShowModal,
  showModal,
  setLoading,
  riskAreaSelected,
  setRiskAreaSelected,
  getRiskAreaAndWebMapKey,
}: ModalSetAreaRiskProps) => {
  const handleCloseModal = () => {
    setRiskAreaSelected(null);
    setShowModal(false);
  };

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapboxMap | null>(null);

  const [radius, setRadius] = useState<number>(
    riskAreaSelected?.radius as number
  );

  const handleUpdateAreaRisk = async () => {
    setLoading(true);
    try {
      const responseUpdateAreaRisk = await api.put(
        `riskArea/${riskAreaSelected?.id}`,
        {
          radius: String(radius),
        }
      );

      if (responseUpdateAreaRisk.status) {
        swal({
          title: "Área de risco atualizada com sucesso",
          icon: "success",
        });
        getRiskAreaAndWebMapKey();
        setShowModal(false);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao atualizar área de risco",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateLayerRadius = (newRadius: number) => {
    if (map.current) {
      const sourceData = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                Number(riskAreaSelected?.longitude),
                Number(riskAreaSelected?.latitude),
              ],
            },
          },
        ],
      };

      if (map.current.getSource("risk-area-source") !== undefined) {
        map.current.getSource("risk-area-source").setData(sourceData);

        map.current.setPaintProperty(
          "risk-area",
          "circle-radius",
          newRadius / 10
        );
      }
    }
  };

  const { mapboxToken } = useMapbox();

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) {
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [
        Number(riskAreaSelected?.longitude),
        Number(riskAreaSelected?.latitude),
      ],
      zoom: 13,
    });

    map.current.on("load", () => {
      map.current?.addSource("risk-area-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [
                  Number(riskAreaSelected?.longitude),
                  Number(riskAreaSelected?.latitude),
                ],
              },
            },
          ],
        },
      });

      map.current?.addLayer({
        id: "risk-area",
        type: "circle",
        source: "risk-area-source",
        layout: {
          visibility: "visible",
        },
        paint: {
          "circle-radius": riskAreaSelected?.radius / 10,
          "circle-color": "#FF0000",
          "circle-opacity": 0.5,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#FF0000",
        },
      });
    });
  }, [mapboxToken, riskAreaSelected]);

  useEffect(() => {
    setRadius(riskAreaSelected?.radius);
  }, [riskAreaSelected]);

  useEffect(() => {
    if (radius !== undefined) {
      console.log(radius);
      updateLayerRadius(radius);
    }
  }, [radius]);

  return (
    <Modal
      title="Alterar raio da área de risco"
      open={showModal}
      onCancel={() => setShowModal(false)}
      footer={[
        <Button onClick={handleCloseModal} key={1}>
          Cancelar
        </Button>,
        <Button type="primary" onClick={handleUpdateAreaRisk} key={2}>
          Atualizar
        </Button>,
      ]}
    >
      <Container>
        <ContentInput>
          <LabelText>Endereço</LabelText>
          <Input value={riskAreaSelected?.address} readOnly />
        </ContentInput>

        <ContentInput>
          <LabelText>Usuário</LabelText>
          <Input value={riskAreaSelected?.user.name} readOnly />
        </ContentInput>

        <ContentInput>
          <LabelText>Data/Horário</LabelText>
          <Input
            value={new Date(riskAreaSelected?.created_at).toLocaleString()}
            readOnly
          />
        </ContentInput>

        <ContentInput>
          <LabelText>Tamanho do raio da área de risco (metros)</LabelText>
          <Input
            type="number"
            value={radius}
            onChange={(event) => setRadius(Number(event.target.value))}
          />
        </ContentInput>

        <div ref={mapContainer} style={{ width: "100%", height: "300px" }} />
      </Container>
    </Modal>
  );
};
