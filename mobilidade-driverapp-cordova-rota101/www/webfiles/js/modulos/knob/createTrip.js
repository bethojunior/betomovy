viewController.setObserver("know-trip", () => {
    const locales = {
        origin: null,
        destination: null,
        focus: null,
        price: null,
        recalculatedTrip: null,
        multiplierDynamic: null
    };

    document.getElementById("preloadLogin").style.display = "block";

    TripTypeController.findByLocale(Session.get("lastPosition")).then((result) => {
        const user = Session.get("user");
        const tripTypes = result.data.filter(item => {
            return user.tripTypes.filter(type => {
                return item.tripTypeId == type.tripTypeId;
            }).length > 0;
        });

        showModalTripType(tripTypes);
    }).finally(() => {
        document.getElementById("preloadLogin").style.display = "none";
    });

    clearKnobTrip();

    Mask.setMaskPhone("#phoneCustomerKnob");
    Mask.setMaskCpf("#documentCustomerKnob");

    function showModalTripType(tripTypes) {
        viewController.elementProperty.getElement("#listTripTypeKnob", element => {
            element.innerHTML = tripTypes.map(item => {
                return `<li class="select-type-trip-knob" value='${JSON.stringify(item)}'>${item.name}</li>`
            }).join("");

            viewController.elementProperty.addEventInElement(".select-type-trip-knob", "onclick", function () {
                const tripType = JSON.parse(this.getAttribute("value"));
                viewController.elementProperty.addClass(".container-modal-trip-knob", "active");
                Session.set("tripTypeKnob", tripType.tripTypeId);

                document.querySelector("#destination").focus();
            });

            viewController.elementProperty.removeClass(".container-modal-trip-knob", "active");
        });

        viewController.elementProperty.addEventInElement(".close-modal-type-knob", "onclick", function () {
            viewController.elementProperty.addClass(".container-modal-trip-knob", "active");
            Route.backPage();
        });
    }


    function updateLocalOrigin() {
        getAddressByLatLng(Session.get("lastPosition")).then(({status, data}) => {
            if (!status)
                return;

            document.querySelector(`#origin`).value = data.address;

            locales.origin = data;
        });
    }

    viewController.elementProperty.addEventInElement(".clear-input", "onclick", function () {
        const who = this.getAttribute("for");
        locales[who] = null;
        document.querySelector(`#${who}`).value = "";
        document.querySelector(`#${who}`).focus();

    });

    TripPaymentFormController.getAll().then(({status, data}) => {

        viewController.elementProperty.getElement("#paymentFormKnobTrip", element => {
            element.innerHTML = `<option value="" disabled selected>Selecione a forma de pagamento</option>`;
            element.innerHTML += data.map(item => {
                return `<option value="${item.idTripPaymentForm}">${item.name}</option>`
            }).join("")
        });
    });

    viewController.elementProperty.getElement(".search-address-location", element => {
        addEventSearchLocal(element, showResultInScreen, () => {
            locales[locales.focus] = null;
            document.querySelector("#listPlaceKnob").innerHTML = "";
        })
    });

    viewController.elementProperty.addEventInElement(".search-address-location", "onfocus", function () {
        locales.focus = this.getAttribute("id");
    });

    viewController.elementProperty.addEventInElement(".close-knob-manual", "onclick", () => Route.backPage());

    viewController.elementProperty.addEventInElement("#createTripKnobManual", "onclick", () => {
        try {
            const customer = validateDataCustomer();

            initTripKnob(customer);
        } catch (error) {
            SwalCustom.messageDialog("", error.message, () => error.element.focus());
        }
    });

    viewController.elementProperty.addEventInElement("#btnEditPriceKnob", "onclick", openEditPrice);

    function validateDataCustomer() {
        const elementName = document.querySelector("#nameCustomerKnob");
        const elementPhone = document.querySelector("#phoneCustomerKnob");
        const elementDocument = document.querySelector("#documentCustomerKnob");
        const elementEmail = document.querySelector("#emailCustomerKnob");
        const elementPaymentForm = document.querySelector("#paymentFormKnobTrip");

        if (elementName.value.length <= 0)
            throw {message: getTextTranslate("knob", "name-required"), element: elementName};

        /*if (elementPhone.value.length <= 0)
            throw {message: "Informe o telefone do cliente", element: elementPhone};

        if (!ValidateForm.validatePhone(elementPhone.value))
            throw {message: "Telefone inválido", element: elementPhone};

        if (elementDocument.value.length <= 0)
            throw {message: "Informe o cpf do cliente", element: elementDocument};

        if (!ValidateForm.validateCpf(elementDocument.value.replace(/\D/g, '')))
            throw {message: "CPF inválido", element: elementDocument};

        if (elementEmail.value.length <= 0)
            throw {message: "Informe o email do cliente", element: elementEmail};

        if (!ValidateForm.validateEmail(elementEmail.value))
            throw {message: "E-mail inválido", element: elementEmail};*/

        if (elementPaymentForm.value.length <= 0)
            throw {message: getTextTranslate("knob", "payment-required"), element: elementPaymentForm};

        return {
            name: elementName.value,
            phone: elementPhone.value,
            document: elementDocument.value,
            email: elementEmail.value
        };
    }

    function showResultInScreen({status, data}) {
        if (!status)
            return;

        viewController.elementProperty.getElement("#listPlaceKnob", element => {
            element.innerHTML = " " + data.map(place => {
                return `<li class="item-place-found" value='${JSON.stringify(place)}'>
                            <i class="material-icons">place</i>
                            <span>${place.address}</span>
                        </li>`;
            }).join("");
        });

        viewController.elementProperty.addEventInElement(".item-place-found", "onclick", function () {
            let who = locales.focus;

            const place = JSON.parse(this.getAttribute("value"));

            document.querySelector(`#${who}`).value = place.address;

            locales[who] = place;

            if (verifyLocalesIsNull()) {
                document.querySelector("#listPlaceKnob").innerHTML = " ";
            } else {
                document.querySelector("#listPlaceKnob").innerHTML = "";
                document.querySelector("#origin").disabled = true;
                document.querySelector("#destination").disabled = true;

            }

            if(place.latitude == null || place.longitude == null) {
                getDetailPlace(place.address).then(({status, data}) => {
                    if (!status)
                        return locales[who] = null;

                    locales[who] = data;

                    if (!verifyLocalesIsNull())
                        calculatePriceTrip();
                });

                return;
            }

            if (!verifyLocalesIsNull())
                calculatePriceTrip();
        })
    }

    function calculatePriceTrip() {
        const user = Session.get("user");

        viewController.elementProperty.getElement("#detailValueTripKnob", element => {
            element.innerHTML = `
                <span>${CityConfig.getTypeCoin()}</span><span id="priceTripKnob"></span>
            `
        });

        PriceController.getPrice(locales.origin, locales.destination, Session.get("tripTypeKnob"))
            .then(({status, data, message}) => {
                if (!status)
                    return SwalCustom.messageDialog("", message);

                Session.set("distanceTrip", data.distance);
                Session.set("estimatedTripTime", data.duration);

                Route.startClassesInComponent([
                    {component: "#listPlaceKnob", class: "hide"},
                ], () => clearKnobTrip());

                locales.price = data.price;
                locales.multiplierDynamic = data?.priceDynamicValue; 

                document.querySelector("#priceTripKnob").innerHTML =
                    Mask.maskMoney(locales.price.price);
            })
    }


    function verifyLocalesIsNull() {
        if (locales.origin == null) {
            document.querySelector("#origin").focus();
            return true;
        }

        if (locales.destination == null) {
            document.querySelector("#destination").focus();
            return true;
        }

        return false;
    }

    function getDetailPlace(address) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`geocoding/search?address=${address}`, 'GET', null, resolve, reject);
        });
    }

    function getAddressByLatLng(position) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`geocoding/search?latlng=${position.lat},${position.lng}`, 'GET', null, resolve, reject);
        });
    }


    function addEventSearchLocal(input, callback, preCallback) {
        let timeout = null;

        input.oninput = function () {

            clearTimeout(timeout);

            if (preCallback)
                preCallback();

            if (this.value.length === 0)
                return callback({data: []});

            timeout = setTimeout(() => {
                const {lat, lng} = Session.get("lastPosition");

                PlaceController.searching(this.value, `${lat},${lng}`).then(callback)
            }, 500);
        };
    }

    function clearKnobTrip() {
        document.querySelector("#nameCustomerKnob").value = "";
        document.querySelector("#phoneCustomerKnob").value = "";
        document.querySelector("#documentCustomerKnob").value = "";
        document.querySelector("#emailCustomerKnob").value = "";

        document.querySelector("#listPlaceKnob").innerHTML = " ";

        locales.price = null;
        locales.destination = null;
        locales.origin = null;
        locales.recalculatedTrip = null;

        const elementOrigin = document.querySelector("#origin");
        const elementDestination = document.querySelector("#destination");

        elementOrigin.disabled = false;
        elementDestination.disabled = false;
        elementOrigin.value = "";
        elementDestination.value = "";

        viewController.elementProperty.removeClass("#listPlaceKnob", "hide");

        updateLocalOrigin();
    }

    function initTripKnob(tripCustomer) {
        const user = Session.get("user");

        const tripKnob = {
            userId: parseInt(user.idUser),
            tripTypeId: locales.price.tripTypeId,
            tripPaymentFormId: document.querySelector("#paymentFormKnobTrip").value,
            origin: locales.origin,
            destination: locales.destination,
            price: locales.recalculatedTrip == null ? locales.price.price : locales.recalculatedTrip.newPrice,
            priceId: locales.price.idPrice,
            driverId: user.idDriver,
            tripCustomer,
            recalculatedTrip: locales.recalculatedTrip,
            distance: Session.get("distanceTrip"),
            estimatedTripTime: Session.get("estimatedTripTime"),
            multiplierDynamic: locales.multiplierDynamic 
            ?? (locales?.price?.multiplierPriceDynamic ? parseFloat(locales.price.multiplierPriceDynamic) : null)      
        };

        document.querySelector("#createTripKnobManual").disabled = true;

        KnobTripController.init(tripKnob).then(({status, data, errors}) => {
            if (!status)
                return SwalCustom.messageDialog("", errors.message, undefined, "info");
            Route.goHomeBack();
            updateTripDriver();
            setTimeout(() => {
                updateTripDriver()
            }, 2000)
        }).finally(() => {
            document.querySelector("#createTripKnobManual").disabled = false;
        });
    }

    function openEditPrice() {
        resetPricesEdited();

        Route.startClassesInComponent([
            {component: ".container-edit-price", class: "active"}
        ], () => {
            viewController.elementProperty.removeClass(".container-edit-price", "active");
        });

        viewController.elementProperty.addEventInElement("#closeEditPrice", "onclick", function () {
            Route.backPage();
        });

        viewController.elementProperty.getElement("#typeEditPrice", element => {
            element.innerHTML = locales.price.priceName;
        });

        Mask.setMoneyField("#valueNewPrice");

        viewController.elementProperty.getElement("#valueNewPrice", element => {
            element.value = Mask.maskMoney(locales.price.price);
        });

        viewController.elementProperty
            .addEventInElement("#btnConfirmationNewPrice", "onclick", function () {

                const value = Mask.removeMaskMoney(document.getElementById("valueNewPrice").value);

                if (value === 0)
                    return SwalCustom.messageDialog("", getTextTranslate("knob","value-price-required"), undefined, "info");

                createNewPrice(value);

                Route.backPage();
            });
    }

    function createNewPrice(value) {
        locales.recalculatedTrip = {
            oldPrice: locales.price.price,
            newPrice: value
        };

        document.querySelector(`#priceTripKnob`).innerHTML = Mask.maskMoney(value);

    }

    function resetPricesEdited() {
        locales.recalculatedTrip = null;

        viewController.elementProperty.getElement(".label-prices-trip", element => {
            element.innerHTML = `<span>${CityConfig.getTypeCoin()}</span>${element.getAttribute("valueDefault")}`;
        });
    }

    viewController.onBack(() => {
        viewController.elementProperty.addClass(".container-modal-trip-knob", "active");
    })

});
