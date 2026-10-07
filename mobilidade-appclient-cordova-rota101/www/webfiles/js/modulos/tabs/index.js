function showTab() {

    if (
        ConfigGeneral().get("enable_mobility_app") == true &&
        ConfigGeneral().get("enable_freight_app") == true &&
        ConfigGeneral().get("enable_share_trip_app") == true) {
        viewController.elementProperty.addClass(".container-main", "active");
    } else {
        let countActive = 0;
        if (ConfigGeneral().get("enable_mobility_app") == false) {
            document.querySelector("#enableMobilityApp").style.display = "none";
        } else {
            countActive++;
        }

        if (ConfigGeneral().get("enable_freight_app") == false) {
            document.querySelector("#enableFreightApp").style.display = "none";
        } else {
            countActive++;
        }

        if (ConfigGeneral().get("enable_share_trip_app") == false) {
            document.querySelector("#enableShareTripApp").style.display = "none";
            viewController.elementProperty.getElement(".share-trip-app-event", element=> {
                element.style.display = "none";
            })
        } else {
            countActive++;
        }

        if (ConfigGeneral().get("enable_mobility_app")) {
            if (countActive > 1)
                viewController.elementProperty.addClass(".container-main", "active");
        }
    }

    viewController.elementProperty.getElement("#contentTabHome", element => {
        element.setAttribute("label-notify-item", getTextTranslate("tabs", "notify-item"));
    });

    viewController.elementProperty.addEventInElement(".option-item-tab", "onclick", function () {
        if (this.classList.contains("active"))
            return;

        viewController.elementProperty.removeClass(".option-item-tab", "active");
        this.classList.add("active");

        if (this.classList.contains("notify-tab")) {
            document.querySelector("#contentTabHome").classList.remove("show-notify");
            this.classList.remove("notify-tab");
        }

        viewController.elementProperty.getElement(".views-dynamic", element => element.style.display = "none");

        pages.map(item => {
            if (item.component) {
                item.component.map(object => {
                    viewController.elementProperty.removeClass(object.component, object.class);
                });
                item.callback();
            }
        });

        pages = [];

        Route.redirectDynamic(this.getAttribute("view"), this.getAttribute("action"));
    });

    if (!Array.isArray(Session.get("tripReferenceRide"))) {
        (new ChatRepository()).getAllMessagesRider(Session.getValueInSession("user", "idUser"), (result) => {
            const element = document.querySelector("#enableShareTripApp");
            if (!element.classList.contains("active")) {
                document.querySelector("#contentTabHome").classList.add("show-notify");
                element.classList.add("notify-tab");
            }
        });
    }
}

function hideTab() {
    viewController.elementProperty.removeClass(".container-main", "active");
}
