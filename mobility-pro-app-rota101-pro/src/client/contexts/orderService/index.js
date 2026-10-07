import { useContext, createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiDelivery from "../../api/apiDelivery";
import { loadSession } from "~/utils/Storage/sessionStorage";

const OrderServiceContext = createContext({
  bag: [],
  indexSelected: 0,
  ordersActive: [],
  visible: false,
  establishment: null,
  paymentForm: null,
  deliveryPrice: null,
  deliveryRateId: null,
  coupon: null,
  change: null,
  card: null,
  loadingRate: false,
  orderDeliveryType:1,
  addItem: () => {},
  setVisibleBag: () => {},
  clearBag: () => {},
  addEstablishment: () => {},
  editItem: () => {},
  removeItem: (id) => {},
  selectedPaymentForm: () => {},
  setDeliveryPrice: () => {},
  setDeliveryRateId: () => {},
  clearOrder: () => {},
  updateListOrdersActive: () => {},
  changeIndexSelectRequest: () => {},
  setCoupon: () => {},
  setChange: () => {},
  setCard: () => {},
  setLoadingRate: () => {},
  setOrderDeliveryType: () => {},
  setEstablishment: null,
  setBag: [],
});

export const OrderServiceProvider = ({ children }) => {
  const [indexSelected, setIndexSelected] = useState(0);
  const [establishment, setEstablishment] = useState(null);
  const [bag, setBag] = useState([]);
  const [visible, setVisible] = useState(false);
  const [paymentForm, setPaymentForm] = useState(null);
  const [ordersActive, setOrdersActive] = useState([]);
  const [deliveryPrice, setDeliveryPrice] = useState(null);
  const [deliveryRateId, setDeliveryRateId] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const [change, setChange] = useState(null);
  const [card, setCard] = useState(null);
  const [loadingRate, setLoadingRate] = useState(false);
  const [orderDeliveryType, setOrderDeliveryType] = useState(1);

  async function updateListOrdersActive() {
    try {
      const session = await loadSession();
      if (!session?.token) return;

      const {
        data: { response, status },
      } = await apiDelivery.get("delivery/order/actives/customer");
      if (status) setOrdersActive(response);
    } catch (error) {
      const isNetworkError = 
        error?.message === "Network Error" ||
        error?.code === "NETWORK_ERROR" ||
        error?.message?.includes("Network request failed") ||
        error?.message?.includes("timeout") ||
        !error?.response;
      if (!isNetworkError) {
        console.error("Error updateListOrdersActive", error?.message || error);
      }
    }
  }

  function addItem(item, amount, complements, observation) {
    const id = new Date().getTime();
    AsyncStorage.setItem(
      "bagCache",
      JSON.stringify([...bag, { id, item, amount, complements, observation }])
    );
    setBag([...bag, { id, item, amount, complements, observation }]);
  }

  function addEstablishment(establishment) {
    AsyncStorage.setItem("establishmentCache", JSON.stringify(establishment));
    setEstablishment(establishment);
  }

  function clearOrder() {
    setEstablishment(null);
    setBag([]);
    setPaymentForm(null);
    setCoupon(null);
    setChange(null);
    AsyncStorage.removeItem("bagCache");
    AsyncStorage.removeItem("establishmentCache");
  }

  function clearBag(newItem, establishment) {
    setEstablishment(establishment);
    setBag([newItem]);
    setPaymentForm(null);
    setCoupon(null);
    setChange(null);
    AsyncStorage.removeItem("bagCache");
    AsyncStorage.removeItem("establishmentCache");
  }

  function selectedPaymentForm(payment) {
    setPaymentForm(payment);
  }

  function setVisibleBag(status) {
    setVisible(status);
  }

  function editItem(id, item, amount, complements, observation) {
    setBag([
      ...bag.map((group) => {
        if (group.id !== id) return group;

        return { id, item, amount, complements, observation };
      }),
    ]);
  }

  function removeItem(id) {
    const newBag = bag.filter((product) => {
      return product.id !== id;
    });

    if (newBag.length === 0) {
      setEstablishment(null);
      AsyncStorage.removeItem("bagCache");
      AsyncStorage.removeItem("establishmentCache");
    } else {
      AsyncStorage.setItem("bagCache", JSON.stringify(newBag));
    }

    setBag([...newBag]);
  }

  function changeIndexSelectRequest(index) {
    setIndexSelected(index);
  }

  return (
    <OrderServiceContext.Provider
      value={{
        bag,
        visible,
        establishment,
        paymentForm,
        ordersActive,
        indexSelected,
        deliveryPrice,
        coupon,
        change,
        card,
        loadingRate,
        deliveryRateId,
        orderDeliveryType,
        addItem,
        setVisibleBag,
        clearBag,
        addEstablishment,
        selectedPaymentForm,
        editItem,
        removeItem,
        clearOrder,
        updateListOrdersActive,
        changeIndexSelectRequest,
        setDeliveryPrice,
        setCoupon,
        setChange,
        setCard,
        setLoadingRate,
        setDeliveryRateId,
        setOrderDeliveryType,
        setEstablishment,
        setBag
      }}
    >
      {children}
    </OrderServiceContext.Provider>
  );
};

export const useOrderService = () => {
  const context = useContext(OrderServiceContext);

  return context;
};
