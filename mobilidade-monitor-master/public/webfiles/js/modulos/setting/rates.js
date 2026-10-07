preload(true);

document.addEventListener("DOMContentLoaded", function () {

    Mask.setMoneyField('#min_value');
    Mask.setMoneyField('#max_value');
    Mask.setMoneyField('#new_value');
    Mask.setMoneyField('#value-cash-back');

    let typeActivies = '';
    let typeSelected = '';
    let imageTypeSelected = '';

    const elementProperty = new ElementProperty();

    Session.delete("idTripType");

    getRateCity(Session.getLocal("citySelected"));


    elementProperty.addEventInElement('#save-cash-back', 'onclick', function () {
        let data = {};
        let valueCash = document.getElementById('value-cash-back').value;
        data.value = valueCash.replace(',', '.');
        data.value = valueCash.replace(',', '.');
        data.value = valueCash.replace(',', '.');
        data.tripTypeId = Session.get("tripTypeIdSelected");
        data.valueType = document.querySelector(`input[name='valueType']:checked`).value;
        data.backToTripBalance = true;
        data.addToFinalPrice = document.getElementById('addToFinalPrice').checked;
        data.cityId = Session.getValueInSessionLocal("citySelected", "cityId");

        if (document.querySelector(`input[name='backToTripBalance']:checked`).value === 'true') {
            data.backToTripBalance = false;
        }
        preload(true);
        PriceController.insertCashBack(data).then(response => {
            preload(false);
            if (response.status) {
                showCashBack();
                return swal("Inserido com sucesso", "Verifique suas mudanças no seu app", "success");
            }

            return swal("Erro ao inserir cashback", "Contate o suporte", "error");
        })

    });

    elementProperty.addEventInElement('#save-prince-range', 'onclick', function () {
        preload(true);
        let data = {};
        let min_value = document.getElementById('min_value').value;
        let new_value = document.getElementById('new_value').value;
        let max_value = document.getElementById('max_value').value;
        const cityId = Session.getLocal("citySelected").cityId;
        const idTripType = Session.get("idTripType");

        data.tripTypeId = idTripType;
        data.description = document.getElementById('description_value').value;
        data.max_value = Mask.removeMaskMoney(max_value);
        data.new_value = Mask.removeMaskMoney(new_value);
        data.min_value = Mask.removeMaskMoney(min_value);
        data.cityId = Session.getValueInSessionLocal("citySelected", "cityId")

        TripTypeController.insertPriceRange(data).then(({status, response}) => {
            preload(false);
            if (!status)
                return swal('Erro ao inserir faixa de preço', 'Certifique que não existe uma faixa com os mesmos valores', 'info')

            swal('Atualizado com sucesso', '', 'success');
            initPriceRange(cityId, idTripType);
        });
    });

    elementProperty.addEventInElement('#price-range-list', 'onclick', function () {
        if(this.open){
            return;
        } else {
            const cityId = Session.getLocal("citySelected").cityId;
            const idTripType = Session.get("idTripType");
            preload(true)
            return initPriceRange(cityId, idTripType);
        }
    });


    function initPriceRange(cityId, idTripType) {
        TripTypeController.getPriceRange(cityId, idTripType).then(({status, response}) => {
            elementProperty.getElement('#mount-price-range', these => {
                let content = '';
                content += response.map(item => {
                    return `    
                      
                    <tr>
                        <tr>
                            <td colspan="5">
                               ${item.description}
                            </td>
                        </tr> 
                        <tr>                          
                            <td>
                                <span style="font-size: 0.7vw">${Mask.setDateCrazy(item.updated_at, false)}</span>
                            </td>
                            <td>R$${Mask.maskMoney(item.min_value)}</td>
                            <td>R$${Mask.maskMoney(item.max_value)}</td>
                            <td>R$${Mask.maskMoney(item.new_value)}</td>
                            <td>${item.trip_type.type}</td>
                            <td>
                                <span style="color: red; cursor: pointer;" id="${item.id}" class="delete-range">X</span>
                            </td>
                        </tr>
                    </tr>
                `;
                }).join('');
                preload(false);
                these.innerHTML = content;
                elementProperty.addEventInElement('.delete-range', 'onclick', function () {
                    let id = this.getAttribute('id');
                    SwalCustom.confirm('Deseja deletar essa faixa de preço?', 'Essa ação é irreversivel').then(status => {
                        preload(true);
                        if (status) {
                            TripTypeController.deletePriceRange(id).then(({status, response}) => {
                                preload(false);

                                if (!status)
                                    return swal('Erro ao deletar essa faixa de preço', 'Contate o suporte', 'info');

                                swal('Preço apagado com sucesso', '', 'success');
                                initPriceRange(cityId, idTripType);
                            });
                        }
                    });
                });
            });
        });
    }

    TripPaymentFormController.getV2().then(({status, response: data}) => {
        if (!status)
            return;

        elementProperty.getElement("#typePaymentTrip", element => {
            element.innerHTML = data.map(paymentform => {
                return `<div class="input-duplicate container-payment-form">
                        <label for="">${paymentform.name}</label>
                        <input type="tel" class="simulation-price payment-input" typePayment="${paymentform.idTripPaymentForm}" autocomplete="off">
                        <p>
                            <input type="radio" name="typePayment${paymentform.idTripPaymentForm}"
                                   value="%" checked>%<br>
                            <input type="radio" name="typePayment${paymentform.idTripPaymentForm}" 
                                   value="$">$<br>
                        </p>
                    </div>`;
            }).join("");
            preload(false);
            Mask.setMoneyField(".simulation-price");
        });
    });


    mapService.importScriptWithPlaces().then(() => {
    });


    elementProperty.addEventInElement('.add-new-type', 'onclick', function () {
        $('#modal-type-trip').modal('show');
    });

    elementProperty.getElement('#mount-here-trip-types', here => {
        preload(true);
        let content = '';

        const city = Session.getLocal("citySelected");

        PriceController.getByCity(city.cityId).then((response) => {
            const {response: list} = response;

            TripTypeController.getAllV2().then(callback => {
                let data = callback.response.filter((item) => {
                    return list.filter(({trip_type}) => {
                        return item.idTripType === trip_type.idTripType;
                    }).length === 0;
                });

                verifyExistTrip(data);

                content += data.map(item => {
                    return `
                        <div class="card data-item" data-that='${JSON.stringify(item)}' style="cursor: pointer" name="${item.type}" id="${item.idTripType}">
                          <div class="row no-gutters">
                            <div class="col-md-4 d-flex justify-content-center align-items-center">
                              <img src="${item.picture}" width="50%">
                            </div>
                            <div class="col-md-8">
                              <div class="card-body">
                                <h5 class="card-title">${item.type}</h5>
                                <p class="card-text">${item.description} TESTE</p>
                                <p class="card-text"><small class="text-muted">Gênero: ${item.gender.name}</small></p>
                              </div>
                            </div>
                          </div>
                        </div>
                    `;
                }).join('');
                here.innerHTML = content;
                preload(false);

                elementProperty.addEventInElement('.data-item', 'onclick', function () {
                    let id = this.getAttribute('id');
                    let data = JSON.parse(this.getAttribute('data-that'));
                    SwalCustom.dialogConfirm('Deseja ativar ' + this.getAttribute('name'), '', status => {
                        if (status) {
                            elementProperty.getElement("#typeRates", element => {
                                element.innerHTML += `
                                <li id="${data.id}" class="option-trip-type" data="${data.idTripType}" value='${JSON.stringify(data)}'>
                                <img src="${data.picture}">
                                <span>${data.type}</span>
                                </li>
                                `;
                            });

                            initEventSelectedTripType();

                            $('#modal-type-trip').modal('hide');

                            elementProperty.removeClass(".option-trip-type", "active");

                            document.querySelector(`.option-trip-type[data='${data.idTripType}']`).classList.add("active");

                            showRatesSeletected(data);

                            return false;
                        }
                    })
                });
            })
        });
    });


    function verifyExistTrip(data) {
        const idParam = getIdParam();

        if (idParam != null) {

            const elementExist = document.querySelector(`.option-trip-type[data='${idParam}']`);

            if (elementExist == null) {

                let dataSelected = data.find(item => {
                    return idParam == item.idTripType;
                });

                elementProperty.getElement("#typeRates", element => {
                    element.innerHTML += `
                                <li id="${dataSelected.id}" class="option-trip-type" data="${dataSelected.idTripType}" value='${JSON.stringify(data)}'>
                                <img src="${dataSelected.picture}">
                                <span>${dataSelected.type}</span>
                                </li>
                                `;
                });

                initEventSelectedTripType();

                $('#modal-type-trip').modal('hide');

                elementProperty.removeClass(".option-trip-type", "active");

                document.querySelector(`.option-trip-type[data='${dataSelected.idTripType}']`).classList.add("active");

                showRatesSeletected(dataSelected);
            } else {
                const dataSelected = JSON.parse(elementExist.getAttribute("value"));

                $('#modal-type-trip').modal('hide');

                elementProperty.removeClass(".option-trip-type", "active");

                elementExist.classList.add("active");

                showRatesSeletected(dataSelected);
            }
        }
    }

    function getIdParam() {
        const urlSplit = window.location.pathname.split("/");
        const value = parseInt(urlSplit[urlSplit.length - 1]);

        return isNaN(value) ? null : value;
    }

    EstateController.getAllV2().then(({status, response: data, message}) => {
        if (!status) {
            SwalCustom.messageDialog("", message, "warning");
            return;
        }

        elementProperty.getElement("#estate", element => {
            element.innerHTML += data.map(estate => {
                return `<option value="${estate.nome}" valueSelected='${JSON.stringify(estate)}' />`
            }).join("")
        });
    });

    getOptionDataList("#inputEstate", "#estate", function (estate) {
        elementProperty.getElement("#inputEstate", element => {
            element.disabled = true;
        });

        CityController.getByEstate(estate.id).then(showCity);
    });

    elementProperty.getElement(".simulation-price", element => {
        element.addEventListener("changeValueMask", (data) => {
            calculatePrice();
        });
    });

    elementProperty.addEventInElement("#description", "oninput",
        ({srcElement: {value}}) => {
            elementProperty.getElement(".tag-price", element => {
                element.innerHTML = value;
            })
        });

    elementProperty.addEventInElement("#color", "onchange",
        ({srcElement: {value}}) => {
            elementProperty.getElement(".tag-price", element => {
                element.style.backgroundColor = value;
            })
        });

    elementProperty.addEventInElement(".btn-option-menu", "onclick", function () {
        const type = this.getAttribute("value");

        if (type === "2")
            getPositionInMap();

        activeOptionMenu(type);
    });

    elementProperty.addEventInElement("#closeSimulator", "onclick", disabledSimulator);

    const showCity = ({status, data: cities}) => {
        elementProperty.getElement("#city", element => {
            element.innerHTML = cities.map(city => {
                return `<option value="${city.nome}" valueSelected='${JSON.stringify(city)}' />`;
            }).join("");
        });

        elementProperty.getElement("#inputCity", element => {
            element.focus();
        });

        getOptionDataList("#inputCity", "#city", getRateCity);
    };


    function getOptionDataList(idInput, idList, callback) {
        elementProperty.addEventInElement(idInput, "oninput", function () {
            const value = this.value;
            elementProperty.getElement(idList, element => {
                const {options} = element;

                const selected = Object.keys(options).filter(position => {
                    return options[position].value === value;
                });

                if (selected.length === 0)
                    return;

                const object = JSON.parse(options[selected[0]].getAttribute("valueSelected"));

                callback(object);
            })
        });
    }

    function clearBy(type = "") {
        if (type === "" || type === "estate") {
            elementProperty.getElement("#inputEstate", element => {
                element.value = "";
                element.disabled = false;
            });
        }

        if (type === "" || type === "city" || type === "estate") {
            elementProperty.getElement("#inputCity", element => {
                element.value = "";
                element.disabled = false;
            });
        }

        elementProperty.getElement("#typeRates", element => {
            element.innerHTML = "";
        });

        elementProperty.removeClass(".container-rates-change", "active");

        document.getElementById("priceMin").value = "0,00";
        document.getElementById("priceBase").value = "0,00";
        document.getElementById("priceKm").value = "0,00";
        document.getElementById("priceMinute").value = "0,00";
        document.getElementById("description").value = "";
        document.getElementById("taxRate").value = "0,00";
        document.getElementById("surcharge").value = "0,00";
        document.getElementById("disableAfterKm").value = "0,00";
        document.getElementById("priceWaypoint").value = "0,00";
        document.getElementById("long_distance_per_km").value = "0,00";
        document.getElementById("promotional_price_temp").value = "0,00";
        document.getElementById("reward_driver_min_price").value = "0,00";
        document.getElementById("color").value = "";
        Session.delete("idTripType");

        elementProperty.removeClass(".container-option-price", "active");

        disabledSimulator();
    }

    elementProperty.addEventInElement(".clear-fields", "onclick", function () {
        clearBy(this.getAttribute("value"));
    });

});


function getRateCity(city) {
    const elementProperty = new ElementProperty();

    elementProperty.getElement("#inputCity", element => {
        element.disabled = true;
    });

    Session.set("idCitySelected", city.cityId);

    PriceController.getByCity(city.cityId).then(({status, message, response}) => {
        if (!status) {
            Session.set("rates", []);
            SwalCustom.messageDialog("", message, "info");
            return;
        }

        if (response.length === 0) {
            return swal('Não há tipos de viagens cadastradas para essa cidade', 'Você pode adicionar clicando em  "Adicionar novo"', 'info');
        }

        showTypeTrip(response);

        Session.set("rates", response);

    });

    DriverCommissionController.get(city.cityId).then(getDriverCommission);
}

function getDriverCommission({status, response: data}) {
    if (!status)
        return;

    Session.setLocal("driverCommission", data);
}

function activeOptionMenu(option) {
    const elementProperty = new ElementProperty();

    elementProperty.getElement(".btn-option-menu", element => {
        if (element.getAttribute("value") === option) {
            element.classList.add("active");
            return;
        }
        element.classList.remove("active");
    });

    elementProperty.getElement(".option-menu-rate", element => {
        if (element.getAttribute("value") === option) {
            element.classList.add("active");
            return;
        }
        element.classList.remove("active");
    })
}

function disabledSimulator() {
    const elementProperty = new ElementProperty();

    elementProperty.removeClass(".address-simulator", "active");
    elementProperty.removeClass(".map-route", "active");
    elementProperty.removeClass(".container-simulator-price", "active");

//    document.getElementById("durationPrice").innerHTML = "";
//    document.getElementById("distancePrice").innerHTML = "";
//    document.getElementById("originPrice").innerHTML = "";
//    document.getElementById("destinationPrice").innerHTML = "";

    placeSelected.origin = null;
    placeSelected.destination = null;

    placeSelected.distance = 0;
    placeSelected.duration = 0;

    elementProperty.getElement(".auto-place", element => {
        element.value = "";
    });

    if (placeSelected.activeSimulator) {
        mapService.pointOrigin.setMap(null);
        mapService.pointDestination.setMap(null);
        mapService.directionsDisplay.setMap(null);
        placeSelected.activeSimulator = false;
    }
}

const placeSelected = {
    activeAutocomplete: false,
    origin: null,
    destination: null,
    duration: 0,
    distance: 0,
    activeSimulator: false
};

const mapService = new MapService();

function showTypeTrip(rates) {
    const elementProperty = new ElementProperty();

    elementProperty.getElement("#typeRates", element => {
        element.innerHTML = rates.map(rate => {
            const active = rate.trip_type.idTripType === Session.get("idTripType") ?
                "active" : "";

            return `<li class="option-trip-type ${active}" data="${rate.trip_type.idTripType} " value='${JSON.stringify(rate)}'>
                            <img id="image-type-${rate.trip_type.idTripType}" src="${rate.trip_type.picture}">
                            <span>${rate.trip_type.type}</span>
                            <span style="font-size: 12px">id:${rate.trip_type.idTripType}</span>
                        </li>`;
        }).join("");

        initEventSelectedTripType();
    });
}

function showCashBack() {
    elementProperty.getElement('#mount-table-cashback', table => {
        table.innerHTML = '';
        let data = {};
        data.tripTypeId = typeSelected;
        PriceController.getCashBack(data).then(resolve => {
            if (resolve.response === null) {
                return false;
            }

            let content = '';
            let data = resolve.response;
            content += data.map(item => {
                return `
                        <tr> 
                            <th>${Mask.setDateCrazy(item.created_at)}</th>
                            <th>${item.valueType + ' ' + Mask.maskMoney(item.value)}</th>
                            <th> 
                                <button id="${item.id}" class="btn btn-danger delete-cash"><i class="material-icons">close</i></button>
<!--                                <button class="btn"><i class="material-icons">cloud_off</i></button>-->
                            </th>
                        </tr>
                    `;
            }).join('');
            table.innerHTML = content;

            elementProperty.addEventInElement('.delete-cash', 'onclick', function () {
                let id = this.getAttribute('id');
                SwalCustom.confirm('Deseja deletar esse CashBack', 'Essa ação é irreversivel').then(status => {
                    if (!status)
                        return false;

                    preload(true);
                    PriceController.deleteCash(id).then(({status, response}) => {
                        preload(false);
                        showCashBack();
                        if (status) {
                            table.innerHTML = '';
                            return swal('Deletado com sucesso', 'Verifique suas mudanças em seu app', 'success');
                        }
                        showCashBack();
                        return swal('Erro ao deletar valor cashback', 'Contate o suporte', 'error');
                    });
                })
            });

        })
    });

}

function initEventSelectedTripType() {
    const elementProperty = new ElementProperty();

    elementProperty.addEventInElement(".option-trip-type", "onclick", function () {
        let data = this.getAttribute('value');
        data = JSON.parse(data);

        elementProperty.removeClass(".option-trip-type", "active");
        showRatesSeletected(data);

        this.classList.add("active");
    });
}

function showRatesSeletected(data) {
    typeSelected = data.tripTypeId;
    Session.setLocal('typeSelected', data.id);

    showCashBack();

    document.querySelector("#price-range-list").open = false;
    document.querySelector("#fees-option").open = false;
    elementProperty.addClass(".container-option-price", "active");

    const rate = data;
    if (rate.tripTypeId === undefined) {
        Session.set("idTripType", rate.idTripType);
        Session.set("tripTypeIdSelected", rate.idTripType);
    } else {
        Session.set("tripTypeIdSelected", rate.tripTypeId);
        Session.set("idTripType", rate.tripTypeId);
    }

    // Session.set("tripTypeIdSelected", rate.tripTypeId);

    showDriverCommission(rate.tripTypeId);

    getPositionInMap();


    elementProperty.addClass(".container-rates-change", "active");


    if (rate.type_additional_value_after_km === undefined) {
        document.querySelector(`input[name='type_additional_value_after_km'][value='$']`).checked = true;
    } else {
        document.querySelector(`input[name='type_additional_value_after_km'][value='${rate.type_additional_value_after_km}']`).checked = true;
    }

    if (rate.long_distance_value_to_final_price)
        document.getElementById('long_distance_value_to_final_price').checked = true;

    document.getElementById("priceMin").value = Mask.maskMoney(rate.min_price);
    document.getElementById("priceBase").value = Mask.maskMoney(rate.base_price);
    document.getElementById("priceKm").value = Mask.maskMoney(rate.km_price);
    document.getElementById("priceMinute").value = Mask.maskMoney(rate.minute_price);
    document.getElementById("citySelected").value = rate.cityId;
    document.getElementById("description").value = rate.tag || '';
    document.getElementById("taxRate").value = Mask.maskMoney(rate.tax_price);
    document.getElementById("surcharge").value = Mask.maskMoney(rate.another_fee);
    document.getElementById("priceWaypoint").value = Mask.maskMoney(rate.waypoint_price);
    document.getElementById("long_distance_per_km").value = Mask.maskMoney(rate.long_distance_per_km);
    document.getElementById('long_distance_radius').value = rate.long_distance_radius || '0';
    document.getElementById("promotional_price_temp").value = Mask.maskMoney(rate.promotional_price_temp);
    document.getElementById("reward_driver_min_price").value = Mask.maskMoney(rate.reward_driver_min_price);
    document.getElementById("idealListCommonPrice").value = rate.idealListCommonPrice;
    document.getElementById("km_to_additional_value").value = rate.km_to_additional_value || '0,00';
    document.getElementById("additional_value_after_km").value = Mask.maskMoney(rate.additional_value_after_km);
    document.getElementById("surchargeTextarea").value = rate.another_fee_description || "";
    document.getElementById("taxRateTextarea").value = rate.tax_price_description || "";
    document.querySelector(`input[name=typeTaxRate][value='${typeIsValid(rate.tax_price_type)}']`).checked = true;
    document.querySelector(`input[name=typeSurcharge][value='${typeIsValid(rate.another_fee_type)}']`).checked = true;

    if (document.querySelector("#long_distance_delivery_price"))
        document.getElementById("long_distance_delivery_price").value = Mask.maskMoney(rate.long_distance_delivery_price);

    document.getElementById("disableAfterKm").value =
        rate.disable_after_km != null ? Mask.maskMoney(rate.disable_after_km) : 0;
    document.getElementById("color").value = rate.color;
    elementProperty.getElement(".tag-price", element => {
        element.innerHTML = rate.tag;
        element.style.backgroundColor = rate.color;
    });

    activeOptionMenu("1");

    disabledSimulator();
}

function showDriverCommission(tripTypeId) {

    const commissions = Session.getLocal("driverCommission");

    const commission = commissions.filter((commission) => {
        return commission.tripTypeId === tripTypeId;
    })[0];

    if (!commission)
        return;

    document.querySelector(`input[name='typeServiceCharge'][value='${commission.valueType}']`).checked = true;
    document.getElementById("serviceCharge").value = Mask.maskMoney(commission.value);

    document.getElementById("disableOnPromotional").checked = commission.disableOnPromotion;

    setTimeout(function () {
        commission.commissions_payment_form.map(payment => {
            if (document.querySelector(`input[typePayment='${payment.tripPaymentFormId}']`))
                document.querySelector(`input[typePayment='${payment.tripPaymentFormId}']`).value = Mask.maskMoney(payment.value);

            if (document.querySelector(`input[name='typePayment${payment.tripPaymentFormId}'][value='${payment.valueType}']`))
                document.querySelector(`input[name='typePayment${payment.tripPaymentFormId}'][value='${payment.valueType}']`).checked = true;
        });
    }, 1500)
}

function valueIsValid(value) {
    return value != null ? value : 0;
}

function typeIsValid(type) {
    return type != null ? type : "%";
}

function getPositionInMap() {
    const elementProperty = new ElementProperty();


    elementProperty.getElement(".map-route", element => {
        mapService.initMap(location, 10, element, true);

        setTimeout(() => {
            mapService.setBoundsArray(Session.getLocal("pointsCity"));
            initEventMap();
        }, 1000);
    })
}

function initEventMap() {
    const elementProperty = new ElementProperty();

    if (!placeSelected.activeAutocomplete)
        elementProperty.getElement(".auto-place", element => {
            mapService.addSearchInInput(element, (place, input) => {

                const {geometry: {location}} = place;

                placeSelected[input.getAttribute("valuePlace")] = location;

                if (placeSelected.origin !== null && placeSelected.destination !== null) {
                    mapService.showPointEventMap(placeSelected.origin, placeSelected.destination, [],
                        ({routes: [{legs: [{distance, duration, end_address, start_address}]}]}) => {

                            placeSelected.distance = distance.value / 1000;
                            placeSelected.duration = duration.value / 60;

                            document.getElementById("durationPrice").innerHTML = duration.text;
                            document.getElementById("distancePrice").innerHTML = distance.text;
                            document.getElementById("originPrice").innerHTML = start_address;
                            document.getElementById("destinationPrice").innerHTML = end_address;

                            placeSelected.activeSimulator = true;

                            calculatePrice();
                        });
                    elementProperty.addClass(".address-simulator", "active");
                    elementProperty.addClass(".map-route", "active");
                    elementProperty.addClass(".container-simulator-price", "active");
                }
            });
        });

}


function calculatePrice() {
    if (!placeSelected.activeSimulator)
        return;

    const {
        base_price,
        km_price,
        min_price,
        tax_price,
        another_fee,
        minute_price,
        reward_driver_min_price,
        service_charge
    } = {
        "min_price": Mask.removeMaskMoney(document.getElementById("priceMin").value),
        "base_price": Mask.removeMaskMoney(document.getElementById("priceBase").value),
        "km_price": Mask.removeMaskMoney(document.getElementById("priceKm").value),
        "minute_price": Mask.removeMaskMoney(document.getElementById("priceMinute").value),
        "cityId": document.getElementById("citySelected").value,
        "tripTypeId": `${Session.get("tripTypeIdSelected")}`,
        "tax_price": Mask.removeMaskMoney(document.getElementById("taxRate").value),
        "another_fee": Mask.removeMaskMoney(document.getElementById("surcharge").value),
        "tag": document.getElementById("description").value,
        "color": document.getElementById("color").value,
        "long_distance_per_km": Mask.removeMaskMoney(document.getElementById("long_distance_per_km").value),
        "promotional_price_temp": Mask.removeMaskMoney(document.getElementById("promotional_price_temp").value),
        "reward_driver_min_price": Mask.removeMaskMoney(document.getElementById("reward_driver_min_price").value),
        "service_charge": Mask.removeMaskMoney(document.getElementById("serviceCharge").value)
    };

    let price = base_price + (km_price * placeSelected.distance) + (minute_price * placeSelected.duration) + tax_price +
        another_fee;

    price = price < min_price ? min_price : price;

    document.getElementById("valuePrice").innerHTML = Mask.maskMoney(price);

    document.getElementById("valueTripCalc").innerHTML = `${Mask.maskMoney(price)} +`;
    document.getElementById("valueBonusCalc").innerHTML = `${Mask.maskMoney(reward_driver_min_price)} +`;

    let valueServiceCharge = (getValueTypeRadio("typeServiceCharge") === "percent") ?
        (service_charge * price) / 100 : service_charge;

    let valueTaxRate = (getValueTypeRadio("typeTaxRate") === "percent") ?
        (tax_price * price) / 100 : tax_price;

    document.getElementById("valueServiceChargeCalc").innerHTML = `${Mask.maskMoney(valueServiceCharge)} -`;
    document.getElementById("valueTaxRate").innerHTML = `${Mask.maskMoney(valueTaxRate)} -`;

    const total = (price + reward_driver_min_price) - (valueServiceCharge + valueTaxRate);

    document.getElementById("totalCalc").innerHTML = Mask.maskMoney(total);
}

function getValueTypeRadio(name) {
    let type = "";
    for (let i = 0; i < document.getElementsByName(name).length; i++) {
        const element = document.getElementsByName(name)[0];
        if (element.checked) {
            type = element.value;
            break;
        }
    }
    return type;
}

