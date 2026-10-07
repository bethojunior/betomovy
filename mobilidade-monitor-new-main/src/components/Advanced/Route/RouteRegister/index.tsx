import { FC, useEffect, useState, useCallback, useRef } from "react";
import { Form, Input, Button, Select, Switch, Modal } from "antd";
import swal from "sweetalert";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import {
  Container,
  LeftSection,
  RightSection,
  MapContainer,
  FormItem,
  LocationIcon,
  ObjectInputContainer,
  EstimatedTimeContainer,
  AcceptCustomerStopsContainer,
  Separator,
} from "./styles";
import api from "../../../../services/api";
import apiApp from "../../../../services/apiApp";
import Preload from "../../../../components/Utils/Preload";
import Alert from "../../../../components/Utils/Alert";
import MapService from "../../../../services/MapService";
import mapboxgl, { Map as MapboxMap, Marker, AnyLayer } from "mapbox-gl";
import { PitStopType, TripType } from "./types";
import Mask from "../../../../services/Mask";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useMapbox } from "../../../../contexts/mapbox";

const RouteRegister: FC = () => {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert] = useState("");
  const [typeAlert] = useState<"success" | "info" | "warning" | "error">(
    "success"
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [pitStopTypes, setPitStopTypes] = useState<PitStopType[]>([]);
  const [tripTypes, setTripTypes] = useState<TripType[]>([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [acceptCustomerStops, setAcceptCustomerStops] = useState(false);
  const [defaultLayout, setDefaultLayout] = useState("");
  const [originLocalName, setOriginLocalName] = useState("");
  const [destinationLocalName, setDestinationLocalName] = useState("");
  const [originReference, setOriginReference] = useState("");
  const [destinationReference, setDestinationReference] = useState("");
  const history = useHistory();
  const [estimatedDistance, setEstimatedDistance] = useState<number | null>(
    null
  );
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [originCoords, setOriginCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [modalType, setModalType] = useState<"origin" | "destination" | null>(
    null
  );
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const originMarkerRef = useRef<Marker | null>(null);
  const destinationMarkerRef = useRef<Marker | null>(null);
  const [tripItemTypes, setTripItemTypes] = useState<any[]>([]);
  const [objects, setObjects] = useState<{ name: string; id: number }[]>([]);
  const [objectValues, setObjectValues] = useState<{ [key: number]: string }>(
    {}
  );
  const [selectedObject, setSelectedObject] = useState<number | undefined>(
    undefined
  );
  const { mapboxToken } = useMapbox();

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [pitStopTypesResponse, tripTypesResponse] = await Promise.all([
        api.get("/routePitStopType"),
        api.get("/tripType"),
      ]);

      setPitStopTypes(pitStopTypesResponse.data.response);
      setTripTypes(tripTypesResponse.data.response);
    } catch (error) {
      console.error(error);
      swal("Erro", "Não foi possível carregar os dados iniciais", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTripItemTypes = async () => {
    setLoading(true);
    try {
      const result = await api.get("/deliveryInfoSuggestion");
      setTripItemTypes(result.data.response.tripItemType);
      if (result.data.response.tripItemType.length > 0) {
        setSelectedObject(result.data.response.tripItemType[0].id);
      }
    } catch (error) {
      console.error("Erro ao buscar tipos de itens de viagem:", error);
      swal(
        "Erro",
        "Não foi possível carregar os tipos de itens de viagem",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
    fetchTripItemTypes();
  }, [fetchInitialData]);

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || mapRef.current) {
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-34.50262, -4.34345],
      zoom: 13,
    });
  }, [mapboxToken]);

  const handleAddPitStop = (type: "origin" | "destination" | null) => {
    setModalType(type);
    setModalVisible(true);
    if (type) {
      modalForm.setFieldsValue({
        type:
          type === "origin"
            ? pitStopTypes.find((p) => p.name === "EMBARQUE")?.id
            : pitStopTypes.find((p) => p.name === "DESEMBARQUE")?.id,
        localName: type === "origin" ? originLocalName : destinationLocalName,
        reference: type === "origin" ? originReference : destinationReference,
        address: type === "origin" ? origin : destination,
      });
    }
  };

  const handleCalculateRoute = useCallback(async () => {
    if (!originCoords || !destinationCoords) {
      swal(
        "Erro",
        "Por favor, preencha os campos de origem e destino",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await apiApp.get(
        `/direction/search?origin=${originCoords.lat},${originCoords.lng}&destination=${destinationCoords.lat},${destinationCoords.lng}`
      );
      const routeData = response.data.data;

      if (
        routeData &&
        routeData.overview_polyline &&
        routeData.overview_polyline.points
      ) {
        const decodedPoints = MapService.decodePolyline(
          routeData.overview_polyline.points
        );

        const routeLayer: AnyLayer = {
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: decodedPoints.map((point: any) => [
                  point.lng,
                  point.lat,
                ]),
              },
            },
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#001529",
            "line-width": 2,
          },
        };

        if (mapRef.current) {
          if (mapRef.current.getLayer("route")) {
            mapRef.current.removeLayer("route");
            mapRef.current.removeSource("route");
          }

          mapRef.current.addLayer(routeLayer);

          const bounds = new mapboxgl.LngLatBounds();
          decodedPoints.forEach((point) =>
            bounds.extend([point.lng, point.lat])
          );
          mapRef.current.fitBounds(bounds, { padding: 50 });

          const durationInMinutes = Math.round(routeData.duration / 60);
          form.setFieldsValue({
            estimatedTime: `${durationInMinutes} minutos`,
          });
          setEstimatedTime(routeData.duration);
          setEstimatedDistance(routeData.distance);
          setDefaultLayout(routeData.overview_polyline.points);
        }
      } else {
        console.error("Polyline data is missing");
      }
    } catch (error) {
      console.error(error);
      swal("Erro", "Não foi possível calcular a rota", "error");
    } finally {
      setLoading(false);
    }
  }, [originCoords, destinationCoords, form]);

  const handleSavePitStop = async () => {
    try {
      const values = await modalForm.validateFields();
      const geoResponse = await apiApp.get(
        `/Geocoding/search?address=${encodeURIComponent(values.address)}`
      );
      if (geoResponse.data && geoResponse.data.data) {
        const addressData = geoResponse.data.data;

        const selectedType = pitStopTypes.find(
          (type) => type.id === values.type
        );

        if (selectedType?.name === "EMBARQUE") {
          setOrigin(addressData.address);
          setOriginLocalName(values.localName);
          setOriginReference(values.reference);
          setOriginCoords({
            lat: addressData.latitude,
            lng: addressData.longitude,
          });
          form.setFieldsValue({ origin: addressData.address });
        } else if (selectedType?.name === "DESEMBARQUE") {
          setDestination(addressData.address);
          setDestinationLocalName(values.localName);
          setDestinationReference(values.reference);
          setDestinationCoords({
            lat: addressData.latitude,
            lng: addressData.longitude,
          });
          form.setFieldsValue({ destination: addressData.address });
        }

        setModalVisible(false);
        modalForm.resetFields();
      } else {
        throw new Error("Detalhes do endereço não encontrados");
      }
    } catch (error) {
      console.error(error);
      modalForm.setFields([
        {
          name: "address",
          errors: ["Não foi possível buscar os detalhes do endereço"],
        },
      ]);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    modalForm.resetFields();
  };

  useEffect(() => {
    if (origin.length > 0 && destination.length > 0) {
      if (originCoords) {
        addMarker(originCoords.lat, originCoords.lng, "origin");
      }
      if (destinationCoords) {
        addMarker(destinationCoords.lat, destinationCoords.lng, "destination");
      }
      handleCalculateRoute();
    }
  }, [
    origin,
    destination,
    originCoords,
    destinationCoords,
    handleCalculateRoute,
  ]);

  const addMarker = (
    lat: number,
    lng: number,
    type: "origin" | "destination"
  ) => {
    const el = document.createElement("div");
    el.style.width = "32px";
    el.style.height = "32px";
    el.style.backgroundImage =
      type === "origin"
        ? 'url("https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png")'
        : 'url("https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png")';
    el.style.backgroundSize = "100%";

    const marker = new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .addTo(mapRef.current!);

    if (type === "origin") {
      if (originMarkerRef.current) {
        originMarkerRef.current.remove();
      }
      originMarkerRef.current = marker;
    } else if (type === "destination") {
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.remove();
      }
      destinationMarkerRef.current = marker;
    }
  };

  const fetchCoordinates = async (address: string) => {
    try {
      const response = await apiApp.get(
        `/Geocoding/search?address=${encodeURIComponent(address)}`
      );
      if (response.data && response.data.data) {
        return {
          lat: response.data.data.latitude,
          lng: response.data.data.longitude,
        };
      } else {
        throw new Error("Erro ao buscar coordenadas");
      }
    } catch (error) {
      console.error("Erro ao buscar coordenadas:", error);
      throw error;
    }
  };

  const fetchAddresses = async (query: string, lat: number, lng: number) => {
    setLoading(true);
    try {
      const response = await apiApp.get(
        `/Place/Search?q=${encodeURIComponent(query)}&latlng=${lat},${lng}`
      );
      if (response.data.status) {
        setSearchResults(response.data.data);
      } else {
        throw new Error("Erro na resposta da API");
      }
    } catch (error) {
      console.error(error);
      modalForm.setFields([
        {
          name: "address",
          errors: ["Não foi possível buscar os detalhes do endereço"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (value.length >= 3) {
      const timeout = setTimeout(async () => {
        try {
          const { lat, lng } = await fetchCoordinates(value);
          await fetchAddresses(value, lat, lng);
        } catch (error) {
          console.error("Erro ao buscar endereços:", error);
        }
      }, 1500);
      setSearchTimeout(timeout);
    }
  };

  const handleAddObject = () => {
    if (selectedObject !== undefined) {
      const object = tripItemTypes.find((item) => item.id === selectedObject);
      if (object) {
        setObjects([...objects, object]);
        setObjectValues({
          ...objectValues,
          [object.id]: "0,00",
        });
      }
    }
  };

  const handleObjectChange = (value: number) => {
    setSelectedObject(value);
  };

  const handleValueChange = (index: number, value: string) => {
    const newObjectValues = {
      ...objectValues,
      [index]: Mask.setMaskMoney(value || "0,00"),
    };
    setObjectValues(newObjectValues);
  };

  useEffect(() => {
    form.setFieldsValue({ price: "0,00" });
  }, [form]);

  const handleRemoveObject = (index: number) => {
    const newObjects = objects.filter((_, i) => i !== index);
    setObjects(newObjects);
    const newObjectValues = { ...objectValues };
    delete newObjectValues[index];
    setObjectValues(newObjectValues);
  };

  useEffect(() => {
    modalForm.setFieldsValue({ origin });
  }, [origin, modalForm]);

  useEffect(() => {
    modalForm.setFieldsValue({ destination });
  }, [destination, modalForm]);

  const handleSaveRoute = async () => {
    try {
      const values = await form.validateFields();
      const price = parseFloat(
        values.price.replace(/\./g, "").replace(",", ".")
      ).toFixed(2);
      const payload = {
        name: values.routeName,
        allowCustomerStops: acceptCustomerStops,
        defaultLayout: defaultLayout,
        origin: {
          tag: originLocalName,
          complement: originReference,
          latitude: originCoords?.lat,
          longitude: originCoords?.lng,
          address: origin,
        },
        destination: {
          tag: destinationLocalName,
          complement: destinationReference,
          latitude: destinationCoords?.lat,
          longitude: destinationCoords?.lng,
          address: destination,
        },
        estimatedDistance: estimatedDistance,
        estimatedTime: estimatedTime,
        price: price,
        routeTripItemType: objects.map((object) => ({
          tripItemTypeId: object.id,
          value: objectValues[object.id]
            ? parseFloat(
                objectValues[object.id].replace(/\./g, "").replace(",", ".")
              )
            : 0,
        })),
        tripTypeId: values.tripType,
        routeWayPoints: [],
      };

      const response = await api.post("/route", payload);
      if (response.data.status) {
        swal("Sucesso", "Rota criada com sucesso", "success");
        form.resetFields();
        history.push("/route/routeList");
      } else {
        throw new Error(response.data.message || "Erro ao criar rota");
      }
    } catch (error) {
      console.error("Erro ao salvar a rota:", error);
      let errorMessage = "Não foi possível salvar a rota";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.response.join(", ");
      }

      swal("Erro", errorMessage, "error");
    }
  };

  const modalFormContent = (
    <Form form={modalForm} layout="vertical">
      <FormItem
        name="localName"
        label="Nome do local"
        rules={[
          { required: true, message: "Por favor, insira o nome do local" },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem
        name="reference"
        label="Referência"
        rules={[{ required: true, message: "Por favor, insira a referência" }]}
      >
        <Input />
      </FormItem>
      <FormItem
        name="type"
        label="Tipo"
        rules={[{ required: true, message: "Por favor, selecione o tipo" }]}
      >
        <Select>
          {pitStopTypes.map((type) => (
            <Select.Option key={type.id} value={type.id}>
              {type.name}
            </Select.Option>
          ))}
        </Select>
      </FormItem>
      <FormItem
        name="address"
        label="Endereço"
        rules={[{ required: true, message: "Por favor, insira o endereço" }]}
      >
        <Input
          value={selectedAddress || searchTerm}
          onChange={handleSearchChange}
        />
      </FormItem>
      {searchResults.length > 0 && (
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            border: "1px solid #d9d9d9",
            borderRadius: "4px",
            maxHeight: "150px",
            overflowY: "auto",
          }}
        >
          {searchResults.map((result, index) => (
            <li
              key={index}
              style={{
                padding: "8px",
                borderBottom: "1px solid #d9d9d9",
                cursor: "pointer",
              }}
              onClick={() => {
                setSelectedAddress(result.address);
                modalForm.setFieldsValue({ address: result.address });
                setSearchResults([]);
              }}
            >
              {result.address}
            </li>
          ))}
        </ul>
      )}
    </Form>
  );

  return (
    <Container>
      <Preload visible={loading} />
      <Alert
        visibility={showAlert}
        message={messageAlert}
        typeAlert={typeAlert}
        setVisibility={setShowAlert}
      />
      <LeftSection>
        <h2>
          <b>Rotas</b>
        </h2>
        <Form layout="vertical" form={form}>
          <FormItem
            name="routeName"
            label="Nome da rota"
            rules={[
              { required: true, message: "Por favor, insira o nome da rota" },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem
            name="origin"
            label="Nome da origem"
            rules={[
              { required: true, message: "Por favor, insira o nome da origem" },
            ]}
          >
            <div onClick={() => handleAddPitStop("origin")}>
              <Input
                value={origin}
                readOnly
                style={{ backgroundColor: "#e6f7ff", cursor: "pointer" }}
                addonAfter={<LocationIcon />}
              />
            </div>
          </FormItem>
          <FormItem
            name="destination"
            label="Nome do destino"
            rules={[
              {
                required: true,
                message: "Por favor, insira o nome do destino",
              },
            ]}
          >
            <div onClick={() => handleAddPitStop("destination")}>
              <Input
                value={destination}
                readOnly
                style={{ backgroundColor: "#e6f7ff", cursor: "pointer" }}
                addonAfter={<LocationIcon />}
              />
            </div>
          </FormItem>
          <Button type="primary" onClick={() => handleAddPitStop(null)}>
            Adicionar Ponto
          </Button>
          <Separator />
          <FormItem name="acceptCustomerStops" valuePropName="checked">
            <AcceptCustomerStopsContainer>
              <Switch
                checked={acceptCustomerStops}
                onChange={setAcceptCustomerStops}
              />
              <span>Aceitar parada do cliente</span>
            </AcceptCustomerStopsContainer>
            <Separator />
          </FormItem>
          <FormItem
            name="tripType"
            label="Tipo de chamado"
            rules={[
              {
                required: true,
                message: "Por favor, selecione o tipo de chamado",
              },
            ]}
          >
            <Select>
              {tripTypes.map((type) => (
                <Select.Option key={type.idTripType} value={type.idTripType}>
                  {type.type}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
          <Separator />
          <h2>
            <b>Preços</b>
          </h2>
          <FormItem
            name="price"
            label="Por pessoa"
            initialValue="0,00"
            rules={[{ required: true, message: "Por favor, insira o preço" }]}
          >
            <Input
              placeholder="0,00"
              value={form.getFieldValue("price")}
              onChange={(e) =>
                form.setFieldsValue({
                  price: Mask.setMaskMoney(e.target.value || "0,00"),
                })
              }
            />
          </FormItem>
          <FormItem name="objects" label="Objetos">
            <ObjectInputContainer>
              <Select
                onChange={handleObjectChange}
                value={selectedObject}
                style={{ flex: 1 }}
              >
                {tripItemTypes.map((object) => (
                  <Select.Option key={object.id} value={object.id}>
                    {object.name}
                  </Select.Option>
                ))}
              </Select>
              <Button icon={<AiOutlinePlus />} onClick={handleAddObject} />
            </ObjectInputContainer>
            {objects.map((object, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center", marginTop: 8 }}
              >
                <Input
                  value={object.name}
                  readOnly
                  style={{ marginRight: 8 }}
                />
                <Input
                  value={objectValues[object.id] || ""}
                  onChange={(e) => handleValueChange(object.id, e.target.value)}
                  placeholder="0,00"
                  style={{ width: 90, marginRight: 16 }}
                />
                <Button
                  icon={<AiOutlineDelete />}
                  onClick={() => handleRemoveObject(index)}
                />
              </div>
            ))}
          </FormItem>
          <Button type="primary" onClick={handleSaveRoute}>
            SALVAR
          </Button>
        </Form>
      </LeftSection>
      <RightSection>
        <MapContainer ref={mapContainer} />
        <Separator />
        <EstimatedTimeContainer>
          <Form form={form} layout="inline">
            <FormItem name="estimatedTime" label="Tempo estimado">
              <Input readOnly />
            </FormItem>
            <Button
              type="primary"
              onClick={handleCalculateRoute}
              loading={loading}
            >
              Calcular Rota
            </Button>
          </Form>
        </EstimatedTimeContainer>
      </RightSection>
      <Modal
        title={
          modalType === "origin"
            ? "Cadastrar endereço de origem"
            : modalType === "destination"
            ? "Cadastrar endereço de destino"
            : "Cadastrar endereço"
        }
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            Cancelar
          </Button>,
          <Button key="save" type="primary" onClick={handleSavePitStop}>
            Salvar
          </Button>,
        ]}
      >
        {modalFormContent}
      </Modal>
    </Container>
  );
};

export default RouteRegister;
