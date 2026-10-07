class ChatNotification {
    constructor() {
        this.elementProperty = new ElementProperty();

        this.userLogged = Session.get("user");

        this.tripChat = null;
    }

    observerNotification(trip, callbackMessage, callbackIgnore) {
        if (trip.tripCallTypeId === TRIP_CALL_CORPORATE || trip.tripCallTypeId === TRIP_CALL_RIDE)
            return;
        this.tripChat = trip;

        if (this.chatRepository == null) {
            this.chatRepository = new ChatRepository();
        }

        this.chatRepository.close();
        this.chatRepository.getLastMessageUnread(trip.tripReference, (result, idDoc) => {

            this.elementProperty.getElement(".name-client-notification", element => {
                element.innerHTML = "Mensagem de " + trip.customerName;
            });
            this.elementProperty.addEventInElement(".container-notification-chat", "onclick", () => {
                if (callbackMessage !== undefined)
                    callbackMessage();

                this.elementProperty.getElement(".container-notification-chat", element => {
                    element.classList.remove("active")
                });
            });
            this.elementProperty.addEventInElement(".close-notification-chat", "onclick", () => {
                if (callbackIgnore !== undefined)
                    callbackIgnore();

                this.elementProperty.getElement(".container-notification-chat", element => {
                    element.classList.remove("active")
                });
            });

            const dateSend = new Date();

            dateSend.setTime(result.date.seconds * 1000);

            this.elementProperty.getElement(".time-notification", element => {
                element.innerHTML = dateSend.toLocaleTimeString();
            });

            if (parseInt(result.userId) != parseInt(this.userLogged.idUser)) {
                this.elementProperty.getElement(".message-client-notification", element => {
                    if (result.isAudio)
                        return element.innerHTML = "Mensagem de áudio";
                    if (result.message === "call-number call-driver")
                        return element.innerHTML = getTextTranslate("notification", "notify-called-customer");

                    element.innerHTML = result.message;
                });

                openAppForeground();
                this.chatRepository.setViewMessage(idDoc);

                if (viewController.currentView === "chat-trip")
                    return;

                this.elementProperty.getElement(".amount-msg", element => {
                    const amountNotification = parseInt(element.innerHTML);
                    viewController.elementProperty.getElement('#songNewMessageChat', element => {
                        element.play();
                    });
                    element.innerHTML = isNaN(amountNotification) ? 1 : amountNotification + 1;
                });

                if (!(ConfigGeneral().get("lite_map_option") == true))
                    this.elementProperty.addClass(".container-notification-chat", "active");
            }
        });
    }

    closeChat() {
        this.elementProperty.getElement(".container-notification-chat", element => {
            element.classList.remove("active")
        });

        this.elementProperty.getElement(".amount-msg", element => {
            element.innerHTML = '';
        });

        if (this.chatRepository)
            this.chatRepository.close();

        if (this.tripChat === null)
            return;

        if (this.tripChat.tripReference === null)
            return;

    }
}

const chatNotification = new ChatNotification();
