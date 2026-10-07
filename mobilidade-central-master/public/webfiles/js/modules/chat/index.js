const chatCurrentRealtime = new ChatRealtime();

const manager = {
    tripReference: null,
    activeTrips: {},
};

const ignoredStatuses = [
    STATUS_SEARCHING_FAVORITE,
    STATUS_SEARCHING,
    STATUS_SCHEDULED,
];

function onTripUpdateChatEvent(results = []) {
    if (!Array.isArray(results) || results.length === 0) return;

    results
        .filter(({ data }) => !ignoredStatuses.includes(data.status))
        .forEach(({ data, type }) => {
            if (type === tripRealtime.typeRemoved) {
                manager.activeTrips[data.tripReference]?.close();
                removeChat(data);
                return;
            }

            const queryId = `.chat-item[tripReference='${data.tripReference}']`;
            if (document.querySelector(queryId)) {
                return;
            }

            addChat(data);
        });
    initEventChat();
}

function observerChatMessages(tripReference) {
    manager.activeTrips[tripReference] = new ChatRealtime();

    manager.activeTrips[tripReference].getLastMessageUnread(
        tripReference,
        async (result) => {
            if (result.isCentral) return;

            if (manager.tripReference === result.tripReference) return;

            viewController.elementProperty.addClass(
                ".box-chat",
                "notification-active"
            );

            document.querySelector(".box-chat").classList.add("active");

            document
                .querySelector(`.chat-item[tripReference='${tripReference}']`)
                .classList.add("notification-active");
            const audio = new Audio("./webfiles/songs/alertNewMessageChat.mp3");
            await audio.play();
        }
    );
}

function removeChat(trip) {
    if (!trip || trip.tripReference == null) return;

    const chatEl = document.querySelector(
        `.chat-item[tripReference='${trip.tripReference}']`
    );
    if (chatEl) chatEl.remove();
}

function addChat(trip) {
    viewController.elementProperty.getElement(".list-chat", (element) => {
        element.innerHTML += `<li class="chat-item" tripReference="${
            trip.tripReference
        }"
                            value='${JSON.stringify(trip)}'>
                        <div class="photo-driver"
                         style="background-image: url(${
                             environment.hosts.hostImageDriver
                         }${trip.driver.profileImage})">
                        </div>
                        <div class="info-chat-driver">
                            <p><span>Motorista:</span><span>${
                                trip.driver.name
                            }</span></p>
                            <p><span>Cliente:</span><span>${
                                trip.customer?.nickname
                            }</span></p>
                        </div>
                        <i class="material-icons">arrow_forward_ios</i>
                    </li>`;

        observerChatMessages(trip.tripReference);
    });
}

function initEventChat() {
    viewController.elementProperty.addEventInElement(
        ".chat-item",
        "onclick",
        function () {
            viewController.elementProperty.addClass(
                ".container-box-chat",
                "active"
            );

            const trip = JSON.parse(this.getAttribute("value"));

            document.getElementById("centralMessages").innerHTML = "";

            chatCurrentRealtime.close();

            manager.tripReference = trip.tripReference;

            viewController.elementProperty.removeClass(
                ".box-chat",
                "notification-active"
            );

            document
                .querySelector(
                    `.chat-item[tripReference='${trip.tripReference}']`
                )
                .classList.remove("notification-active");

            chatCurrentRealtime.getCurrentMessages(
                trip.tripReference,
                (result, idDoc) => {
                    chatCurrentRealtime.setViewMessage(idDoc);

                    viewController.elementProperty.getElement(
                        ".prev-message",
                        (element) => {
                            element.remove();
                        }
                    );

                    viewController.elementProperty.getElement(
                        "#centralMessages",
                        (element) => {
                            const container = $("#centralMessages");

                            const type = result.isCentral
                                ? "customer"
                                : "driver";

                            if (!result.isAudio) {
                                if (result.message.includes("call-number"))
                                    return;

                                element.innerHTML += `<li class="${type}"><div>${result.message}</div></li>`;
                            } else {
                                element.innerHTML += `<li class="${type}">
                                    <div>
                                        <audio controls><source src="${environment.hosts.hostAudio}${result.tripReference}/${result.message}" type="audio/mpeg"></audio>
                                    </div>
                                </li>`;
                            }
                            container.scrollTop(container.height());
                        }
                    );
                }
            );

            document.getElementById("nameDriverChat").innerHTML =
                trip.driver.name;

            viewController.elementProperty.addEventInElement(
                ".close-box-chat",
                "onclick",
                function () {
                    manager.tripReference = null;
                    viewController.elementProperty.removeClass(
                        ".container-box-chat",
                        "active"
                    );
                }
            );
        }
    );
}

document.addEventListener("DOMContentLoaded", function () {
    viewController.elementProperty.addEventInElement(
        ".close-chat",
        "onclick",
        function () {
            viewController.elementProperty.removeClass(".box-chat", "active");
        }
    );

    document.addEventListener("click", function (event) {
        const element = event.target;

        const isClickContainerChat =
            element.classList &&
            (element.classList.contains("container-chat-map") ||
                element.classList.contains("box-chat") ||
                element.classList.contains("img-chattrip"));

        if (!isClickContainerChat) {
            if (!document.querySelector(".container-box-chat.active"))
                viewController.elementProperty.removeClass(
                    ".box-chat",
                    "active"
                );
        }
    });

    let unsubscribeId = null;

    const centralId = Session.getValueInSession("centralSelected", "id").toString();

    if (!unsubscribeId) {
        unsubscribeId = tripRealtime.getTrips(centralId, onTripUpdateChatEvent);
    }

    viewController.elementProperty.addEventInElement(
        ".box-chat",
        "onclick",
        function () {
            if (!this.classList.contains("active")) {
                this.classList.add("active");
                this.classList.remove("notification-active");
            } else {
                this.classList.remove("active");
            }
        }
    );

    viewController.elementProperty.addEventInElement(
        "#btnSendMessage",
        "onclick",
        function () {
            const value = document.querySelector("#sendMessageByCentral").value;
            if (value.trim().length === 0) return;

            addPrev(value);

            ChatRepository.sendMessage(manager.tripReference, value);

            this.value = "";
        }
    );

    viewController.elementProperty.addEventInElement(
        "#sendMessageByCentral",
        "onkeyup",
        async function (event) {
            if (event.keyCode === 13) {
                if (this.value.trim().length === 0) return;

                let textForPrev = this.value;

                addPrev(this.value);

                await ChatRepository.sendMessage(
                    manager.tripReference,
                    textForPrev
                );

                this.value = "";
            }
        }
    );

    function addPrev(text) {
        const container = $("#centralMessages");
        viewController.elementProperty.getElement(
            "#centralMessages",
            (element) => {
                element.innerHTML += `<li class="prev-message customer"><div>${text}</div></li>`;
                container.scrollTop(container.height());
            }
        );
        document.querySelector("#sendMessageByCentral").value = "";
    }
});
