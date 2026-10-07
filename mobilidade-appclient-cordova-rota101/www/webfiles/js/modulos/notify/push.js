Route.waitView().then(() => {
    const elementProperty = new ElementProperty();

    const push = new Push();

    push.addEvent("notifyChat", notifyChat);
    push.addEvent("openAppOnDriverArrival", openAppOnDriverArrival);
    push.addEvent("newNotificationApp", (data) => {
        if (data.additionalData.coldstart === false && data.additionalData.foreground === false) {
            setTimeout(() => {
                showDetailNotificationByPush(data);
            }, 1000)
        } else {
            updateNotificationsApp();
        }

    });

    function notifyChat() {
        if (viewController.currentView === "chat-trip")
            return;

        elementProperty.getElement(".chat-client", element => {
            element.classList.add("active");
        });

        elementProperty.getElement("#songMessage", element => {
            element.play();
        })
    }

    function openAppOnDriverArrival() {
        setTimeout(function () {
            InfoTrip.showArrivalDriver();
        }, 5000)
    }
})
