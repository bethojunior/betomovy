import React, { forwardRef, useImperativeHandle, useState } from "react";

import { Modal } from "react-bootstrap";
import Mask from "../../utils/Mask";
import "./style.css";
import {WITHDRAW_IN_LOCAL_TYPE} from "../../constants/orderDeliveryType";


function OrderReceiptModal(props, ref) {
    const [active, setActive] = useState(false);
    const [order, setOrder] = useState(null);

    useImperativeHandle(
        ref,
        () => ({
            show: order => {
                setOrder(order);
                setActive(true);
            }
        }),
        [order]
    );

    return (
        <Modal show={active} onHide={() => setActive(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Recibo do pedido</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
                {order != null && (
                    <table id="printer-ticket" className="printer-ticket">
                        <thead>
                            <tr>
                                <th className="title" colspan="3">
                                    {order.company.fantasyName}
                                </th>
                            </tr>
                            <tr>
                                <th colspan="3">
                                    {new Date(
                                        order.created_at
                                    ).toLocaleString()}
                                </th>
                            </tr>
                            <tr>
                                <th colspan="3">
                                    <span style={{ fontWeight: "bold" }}>
                                        Cliente: {order.user.name}
                                    </span>
                                </th>
                            </tr>

                            {order.orderDeliveryTypeId === WITHDRAW_IN_LOCAL_TYPE ? null :  <>
                                <tr>
                                    <th colspan="3">
                                        <span style={{fontWeight: "bold"}}>
                                            Endereço: {order.delivery_order_place.place.address}
                                        </span>
                                    </th>
                                </tr>
                                <tr>
                                    <th colspan="3">
                                        <span style={{fontWeight: "bold"}}>
                                            Complemento: {order.delivery_order_place.place.complement || "-"}
                                        </span>
                                    </th>
                                </tr>
                                <tr>
                                    <th colSpan="3">
                                        <span style={{fontWeight: "bold"}}>
                                            Ponto de referência: {order.delivery_order_place.place.referencePoint || "-"}
                                        </span>
                                    </th>
                                </tr>
                            </>}
                        </thead>
                        <tbody>
                            {order.delivery_order_items.map(item => {
                                return [
                                    <tr className="top">
                                        <td colspan="1">
                                            {item.delivery_product.name}
                                        </td>
                                        <td>Qtd</td>
                                        <td>Total</td>
                                    </tr>,
                                    <tr>
                                        <td>
                                            {!item.delivery_product.isOpenValue ?  Mask.maskMoney(
                                                item.delivery_product.price
                                            ): "-"}
                                        </td>
                                        <td>{item.quantity}</td>
                                        <td>{Mask.maskMoney(item.value)}</td>
                                    </tr>,
                                    item.obs != null && (
                                        <tr>
                                            <td colspan="3">
                                                <b>OBS: {item.obs}</b>
                                            </td>
                                        </tr>
                                    ),
                                    item.delivery_order_complements.length >
                                        0 && (
                                        <tr>
                                            <td colspan="3">
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
                                                <td>{Mask.maskMoney(complement.delivery_complement.price)}</td>
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
                                <td colspan="3">
                                    <b>Totais</b>
                                </td>
                            </tr>
                            <tr className="ttu">
                                <td colspan="2">Subtotal</td>
                                <td align="right">
                                R${Mask.maskMoney(
                                    order.delivery_order_items
                                        .map(({value}) => {
                                            return value;
                                        })
                                        .reduce((acc, value) => {
                                            return acc + value;
                                        }, 0)
                                )}
                                </td>
                            </tr>
                            <tr className="ttu">
                                <td colspan="2">Taxa de entrega</td>
                                <td align="right">
                                    R${Mask.maskMoney(order.deliveryFee || 0)}
                                </td>
                            </tr>
                            <tr className="ttu">
                                <td colSpan="2">Total</td>
                                <td align="right">
                                    R${Mask.maskMoney(order.value)}
                                </td>
                            </tr>
                            {order.user_discount_coupon_delivery != null && (<tr className="ttu">
                                <td colspan="2">Cupom</td>
                                <td align="right">
                                    R${Mask.maskMoney(order.user_discount_coupon_delivery.discount_coupon_delivery.value || 0)}
                                </td>
                            </tr>)}
                            <tr className="ttu">
                                <td colspan="2">Troco</td>
                                <td align="right">
                                    {order.changeValue != null
                                        ? Mask.maskMoney(order.changeValue)
                                        : "Sem troco"}
                                </td>
                            </tr>
                            <tr className="sup ttu p--0">
                                <td colspan="3">
                                    <b>Pagamentos</b>
                                </td>
                            </tr>
                            <tr className="ttu">
                                <td colspan="2">Tipo de pagamento</td>
                                <td align="right">
                                    {order.delivery_payment_form.name}
                                </td>
                            </tr>
                            <tr className="sup">
                                <td colspan="3" align="center">
                                    <b>Pedido: {order.id}</b>
                                </td>
                            </tr>
                            <tr className="sup">
                                <td colspan="3" align="center">
                                    <b>Cupom não fiscal</b>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                )}
            </Modal.Body>
            <Modal.Footer>
                <button
                    onClick={() => {
                        var divContents = document.querySelector(".modal-body")
                            .innerHTML;
                        var a = window.open("", "", "height=500,width=800");
                        a.document.write("<html>");
                        a.document.write("<body>");
                        a.document.write(divContents);
                        a.document.write("</body></html>");
                        a.document.close();
                        a.print();
                    }}
                    type="button"
                    className="btn btn-primary"
                >
                    Imprimir
                </button>
            </Modal.Footer>
        </Modal>
    );
}

export default forwardRef(OrderReceiptModal);
