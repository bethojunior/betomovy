import {
  FaDotCircle,
  FaClock,
  FaPlus,
  FaGripLinesVertical,
  FaMinus,
} from "react-icons/fa";
import { Container } from "./styles";
import { TbSquareDotFilled } from "react-icons/tb";
import { IoPerson } from "react-icons/io5";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { AxiosError } from "axios";
import { debounce } from "@mui/material";
import { SelectAsync } from "../SelectAsync";
import { useSliceAnimationStore } from "../../../store/sliceAnimationStore";
import { useRouteStore } from "../../../store/routeStore";
import LoadingBackdrop from "../../LoadingBackdrop";
import { GetPositionByAddress } from "../../../utils/GetPositionByAddress";
import { useCalculateStore } from "../../../store/calculateAllStore";
import api from "../../../api/apiAxios";
import { useTripStore } from "../../../store/tripStore";
import { useAuthStore } from "../../../store/authStore";
import { totem } from "../../../utils/Totem";
import swal from "sweetalert";

export const Search = () => {
  const [waypoints, setWaypoints] = useState<any>([]);
  const [origin, setOrigin] = useState<any>({});
  const [originInput, setOriginInput] = useState("");
  const [destination, setDestination] = useState<any>({});
  const [destinationInput, setDestinationInput] = useState("");
  const [loading, setLoading] = useState(false);

  const recalculateRoute = useRef<any>();

  const { sliceIn } = useSliceAnimationStore();
  const { setRoute, route } = useRouteStore();
  const { setCalculate, clearSearch, setClearSearch } = useCalculateStore();
  const { trip } = useTripStore();
  const { devicePosition } = useAuthStore();

  const addWaypoint = () => {
    if (waypoints.length < 4) {
      setWaypoints([...waypoints, { id: waypoints.length }]);
    }
  };

  const removeWaypoint = (id: number) => {
    setWaypoints((prev: any) => prev.filter((item: any) => item.id !== id));
  };

  const calculateAll = async () => {
    try {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      const timeString = `${hours}:${minutes}:${seconds}`;

      let waypointsFormat = [];

      if (waypoints.length > 0) {
        waypointsFormat = waypoints.map((item: any) => ({
          latitude: Number(item?.value?.value?.latitude),
          longitude: Number(item?.value?.value?.longitude),
        }));
      }

      const payload = {
        cityId: null,
        origin: {
          address: origin.value.address,
          latitude: origin.value.latitude,
          longitude: origin.value.longitude,
        },
        destiny: {
          address: destination.value.address,
          latitude: destination.value.latitude,
          longitude: destination.value.longitude,
        },
        waypoints: waypointsFormat,
        time: null,
        noDestination: false,
        timeCurrent: timeString,
      };

      setLoading(true);
      const result = await api.post("price/calculateAll", payload);
      setLoading(false);

      const { data } = result;
      if (!data.status)
        return swal({
          title: "Erro ao buscar preços",
          icon: "error",
        });
      setCalculate(data?.data);
      sliceIn();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error(axiosError);
      setLoading(false);
    }
  };

  const validatePosition = async () => {
    let newOrigin = origin;
    let newDestination = destination;
    if (origin?.value?.address && !origin?.value?.latitude) {
      newOrigin.value = await GetPositionByAddress(origin?.value?.address);
      setOrigin(newOrigin);
    }
    if (destination?.value?.address && !destination?.value?.latitude) {
      newDestination.value = await GetPositionByAddress(
        destination?.value?.address
      );
      setDestination(newDestination);
    }

    let waypointsFormat = [];

    if (waypoints.length > 0) {
      waypointsFormat = waypoints.map((item: any) => ({
        latitude: Number(item?.value?.value?.latitude),
        longitude: Number(item?.value?.value?.longitude),
      }));
    }

    setRoute({
      origin: {
        address: newOrigin?.value?.address || "",
        lat: newOrigin?.value?.latitude || "",
        lng: newOrigin?.value?.longitude || "",
        type: newOrigin?.value?.type || "",
      },
      destination: {
        address: newDestination?.value?.address || "",
        lat: newDestination?.value?.latitude || "",
        lng: newDestination?.value?.longitude || "",
        type: newDestination?.value?.type || "",
      },
      waypoints: waypointsFormat || [],
    });
  };

  const getUserPlace = async () => {
    try {
      setLoading(true);
      const {
        data: { status, data },
      } = await api.get(
        `geocoding/search?latlng=${devicePosition.latitude},${devicePosition.longitude}`
      );
      setLoading(false);
      if (!status) return;
      setOriginInput(data.address);
      setOrigin({
        label: data.address,
        id: 0,
        value: {
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          type: data.type,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const seconds = 150;
    if (
      recalculateRoute.current &&
      Object.keys(trip).length === 0 &&
      String(route?.origin?.lat).length > 0 &&
      String(route?.destination?.lat).length > 0
    ) {
      const interval = setInterval(() => {
        calculateAll();
      }, 1000 * seconds);

      return () => clearInterval(interval);
    }
    if (Object.keys(trip).length > 0) {
      recalculateRoute.current = false;
    }
  }, [recalculateRoute.current, trip]);

  useEffect(() => {
    validatePosition();
  }, [origin, destination, waypoints]);

  useEffect(() => {
    if (clearSearch) {
      setDestinationInput("");
      setClearSearch(false);
    }
  }, [clearSearch]);

  useEffect(() => {
    getUserPlace();
  }, []);

  return (
    <>
      <LoadingBackdrop loading={loading} />
      <Container>
        <div className="card">
          <span className="title">Solicite uma viagem</span>
          <div className="search-container">
            <div className="input-wrapper">
              <SelectAsync
                value={originInput}
                setValue={setOriginInput}
                placeholder="Origem"
                getSelectedValue={setOrigin}
              />
              <div className="icon-wrapper async">
                <FaDotCircle className="icon" />
              </div>
            </div>
            {waypoints.map((item: any, index: number) => (
              <div key={item.id} className="input-wrapper">
                <SelectAsync
                  placeholder={`Parada ${index + 1}`}
                  getSelectedValue={(value: any) => {
                    const updatedWaypoints = waypoints.map((wp: any) =>
                      wp.id === item.id ? { ...wp, value } : wp
                    );
                    setWaypoints(updatedWaypoints);
                  }}
                />
                <div className="icon-wrapper">
                  <FaGripLinesVertical className="icon" />
                </div>
                <div
                  className="icon-rigth"
                  onClick={() => removeWaypoint(item.id)}
                >
                  <FaMinus className="icon" />
                </div>
              </div>
            ))}
            <div className="input-wrapper">
              <SelectAsync
                value={destinationInput}
                setValue={setDestinationInput}
                placeholder="Destino"
                getSelectedValue={setDestination}
              />
              <div className="icon-wrapper async">
                <TbSquareDotFilled className="icon" />
              </div>
              <div
                className="icon-rigth async"
                style={{ display: waypoints.length === 4 ? "none" : "" }}
                onClick={() => addWaypoint()}
              >
                <FaPlus className="icon" />
              </div>
            </div>
            {!totem ? (
              <>
                <div className="input-wrapper">
                  <select className="input pointer select">
                    <option>Embarcar agora</option>
                    <option>Agendar</option>
                  </select>
                  <div className="icon-wrapper">
                    <FaClock className="icon" />
                  </div>
                  <div className="icon-rigth">
                    <MdOutlineKeyboardArrowDown fontSize={20} />
                  </div>
                </div>
                <div className="input-wrapper">
                  <select className="input-person pointer select">
                    <option>Para mim</option>
                    <option>Para outra pessoa</option>
                  </select>
                  <div className="icon-wrapper">
                    <IoPerson className="icon" />
                  </div>
                  <div className="icon-rigth-person">
                    <MdOutlineKeyboardArrowDown fontSize={20} />
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <button
            className="button pointer"
            onClick={() => {
              calculateAll();
              recalculateRoute.current = true;
            }}
          >
            Pesquisar
          </button>
        </div>
      </Container>
    </>
  );
};
