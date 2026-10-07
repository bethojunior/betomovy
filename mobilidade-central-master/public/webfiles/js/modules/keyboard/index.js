document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("keyup", event => {
        switch (event.keyCode) {
            case 13: {
                actionEnter(event);
                break;
            }
            case 27: {
                actionESC(event);
                break;
            }
            case 40: {
                actionDownKey();
                break;
            }
            case 39: {
                actionRight();
                break;
            }
            case 38: {
                actionUpKey();
                break;
            }
            case 37: {
                actionLeft();
                break;
            }
        }
    });

    function actionESC(event) {
        if (document.querySelector(".container-preload-main").classList.contains("active"))
            return;

        if (document.querySelector(".list-trips-active-partner").classList.contains("active")) {
            document.querySelector(".close-trip-actives").click();
            return;
        }

        if (document.querySelector(".container-search-local").classList.contains("active")) {
            document.querySelector(".back-address").click();
            return;
        }

        if(document.querySelector("#modalChoiceTax").classList.contains("show")) {
            document.querySelector(".modal-type-customer").classList.remove("option-client-selected");
            return $("#modalChoiceTax").modal("hide");
        }

        if(document.querySelector("#modalNeighborhood").classList.contains("show")) {
            document.querySelector(".modal-type-customer").classList.remove("option-client-selected");
            return $("#modalNeighborhood").modal("hide");
        }

        if (document.querySelector(".modal-confirmation-data-trip").classList.contains("active"))
            return document.querySelector(".modal-confirmation-data-trip").classList.remove("active");

        if (document.querySelector(".modal-create-customer").classList.contains("active")) {
            document.querySelector(".modal-type-customer").classList.remove("option-client-selected");
            return document.querySelector(".modal-create-customer").classList.remove("active");
        }

        if (document.querySelector(".modal-find-customer").classList.contains("active")) {
            document.querySelector(".modal-type-customer").classList.remove("option-client-selected");
            return document.querySelector(".modal-find-customer").classList.remove("active");
        }

        if (document.querySelector(".payment-trip-selected")) {
            document.querySelector(".payment-trip").classList.remove("payment-trip-selected");
            return selectPaymentForm();
        }

        if (document.querySelector(".type-cars").classList.contains("trip-type-selected"))
            return closePaymentFormKey();

        if (document.querySelector(".modal-type-customer").classList.contains("client-selected")) {
            document.querySelector(".modal-find-customer").classList.remove("active");
            document.querySelector(".modal-type-customer").classList.remove("client-selected");
            return;
        }

        if (isTripConfirmationScreenVisible()) {
            closeTripAndGoBack();
            return;
        }

        if (document.querySelector("#callRunning").classList.contains("active")) {
            document.querySelector("#btnCloseTripPanel").click();
            return;
        }

        closeAddressTrip(event);
    }

    function actionLeft() {
        if (document.querySelector(".footer-container-trip").classList.contains("active")
            && !document.querySelector(".type-cars").classList.contains("trip-type-selected"))
            selectTypeTripLeft()


        if(document.querySelector("#modalChoiceTax").classList.contains("show")){
            document.querySelector("#btnRouteOption").classList.remove("btn-outline-secondary");
            document.querySelector("#btnRouteOption").classList.add("btn-primary");
            document.querySelector("#btnNeighborhoodOption").classList.remove("btn-primary");
            document.querySelector("#btnNeighborhoodOption").classList.add("btn-outline-secondary");
            return;
        }
    }

    function actionRight() {
        if (document.querySelector(".footer-container-trip").classList.contains("active")
            && !document.querySelector(".type-cars").classList.contains("trip-type-selected"))
            return selectTypeTripRight();

        if(document.querySelector("#modalChoiceTax").classList.contains("show")){
            document.querySelector("#btnRouteOption").classList.remove("btn-primary");
            document.querySelector("#btnRouteOption").classList.add("btn-outline-secondary");
            document.querySelector("#btnNeighborhoodOption").classList.remove("btn-outline-secondary");
            document.querySelector("#btnNeighborhoodOption").classList.add("btn-primary");
            return;
        }
    }

    function actionUpKey() {
        if (document.querySelector(".modal-create-customer.active"))
            return;

        if (document.querySelector(".modal-find-customer").classList.contains("active"))
            return afterClientSelected();

        if (!document.querySelector(".modal-type-customer").classList.contains("client-selected"))
            return afterOptionCustomerSelected();

        if(document.querySelector("#modalNeighborhood").classList.contains("show"))
            return document.querySelector("#neighborhoodSelect").focus();

        if (document.querySelector('.container-menu').classList.contains("active"))
            return afterAddressSelected();

        if (document.querySelector(".footer-payment-form").classList.contains("active"))
            return afterPaymentFormSelected();
    }

    function actionDownKey() {
        if (document.querySelector(".modal-create-customer.active"))
            return;

        if(document.querySelector("#modalNeighborhood").classList.contains("show"))
            return document.querySelector("#neighborhoodSelect").focus();

        if (document.querySelector(".modal-find-customer").classList.contains("active"))
            return nextClientSelected();

        if (!document.querySelector(".modal-type-customer").classList.contains("client-selected"))
            return downOptionCustomerSelected();

        if (document.querySelector('.container-menu').classList.contains("active"))
            return nextAddressSelected();

        if (document.querySelector(".footer-payment-form").classList.contains("active"))
            return nextPaymentFormSelected();
    }

    function actionEnter(event) {
        if (document.querySelector(".box-chat.active"))
            return;
        if (document.querySelector(".modal-create-customer").classList.contains("active"))
            return;

        if(document.querySelector("#modalNeighborhood").classList.contains("show"))
            return document.querySelector("#btnNeighborhoodSelected").onclick();

        //Passos para selecionar o cliente na vaigem
        //Passos para selecionar o cliente na vaigem
        if (!document.querySelector(".modal-type-customer").classList.contains("client-selected")) {
            if (!document.querySelector(".modal-type-customer").classList.contains("active") &&
                !document.querySelector(".modal-type-customer").classList.contains("option-client-selected"))
                return toggleCallOrCancel(event);

            if (document.querySelector(".modal-type-customer").classList.contains("active") &&
                !document.querySelector(".modal-type-customer").classList.contains("option-client-selected")) {
                const element = document.querySelector(".option-selected-customer-trip.active");
                if (element) {
                    element.onclick();
                    document.querySelector(".modal-type-customer").classList.add("option-client-selected");
                }
                return;
            }
        }

        if(document.querySelector("#modalChoiceTax").classList.contains("show")) {
            if(document.querySelector("#btnRouteOption").classList.contains("btn-primary")){
                document.querySelector("#btnRouteOption").onclick();
            }
            if(document.querySelector("#btnNeighborhoodOption").classList.contains("btn-primary")){
                document.querySelector("#btnNeighborhoodOption").onclick();
            }
            return $("#modalChoiceTax").modal("hide");
        }


        if (document.querySelector(".modal-find-customer").classList.contains("active")) {
            const element = document.querySelector(".select-customer.active");
            if (element)
                element.onclick();
            return;
        }

        if (!document.querySelector("#containerMenu").classList.contains("active") &&
            !document.querySelector(".footer-container-trip").classList.contains("active"))
            return toggleCallOrCancel(event);

        if (document.querySelector("#containerMenu").classList.contains("active") &&
            !document.querySelector(".footer-container-trip").classList.contains("active")
        )
            return selectAddressSelected();
        if (!document.querySelector(".type-cars").classList.contains("trip-type-selected"))
            return selectPaymentForm();

        if (document.querySelector(".footer-payment-form").classList.contains("active"))
            return confirmPaymentFormKey();

        if (!document.querySelector(".modal-confirmation-data-trip").classList.contains("active")) {
            const element = document.querySelector(".btn-search-trip");

            if (element)
                element.onclick();

            return;
        }

        if (document.querySelector(".modal-confirmation-data-trip").classList.contains("active")) {
            const element = document.querySelector("#btnConfirmationTrip");
            if (element)
                element.onclick();
        }

    }

    function afterAddressSelected() {
        selectItemUp(".local-trip-customer", "focus-item", ".history-trips");
        if (Session.get("lastInputSearch"))
            document.querySelector(`#${Session.get("lastInputSearch")}`).focus();
    }

    function nextAddressSelected() {
        selectItemDown(".local-trip-customer", "focus-item", ".history-trips");
        if (Session.get("lastInputSearch"))
            document.querySelector(`#${Session.get("lastInputSearch")}`).focus();
    }

    function selectAddressSelected() {
        const element = document.querySelector(".local-trip-customer.focus-item");
        if (element)
            element.onclick();
    }

    function selectPaymentForm() {
        document.querySelector(".type-cars").classList.add("trip-type-selected");
        document.querySelector("#choicePaymentTrip").onclick();
    }

    function nextPaymentFormSelected() {
        selectItemDown(".payment-form-trip", "active", ".list-payment-forms");
    }

    function afterPaymentFormSelected() {
        selectItemUp(".payment-form-trip", "active", ".list-payment-forms");
    }

    function confirmPaymentFormKey() {
        const element = document.querySelector(".payment-form-trip.active");
        if (element) {
            element.onclick();
            document.querySelector(".payment-trip").classList.add("payment-trip-selected")
        }
    }

    function downOptionCustomerSelected() {
        selectItemDown('.option-selected-customer-trip', 'active')
    }

    function afterOptionCustomerSelected() {
        selectItemUp('.option-selected-customer-trip', 'active')
    }

    function nextClientSelected() {
        selectItemDown('.select-customer', 'active', "#listCustomer")
    }

    function afterClientSelected() {
        selectItemUp('.select-customer', 'active', "#listCustomer")
    }

    function selectItemDown(classNameItems, classNameActive, containerScroll = null) {
        let indexSelect = 0;
        let foundElement = false;
        let scroll = 0;
        const listElementAddress = document.querySelectorAll(classNameItems);
        listElementAddress.forEach((element, index) => {
            if (element.classList.contains(classNameActive)) {
                foundElement = true;
                indexSelect = index;
                if (listElementAddress[index + 1] != null)
                    indexSelect = index + 1;
            }

            if (!foundElement)
                scroll += element.offsetHeight;

            element.classList.remove(classNameActive);
        });

        if (listElementAddress.length > 0) {
            const element = listElementAddress.item(indexSelect);
            element.classList.add(classNameActive);

            if (indexSelect > 0 && containerScroll != null) {
                document.querySelector(containerScroll).scrollTo(0, scroll);
            }

        }
    }

    function selectItemUp(classNameItems, classNameActive, containerScroll = null) {
        let indexSelect = 0;
        let foundElement = false;
        let scroll = 0;
        const listElementAddress = document.querySelectorAll(classNameItems);
        listElementAddress.forEach((element, index) => {
            if (element.classList.contains(classNameActive)) {
                foundElement = true;
                indexSelect = index;
                if (listElementAddress[index - 1] != null)
                    indexSelect = index - 1;
            }

            if (!foundElement)
                scroll += element.offsetHeight;

            element.classList.remove(classNameActive);
        });

        if (listElementAddress.length > 0) {
            const element = listElementAddress.item(indexSelect);
            element.classList.add(classNameActive);

            if (containerScroll)
                document.querySelector(containerScroll).scrollTo(0, scroll - element.offsetHeight);
        }
    }


    function selectTypeTripRight() {
        const types = document.querySelectorAll(".trip-type");
        let indexSelected = 0;

        types.forEach((element, index) => {
            if (element.classList.contains("active")) {
                indexSelected = index;
                if (types[index + 1] != null)
                    indexSelected = index + 1;
            }
        });

        if (types.length > 0) {
            const isNext = (((100 * indexSelected) / 3) % 1) === 0;
            if (isNext) {
                const next = document.querySelector(".next-container-price.active");
                if (next)
                    next.onclick();
            }
            const element = types.item(indexSelected);
            element.onclick();
        }
    }

    function selectTypeTripLeft() {
        const types = document.querySelectorAll(".trip-type");
        let indexSelected = 0;

        types.forEach((element, index) => {
            if (element.classList.contains("active")) {
                indexSelected = index;
                if (types[index - 1] != null)
                    indexSelected = index - 1;
            }
        });

        if (types.length > 0) {
            const isAfter = (((100 * (indexSelected + 1)) / 3) % 1) === 0;
            if (isAfter) {
                const prev = document.querySelector(".prev-container-price.active");
                if (prev)
                    prev.onclick();
            }
            const element = types.item(indexSelected);
            element.onclick();
        }
    }

});