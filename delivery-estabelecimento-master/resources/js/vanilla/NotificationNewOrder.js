import AppSocket from "../services/socket";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

let socket = null;

export function NotificationNewOrder(params) {
    socket = new AppSocket();

    if (params === false) {
        return console.log();
    } else {

        socket.onEvent(`notificationNewOrder_${document.querySelector("#header-company-id").value
            }`, (data) => {
                const audio = new Audio('/assets/songs/ringtone.mp3');

                audio.play();
                audio.loop = true;
                audio.playbackRate = 0.6;

                Toastify({
                    text: "Novo pedido - Click aqui para ver",
                    duration: 60000,
                    newWindow: false,
                    close: false,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "orange",
                    stopOnFocus: true,
                    onClick: function () {
                        window.location.href = "/delivery/order";
                        audio.pause();
                    },
                }).showToast();
            });


        socket.onEvent(`notificationcancelledOrderByDriver_${document.querySelector("#header-company-id").value
            }`, (order) => {
                console.log(order);
                const audio = new Audio('/assets/songs/weather.mp3');

                audio.play();
                audio.loop = true;
                audio.playbackRate = 0.6;
                const id = 1413;
                Toastify({
                    text: `Entrega cancelada , Nª pedido ${order.id}  - Click aqui para ver`,
                    duration: -1,
                    newWindow: false,
                    close: false,
                    gravity: "top",
                    position: "right",
                    backgroundColor: "red",
                    stopOnFocus: true,
                    onClick: function () {
                        window.location.href = `/delivery/order?id=${id}`;
                        audio.pause();
                    },
                }).showToast();
            })

    }
}
