import { Modal, Input, Button } from "antd";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";

import { useEffect, useRef, useState } from "react";

import { Container, LabelText, ContentInput } from "./styles";

import { useGetMyPosition } from "../../../../../../utils/Hook";
import { useMapbox } from "../../../../../../contexts/mapbox";

import api from "../../../../../../services/api";
import swal from "sweetalert";

interface ModalAddAddressProps {
  showModal: boolean;
  setShowModal: (data: boolean) => void;
  setLoading: (data: boolean) => void;
  getAddress: () => void;
}

export const ModalAddAddress = ({
  showModal,
  setShowModal,
  setLoading,
  getAddress,
}: ModalAddAddressProps) => {
  const [nameAddress, setNameAddress] = useState<string>("");
  const [position, setPosition] = useState<{
    lat: number | string;
    lng: number | string;
  }>({
    lat: 0,
    lng: 0,
  });

  const { latitude, longitude } = useGetMyPosition();
  const { mapboxToken } = useMapbox();

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<MapboxMap | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [isUserEditing, setIsUserEditing] = useState(false);
  const [loading, setLocalLoading] = useState(false);

  const handleSaveNewAddress = async () => {
    setLocalLoading(true);
    setLoading(true);
    try {
      if (nameAddress.length <= 0) {
        swal({
          title: "Digite o nome do local",
          icon: "warning",
        });
        return;
      }

      const responseSaveNewAddress = await api.post("address", {
        address: nameAddress,
        latitude: Number(position.lat),
        longitude: Number(position.lng),
      });

      if (responseSaveNewAddress.status) {
        swal({
          title: "Endereço salvo com sucesso.",
          icon: "success",
        });
        setShowModal(false);
        setNameAddress("");
        setPosition({ lat: 0, lng: 0 });
        getAddress();
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao salvar endereço.",
        icon: "error",
      });
    } finally {
      setLocalLoading(false);
      setLoading(false);
    }
  };

  const handlePositionChange = (key: "lat" | "lng", value: string) => {
    if (/^-?\d*\.?\d*$/.test(value) || value === "") {
      setIsUserEditing(true);
      const newPosition = { ...position, [key]: value };
      setPosition(newPosition);
      
      const lat = parseFloat(newPosition.lat.toString());
      const lng = parseFloat(newPosition.lng.toString());
      
      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0 && map.current && marker.current) {
        map.current.flyTo({ center: [lng, lat], zoom: 15 });
        marker.current.setLngLat([lng, lat]);
      }
    }
  };

  const handleBlur = (key: "lat" | "lng") => {
    setPosition((prev) => ({
      ...prev,
      [key]: prev[key].toString() !== "" ? parseFloat(prev[key].toString()) || 0 : 0,
    }));
  };
  



  useEffect(() => {
    if (!showModal) {
      setNameAddress("");
      setPosition({ lat: 0, lng: 0 });
      setIsUserEditing(false);
      if (map.current) {
        map.current.remove();
        map.current = null;
        marker.current = null;
      }
      return;
    }

    if (!mapboxToken || !mapContainer.current || map.current) {
      return;
    }

    if (latitude && longitude) {
      setPosition({ lat: latitude, lng: longitude });
    }

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [longitude, latitude],
      zoom: 13,
    });

    marker.current = new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map?.current);

    let moveTimeout: NodeJS.Timeout;
    
    map.current.on('move', () => {
      const center = map.current?.getCenter();
      if (center) {
        marker.current?.setLngLat([center.lng, center.lat]);
      }
    });

    map.current.on('moveend', () => {
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        const center = map.current?.getCenter();
        if (center && !isUserEditing) {
          setPosition({ lat: center.lat, lng: center.lng });
        }
        setIsUserEditing(false);
      }, 300);
    });
  }, [mapboxToken, showModal]);

  return (
    <Modal
      title="Cadastro de endereço"
      open={showModal}
      onCancel={() => {
        setShowModal(false);
        setNameAddress("");
      }}
      footer={[
        <Button onClick={() => setShowModal(false)} key={1}>
          Cancelar
        </Button>,
        <Button type="primary" onClick={handleSaveNewAddress} loading={loading} key={2}>
          Salvar
        </Button>,
      ]}
    >
      <Container>
        <ContentInput>
          <LabelText>
            Nome do local (Ex:. Praças, restaurantes, Shoppings etc..)
          </LabelText>
          <Input
            style={{
              width: "100%",
            }}
            value={nameAddress}
            onChange={(event) => setNameAddress(event.target.value)}
          />
        </ContentInput>

        <ContentInput
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ContentInput>
            <LabelText>Latitude</LabelText>
            <Input
              value={position.lat}
              onChange={(e) => handlePositionChange("lat", e.target.value)}
              onBlur={() => handleBlur("lat")}
            />
          </ContentInput>
          <ContentInput>
            <LabelText>Longitude</LabelText>
            <Input
              value={position.lng}
              onChange={(e) => handlePositionChange("lng", e.target.value)}
              onBlur={() => handleBlur("lng")}
            />
          </ContentInput>
        </ContentInput>

        <div ref={mapContainer} style={{ width: "100%", height: 300 }}></div>
      </Container>
    </Modal>
  );
};
