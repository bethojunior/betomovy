import React, {useState, useEffect, useRef} from "react";
import {IoIosChatbubbles, IoIosClose} from "react-icons/io";
import "./styles.css";
import api from "../../api";
import AppSocket from "../../services/socket";

export default function OrderChat({orders}) {
    const socket = useRef(null);
    const [openChat, setOpenChat] = useState(false);
    const [orderSelected, setOrderSelected] = useState(null);
    const [active, setActive] = useState(false);
    const [listOrderActive, setListOrderActive] = useState([]);

    useEffect(() => {
        function openSocket() {
            socket.current = new AppSocket();
            orders.map(order => {
                socket.current.onEvent(`deliveryChat_${order.id}`, (result) => {
                    if(result.userId) {
                        setActive(true);
                        setListOrderActive([...listOrderActive, order.id]);
                    }
                });
            });
        }

        openSocket()

        return () => {
            if (socket.current) socket.current.close();
        };
    }, [orders,listOrderActive]);

    return (
        <>
            <div
                className={active ? "container-order-chat active" : "container-order-chat"}
                onClick={() => {
                    setActive(false)
                    setOpenChat(true);
                }}
            >
                <IoIosChatbubbles/>
            </div>
            <div
                className={`container-list-messages ${
                    openChat ? "active" : ""
                }`}
            >
                <nav>
                    <span>
                        <span>
                            {orderSelected ? orderSelected.user.name : ""}
                        </span>
                        <small>
                            {orderSelected ? `Pedido #${orderSelected.id}` : ""}
                        </small>
                    </span>

                    <IoIosClose
                        onClick={() => {
                            if (orderSelected) {
                                setOrderSelected(null);
                            } else {
                                setOpenChat(false);
                            }
                        }}
                    />
                </nav>
                <div>
                    <ul>
                        {orders.map(order => {
                            return (
                                <li
                                    key={order.id}
                                    onClick={() => {
                                        setOrderSelected(order);
                                        setListOrderActive([...listOrderActive.filter(id => order.id != id)]);
                                    }}
                                    className={listOrderActive.includes(order.id) ? "active" : ""}
                                >
                                    <div>
                                        <p>
                                            {order.user.nickname ||
                                            order.user.name}
                                        </p>
                                        <small>Pedido #{order.id}</small>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    <LayoutChat order={orderSelected}/>
                </div>
            </div>
        </>
    );
}

function LayoutChat({order}) {
    const socket = useRef(null);
    const KEY_ENTER = 13;
    let element = useRef(null);
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState("");

    useEffect(() => {
        if (order) {
            getMessages();
            socket.current = new AppSocket();
            socket.current.onEvent(`deliveryChat_${order.id}`, () => {
                getMessages();
            });
        }

        return () => {
            if (socket.current) socket.current.close();
            setMessages([]);
        };
    }, [order]);

    async function getMessages() {
        const {
            data: {response}
        } = await api.get(`deliveryOrders/${order.id}/chat`);
        setMessages(response.reverse());

        element.current.scrollTo(0, element.current.scrollHeight);
    }

    function sendMessage() {
        if (value.trim().length > 0) {
            api.post(`deliveryOrders/${order.id}/chat/sendMessage`, {
                message: value
            });
            setValue("");
        }
    }

    return (
        <div className={`container-layout ${order ? "active" : ""}`}>
            <ul ref={element}>
                {messages.map(({id, message, companyId}) => {
                    if (companyId)
                        return <MessageSent message={message} id={id}/>;
                    return <MessageReceived message={message} id={id}/>;
                })}
            </ul>
            <div>
                <input
                    type="text"
                    placeholder="Digite algo"
                    value={value}
                    onChange={event => {
                        setValue(event.target.value);
                    }}
                    onKeyUp={event => {
                        if (event.keyCode === KEY_ENTER) {
                            sendMessage();
                        }
                    }}
                />
                <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => {
                        sendMessage();
                    }}
                >
                    Enviar
                </button>
            </div>
        </div>
    );
}

function MessageSent({message}) {
    return (
        <li className="message-sent">
            <div>{message}</div>
        </li>
    );
}

function MessageReceived({message}) {
    return (
        <li>
            <div>{message}</div>
        </li>
    );
}
