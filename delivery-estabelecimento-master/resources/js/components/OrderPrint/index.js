import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { WITHDRAW_IN_LOCAL_TYPE } from "../../constants/orderDeliveryType";
import "./style.css";
import io from 'socket.io-client';

export default function OrderPrint() {
    const [order, setOrder] = useState(null)
    // const [socket, setSocket] = useState(io('ws://localhost:3333/'))

    const getOrderLocalStorage = () => {
        const orderData = JSON.parse(localStorage.getItem('dataOrder'))
        if (orderData) {
            setOrder(orderData);
        }
    }

    const sockectServer = () => {

        let socket = io('https://ws-delivery-global.fabrica704.com/', {
            withCredentials: false
        })
        const data = {
            ...order,
            delivery_host: window.location.origin
        }
        socket.emit('message', JSON.stringify(data))

    }

    useEffect(() => {
        getOrderLocalStorage()
    }, [])

    return (
        <>
            {
                order !== null && (
                    <div className="printer-cont">
                        <table id="printer-ticket" className="printer-ticket">
                            <thead>
                                <tr>
                                    <th className="title" colSpan="4">
                                        {order.company.fantasyName}
                                    </th>
                                </tr>
                                <tr>
                                    <th colSpan="4">
                                        {new Date(
                                            order.created_at
                                        ).toLocaleString()}
                                    </th>
                                </tr>
                                <tr>
                                    <th colSpan="4">
                                        <span style={{ fontWeight: "bold" }}>
                                            Cliente: {order.user.name}
                                        </span>
                                    </th>
                                </tr>

                                {order.orderDeliveryTypeId === WITHDRAW_IN_LOCAL_TYPE ? null : <>
                                    <tr>
                                        <th colSpan="4">
                                            <span style={{ fontWeight: "bold" }}>
                                                Endereço: {order.delivery_order_place.place.address}
                                            </span>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th colSpan="4">
                                            <span style={{ fontWeight: "bold" }}>
                                                Complemento: {order.delivery_order_place.place.complement || "-"}
                                            </span>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th colSpan="4">
                                            <span style={{ fontWeight: "bold" }}>
                                                Ponto de referência: {order.delivery_order_place.place.referencePoint || "-"}
                                            </span>
                                        </th>
                                    </tr>
                                </>}
                            </thead>
                            <tbody>
                                {order.delivery_order_items.map((item, index) => {
                                    return [
                                        <tr className="top" key={index}>
                                            <td>
                                                {item.delivery_product.name}
                                            </td>
                                            <td></td>
                                            <td colSpan={'1'} >Qtd</td>
                                            <td>Total</td>
                                        </tr>,
                                        <tr>
                                            <td>
                                                {!item.delivery_product.isOpenValue ? Mask.maskMoney(
                                                    item.delivery_product.price
                                                ) : "-"}
                                            </td>
                                            <td></td>

                                            <td>x{item.quantity}</td>
                                            <td>{Mask.maskMoney(item.value)}</td>
                                        </tr>,
                                        item.obs != null && (
                                            <tr>
                                                <td colSpan="3">
                                                    <b>OBS: {item.obs}</b>
                                                </td>
                                            </tr>
                                        ),
                                        item.delivery_order_complements.length >
                                        0 && (
                                            <tr>
                                                <td colSpan="1">
                                                    <b>complementos:</b>
                                                </td>
                                            </tr>
                                        ),
                                        item.delivery_order_complements.map((complement) => {
                                            return [
                                                <tr>
                                                    <td>{complement.delivery_complement.name}</td>
                                                </tr>,
                                                <tr>
                                                    <td colSpan={'2'} >{Mask.maskMoney(complement.delivery_complement.price)}</td>
                                                    <td>{complement.quantity}</td>
                                                    <td>{Mask.maskMoney(complement.quantity * complement.delivery_complement.price)}</td>
                                                </tr>
                                            ];
                                        })
                                    ];
                                })}
                            </tbody>
                            <tfoot>
                                <tr className="sup ttu p--0">
                                    <td colSpan="4">
                                        <b>Totais</b>
                                    </td>
                                </tr>
                                <tr className="ttu">
                                    <td colSpan="2">Subtotal</td>
                                    <td align="right">
                                        R${Mask.maskMoney(
                                            order.delivery_order_items
                                                .map(({ value }) => {
                                                    return value;
                                                })
                                                .reduce((acc, value) => {
                                                    return acc + value;
                                                }, 0)
                                        )}
                                    </td>
                                </tr>
                                <tr className="ttu">
                                    <td colSpan="2">Taxa de entrega</td>
                                    <td align="right">
                                        R${Mask.maskMoney(order.deliveryFee || 0)}
                                    </td>
                                </tr>
                                <tr className="ttu">
                                    <td colSpan="2" >Total</td>
                                    <td align="right">
                                        R${Mask.maskMoney(order.value)}
                                    </td>
                                </tr>
                                {order.user_discount_coupon_delivery != null && (<tr className="ttu">
                                    <td colSpan="2">Cupom</td>
                                    <td align="right">
                                        R${Mask.maskMoney(order.user_discount_coupon_delivery.discount_coupon_delivery.value || 0)}
                                    </td>
                                </tr>)}
                                <tr className="ttu">
                                    <td colSpan="2">Troco</td>
                                    <td align="right">
                                        {order.changeValue != null
                                            ? Mask.maskMoney(order.changeValue)
                                            : "Sem troco"}
                                    </td>
                                </tr>
                                <tr className="sup ttu p--0">
                                    <td colSpan="4">
                                        <b>Pagamentos</b>
                                    </td>
                                </tr>
                                <tr className="ttu">
                                    <td colSpan="2">Tipo de pagamento</td>
                                    <td align="right">
                                        {order.delivery_payment_form.name}
                                    </td>
                                </tr>
                                <tr className="sup">
                                    <td colSpan="4" align="center">
                                        <b>Pedido: {order.id}</b>
                                    </td>
                                </tr>
                                <tr className="sup">
                                    <td colSpan="4" align="center">
                                        <b>Cupom não fiscal</b>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                        <button
                            onClick={sockectServer}
                            type="button"
                            className="btn btn-primary print"
                        >
                            Imprimir
                        </button>
                    </div>
                )
            }
        </>

    )
}

if (document.getElementById("containerOrderPrint")) {
    ReactDOM.render(<OrderPrint />, document.getElementById("containerOrderPrint"));
}