viewController.setObserver("multiple-chat", (data = null) => {
    const trip = data || Session.get("tripDriver");

    const chatTripRepository = new ChatRepository();

    document.querySelector("#listRiders").innerHTML = trip.ride.riders.map(rider => {
        return `<li class="rider-trip ${rider.isResponsible == false ? "is-not-responsible" : ""}" value="${btoa(JSON.stringify(rider))}" userId="${rider.userId}">
                    <div class="profile-image-chat"></div>
                    <div>
                        <b>${rider.name}</b>
                        <p>
                            <span>Responsável:</span>    
                            ${rider.responsibleName}
                        </p>
                    </div>
                </li>`
    }).join("");

    chatTripRepository.getLastMessageUnread(trip.tripReference, (item, id) => {
        if (parseInt(item.userId) != parseInt(Session.getValueInSession("user","idUser"))) {
            if(document.querySelector(`.rider-trip[userId='${item.customerUserId}']`))
                document.querySelector(`.rider-trip[userId='${item.customerUserId}']`).classList.add("active");

            chatTripRepository.setViewMessage(id);
        }
    });

    viewController.elementProperty.addEventInElement(".go-back", "onclick", () => {
        Route.backPage();
    });

    viewController.elementProperty.addEventInElement(".rider-trip", "onclick", function () {
        if(this.classList.contains("is-not-responsible"))
            return;
        this.classList.remove("active");
        const rider = JSON.parse(atob(this.getAttribute("value")));
        viewController.addParams("chat-trip-selected-rider", {rider,trip});
        Route.redirectDynamic("Driver", "ChatSelected");
    });

    viewController.elementProperty.addEventInElement(".back-page","onclick",()=> Route.backPage());
});
