import { useEffect, useState } from "react";
import { DriverTypeCard } from "../DriverTypeCard";
import { Container } from "./styles";
import { useSliceAnimationStore } from "../../../store/sliceAnimationStore";
import { useRouteStore } from "../../../store/routeStore";
import { useCalculateStore } from "../../../store/calculateAllStore";
import { AxiosError } from "axios";
import LoadingBackdrop from "../../LoadingBackdrop";
import { useTripStore } from "../../../store/tripStore";
import { useStorage } from "../../../utils/Storage";
import { usePaymentFormStore } from "../../../store/paymentFormStore";
import swal from "sweetalert";
import api from "../../../api/apiAxios";
import { totem } from "../../../utils/Totem";
import { FormTripModal } from "../FormTripModal";
import { FormDataProps } from "../FormTripModal/types";
import { Button } from "@mui/material";
import { IoArrowBack } from "react-icons/io5";

export const DriverTypeList = () => {
  const [typeSelected, setTypeSelected] = useState<any>();
  const [loading, setLoading] = useState(false);

  const [modalFormVisible, setModalFormVisible] = useState(false);

  const { sliceOut } = useSliceAnimationStore();
  const { calculate, setClearSearch } = useCalculateStore();
  const { route } = useRouteStore();
  const { setTrip } = useTripStore();
  const { setItem, getItem } = useStorage();
  const { paymentForm, setPaymentSelected, paymentSelected } =
    usePaymentFormStore();

  const mountPayload = () => {
    const user = getItem("user");
    const userParse = user ? JSON.parse(user) : null;
    return {
      stdObject: [
        {
          origin: {
            address: route?.origin?.address,
            latitude: route?.origin?.lat,
            longitude: route?.origin?.lng,
            street: "",
            type: route?.origin?.type,
          },
          destination: {
            address: route?.destination?.address,
            latitude: route?.destination?.lat,
            longitude: route?.destination?.lng,
            street: "",
            type: route?.destination?.type,
          },
          userId: userParse?.idUser,
          pixId: null,
          tripTypeId: typeSelected.tripType.idTripType,
          tripPaymentFormId: JSON.parse(paymentSelected).idTripPaymentForm,
          waypoints: route?.waypoints || [],
          tolls: [],
          cardId: null,
          schedule: null,
          scheduleISO: null,
          price: typeSelected.price,
          tripDiscountCoupon: null,
          priceId: typeSelected.idPrice,
          favorites: [],
          multiplierDynamic: 0,
          isFavorite: false,
          isTurbined: false,
          oldPrice: null,
          distance: calculate?.distance,
          estimatedTripTime: calculate.duration,
        },
      ],
    };
  };

  const tripPartnerPayload = (data: FormDataProps) => {
    const user = getItem("user");
    const userParse = user ? JSON.parse(user) : null;
    return {
      destination: {
        address: route?.destination?.address,
        latitude: route?.destination?.lat,
        longitude: route?.destination?.lng,
        street: "",
        type: route?.destination?.type,
      },
      distance: calculate?.distance,
      driverId: null,
      estimatedTripTime: calculate.duration,
      origin: {
        address: route?.origin?.address,
        latitude: route?.origin?.lat,
        longitude: route?.origin?.lng,
        street: "",
        type: route?.origin?.type,
      },
      waypoints: route?.waypoints || [],
      tolls: [],
      cardId: null,
      schedule: null,
      scheduleISO: null,
      price: typeSelected.price,
      priceId: typeSelected.idPrice,
      recalculatedTrip: null,
      tripCustomer: {
        name: data.name,
        phone: data.phone,
        document: data.document,
        email: data.email,
        totem: true,
      },
      tripPaymentFormId: paymentSelected
        ? JSON.parse(paymentSelected).idTripPaymentForm
        : "",
      tripTypeId: typeSelected.tripType.idTripType,
      userId: userParse?.idUser,
      noDestination: false,
      cashback: "",
    };
  };

  const newTrip = async () => {
    try {
      if (!typeSelected) {
        return swal({
          title: "Selecione um tipo de viagem",
          icon: "warning",
        });
      }
      setLoading(true);
      const { data } = await api.post("Customer/NewTrip", mountPayload());
      if (data.message === "Nenhum motorista foi encontrado para essa viagem") {
        return swal({
          title: data.message,
          icon: "warning",
        });
      }

      if (!data.status) throw new Error(JSON.stringify(data));
      setTrip(data.data);
      setItem("trip", JSON.stringify(data.data));
      sliceOut();
    } catch (error) {
      const axiosError = error as AxiosError;
      if (!axiosError?.message.includes("JSON")) {
        return swal({
          title: JSON.parse(axiosError?.message)?.message,
          icon: "warning",
        });
      }
      swal({
        title: axiosError?.message,
        icon: "warning",
      });
    } finally {
      setLoading(false);
    }
  };

  const totemFormModal = () => {
    if (!typeSelected) {
      return swal({
        title: "Selecione um tipo de viagem",
        icon: "warning",
      });
    }
    setModalFormVisible(true);
  };

  const newTripDoorHandle = async (values: FormDataProps) => {
    const payload = tripPartnerPayload(values);
    try {
      setLoading(true);
      const { data } = await api.post("Partner/NewTrip", payload);

      if (
        data.message ===
        "Todos motoristas estão em viagem, aguarde alguns minutos e peça novamente."
      ) {
        return swal({
          title: data.message,
          icon: "warning",
        });
      }

      if (!data.status) throw new Error(JSON.stringify(data));

      setTrip(data.data);
      setItem("trip", JSON.stringify(data.data));
      sliceOut();
      setModalFormVisible(false);
      setClearSearch(true);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (!axiosError?.message.includes("JSON")) {
        return swal({
          title: JSON.parse(axiosError?.message)?.message,
          icon: "warning",
        });
      }
      swal({
        title: axiosError?.message,
        icon: "warning",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackButton = () => {
    sliceOut();
  };

  useEffect(() => {
    if (paymentForm.length > 0) {
      setPaymentSelected(JSON.stringify(paymentForm[0]));
    }
  }, [paymentForm]);

  return (
    <Container>
      <FormTripModal
        visible={modalFormVisible}
        setVisible={setModalFormVisible}
        callback={newTripDoorHandle}
      />
      <LoadingBackdrop loading={loading} />
      <div>
        <Button onClick={handleBackButton}>
          <IoArrowBack size={40} color="black" />
        </Button>
      </div>
      <div className="body">
        <div className="header">
          <span className="title">Escolha uma viagem</span>
          <span className="sub-title">Recomendados</span>
        </div>
        <div className="list scroll">
          {calculate?.prices?.map((item: any) => (
            <DriverTypeCard
              key={item?.idPrice}
              item={item}
              setTypeSelected={setTypeSelected}
              typeSelected={typeSelected}
            />
          ))}
        </div>
        <div className="footer-container">
          <div className="payment">
            <select
              className="select-payment"
              value={paymentSelected}
              onChange={(e) => setPaymentSelected(e.target.value)}
            >
              {paymentForm.map((item: any) => (
                <option
                  key={item.idTripPaymentForm}
                  value={JSON.stringify(item)}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="button pointer"
            onClick={() => (!totem ? newTrip() : totemFormModal())}
          >
            <span className="bolder">SOLICITAR VEÍCULO</span>
          </button>
        </div>
      </div>
    </Container>
  );
};
