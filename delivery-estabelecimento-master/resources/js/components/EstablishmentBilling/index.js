import React, {useCallback, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import api from "../../api";
import Mask from "../../utils/Mask"
import {NotificationNewOrder} from "../../vanilla/NotificationNewOrder";

const STATUS_PENDING = 1;

export default function EstablishmentBilling() {
    const [list, setList] = useState([]);

    useEffect(() => {
        NotificationNewOrder(true);
        async function getData() {
            Preload.show();
            const {data} = await api.get(
                `establishment/${document.querySelector('#header-company-id').value}/billing`);
            Preload.hide();
            setList(data.response.data);
        }

        async function createCustomerInAsaas() {
            const {data} = await api.get(
                `establishment/customer/create`);
        }

        getData();
        createCustomerInAsaas();
    }, []);

    const requestBillet = useCallback(async (id) => {
        Preload.show();
        const {data} = await api.get(
            `establishment/${id}/billet`);
        Preload.hide();
    }, []);

    return (<div>
        <table className="table">
            <thead>
            <tr>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Data</th>
                <th>Status</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {list.map(item => {
                return <tr key={item.id}>
                    <td>{item.description}</td>
                    <td>{Mask.maskMoney(item.value)}</td>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                    <td>{item.status_payment.description}</td>
                    <td>
                        {item.status_payment.id === STATUS_PENDING ?
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => {
                                requestBillet(item.id)
                            }}>Pagar</button> : null}
                    </td>
                </tr>
            })}
            </tbody>
        </table>
    </div>)
}


if (document.getElementById("containerEstablishmentBilling")) {
    ReactDOM.render(<EstablishmentBilling/>, document.getElementById("containerEstablishmentBilling"));
}
