import { Button, Input, Modal } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import mapboxgl, { Map } from "mapbox-gl";
import swal from "sweetalert";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";

import {
  Container,
  ContentInput,
  LabelInput,
  Footer,
  ContentMap,
  MessageError,
} from "./styles";

import Utils from "../../../../../utils/Utils";
import Session from "../../../../../utils/Session";
import { theme_colors } from "../../../../../theme/theme";
import api from "../../../../../services/api";
import { SelectSearch } from "../../../../SelectSearch";
import { useDebounce } from "../../../../../hooks/useDebounce";
import { InformationsPlacesProps, PlaceProps } from "../ModalAddToll/types";
import apiApp from "../../../../../services/apiApp";
import { useMapbox } from "../../../../../contexts/mapbox";


const schemaForm = yup
  .object({
    name: yup.string().required("Este campo é obrigatório"),
    address: yup.string().required("Este campo é obrigatório"),
    value: yup.number().required("Este campo é obrigatório"),
  })
  .required();

type SchemaFormProps = yup.InferType<typeof schemaForm>;

interface TollPoint {
    lat: number;
    lng: number;
  }
  

  interface Toll {
    id: number;
    name: string;
    address: string;
    value: number;
    active: number;
    cityId: number;
    polygon: TollPoint[];
    created_at: string;
    updated_at: string;
    radius?: number;
  }

interface ModalEditTollProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  getTolls: () => void;
  tollSelected: Toll | null;
}

const { getCenterCoordinates, newGetCircleCoordinates } = Utils;

export const ModalEditToll = ({
  setVisible,
  visible,
  getTolls,
  tollSelected,
}: ModalEditTollProps) => {
  const { control, reset, setValue, handleSubmit, formState: { errors } } = useForm<SchemaFormProps>({
    resolver: yupResolver(schemaForm),
  });

  const [loading, setLoading] = useState<boolean>(false);
  const coordinates = Session.getLocal("pointsCity");
  const cityId = Session.getLocal("citySelected").cityId;
  const lat = getCenterCoordinates(coordinates).lat;
  const lng = getCenterCoordinates(coordinates).lng;
  const [placesOptions, setPlacesOptions] = useState<DefaultOptionsSelectAntdProps[]>([]);
  const [placeSelected, setPlaceSelected] = useState<PlaceProps | null>(null);
  const [loadingPlaces, setLoadingPlace] = useState<boolean>(false);


  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const currentRadius = useRef<number>(30);
  const currentCenter = useRef<{ lat: number; lng: number }>({ lat, lng });
  const [radius, setRadius] = useState<number>(30);
  const { mapboxToken } = useMapbox();



  const getPlaces = async (namePlace: string) => {
    try {
      setLoadingPlace(true);
      const response = await apiApp.get(`Place/Search?q=${namePlace}&latlng=${lat},${lng}`);
      if (response.status) {
        const formatted = response.data.data.map((data: InformationsPlacesProps) => ({
          label: data.address,
          value: JSON.stringify(data),
        }));
        setPlacesOptions(formatted);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPlace(false);
    }
  };
  
  const handleSearchPlace = useDebounce((value: string) => {
    getPlaces(value);
  }, 1000);
  
  const getInformationsPlace = async (address: string) => {
    try {
      const response = await apiApp.get(`Geocoding/search?address=${address}`);
      if (response.status) {
        setPlaceSelected(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    if (placeSelected?.latitude && placeSelected?.longitude) {
      currentCenter.current = {
        lat: placeSelected.latitude,
        lng: placeSelected.longitude,
      };
    }
  }, [placeSelected]);
  
  
  useEffect(() => {
      if (visible && tollSelected) {
          reset({
              name: tollSelected.name,
              address: tollSelected.address,
              value: tollSelected.value ?? 0,
            });
      currentCenter.current = {
        lat: tollSelected.polygon[0].lat,
        lng: tollSelected.polygon[0].lng,
      };
      setRadius(tollSelected.radius ?? 30);
      currentRadius.current = tollSelected.radius ?? 30;
    }
  }, [visible, tollSelected]);

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current || !visible) {
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    const { lat, lng } = currentCenter.current;
    if (isNaN(lat) || isNaN(lng)) {
      console.error('Coordenadas inválidas:', lat, lng);
      return;
    }

    const mapbox = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: 13,
    });

    mapbox.on("load", () => {
      const coordinates = newGetCircleCoordinates([lng, lat], currentRadius.current);

      mapbox.addSource("circle", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [coordinates],
          },
          properties: {},
        },
      });

      mapbox.addLayer({
        id: "circle",
        type: "fill",
        source: "circle",
        paint: {
          "fill-color": theme_colors.primary_antd,
          "fill-opacity": 0.5,
        },
      });

      mapbox.resize();
    });

    map.current = mapbox;
  }, [mapboxToken, visible]);
  

  useEffect(() => {
    if (!visible) {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
  
      reset({
        name: '',
        address: '',
        value: 0,
      });
    }
  }, [visible, reset]);
  

  const onSubmit = async (data: SchemaFormProps) => {
    try {
      setLoading(true);
      const { lat, lng } = currentCenter.current;
  
      const coordinates = newGetCircleCoordinates([lng, lat], currentRadius.current);
  
      if (!coordinates || coordinates.length === 0) {
        throw new Error("Não foi possível gerar o polígono. Verifique o endereço selecionado.");
      }

      const polygonFormatted = coordinates.map((point) => ({
        lat: point[1],
        lng: point[0],
      }));

      const payload = {
        name: data.name,
        address: data.address,
        value: parseFloat(data.value.toString()),
        cityId,
        polygon: polygonFormatted,
        radius: currentRadius.current,
      };
  
      await api.put(`/toll/${tollSelected?.id}`, payload);
  
      swal("Sucesso", "Pedágio atualizado com sucesso!", "success");
      getTolls();
      setVisible(false);
    } catch (error) {
      const responseError = error as AxiosError;
      swal("Erro", responseError.response?.data.message || "Erro ao atualizar pedágio", "error");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    setVisible(false);
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    reset({
      name: '',
      address: '',
      value: 0,
    });
  };
  

  return (
    <Modal
        title="Editar Pedágio"
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={800}
    >
      <Container>
        <ContentInput>
          <LabelInput>Nome</LabelInput>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Nome do pedágio" />}
          />
          {errors.name && <MessageError>{errors.name.message}</MessageError>}
        </ContentInput>

        <ContentInput>
  <LabelInput>Endereço</LabelInput>
  {/* <Controller
    name="address"
    control={control}
    render={({ field }) => (
      <SelectSearch
        {...field}
        width="100%"
        placeholder="Buscar endereço"
        options={placesOptions}
        loading={loadingPlaces}
        onSearch={handleSearchPlace}
        onChange={(value: string) => {
          const place = JSON.parse(value);
          setValue("address", place.address);
          getInformationsPlace(place.address);

          currentCenter.current = {
            lat: place.lat,
            lng: place.lng,
          };
        }}
      />
    )}
  /> */}
  <Controller
    name="address"
    control={control}
    render={({ field }) => (
      <SelectSearch
        width="100%"
        placeholder="Buscar endereço"
        options={placesOptions}
        loading={loadingPlaces}
        onSearch={handleSearchPlace}
        value={field.value ?? ""}
        onChange={(value: string) => {
          const place = JSON.parse(value);

          field.onChange(place.address);
          setValue("address", place.address);

          getInformationsPlace(place.address);

          currentCenter.current = {
            lat: place.lat,
            lng: place.lng,
          };
        }}
      />
    )}
  />

  {errors.address && <MessageError>{errors.address.message}</MessageError>}
</ContentInput>

        <ContentInput>
          <LabelInput>Valor</LabelInput>
          <Controller
            name="value"
            control={control}
            render={({ field }) => 
            <Input {...field} placeholder="Valor" onChange={(e) => field.onChange(e.target.value)} />
        }
          />
          {errors.value && <MessageError>{errors.value.message}</MessageError>}
        </ContentInput>

        <ContentInput>
          <LabelInput>Tamanho do raio da área de cobrança (metros)</LabelInput>
          <Input
            type="number"
            value={radius}
            onChange={(event) => {
              const newRadius = Number(event.target.value);
              setRadius(newRadius);
              currentRadius.current = newRadius;
              if (map.current) {
                const { lat, lng } = currentCenter.current;
                const coordinates = newGetCircleCoordinates([lng, lat], newRadius);
                
                const source = map.current.getSource("circle") as mapboxgl.GeoJSONSource;
                if (source) {
                  source.setData({
                    type: "Feature",
                    geometry: {
                      type: "Polygon",
                      coordinates: [coordinates],
                    },
                    properties: {},
                  });
                }
              }
            }}
            min={10}
            max={5000}
          />
          <small>
            Defina o raio em metros para a área de cobrança do pedágio
          </small>
        </ContentInput>

        <ContentMap>
          <div ref={mapContainer} style={{ width: "100%", height: "250px" }} />
        </ContentMap>

        <Footer>
          <Button onClick={() => setVisible(false)}>Cancelar</Button>
          <Button type="primary" onClick={handleSubmit(onSubmit)} loading={loading}>
            Salvar
          </Button>
        </Footer>
      </Container>
    </Modal>
  );
};