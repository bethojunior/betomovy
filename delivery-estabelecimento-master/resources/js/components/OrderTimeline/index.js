import React, {useRef, useState, useEffect} from "react";
import "./style.css";
import {
    IoIosCheckmarkCircleOutline,
    IoIosTimer,
    IoMdClose,
} from "react-icons/io";
import {GiFullMotorcycleHelmet} from "react-icons/gi";
import {RiRouteLine} from "react-icons/ri";
import {FaConciergeBell} from "react-icons/fa";
import {BsBag} from "react-icons/bs";
import {
    order_confirmed,
    in_preparation,
    out_for_delivery,
    delivered,
    arrived,
    order_accepted_delivery_man,
    order_refused, withdraw_in_local
} from "../../constants";
import api from "../../api";
import CallModeModal from "../CallModeModal";
import DeliveryManOrderModal from "../DeliveryManOrderModal";
import {DELIVERY_TYPE, WITHDRAW_IN_LOCAL_TYPE} from "../../constants/orderDeliveryType";

export default function OrderTimeline({order, config}) {
    const [messageStatus, setMessageStatus] = useState("");
    const btnRefus = useRef(null);
    const btnAccept = useRef(null);
    const btnInPreparation = useRef(null);
    const btnSearchingDeliveryMan = useRef(null);
    const btnOutForDelivery = useRef(null);
    const btnDelivered = useRef(null);
    const callModeModalRef = useRef(null);
    const deliveryManModalRef = useRef(null);
    const btnWithdrawInLocalTypeRef = useRef(null);

    useEffect(() => {
        function getStatusOrder() {
            btnRefus.current.classList.remove(
                "hidden",
                "active-preload",
                "option-active"
            );
            btnAccept.current.classList.remove("active", "hidden");
            btnInPreparation.current.classList.remove("active");
            if (btnSearchingDeliveryMan.current)
                btnSearchingDeliveryMan.current.classList.remove("active");
            if (btnOutForDelivery.current)
                btnOutForDelivery.current.classList.remove("active");
            if (btnDelivered.current.classList)
                btnDelivered.current.classList.remove("active");

            setMessageStatus(order.delivery_order_status.label);

            if (order_refused === order.delivery_order_status.id) {
                btnRefus.current.classList.add("option-active");
                btnAccept.current.classList.add("hidden");
                return;
            }

            if (order_confirmed > order.delivery_order_status.id) return;
            btnRefus.current.classList.add("hidden");
            btnAccept.current.classList.add("active");

            if (in_preparation > order.delivery_order_status.id) return;
            btnInPreparation.current?.classList.add("active");
            btnSearchingDeliveryMan.current?.classList.add("hidden");

            if (order_accepted_delivery_man > order.delivery_order_status.id)
                return;
            if (btnSearchingDeliveryMan.current)
                btnSearchingDeliveryMan.current.classList.add("active");

            if (out_for_delivery > order.delivery_order_status.id) return;

            if (arrived > order.delivery_order_status.id) return;

            if (btnOutForDelivery.current)
                btnOutForDelivery.current.classList.add("active");

            if (btnWithdrawInLocalTypeRef.current) {
                if (order.delivery_order_status.id === withdraw_in_local) {
                    btnWithdrawInLocalTypeRef.current.classList.add("active");
                    return;
                }

                if (order.delivery_order_status.id === withdraw_in_local || order.delivery_order_status.id === delivered) {
                    btnWithdrawInLocalTypeRef.current.classList.add("active");
                }
            }


            if (delivered > order.delivery_order_status.id) return;
            btnDelivered.current.classList.add("active");
        }

        if (order) getStatusOrder();
    }, [order]);

    async function requestChangeStatusOrder(
        status,
        btnRef,
        typeRequest = "post"
    ) {
        const element = btnRef.current;

        if (!element.classList.contains("active")) {
            if (typeRequest !== "delete") {
                btnRefus.current.classList.add("hidden");
            }

            element.classList.add("active-preload");

            switch (typeRequest) {
                case "post": {
                    await api.post(
                        `deliveryOrders/${order.id}/deliveryOrderActions/${status}`
                    );
                    break;
                }
                case "delete": {
                    await api.delete(
                        `deliveryOrders/${order.id}/deliveryOrderActions/${status}`
                    );
                    break;
                }
            }

            if (typeRequest !== "delete") {
                element.classList.remove("active-preload");
                element.classList.add("active");
            }
        }
    }

    function handleRefused() {
        requestChangeStatusOrder("refuse", btnRefus, "delete");
    }

    function handleAccept() {
        requestChangeStatusOrder("confirm", btnAccept);
    }

    function handlePrepare() {
        requestChangeStatusOrder("prepare", btnInPreparation);
    }

    function handleSearchingDeliveryMan() {
        if (!btnSearchingDeliveryMan.current.classList.contains("active")) {
            if (config) {
                if (config.callForAll == true) {
                    appCallOwnDeliveryMan();
                } else {
                    deliveryManModalRef.current.showModal();
                    //  callModeModalRef.current.showModal();
                }
            } else {
                appCallOwnDeliveryMan();
            }
        }
    }

    function appCallOwnDeliveryMan() {
        requestChangeStatusOrder("searchDeliveryMan", btnSearchingDeliveryMan);
    }


    function handleWithdrawInLocal() {
        requestChangeStatusOrder("withdrawInLocal", btnWithdrawInLocalTypeRef);
    }

    function OptionOrderByType() {
        if (order.orderDeliveryTypeId === DELIVERY_TYPE)
            return [];

        if (order.orderDeliveryTypeId === WITHDRAW_IN_LOCAL_TYPE)
            return [];

        return null;
    }

    return (
        <div>
            <p className="label-status-order">{messageStatus}</p>
            <ul className="order-timeline">
                <li
                    className="refus-order"
                    onClick={handleRefused}
                    ref={btnRefus}
                >
                    <IoMdClose/>
                </li>
                <li
                    className="accept-order"
                    onClick={handleAccept}
                    ref={btnAccept}
                >
                    <FaConciergeBell/>
                </li>
                <li ref={btnInPreparation} onClick={handlePrepare}>
                    <IoIosTimer/>
                </li>
                {order.orderDeliveryTypeId === DELIVERY_TYPE && <li
                    ref={btnSearchingDeliveryMan}
                    onClick={handleSearchingDeliveryMan}
                >
                    <GiFullMotorcycleHelmet/>
                </li>}
                {order.orderDeliveryTypeId === DELIVERY_TYPE && <li ref={btnOutForDelivery}>
                    <RiRouteLine/>
                </li>}
                {order.orderDeliveryTypeId === WITHDRAW_IN_LOCAL_TYPE &&
                    <li
                        ref={btnWithdrawInLocalTypeRef}
                        onClick={handleWithdrawInLocal}
                    >
                        <BsBag/>
                    </li>}
                <li ref={btnDelivered}>
                    <IoIosCheckmarkCircleOutline/>
                </li>
            </ul>
            <CallModeModal
                ref={callModeModalRef}
                onOptionDeliveryApp={appCallOwnDeliveryMan}
                onSelectDeliveryMan={() => {
                    deliveryManModalRef.current.showModal();
                }}
            />
            <DeliveryManOrderModal
                ref={deliveryManModalRef}
                onDriverSelected={driverId => {
                    requestChangeStatusOrder(
                        `outForDelivery/driver/${driverId}`,
                        btnSearchingDeliveryMan
                    );
                }}
            />
        </div>
    );
}
