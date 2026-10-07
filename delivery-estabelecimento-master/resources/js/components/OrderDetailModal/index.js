import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import "./style.css"
import OrderDetail from "../OrderDetail";
import api from "../../api";

function OrderDetailModal({order}, ref) {
    const modalRef = useRef();
    const [orderSelected, setOrderSelected] = useState(null);
    const [active, setActive] = useState(false);

    useEffect(() => {
        async function getDataOrder(id) {

            const {
                data: {response}
            } = await api.get(`deliveryOrders/${id}`);

            setOrderSelected(response);
        }

        if(order)
            getDataOrder(order.id)
    },[order])

    useEffect(() => {
        if (active) {
            modalRef.current.classList.add("active");
        } else {
            modalRef.current.classList.remove("active");
            setOrderSelected(null);
        }
    }, [active]);

    useImperativeHandle(
        ref,
        () => ({
            showModal: () => {
                setActive(true);
            }
        }),
        []
    );

    function getDiscountByValueType(){
        switch(order.user_discount_coupon_delivery.discount_coupon_delivery.valueType){
            case "$":
                return ` R$${Mask.maskMoney(order.user_discount_coupon_delivery.discount_coupon_delivery.value)}`;
            case "%":
                return `${Mask.maskMoney(order.user_discount_coupon_delivery.discount_coupon_delivery.value)}%`;
        }
    }

    return (
        <div ref={modalRef} className="modal-order-detail">
            <div>
                <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setActive(false)}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
                <h4>Detalhes do pedido</h4>
                {orderSelected == null && <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>}
                {orderSelected != null ? <OrderDetail order={orderSelected} config={null}/> : null}
            </div>
        </div>
    );
};

export default forwardRef(OrderDetailModal);
