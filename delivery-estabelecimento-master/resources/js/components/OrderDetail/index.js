import React, {useEffect, useRef, useState} from "react";
import "./styles.css";
import moment from "moment";
import OrderTimeline from "../OrderTimeline";
import Mask from "../../utils/Mask";
import api from "../../api";
import AppSocket from "../../services/socket";
import {
    canceled,
    out_for_delivery,
    delivered,
    withdraw_in_local,
    in_preparation,
    finished,
    waiting_confirmation, searching_delivery_man
} from "../../constants";
import {confirmAlert} from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {MONEY_IN_LOCAL} from "../../constants/paymentFormType";
import {DELIVERY_TYPE} from "../../constants/orderDeliveryType";
import {NotificationNewOrder} from "../../vanilla/NotificationNewOrder";
import { set } from "lodash";

const AWS_BUCKET = process.env.MIX_AWS_BUCKET;

let socket = null;

export default function OrderDetail({order, config}) {
    const [orderSelected, setOrderSelected] = useState(null);
    const [haveDriver, setHaveDriver] = useState(null);
    useEffect(() => {
        moment.locale("pt-br");
    }, []);

    useEffect(() => {
        async function getDataOrder(id) {
            NotificationNewOrder(false);
            const {
                data: {response}
            } = await api.get(`deliveryOrders/${id}`);
            setOrderSelected(response);
        }

        order?.driver ? setHaveDriver(order) : setHaveDriver(null)
        function openSocket() {
            socket = new AppSocket();

            socket.onEvent(`trackOrder_${order.id}`, order => {
                order?.driver ? setHaveDriver(order) : setHaveDriver(null)
                setOrderSelected(order);
                //getDataOrder(order.id);
            });
        }

        if (order) {
            setOrderSelected(null);
            getDataOrder(order.id);
            openSocket();
        }

    }, [order]);

    function showChangeValue() {
        if (!order.delivery_payment_form)
            return null;

        if (order.delivery_payment_form.paymentFormTypeId !== MONEY_IN_LOCAL)
            return null;

        if (order.changeValue === null) return <p>Sem troco</p>;

        return <p>Troco para R$ {Mask.maskMoney(order.changeValue)}</p>;
    }

    function getDiscountByValueType(){
        switch(order.user_discount_coupon_delivery.discount_coupon_delivery.valueType){
            case "$":
                return ` R$${Mask.maskMoney(order.user_discount_coupon_delivery.discount_coupon_delivery.value)}`;
            case "%":
                return `${Mask.maskMoney(order.user_discount_coupon_delivery.discount_coupon_delivery.value)}%`;
        }
    }

    if (order === null) return null;

    return (
        <div className="container-order-detail">
            <div>
                <div>
                    <small>Pedido #{order.id}</small>
                </div>
                <div>
                    <p>
                        Horário {moment(order.created_at).format("L")}{" "}
                        {moment(order.created_at).format("LT")}
                    </p>
                    <label>{order.delivery_order_status.label}</label>
                </div>
            </div>
            <div>
                <div>
                    <small>Cliente</small>
                </div>
                <div>
                    <p>{order.user.name}</p>
                </div>
            </div>
            {order.order_delivery_type ? (<div>
                <div>
                    <small>Tipo de pedido</small>
                </div>
                <div>
                    <p>{order.order_delivery_type.description}</p>
                </div>
            </div>) : null}
            {order.orderDeliveryTypeId === DELIVERY_TYPE &&
            (<div>
                <div>
                    <small>Endereço de entrega</small>
                </div>
                <div>
                    <p>{order.delivery_order_place?.address}</p>
                </div>
                <div>
                    <small>Número</small>
                </div>
                <div>
                    <p>{orderSelected ? orderSelected.delivery_order_place?.place.number || "Não informado" : "-"}</p>
                </div>
                <div>
                    <small>Complemento</small>
                </div>
                <div>
                    <p>{orderSelected ? orderSelected.delivery_order_place?.place.complement || "Não informado" : "-"}</p>
                </div>
                <div>
                    <small>Ponto de referencia</small>
                </div>
                <div>
                    <p>{orderSelected ? orderSelected.delivery_order_place?.place.referencePoint || "Não informado" : "-"}</p>
                </div>
                <div>
                    <p></p>
                </div>
            </div>)}
            {haveDriver && haveDriver?.driver ? (<div>
                <div>
                    <img src={`https://s3-sa-east-1.amazonaws.com/${AWS_BUCKET}/driver/profile/compressed/${haveDriver?.driver?.profileImage}`}
                         height="110"
                         width="110"
                         style={{borderRadius: "50%", marginBottom: "12px"}}/>
                </div>

                <div>
                    <small>Nome do Entregador</small>
                </div>
                <div>
                    <p>{haveDriver?.driver?.name}</p>
                </div>
                <div>
                    <small>Telefone do Entregador</small>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <p>{haveDriver?.driver?.phone}</p>
                    <a target="_blank" href={`https://api.whatsapp.com/send?phone=55${haveDriver?.driver?.phone}&amp;text=Olá.`}>
                        <img src="/assets/images/icons/whatsapp.png" />
                    </a>
                </div>
            </div>) : null}
            <ContainerItemOrder order={orderSelected}/>
            <div>
                <div>
                    <small>Pagamento</small>
                </div>
                <div>
                    <p>Subtotal</p>
                    <p>
                        R$
                        {Mask.maskMoney(
                            order.delivery_order_items
                                .map(({value}) => {
                                    return value;
                                })
                                .reduce((acc, value) => {
                                    return acc + value;
                                }, 0)
                        )}
                    </p>
                </div>
                {order.orderDeliveryTypeId === DELIVERY_TYPE &&
                (<div>
                    <p>Taxa de entrega</p>
                    <p>R${Mask.maskMoney(order.deliveryFee || 0)}</p>
                </div>)}
                {order.user_discount_coupon_delivery != null && (
                    <div>
                        <p>Cupom</p>
                        <p style={{color: "#00c853"}}>-
                            {getDiscountByValueType()}</p>
                    </div>
                )}
                <div style={{marginTop: 15}}>
                    <p>TOTAL</p>
                    <p>R${Mask.maskMoney(order.value)}</p>
                </div>
            </div>
            <div>
                <div>
                    <small>Formas de pagamento</small>
                </div>
                <div>
                    <p>{order.delivery_payment_form && order.delivery_payment_form.name}</p>
                    <p>R${Mask.maskMoney(order.value)}</p>
                </div>
                <div>
                    <p>{showChangeValue()}</p>
                </div>
            </div>
            <OptionDelivery orderSelected={orderSelected}/>
            <ContainerOrderTimeline
                orderSelected={orderSelected}
                config={config}
            />
        </div>
    );
}

function OptionDelivery({orderSelected}) {
    const modalRef = useRef();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        setOrder(orderSelected);
    }, [orderSelected]);

    async function cancelOrder() {
        confirmAlert({
            title: "Deseja cancelar esse pedido ?",
            message: "O pedido será cancelado caso você confirme essa ação!",
            buttons: [
                {
                    label: "Sim",
                    onClick: () => {
                        api.delete(
                            `deliveryOrders/${order.id}/deliveryOrderActions/cancel`
                        );
                    }
                },
                {
                    label: "Não", onClick: () => {
                    }
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true
        });
    }


    async function outForDeliveryOrder() {
        confirmAlert({
            title: "Deseja informar ao cliente que o pedido saiu para entrega ?",
            message: "O pedido mudarar o status caso confirme essa ação!",
            buttons: [
                {
                    label: "Sim",
                    onClick: () => {
                        api.post(
                            `deliveryOrders/${order.id}/deliveryOrderActions/outForDeliveryManual`
                        );
                    }
                },
                {
                    label: "Não", onClick: () => {
                    }
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true
        });
    }

    async function finishOrder() {
        confirmAlert({
            title: "Deseja concluir a entrega nesse pedido ?",
            message: "O pedido será finalizado caso você confirme essa ação!",
            buttons: [
                {
                    label: "Sim",
                    onClick: () => {
                        api.post(
                            `deliveryOrders/${order.id}/deliveryOrderActions/finish`
                        );
                        setOrder(null);
                    }
                },
                {
                    label: "Não", onClick: () => {
                    }
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true
        });
    }

    async function cancelSearchingDriver() {
        confirmAlert({
            title: "Deseja cancelar a busca por um entregador ?",
            message: "A busca pelo entregador será cancelado caso você confirme essa ação!",
            buttons: [
                {
                    label: "Sim",
                    onClick: () => {
                        api.post(
                            `deliveryOrders/${order.id}/deliveryOrderActions/prepare`
                        );
                    }
                },
                {
                    label: "Não", onClick: () => {
                    }
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true
        });
    }

    if (!order) return null;

    function showButtonByStatus(statusId){
        return ![waiting_confirmation,canceled, finished].includes(statusId);
    }

    function saveDataOrder(data) {
        localStorage.setItem("dataOrder", JSON.stringify(data));
        console.log(JSON.parse(localStorage.getItem('dataOrder')));
        window.location.href = '/delivery/orderPrinter'
    }

    return (
        <div>
            <p>Status:</p>
            <div style={{ justifyContent: "start" }}>
                {(showButtonByStatus(order.delivery_order_status.id) &&
                    order.delivery_order_status.id < out_for_delivery) ? (
                    <button
                        type="button"
                        onClick={() => outForDeliveryOrder()}
                        className="btn btn-warning mr-2"
                    >
                        Sair para entrega
                    </button>
                ) : null}
                {(showButtonByStatus(order.delivery_order_status.id)) ? (
                    <button
                        type="button"
                        className="btn btn-primary mr-2"
                        onClick={() => {
                            finishOrder();
                        }}
                    >
                        Confirmar entrega
                    </button>
                ) : null}

                {showButtonByStatus(order.delivery_order_status.id) ? (
                    <button
                        type="button"
                        onClick={() => cancelOrder()}
                        className="btn btn-danger mr-2"
                    >
                        Cancelar pedido
                    </button>
                ) : null}

                <button type="button" onClick={() => {
                    // modalRef.current.show(order);
                    saveDataOrder(order);
                }} className="btn btn-info">Imprimir recibo
                </button>

                {(order.delivery_order_status.id == 4) ? (
                    <button
                        type="button"
                        className="btn btn-secondary ml-2"
                        onClick={() => {
                            cancelSearchingDriver();
                        }}
                    >
                        Cancelar Chamado
                    </button>
                ) : null}
            </div>
        </div>
    );
}

function ContainerItemOrder({order}) {
    const [orderDetail, setOrderDetail] = useState(null);
    useEffect(() => {
        setOrderDetail(order);
    }, [order]);
    return (
        <div>
            <div>
                <small>Itens do pedidos</small>
            </div>
            <ul>
                <li className="row item-list">
                    <div className="col-2">
                        <b>Qtd</b>
                    </div>
                    <div className="col-8">
                        <b>Itens</b>
                    </div>
                    <div className="col-2">
                        <b>Preço</b>
                    </div>
                </li>
                {orderDetail === null ? (
                    <Preload/>
                ) : (
                    orderDetail.delivery_order_items.map(item => {
                        return (
                            <li className="row item-list" key={item.id}>
                                <div className="col-2">{item.quantity}</div>
                                <div className="col-8">
                                    {item.delivery_product.name}
                                </div>
                                <div className="col-2">
                                    R$
                                    {Mask.maskMoney(
                                        item.value
                                    )}
                                </div>
                                {item.obs ? (
                                    <p className="text-observation">
                                        Observação:{item.obs}
                                    </p>
                                ) : null}
                                {item.delivery_order_complements.length > 0 ? (
                                    <small>Complementos</small>
                                ) : null}
                                {item.delivery_order_complements.map(
                                    complement => {
                                        return (
                                            <div
                                                className="col-12 item-complement"
                                                key={complement.id}
                                            >
                                                <div className="row">
                                                    <div className="col-2">
                                                        {complement.quantity}
                                                    </div>
                                                    <div className="col-8">
                                                        {
                                                            complement
                                                                .delivery_complement
                                                                .name
                                                        }
                                                    </div>
                                                    <div className="col-2"></div>
                                                    <div className="col-12">
                                                        {complement.obs}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </li>
                        );
                    })
                )}
            </ul>
        </div>
    );
}

function Preload() {
    return <li className="preload-list"></li>;
}

function ContainerOrderTimeline({orderSelected, config}) {
    const [order, setOrder] = useState(false);

    useEffect(() => {
        setOrder(orderSelected);
    }, [orderSelected]);

    return (
        <div>
            <div>
                <>&nbsp;</>
                {order ? <OrderTimeline order={order} config={config}/> : null}
                <>&nbsp;</>
            </div>
        </div>
    );
}
