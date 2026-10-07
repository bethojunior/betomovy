viewController.setObserver("chat-trip-delivery", () => {
    const user = Session.get("user");
    const socket = io(HOST_API_SOCKET_V2, {query: `driverId=${user.idDriver}`});

    const elementProperty = new ElementProperty();

    document.querySelector("#callNumberClient").style.display = "none";
    const order = Session.get("orderDeliverySelected");

    updateMessages(order);

    socket.on(`deliveryChat_${order.id}`, () => {
        updateMessages(order);
    });

    elementProperty.addEventInElement(".back-page", "onclick", comeBackIndex);
    elementProperty.addEventInElement(".btn-send-message", "onclick", sendMessage);

    elementProperty.getElement("#messagesDriver", element => {
        element.innerHTML = "";
    });

    elementProperty.getElement(".name-establishment-chat", element => {
        element.innerHTML = order.customer.name;
    });

    elementProperty.addClass(".option-message", "active");

    function comeBackIndex() {
        Route.backPage();
    }

    function sendMessage() {
        elementProperty.getElement("#messageTripDriver", element => {
            if (element.value.trim().length === 0)
                return;

            addPreviewMessage(element.value);

            ConnectionServer.sendRequest(`delivery/order/${order.id}/chat`, "POST", {
                message: element.value,
                sendTo: "driver"
            }, () => {
            }, () => {
            }, undefined, false, true);

            element.value = "";

            element.focus();
        });
    }


    function updateMessages(order) {
        getMessages(order.id).then(({response}) => {
            document.querySelector("#messagesDriver").innerHTML = '';
            response.reverse().map(item => {
                addMessage(item.message, item.created_at, item.driverId != null, "", false)
            })
        })
    }

    function getMessages(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`delivery/order/${id}/chat?type=driver`, "GET", null, resolve, reject, undefined, false, true);
        })
    }


    function addMessage(message, date, isDriver, idMessagesChatTrip, viewed) {
        const element = $("#messagesDriver");

        const whoSent = isDriver ? `message-driver ${viewed ? "" : "not-viewed"}` : "message-client";

        if (message.includes("call-number")) {
            element.append(`<li class="${message}" id="chat${idMessagesChatTrip}" content-call-customer="${getTextTranslate("chat", "content-call-customer")}" content-call-driver="${getTextTranslate("chat", "content-call-driver")}"></li>`);
            $("#continer-messages").scrollTop(element.height());
            return;
        }

        element.append(`<li class="${whoSent}" id="chat${idMessagesChatTrip}" content-read="${getTextTranslate("chat", "content-read")}" content-delivery="${getTextTranslate("chat", "content-delivery")}">
                        <div class="container-message">
                            <div class="time-message">${date}</div>
                            <pre class="message">${message}</pre>
                        </div>
                    </li>`);
        $("#continer-messages").scrollTop(element.height());

    }

    function addPreviewMessage(message) {
        const element = $("#messagesDriver");

        const whoSent = "message-driver";

        if (message.includes("call-number"))
            return;

        element.append(`<li class="${whoSent} preview-message" >
                        <div class="container-message">
                            <div class="time-message"></div>
                            <div class="message">${message}</div>
                        </div>
                    </li>`);
        $("#continer-messages").scrollTop(element.height());

    }
});
