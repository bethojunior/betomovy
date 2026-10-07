function selectAnotherTypeDriver(user) {

    return new Promise(resolve => {
        viewController.elementProperty.removeClass(".preloader-search-trip", "active");

        showAnotherPrice();
        resolve();
    });
}

function showAnotherPrice() {

    if (managerTrip.typeTaxi.priceName === undefined)
        managerTrip = Session.getLocal("managerTrip");


    if (!Array.isArray(managerTrip)) {
        viewController.elementProperty.getElement("#typeOtherReturn", element => {
            element.innerHTML = managerTrip.prices
                .filter(item => item.tripTypeId !== managerTrip.tripCurrent.tripTypeId).map(item => {
                    return `<li class="trip-another-type" value='${JSON.stringify(item)}'>
                    <img src="${environment.hosts.local}webfiles/img/logo/return-${item.tripTypeId}.png">
                    <p><span>${JSON?.parse(localStorage?.getItem('cityConfig'))?.typeMoney}</span>${Mask.maskMoney(item.price)}</p>
                    </li>`
                }).join("");
        });
    }

    viewController.elementProperty.addEventInElement("#cancelAnotherTrip", "onclick", function () {
        viewController.elementProperty.removeClass(".modal-switch-type-return", "active");
    });

    viewController.elementProperty.addClass(".modal-switch-type-return", "active");
    viewController.elementProperty.getElement("#typeTaxiSelected", element => {
        element.innerHTML = managerTrip.typeTaxi.priceName;
    });

    viewController.elementProperty.addEventInElement(".trip-another-type", "onclick", function () {
        viewController.elementProperty.removeClass(".modal-switch-type-return", "active");

        const type = JSON.parse(this.getAttribute("value"));

        const trip = Session.get("lastTrip");

        managerTrip.typeTaxi = type;
        trip.priceId = type.idPrice;
        trip.price = type.price;
        trip.tripTypeId = type.tripTypeId;

        //Session.set("managerTrip",managerTrip);

        if (parseInt(trip.tripPaymentFormId) === PAYMENT_CARD_CREDIT) {
            getCardSelectedPayTrip(Session.get("cardSelected")).then(() => {
                initNewTrip(trip);
            }).catch((message) => {
                SwalCustom.messageDialog("", message, undefined, "warning");
            });
            return;
        }

        initNewTrip(trip);
    });
}

function callAgainTrip() {

    const trip = Session.get("lastTrip");

    if (parseInt(trip.tripPaymentFormId) === PAYMENT_CARD_CREDIT) {
        getCardSelectedPayTrip(Session.get("cardSelected")).then(() => {
            initNewTrip(trip);
        }).catch((message) => {
            SwalCustom.messageDialog("", message, undefined, "warning");
        });
        return;
    }

    initNewTrip(trip);
}