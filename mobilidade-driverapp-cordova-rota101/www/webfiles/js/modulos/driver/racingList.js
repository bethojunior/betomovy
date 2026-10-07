viewController.setObserver("racing-list", function () {
    $('.modal').modal();
    $('select').material_select();

    var page = 0;
    let lastPageList;
    let dataList = [];
    let filterRun = false;
    let statusTrip = null;
    const elementProperty = new ElementProperty();

    const STATUS_CANCELED = "canceled";

    const driverController = new DriverController();
    const dataDriver = Session.get("user");
    const idDriver = dataDriver.idDriver;

    callList(idDriver, false, false);

    const statusPt = {
        finished: "Finalizou",
        canceled: "Cancelado",
        in_progress: "Embarcou",
        boarding: "Chegou",
        searching: "Buscando",
        accepted: "Aceitou",
        waypoint_confirmed: "Parada",
        scheduled: "Agendada"
    };

    function callList(idDriver, modal, concat) {
        preload(true)
        page += 1;

        if (modal) {
            $('#openModalFilter').modal('close');
        }

        driverController.getTripsById(idDriver, page, null, statusTrip).then(result => {

            dataList = result;

            mountList(concat);

        }).finally(() => {
            preload(false);
        });

    }

    function mountList(concat = true) {
        let writeTrips = "";

        let lenghtTrips = dataList.data.trips.length;

        if (lenghtTrips === 0) {
            Materialize.toast("Não há corridas para esta data", 10000);
            return;
        }

        lastPageList = dataList.data.paginate.lastPage;

        if (!dataList.status) {
            Materialize.toast('Desculpe, não podemos lhe informar esses dados agora', 8000);
            return;
        }

        dataList.data.trips.map(res => {
            writeTrips += `
                <div class='divDataRace col s12'
                        trip='${JSON.stringify(res)}'
                        >

                    <div class='row'>
                        <span class='left'></span>
                        <span class='fs-3 right'>${statusPt[res.status]}</span> 
                    </div> 

                    <div class='row'>
                        <div class='ballgray'></div>
                        <span class='dateRunning'>${DateService.treatDate(res.date)}</span>
                    </div>

                    <div class='row'>
                        <div class='ballgreen'></div>
                        <span class='dateRunning'>${res.originAddress.substr(0, 35)}</span>
                    </div>

                    <div class='row'>
                        <div class='ballOrange'></div>
                        <span class='dateRunning'>${res.destiny.substr(0, 30)}</span>
                    </div>

                </div>
            `;
        });

        elementProperty.getElement('#mountListRacing', element => {
            if (concat) {
                element.innerHTML += writeTrips;
                return;
            }
            element.innerHTML = writeTrips;
        });

        elementProperty.getElement(".custom-preloader", element => {
            element.style.display = "none";
        });

        elementProperty.addEventInElement('.divDataRace', 'onclick', function () {

            //     $('#modalDataRunSelect').modal('open');

            const tripReference = this.getAttribute("tripReference");

            const trip = JSON.parse(this.getAttribute("trip"));

            preload(true);
            TripController.actionGet(trip.tripReference).then(({data}) => {
                const t = document.getElementsByClassName('hide-element')
                for (let i = 0; i <= t.length - 1; i++) {
                    if(data.fare) {
                        t[i].style.display = ''
                        t[i].style.borderBottom = '1px solid #ccc';
                        t[i].style.padding = '15px 10px'
                    } else {
                        t[i].style.display = 'none'
                        t[i].style.borderBottom = 'none'
                        t[i].style.padding = '0'
                    }
                }
                preload(false);
                let anotherFeeType = "";
                let taxPriceType = "";
                const typeCoin = CityConfig.getTypeCoin();
                
                if(data.deliveryOption == 0){
                    if (data.customer){
                        elementProperty.getElement("#customerNameTripDetail", element => element.innerHTML = data.customer.name);
                        elementProperty.getElement("#customerProfileTripDetail", element => {
                            const config = Session.get("configGeneral");
                            const picturesLink = config.find(item => {
                                return item.key === 'link_storage_pictures';
                            });

                            const profileImage = data.customer.profileImage;
                            const finalLink = `${picturesLink.value}customer/profile/compressed/${profileImage}`;
                            
                            element.style.display = '',
                            // element.style.backgroundImage = `url(${CLIENT_PROFILE}${data.customer.profileImage})`
                            element.style.backgroundImage = `url(${finalLink})`
                        });
                    } else{
                        elementProperty.getElement("#customerProfileTripDetail", element => element.style.display = 'none');
                        elementProperty.getElement("#customerNameTripDetail", element => element.innerHTML = 'Nenhum cliente nessa viagem');
                    }
                }

                if(data.ride?.riders.length > 0) {
                    let riders = data.ride.riders.map(item => {
                        return item.name;
                    }).join(", ");
                    elementProperty.getElement("#customerNameTripDetail", element => element.innerHTML = riders);
                    elementProperty.getElement("#customerProfileTripDetail", element => {
                        element.style.display = '',
                        element.style.backgroundImage = ""
                    });
                }

                if(data.fare) {
                    anotherFeeType = data.fare.another_fee_type === "$" ? typeCoin : data.fare.another_fee_type;
                    taxPriceType = data.fare.tax_price_type === "$" ? typeCoin : data.fare.tax_price_type;
                }
                
                document.querySelector('div.detail-trip-modal > div').scrollTop = 0;

                elementProperty.getElement(".list-address-trip", element => {
                    element.innerHTML = `<li>
                                    <span>Origem</span>
                                    <p>${data.origin.address}</p>
                                </li>
                                ${data.tripWayPoints.map(item => {
                        return `<li>
                                                <span>Parada</span>
                                                <p>${item.address}</p>
                                            </li>`;
                    }).join("")}
                                <li>
                                    <span>Destino</span>
                                    <p>${data.destination.name}</p>
                                </li>`;
                });
                elementProperty.getElement("#dateTripDetail", element => element.innerHTML = new Date(data.date).toLocaleString());
                elementProperty.getElement("#statusTripDetail", element => element.innerHTML = statusPt[data.status]);
                elementProperty.getElement("#situationTripDetail", element => element.innerHTML = data.situation);
                elementProperty.getElement("#tripCallTypeDetail", element => element.innerHTML = data.tripCallType);
                elementProperty.getElement("#paymentFormTripDetail", element => element.innerHTML = data.tripPaymentForm);
                
                if (data.ride) {
                    elementProperty.getElement("#estimatedTripDetail", element => element.innerHTML = `${((data.estimatedTripTime) / 60).toFixed(0)}min`);
                    elementProperty.getElement("#distanceItemTripDetail", element => element.innerHTML = `${(parseFloat(data.distance) / 1000).toFixed(2)}km`)
                } else {
                    elementProperty.getElement("#estimatedTripDetail", element => element.innerHTML = `${data.estimatedTripTime} min`);
                    elementProperty.getElement("#distanceItemTripDetail", element => element.innerHTML = `${(parseFloat(data.distance)).toFixed(2)}km`);
                }

                Number(data.cancellationFee_generated) > 0 && data.cancellationFee_generated !== null ? elementProperty.getElement("#txCanceledContent", element => element.style.display = "") : elementProperty.getElement("#txCanceledContent", element => element.style.display = "none"); 

                elementProperty.getElement("#txCanceledContent", element => { 
                    const spanElement = element.querySelector("span");
                    const pElement = element.querySelector("p");
                    if (Number(data.cancellationFee_generated) > 0) {
                        if (!spanElement) {
                            const newSpanElement = document.createElement("span");
                            newSpanElement.innerHTML = "Tx Cancelamento gerada";
                            element.appendChild(newSpanElement);
                        }
                        if (!pElement) {
                            const newPElment = document.createElement("p");
                            newPElment.innerHTML = `${typeCoin} ${Mask.maskMoney(parseFloat(data.cityConfig.cancellationCustomerFeeValue))}`;
                            element.appendChild(newPElment);
                        } else {
                            pElement.innerHTML = `${typeCoin} ${Mask.maskMoney(parseFloat(data.cityConfig.cancellationCustomerFeeValue))}`;
                        }
                    } else {
                        if (spanElement) {
                            element.removeChild(spanElement);
                        }
                        if (pElement) {
                            element.removeChild(pElement);
                        }
                    }
                });

                Number(data.cancellationFee_paid) > 0 && data.cancellationFee_paid !== null ? elementProperty.getElement("#txCanceledExit", element => element.style.display = "") : elementProperty.getElement("#txCanceledExit", element => element.style.display = "none"); 

                elementProperty.getElement("#txCanceledExit", element => { 
                    const spanElement = element.querySelector("span");
                    const pElement = element.querySelector("p");
                    if (Number(data.cancellationFee_paid) > 0) {
                        if (!spanElement) {
                            const newSpanElement = document.createElement("span");
                            newSpanElement.innerHTML = "Coleta Tx Cancelamento";
                            element.appendChild(newSpanElement);
                        }
                        if (!pElement) {
                            const newPElment = document.createElement("p");
                            newPElment.innerHTML = `+ ${typeCoin} ${Mask.maskMoney(parseFloat(data.cityConfig.cancellationCustomerFeeValue))}`;
                            element.appendChild(newPElment);
                        } else {
                            pElement.innerHTML = `+ ${typeCoin} ${Mask.maskMoney(parseFloat(data.cityConfig.cancellationCustomerFeeValue))}`;
                        }
                    } else {
                        if (spanElement) {
                            element.removeChild(spanElement);
                        }
                        if (pElement) {
                            element.removeChild(pElement);
                        }
                    }
                });

                Route.startClassesInComponent([{component: ".detail-trip-modal", class: "active"}], () => {
                    elementProperty.removeClass(".detail-trip-modal", "active");
                });
                elementProperty.getElement("#multiplierDynamicDetail", element => element.innerHTML = data.multiplierDynamic ? data.multiplierDynamic : "0");
                elementProperty.getElement("#basePriceDetail", element => element.innerHTML = data.fare ? `+ ${typeCoin} ${Mask.maskMoney(parseFloat(data.fare.base_price))}` : "-");
                elementProperty.getElement("#minPriceDetail", element => element.innerHTML = data.fare ?
                    `${typeCoin} ${Mask.maskMoney(parseFloat(data.fare.min_price * (data.multiplierDynamic || 1)))}` : "-");
                elementProperty.getElement("#kmPriceDetail", element => element.innerHTML = data.fare ?
                    `(${Mask.maskMoney(parseFloat(data.fare.km_price))} x ${Mask.maskMoney(parseFloat(data.distance))})` : "-");

                elementProperty.getElement("#minutePriceDetail", element => element.innerHTML = data.fare ?
                    `(${Mask.maskMoney(parseFloat(data.fare.minute_price))} x ${Mask.maskMoney(parseFloat(data.estimatedTripTime))})` : "-");

                elementProperty.getElement("#wayPointTripDetail", element => element.innerHTML = data.fare ?
                    `(${Mask.maskMoney(parseFloat(data.fare.waypoint_price))} x ${data.tripWayPoints.length})` : "");


                elementProperty.getElement("#valueKmPriceDetail", element => 
                element.innerHTML = data.fare 
                    ? `+ ${typeCoin} ${Mask.maskMoney(parseFloat(data.fare.km_price) * parseFloat(data.distance))}`
                    : "-"
                );

                elementProperty.getElement("#valueMinutePriceDetail", element => element.innerHTML = 
                    data.fare 
                    ? `+ ${typeCoin} ${Mask.maskMoney(parseFloat(data.fare.minute_price) * parseFloat(data.estimatedTripTime))}` 
                    : "-"
                );

                elementProperty.getElement("#valueWayPointTripDetail", element => element.innerHTML = 
                    data.fare
                    ? `+ ${typeCoin} ${Mask.maskMoney(parseFloat(data.fare.waypoint_price) * parseFloat(data.tripWayPoints.length))}` 
                    : "-");

                elementProperty.getElement("#taxPriceDetailLabel", element => element.innerHTML = 
                    data.fare 
                    ? `${data.fare.tax_price_description}` 
                    : "");

                elementProperty.getElement("#taxPriceDetail", element => element.innerHTML = taxPriceType &&
                    `+ ${taxPriceType} ${Mask.maskMoney(parseFloat(data.fare.tax_price))}`);

                elementProperty.getElement("#anotherFeeDetailLabel", element => element.innerHTML = data.fare ?
                    `${data.fare.another_fee_description}` : "");

                elementProperty.getElement("#anotherFeeDetail", element => element.innerHTML = anotherFeeType &&
                    `+ ${anotherFeeType} ${Mask.maskMoney(parseFloat(data.fare.another_fee))}`);

                elementProperty.getElement("#additionalValueAfterKmDetail", element => element.innerHTML = data.fare ?
                    `+ ${typeCoin} ${Mask.maskMoney(parseFloat(data.fare.additional_value_after_km))}` : "-");

                elementProperty.getElement("#tripLongDistanceValueDetail", element => element.innerHTML = data.fare ?
                    `+ ${typeCoin} ${Mask.maskMoney(parseFloat(data.tripLongDistanceValue ? Mask.maskMoney(parseFloat(data.tripLongDistanceValue.value)) : "0,00"))}` : "-");

                elementProperty.getElement("#kmToAdditionalValueDetail", element => element.innerHTML = data.fare ?
                    `${data.fare.km_to_additional_value} km` : "-");

                elementProperty.getElement("#priceTripDetail", element => {
                    element.innerHTML = `${typeCoin} ${Mask.maskMoney(parseFloat(data.recalculatedPrice ? data.recalculatedPrice.oldPrice : data.price))}`;
                });
                
                if(data.ride){
                    elementProperty.getElement("#priceTripTotalDetail", element => {
                        element.innerHTML = `${typeCoin} ${Mask.maskMoney(parseFloat(data.price) * data.ride.riders.length)}`;
                    });
                } 
                if(data.ride == null){
                    elementProperty.getElement("#priceTripTotalDetail", element => {
                        element.innerHTML = `${typeCoin} ${Mask.maskMoney(parseFloat(data.price))}`;
                    });
                }
            });

            elementProperty.getElement("#btnRequestRelease", element => element.hidden = true);
            if (trip.tripAuditId === "2" || trip.tripAuditId === "3")
                elementProperty.getElement("#btnRequestRelease", element => element.hidden = false);


            Session.set("tripReferenceRelease", tripReference,false);

            elementProperty.addEventInElement(".go-back","onclick",function(){
                Route.backPage();
            });

        });

        preload(false);
    }

    elementProperty.addEventInElement("#btnRequestRelease", "onclick", function () {
        $('#modalDataRunSelect').modal('close');
        Route.redirectDynamic("Driver", "RequestRelease")
    });

    elementProperty.addEventInElement("#btnShowMore", "onclick", function () {
        if (page >= lastPageList) {
            SwalCustom.messageDialog(getTextTranslate("list-trips", "dont-have-races-anymore"), "");
            return;
        }

        if (filterRun) {
            callList(idDriver, true, true);
            return;
        }

        callList(idDriver, false, true);
    });

    function mountTimeline(data) {

        document.getElementById("detailsRunning").innerHTML = "";

        let color;

        document.getElementById("detailsRunning").innerHTML = data.map(res => {

            color = res['info']['color'];

            return `<span><span style="background-color: ${color}"></span>${statusPt[res.tripStatus]}</span> `;

        }).join("");

    }

    elementProperty.addEventInElement('#filterList', 'onclick', function () {
        $('#openModalFilter').modal('open');
    });


    elementProperty.addEventInElement('#makeFilter', 'onclick', function () {

        page = 0;
        dataList = [];

        statusTrip = document.querySelector('input[name=status]:checked').value;

        if (statusTrip === "all") {
            statusTrip = null;
        }

        elementProperty.getElement('#mountListRacing', element => {

            element.innerHTML = "";

            driverController.getTripsById(idDriver, page++, null, statusTrip).then(result => {

                $('#openModalFilter').modal('close');
                dataList = result;
                filterRun = true;
                mountList(false);
            });

        });

    });
    Route.pageDynamic();
});

function comeBackIndex() {
    Route.backPage();
}
