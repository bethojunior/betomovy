import React, {useCallback, useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom";
import api from "../../api";
import OrderDetailModal from "../OrderDetailModal";
import {NotificationNewOrder} from "../../vanilla/NotificationNewOrder";

function OrderList() {
    const [page, setPage] = useState(1);
    const [list, setList] = useState([]);
    const [isNext, setIsNext] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [loading, setLoading] = useState(true);
    const [orderSelected, setOrderSelected] = useState(null);
    const [dateStart, setDateStart] = useState(null);
    const [dateEnd, setDateEnd] = useState(null);
    const [dateStartSelected, setDateStartSelected] = useState(null);
    const [dateEndSelected, setDateEndSelected] = useState(null);
    const modalRef = useRef();

    useEffect(() => {
        NotificationNewOrder(true);
        getList();
    }, [page]);

    const getList = useCallback(async () => {
        if (page <= 0)
            return;

        let params = '';

        if (dateStartSelected && dateEndSelected)
            params = `&dateStart=${dateStartSelected}&dateEnd=${dateEndSelected}`;

        setLoading(true);

        const {data: {response}} = await api.get(`order/all?page=${page}${params}`);

        setList(response.data);

        setIsPreview(!!response.prev_page_url);
        setIsNext(!!response.next_page_url);
        setLoading(false);
    }, [page, dateStartSelected, dateEndSelected]);

    const handlePreview = useCallback(() => {
        setPage(page - 1);
    }, [page]);

    const handleNext = useCallback(() => {
        setPage(page + 1);
    }, [page]);

    const handleFilterBetweenDate = useCallback(() => {
        if (!dateStart || !dateEnd)
            return alert("Informe as datas");

        if (dateStart && dateEnd)
            if (dateStart > dateEnd)
                return alert("Data inicial deve ser menor que a data final");

        setDateStartSelected(dateStart);
        setDateEndSelected(dateEnd);
        setPage(0);

        setTimeout(() => {
            setPage(1);
        }, 500)
    }, [dateStart, dateEnd, dateStartSelected, dateEndSelected]);

    return (
        <div>
            <OrderDetailModal order={orderSelected} ref={modalRef}/>
            <div className="form-row mb-2">
                <div className="col-3">
                    <div className="form-group  mb-0">
                        <label>De</label>
                        <input type="date" className="form-control" value={dateStart}
                               onChange={(event) => setDateStart(event.target.value)}/>
                    </div>
                </div>
                <div className="col-3">
                    <div className="form-group mb-0">
                        <label>Até</label>
                        <input type="date" className="form-control" value={dateEnd}
                               onChange={(event) => setDateEnd(event.target.value)}/>
                    </div>
                </div>
                <div className="col d-flex align-items-end">
                    <button type="button" className="btn btn-primary" onClick={handleFilterBetweenDate}>Buscar</button>
                </div>
            </div>
            <table className="table">
                <thead>
                <tr>
                    <th></th>
                    <th>Nome</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {!loading && list.map(order => {
                    return (<tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.user.name}</td>
                        <td>{new Date(order.created_at).toLocaleString()}</td>
                        <td>{order.delivery_order_status.description}</td>
                        <td>{Mask.maskMoney(order.value)}</td>
                        <td>
                            <button onClick={() => {
                                console.log(order);
                                setOrderSelected(order);
                                modalRef.current.showModal();
                            }} type="button" className="btn btn-primary btn-sm">Detalhes
                            </button>
                        </td>
                    </tr>);
                })}
                </tbody>
            </table>
            {loading && <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>}
            <ul className="pagination">
                <li onClick={handlePreview}
                    className={!loading ? isPreview ? "page-item" : "page-item disabled" : "page-item disabled"}><a
                    className="page-link" href="#">Anterior</a></li>
                <li onClick={handleNext}
                    className={!loading ? isNext ? "page-item" : "page-item disabled" : "page-item disabled"}><a
                    className="page-link" href="#">Prôximo</a></li>
            </ul>
        </div>
    )
}

export default OrderList;

if (document.getElementById("orderList")) {
    ReactDOM.render(<OrderList/>, document.getElementById("orderList"));
}
