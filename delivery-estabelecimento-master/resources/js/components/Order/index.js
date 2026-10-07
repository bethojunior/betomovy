import React, {useState, useEffect, useRef} from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import OrderDetail from "../OrderDetail";
import api from "../../api";
import AppSocket from "../../services/socket";
import {waiting_confirmation} from "../../constants";
import {IoIosArrowBack} from "react-icons/io";
import OrderChat from "../OrderChat";
import notifyMe from "../../services/notification";
import {requestFirebaseNotificationPermission} from "../../services/firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarStatusCompany from "../NavbarStatusCompany";
import {NotificationNewOrder} from "../../vanilla/NotificationNewOrder";

let socket = null;

export default function Order() {
    const [orders, setOrders] = useState([]);
    const [orderSelected, setOrderSelected] = useState(null);
    const [orderConfig, setOrderConfig] = useState(null);

    useEffect(() => {
        async function loadOrders() {
            NotificationNewOrder(false);
            try {
                const {
                    data: {response}
                } = await api.get("deliveryOrders");
                setOrders(response);
            } catch (error) {
                console.log(error);
            }
        }

        function openSocket() {
            socket = new AppSocket();

            socket.onEvent(
                `companyOrders_${
                    document.querySelector("#header-company-id").value
                }`,
                order => {
                    notifyMe(order.delivery_order_status.label);
                    loadOrders();
                }
            );
        }

        async function getOrderConfig() {
            const {
                data: {response}
            } = await api.get(
                `company/${
                    document.querySelector("#header-company-id").value
                }/deliveryOrderConfig`
            );

            setOrderConfig(response);
        }

        openSocket();
        loadOrders();
        getOrderConfig();

        return () => {
            if (socket) socket.close();
        };
    }, []);

    return (
        <>
            <NavbarStatusCompany/>
            <div className="flex-fill container-order">
                <div>
                    <h4>Entregas</h4>
                    <ul>
                        {orders.map(order => {
                            let active = false;

                            if (orderSelected) {
                                active = orderSelected.id === order.id;
                            }

                            return (
                                <ItemListOrder
                                    active={active}
                                    onSelected={order => {
                                        setOrderSelected(order);
                                    }}
                                    key={order.id}
                                    order={order}
                                />
                            );
                        })}
                    </ul>
                    <OrderChat orders={orders}/>
                </div>
                <div className={orderSelected ? "active" : ""}>
                    <nav>
                        <IoIosArrowBack
                            onClick={() => {
                                setOrderSelected(null);
                            }}
                        />
                    </nav>
                    <OrderDetail order={orderSelected} config={orderConfig}/>
                </div>
            </div>
        </>
    );
}

function ItemListOrder({active, order, onSelected}) {
    const audio = useRef(null);
    const elementContainer = useRef(null);
    const [isWaitingConfirmation, setIsWaitingConfirmation] = useState(false);

    useEffect(() => {
        if (active) {
            elementContainer.current.classList.add("active");
        } else {
            elementContainer.current.classList.remove("active");
        }
    }, [active]);

    useEffect(() => {
        function checkWaitingConfirmation() {
            setIsWaitingConfirmation(
                waiting_confirmation === order.delivery_order_status.id
            );
        }

        checkWaitingConfirmation();
    }, [order]);

    useEffect(() => {
        function waitingConfirmation() {
            if (waiting_confirmation === order.delivery_order_status.id) {
                elementContainer.current.classList.add("waiting-confirmation");
                setTimeout(() => {
                    audio.current.play();
                }, 1000);
                return;
            }
            elementContainer.current.classList.remove("waiting-confirmation");
            audio.current.pause();
        }

        waitingConfirmation();

        return () => {
            if (audio) audio.current.pause();
        };
    }, [isWaitingConfirmation]);

    return (
        <li
            ref={elementContainer}
            onClick={() => {
                audio.current.pause();
                elementContainer.current.classList.remove(
                    "waiting-confirmation"
                );
                onSelected(order);
            }}
        >
            <audio ref={audio} loop>
                <source src="/assets/songs/ringtone.mp3" type="audio/ogg"/>
                <source src="/assets/songs/ringtone.mp3" type="audio/mpeg"/>
            </audio>
            <span>Pedido #{order.id}</span>
            <div>
                <p>{order.user.nickname}</p>
                <label>{order.delivery_order_status.label}</label>
            </div>
        </li>
    );
}

if (document.getElementById("componentOrderActive")) {
    ReactDOM.render(<Order/>, document.getElementById("componentOrderActive"));
}

requestFirebaseNotificationPermission().then(token => {
    if(localStorage.getItem("token") === token)
        return;

    localStorage.setItem("token", token);
    const companyId = document.querySelector("input[name='companyId']").value;

    api.post(`notification/company/registerToken`, {
        token,
        companyId
    });
});
