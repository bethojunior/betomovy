import React, { useContext, createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiDelivery from "../../api/apiDelivery";

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
  setOrderDeliveryType: () => {}
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

  useEffect(() => {
    async function getData() {
      const bagStorage = await AsyncStorage.getItem("bagCache");
      const establishmentStorage = await AsyncStorage.getItem(
        "establishmentCache"
      );

      if (bagStorage) setBag(JSON.parse(bagStorage));

      if (establishmentStorage)
        setEstablishment(JSON.parse(establishmentStorage));
    }

    getData();
    updateListOrdersActive();
  }, []);

  async function updateListOrdersActive() {
    if (!apiDelivery.defaults.headers.common["token"]) return;
    const {
      data: { response, status },
    } = await apiDelivery.get("delivery/order/actives/customer");
    if (status) setOrdersActive(response);
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
        if (group.id != id) return group;

        return { id, item, amount, complements, observation };
      }),
    ]);
  }

  function removeItem(id) {
    const newBag = bag.filter((product) => {
      return product.id != id;
    });

    if (newBag.length == 0) setEstablishment(null);

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
        setOrderDeliveryType
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
