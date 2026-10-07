const managerAccessibilityItem = {
    typeGetItem: [],
    typeDeliveryItem: [],
    helper: 0,
};

function openAccessibilityItem() {
    managerAccessibilityItem.typeGetItem = [];
    managerAccessibilityItem.typeDeliveryItem = [];
    managerAccessibilityItem.helper = 0;

    viewController.elementProperty.removeClass(".type-accessibility-get-item", "active");
    viewController.elementProperty.removeClass(".type-accessibility-delivery-item", "active");
    viewController.elementProperty.removeClass(".is-helper-man", "active");


    createListFloor("#numberFloorGetItem");
    createListFloor("#numberFloorDeliveryItem");

    Route.startClassesInComponent([
        {component: ".container-accessibility-item", class: "active"},
    ], () => {
        viewController.elementProperty.removeClass(".container-accessibility-item", "active");
    }, COMPONENT_CREATE_TRIP);

    viewController.elementProperty
        .addEventInElement("#confirmationAccessibilityItem", "onclick", () => {
            //showAlertInfoTravel();

            calculatePriceFreightCustomer();
        });

    showAccessibilityInfo();

    calculateAccessibility();
}

function calculatePriceFreightCustomer(typeCalculatePrice = "forMe") {
    viewController.elementProperty.removeClass(".modal-type-customer", "active");
    viewController.elementProperty.removeClass(
        ".modal-type-customer",
        "form-customer"
    );

    viewController.elementProperty.addEventInElement(".add-photo-item", "onclick", () => {
        const capturePhoto = new CapturePhoto();
        capturePhoto.get().then(path => {

            managerItemDelivery.photos.push(path);

            const element = document.createElement("LI");

            element.style.backgroundImage = `url(${path})`;

            element.innerHTML = `<i class="material-icons remove-image" path="${path}">close</i>`;

            document.querySelector(`#listPhotosItems`).append(element);

            viewController.elementProperty.addEventInElement(".remove-image", "onclick", function () {
                managerItemDelivery.photos = managerItemDelivery.photos.filter(path => {
                    return path !== this.getAttribute("path");
                });

                this.parentElement.remove();
            });
        })
    });

    Route.startClassesInComponent([
        {component: ".container-detail-freight-trip", class: "active"},
    ], () => {
        //initProcessingCallTrip();
        viewController.elementProperty.removeClass(".container-detail-freight-trip", "active");

        if (!document.querySelector(".container-selected-item").classList.contains("active"))
            openScheduledTime();

    }, COMPONENT_CREATE_TRIP);

    viewController.elementProperty.getElement(".trip-item-type", element => {
        element.innerHTML = "";
    });

    getPlaceholderSuggestion();

    getTripItemTypes();

    calculateValuesFreight();

    viewController.elementProperty.addEventInElement(".btn-confirm-detail-trip", "onclick", function () {
        showAlertInfoTravel();
    });

    /*priceTrip.showPriceTrip(trip.origin, trip.destination, waypoints)
        .then((data) => {

            /*checkOptionDefaultActive(data);

            managerTrip.prices = data.prices;

            viewController.elementProperty.addEventInElement(".trip-type", "onclick", getTaxiType);/
            //showRoute(waypoints, data);
        });*/
}


function getTripItemTypes() {
    TripItemTypeController.getAll().then(({data}) => {
        viewController.elementProperty.getElement(".trip-item-type", element => {
            element.innerHTML = data.map((item, index) => {
                let isActive = "";

                if (index === 0) {
                    trip.tripItems = [{tripItemTypeId: item.id}];
                    isActive = "active";
                }


                return `<div class="trip-type ${isActive}"
                            value='${JSON.stringify(item)}'>
                            <img src="${item.picture}" onerror="this.src='webfiles/img/svg/question-mark.svg'">
                            <p>${item.name}</p>
                        </div>`;
            }).join("");

            viewController.elementProperty.addEventInElement(".trip-type", "onclick", function () {
                viewController.elementProperty.removeClass(".trip-type", "active");
                this.classList.add("active");

                const item = JSON.parse(this.getAttribute("value"));

                globalFreight.tripItems = [{tripItemTypeId: item.id}];
            });
        });
    })
}

function getPlaceholderSuggestion() {
    DeliveryInfoController.suggestion().then(({status, data}) => {
        if (!status)
            return;

        viewController.elementProperty.getElement("#obsOrigin", element=>{
            element.setAttribute("placeholder", data.obsOrigin);
        });
        viewController.elementProperty.getElement("#obsDestination", element=>{
            element.setAttribute("placeholder", data.obsDestination);
        });
        viewController.elementProperty.getElement("#obs", element=>{
            element.setAttribute("placeholder", data.obs);
        });
    });
}


function showAlertInfoTravel() {
    preload(true);
    calculateValuesFreight().then(() => {
        managerAccessibilityItem.helper = document.querySelectorAll(".is-helper-man.active").length;

        showBudgetFreight();
    }).finally(() => {
        preload(false);
    })
    /*Route.startClassesInComponent([
        {component: ".container-alert-info-travel", class: "active"},
    ], () => {
        viewController.elementProperty.removeClass(".container-alert-info-travel", "active");

        if (!document.querySelector(".container-selected-item").classList.contains("active") &&
            !document.querySelector(".footer-container-trip").classList.contains("active"))
            openScheduledTime();


    }, COMPONENT_CREATE_TRIP);

    viewController.elementProperty.addEventInElement("#btnAlertInfoTravel", "onclick", () => {
        preload(true);
        calculateValuesFreight().then(() => {
            managerAccessibilityItem.helper = document.querySelectorAll(".is-helper-man.active").length;

            showBudgetFreight();
        }).finally(() => {
            preload(false);
        })
    });*/

    viewController.elementProperty.addEventInElement("#supportAlertInfoTravel", "onclick", () => {

        const support = !Array.isArray(Session.getValueInSession("cityConfig", "supportContactNumber")) ?
            Session.getValueInSession("cityConfig", "supportContactNumber") :
            null;

        if (support == null)
            return SwalCustom.messageDialog("", "Nenhum número de suporte disponível");

        cordova.InAppBrowser.open(`https://wa.me/${support}/`, '_system', 'location=yes')
    });
}


function showAccessibilityInfo() {
    viewController.elementProperty.getElement("#listAccessibilityGetItem", element => {
        element.innerHTML = globalFreight.infoCalculate.price.accessibility.priceObstacle.map(item => {
            return `<li class="type-accessibility-get-item"
                        accessibilityId="${item.id}"
                        value='${JSON.stringify(item)}'>
                    <div style="background-image: url(${item.picture})"></div>
                    <span>${item.obstacle}</span>
                </li>`
        }).join("");
    });

    viewController.elementProperty.getElement("#listAccessibilityDeliveryItem", element => {
        element.innerHTML = globalFreight.infoCalculate.price.accessibility.priceObstacle.map(item => {
            return `  <li class="type-accessibility-delivery-item" 
                        accessibilityId="${item.id}"
                        value='${JSON.stringify(item)}'>
                    <div style="background-image: url(${item.picture})"></div>
                    <span>${item.obstacle}</span>
                </li>`
        }).join("");
    });

    viewController.elementProperty.getElement(".list-helper", element => {
        element.innerHTML = globalFreight.infoCalculate.price.accessibility.priceHelp.map(item => {
            let list = '';

            for (let i = 0; i < parseInt(item.quantityIcon); i++) {
                list += `<li class="is-helper-man" type="delivery-man" accessibilityHelpId="${item.accessibilityHelpId}">
                            <div style="background-image: url(${item.picture})"></div>
                            <span>${item.help}</span>
                        </li>`;

            }

            return list;
        }).join("");
    });


    initEventAccessibility();
}

function initEventAccessibility() {
    viewController.elementProperty.addEventInElement(".type-accessibility-get-item", "onclick", function () {
        if (!this.classList.contains("active")) {
            viewController.elementProperty.removeClass(".type-accessibility-get-item","active");
            this.classList.add("active");
        } else {
            this.classList.remove("active");
        }

        calculateAccessibility();
    });

    viewController.elementProperty.addEventInElement(".type-accessibility-delivery-item", "onclick", function () {
        if (!this.classList.contains("active")) {
            viewController.elementProperty.removeClass(".type-accessibility-delivery-item","active");
            this.classList.add("active");
        } else {
            this.classList.remove("active");
        }

        calculateAccessibility();
    });

    viewController.elementProperty.addEventInElement(".is-helper-man", "onclick", function () {
        if (!this.classList.contains("active")) {
            this.classList.add("active");
        } else {
            this.classList.remove("active");
        }

        calculateAccessibility();
    });
}

function calculateAccessibility() {
    viewController.elementProperty.getElement("#valueTripFreight", element => {
        element.innerHTML = `${CityConfig.getTypeCoin()}${Mask.maskMoney(globalFreight.infoCalculate.price.price)}`;
    });

    viewController.elementProperty.getElement("#listAdditional", element => {
        let totalFreight = globalFreight.infoCalculate.price.price;

        if (globalFreight.infoCalculate.price.accessibility != null)
            element.innerHTML = globalFreight.infoCalculate.price.accessibility.priceObstacle.map(item => {
                const count = document.querySelectorAll(`li[accessibilityId='${item.id}'].active`).length;
                const price = parseFloat(item.value);
                const total = price * count;

                totalFreight += total;

                return `<p><span>Adicional ${item.obstacle}:</span><span>${count} x ${CityConfig.getTypeCoin()}${Mask.maskMoney(price)} = ${CityConfig.getTypeCoin()}${Mask.maskMoney(total)}</span></p>`
            }).join("");


        if (globalFreight.infoCalculate.price.accessibility != null)
            element.innerHTML += globalFreight.infoCalculate.price.accessibility.priceHelp.map(item => {
                const count = document.querySelectorAll(`li[accessibilityHelpId='${item.accessibilityHelpId}'].active`).length;
                const price = parseFloat(item.value);
                const total = price * count;

                totalFreight += total;

                return `<p><span>Adicional ${item.help}:</span><span>${count} x ${CityConfig.getTypeCoin()}${Mask.maskMoney(price)} = ${CityConfig.getTypeCoin()}${Mask.maskMoney(total)}</span></p>`
            }).join("");

        viewController.elementProperty.getElement("#valueFreight", element => {

            freightValue.total = totalFreight;
            element.innerHTML = `${CityConfig.getTypeCoin()}${Mask.maskMoney(totalFreight)}`;
        });
    })
}

const ACTION_COLLECT = 1;
const ACTION_DELIVERY = 2;

function getAccessibilitySelected() {
    const accessibility = {
        obstacle: [],
        assistant: []
    };

    document.querySelectorAll(".type-accessibility-get-item.active").forEach(element => {
        const item = JSON.parse(element.getAttribute("value"));

        accessibility.obstacle.push({
            actionId: ACTION_COLLECT,
            obstacleOnFloorId: item.obstacleOnFloorId
        })
    });

    document.querySelectorAll(".type-accessibility-delivery-item.active").forEach(element => {
        const item = JSON.parse(element.getAttribute("value"));

        accessibility.obstacle.push({
            actionId: ACTION_DELIVERY,
            obstacleOnFloorId: item.obstacleOnFloorId
        })
    });

    document.querySelectorAll(".is-helper-man.active").forEach(element => {
        accessibility.assistant.push({
            actionId: ACTION_COLLECT,
            helpId: element.getAttribute("accessibilityhelpid")
        });

        accessibility.assistant.push({
            actionId: ACTION_DELIVERY,
            helpId: element.getAttribute("accessibilityhelpid")
        })
    });

    return accessibility;
}

function createListFloor(id) {
    viewController.elementProperty.addEventInElement(id, "oninput", function () {
        document.querySelector(id + "Value").innerHTML = this.value;
    });
}
