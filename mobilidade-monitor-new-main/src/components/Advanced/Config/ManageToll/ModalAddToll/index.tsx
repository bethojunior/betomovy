import { Button, Input, Modal } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import mapboxgl, { Map } from "mapbox-gl";
import swal from "sweetalert";
import { AxiosError } from "axios";

import {
  Container,
  ContentInput,
  LabelInput,
  Footer,
  ContentMap,
  MessageError,
} from "./styles";

import { SelectSearch } from "../../../../SelectSearch";
import apiApp from "../../../../../services/apiApp";
import { useEffect, useRef, useState } from "react";
import { InformationsPlacesProps, PlaceProps } from "./types";
import { useDebounce } from "../../../../../hooks/useDebounce";
import Mask from "../../../../../services/Mask";
import Utils from "../../../../../utils/Utils";

import Session from "../../../../../utils/Session";
import { theme_colors } from "../../../../../theme/theme";
import api from "../../../../../services/api";

import { useMapbox } from "../../../../../contexts/mapbox";

const schemaForm = yup
  .object({
    name: yup.string().required("Este campo é obrigatório"),
    address: yup.string().required("Este campo é obrigatório"),
    value: yup.string().required("Este campo é obrigatório"),
  })
  .required();

type SchemaFormProps = yup.InferType<typeof schemaForm>;

interface ModalAddTollProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  getTolls: () => void;
}

const { getCenterCoordinates, getCircleCoordinates } = Utils;
const { setMaskMoney, setRemoveMaskMoney } = Mask;

export const ModalAddToll = ({
  setVisible,
  visible,
  getTolls,
}: ModalAddTollProps) => {
  const { control, resetField, setValue, handleSubmit } =
    useForm<SchemaFormProps>({
      resolver: yupResolver(schemaForm),
    });

  const [placesOptions, setPlacesOptions] = useState<
    DefaultOptionsSelectAntdProps[]
  >([]);
  const [placeSelected, setPlaceSelected] = useState<PlaceProps | null>(null);
  const [loadingPlaces, setLoadingPlace] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const coordinates = Session.getLocal("pointsCity");
  const cityId = Session.getLocal("citySelected")?.cityId;
  const lat = getCenterCoordinates(coordinates).lat;
  const lng = getCenterCoordinates(coordinates).lng;

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const currentRadius = useRef<number>(30);
  const currentCenter = useRef<{ lat: number; lng: number }>({ lat, lng });
  const [radius, setRadius] = useState<number>(30);

  const handleCloseModal = () => {
    setVisible(false);
    resetField("address");
    resetField("name");
    resetField("value");
  };

  const getPlaces = async (namePlace: string) => {
    try {
      setLoadingPlace(true);

      const responseSearchCity = await apiApp.get(
        `Place/Search?q=${namePlace}&latlng=${lat},${lng}`
      );

      if (responseSearchCity.status) {
        const placesFormated = responseSearchCity.data.data.map(
          (data: InformationsPlacesProps) => {
            return {
              label: data.address,
              value: JSON.stringify(data),
            };
          }
        );

        setPlacesOptions(placesFormated);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.message,
        icon: "error",
      });
      console.error(error);
    } finally {
      setLoadingPlace(false);
    }
  };

  const handleSearchCity = useDebounce((value) => {
    getPlaces(value);
  }, 1000);

  const getInformationsPlace = async (namePlace: string) => {
    try {
      setLoadingPlace(true);
      const responseInformations = await apiApp.get(
        `Geocoding/search?address=${namePlace}`
      );

      if (responseInformations.status) {
        setPlaceSelected(responseInformations.data.data);
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.message,
        icon: "error",
      });
      console.error(error);
    } finally {
      setLoadingPlace(false);
    }
  };

  const handleChange = (value: string) => {
    const data: { address: string; type: string } = JSON.parse(value);
    getInformationsPlace(data.address);
    setValue("address", data.address);
  };

  const handleSaveToll = async (data: SchemaFormProps) => {
    const longitude = currentCenter.current?.lng;
    const latitude = currentCenter.current?.lat;
    const polygon = getCircleCoordinates(
      [longitude, latitude],
      currentRadius.current
    );

    try {
      setLoading(true);
      const responseSaveToll = await api.post("toll", {
        address: data.address,
        cityId,
        name: data.name,
        value: setRemoveMaskMoney(data.value),
        polygon,
        radius: currentRadius.current,
      });

      if (responseSaveToll.status) {
        swal({
          title: "Sucesso",
          text: "Pedágio cadastrado com sucesso",
          icon: "success",
        });
        handleCloseModal();
        getTolls();
      }
    } catch (error) {
      const responseError = error as AxiosError;
      swal({
        title: "Error",
        text: responseError.response?.data.message,
        icon: "error",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const { mapboxToken } = useMapbox();

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) {
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: 9,
    });

    const canvas = map.current.getCanvasContainer();

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

    function onMove(e: any) {
      const coords = e.lngLat;
      canvas.style.cursor = "grabbing";
      jsonToll.features[0].geometry.coordinates = [coords.lng, coords.lat];
      currentCenter.current = { lat: coords.lat, lng: coords.lng };
      // @ts-ignore
      map.current?.getSource("toll-source").setData(jsonToll);
    }

    function onUp() {
      canvas.style.cursor = "";
      map.current?.off("mousemove", onMove);
      map.current?.off("touchmove", onMove);
    }

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
          "circle-radius": currentRadius.current / 10,
          "circle-color": theme_colors.red_crismon,
          "circle-opacity": 0.5,
          "circle-stroke-width": 2,
          "circle-stroke-color": theme_colors.red_crismon,
        },
      });

      map.current?.on("mouseenter", "toll-area", (_: any) => {
        canvas.style.cursor = "move";
      });

      map.current?.on("mouseleave", "toll-area", (_: any) => {
        canvas.style.cursor = "";
      });

      map.current?.on("mousedown", "toll-area", (e) => {
        e.preventDefault();
        canvas.style.cursor = "grab";
        map.current?.on("mousemove", onMove);
        map.current?.once("mouseup", onUp);
      });

      map.current?.on("touchstart", "toll-area", (e) => {
        if (e.points.length !== 1) return;
        e.preventDefault();
        map.current?.on("touchmove", onMove);
        map.current?.once("touchend", onUp);
      });
    });
  }, [mapboxToken, visible]);

  useEffect(() => {
    if (placeSelected && map.current) {
      map.current.flyTo({
        center: [placeSelected.longitude, placeSelected.latitude],
      });

      currentCenter.current = {
        lat: placeSelected.latitude,
        lng: placeSelected.longitude,
      };

      const jsonToll = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [placeSelected.longitude, placeSelected.latitude],
            },
          },
        ],
      };

      // @ts-ignore
      map.current.getSource("toll-source").setData(jsonToll);
    }
  }, [placeSelected]);

  return (
    <Modal
      title="Adicionar Pedágio"
      open={visible}
      onCancel={handleCloseModal}
      footer={[]}
    >
      <Container onSubmit={handleSubmit(handleSaveToll)}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <ContentInput>
              <LabelInput>Nome</LabelInput>
              <Input
                onChange={onChange}
                value={value}
                status={Boolean(error) ? "error" : ""}
              />
              {error && <MessageError>{error.message}</MessageError>}
            </ContentInput>
          )}
        />

        <Controller
          control={control}
          name="address"
          render={({ field: { value }, fieldState: { error } }) => (
            <ContentInput>
              <LabelInput>Endereço</LabelInput>
              <SelectSearch
                width="100%"
                onChange={handleChange}
                onSearch={handleSearchCity}
                options={placesOptions}
                placeholder="Selecione o endereço"
                loading={loadingPlaces}
                value={value ?? ""}
                error={Boolean(error)}
              />

              {error && <MessageError>{error.message}</MessageError>}
            </ContentInput>
          )}
        />

        <Controller
          control={control}
          name="value"
          render={({ field: { value }, fieldState: { error } }) => (
            <ContentInput>
              <LabelInput>Valor</LabelInput>
              <Input
                onChange={(event) =>
                  setValue("value", setMaskMoney(event.target.value))
                }
                status={Boolean(error) ? "error" : ""}
                value={value}
              />
              {error && <MessageError>{error.message}</MessageError>}
              <small>
                Verifique o valor cobrado para apenas inda ou inda e volta
              </small>
            </ContentInput>
          )}
        />

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
                map.current.setPaintProperty(
                  "toll-area",
                  "circle-radius",
                  newRadius / 10
                );
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
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Adicionar
          </Button>
        </Footer>
      </Container>
    </Modal>
  );
};
