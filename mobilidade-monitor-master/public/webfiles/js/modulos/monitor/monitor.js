const mapService = new MapService();
const elementProperty = new ElementProperty();
const monitorController = new MonitorController();
const autocomplete = new Autocomplete();
let name = "";
let control = false;
let idNotification = '';
const pointsRoute = {};
const configAlertPhotoPanicButton = Session.get('enable_alert_photo_panic') == 1 ? true : false;

mapService.setLibraries("geometry");

mapService.importScriptWithPlaces().then(initMap);

const STATUS_SEARCH = "searching";

const STATUS_SEARCH_FAVORITE = "searching_favorite";

const STATUS_ACCEPTED = "accepted";
const STATUS_BOARDING = "boarding";


const descriptionStatus = {
    "searching_favorite": "Solicitando favorito",
    "searching": "Solicitando motorista",
    "pre_accepted": "Viagem pre-aceita",
    "accepted": "Aceitou a viagem",
    "boarding": "Embarcando",
    "in_progress": "Iniciou a corrida",
    "scheduled": "Agendada",
    "get_bid_by_drivers":"Em oferta"
};

let statusDriver = "disponivel,corrida";

let timeoutUpdateMonitor = null;

function returnValueByPosition(position = 0, delimiter = ' ', content) {
    content = content.split(delimiter);
    return content[position]
}

function newSubstring(content, init = 0, finish = 10) {
    content = content.substr(init, finish);
    return content;
}

function initMap() {
    const city = Session.getLocal("citySelected");

    mapService.initMap({lat: 0, lng: 0}, 13);

    const keys = Session.getLocal64('keysConfig');
    const manager = keys.find((res) => {
        return res.type == "GESTOR"
    })

    const seconds = manager.config.find(item => item.key === "interval-to-get-trips").value || "5"

    if (city) {
        window.elementProperty.getElement("#citySelectedMap", element =>
            element.innerHTML = city.nome);

        updateActivity(1000 * parseFloat(seconds));
    }
    initPop();

    if (Session.getLocal("pointsCity"))
        setTimeout(() => {
            mapService.setBoundsInMap(Session.getLocal("pointsCity"));

            var lineSymbol = {
                path: 'M 0,-1 0,1',
                strokeOpacity: 0.5,
                scale: 2.5
            };

            const polyline = new google.maps.Polyline({
                path: Session.getLocal("pointsCity"),
                geodesic: true,
                icons: [{
                    icon: lineSymbol,
                    offset: '0',
                    repeat: '20px'
                }],
                // strokeColor: '#000000',
                strokeOpacity: 0,
                //strokeWeight: 2
            });

            polyline.setMap(mapService.map);

        }, 1000);

}

function updateQuantities(time) {
    monitorController.quantities().then(showQuantities);
    setTimeout(() => {
        updateQuantities(time)
    }, time);
}

function updateActivity(time) {
    clearTimeout(timeoutUpdateMonitor);

    const promises = [
        DriverController.getAllPositions(statusDriver),
        monitorController.activeTrips(),
    ];

    const callback = [
        searchDrivers,
        showTripsActive,
    ];

    Promise.all(promises).then((results) => {
        results.map((result, index) => {
            callback[index](result);
        });
    }).finally(() => {
        timeoutUpdateMonitor = setTimeout(function () {
            updateActivity(time);
        }, time);
    });
}

function searchDrivers(result) {

    filterDriverMap();

    mapService.clearMarkers();

    createAutocompleteDriver(result.response);

    createListDriver(result.response);

    Object.keys(mapService.drivers).map((id) => {
        if (result.response.filter(driver => {
            return driver.idDriver === id;
        }).length === 0) {
            mapService.drivers[id].marker.setMap(null);
            delete mapService.drivers[id];
        }
    });

    result.response.map(driver => {

        const colors = {
            'disponivel': '#ffb20a',
            'desligado': '#000000',
            'corrida': '#00bf11'
        };

        mapService.makeMarker(driver, driver.status, colors[driver.status], driver.status === "corrida");
    });
}

function showTripsActive({status, response:data}) {
    mapService.clearGuest();

    elementProperty.getElement("#listTrips", element => {
        mapService.existTripInMap(data.filter(trip => STATUS_SEARCH === trip.status || trip.status === STATUS_SEARCH_FAVORITE));

        showRouteTripActiveInMap(data);

        mapService.clearFinishTrip(data);

        element.innerHTML = data.map(trip => {
            if (STATUS_SEARCH === trip.status || trip.status === STATUS_SEARCH_FAVORITE) {
                showPointCall(trip);
            }

            return layoutStatusTrip(trip);
        }).join("");

        elementProperty.addEventInElement(".option-trip-active", "onclick",
            function () {
                const trip = JSON.parse(decodeURIComponent(escape(atob(this.getAttribute('value')))));
                showOptionTripActive(trip);
            });

    });
}

function showRouteTripActiveInMap(trips) {
    const tripsProgress = trips.filter(trip => {
        return STATUS_SEARCH !== trip.status
            && trip.status !== STATUS_SEARCH_FAVORITE
    });

    Object.keys(pointsRoute).filter(tripReference => {
        const finished = tripsProgress.filter(trip => {
            return trip.tripReference === tripReference;
        }).length === 0;

        if (finished) {
            pointsRoute[tripReference].setMap(null);
            pointsRoute[tripReference].line.setMap(null);
        }
    });

    tripsProgress.map(trip => {
        if (mapService.drivers[trip.driverId] == null)
            return;

        const destination = (trip.status === STATUS_ACCEPTED || trip.status === STATUS_BOARDING) ?
            {lat: parseFloat(trip.originLatitude), lng: parseFloat(trip.originLongitude)} : {
                lat: parseFloat(trip.destinationLatitude),
                lng: parseFloat(trip.destinationLongitude)
            };

        const latLng = new google.maps.LatLng(parseFloat(destination.lat), parseFloat(destination.lng));

        if (pointsRoute[trip.tripReference]) {
            elementProperty.getElement(`#status${trip.tripReference}`, element => {
                element.innerHTML = descriptionStatus[trip.status];
            });
            //pointsRoute[trip.tripReference].anchor.innerHTML = getContentRoute(trip);
            pointsRoute[trip.tripReference].position = latLng;
            const path = [destination];

            const {lat, lng} = mapService.drivers[trip.driverId].marker.getPosition();

            path.push({lat: lat(), lng: lng()});

            pointsRoute[trip.tripReference].line.setPath(path);
            pointsRoute[trip.tripReference].line.setMap(mapService.map);
            return;
        }


        pointsRoute[trip.tripReference] = new Popup(latLng, getContentRoute(trip));

        pointsRoute[trip.tripReference].setMap(mapService.map);

        const path = [destination];

        const {lat, lng} = mapService.drivers[trip.driverId].marker.getPosition();

        path.push({lat: lat(), lng: lng()});

        pointsRoute[trip.tripReference].line = new google.maps.Polyline({
            path,
            geodesic: true,
            strokeColor: getRandomColor(),
            strokeOpacity: 1.0,
            strokeWeight: 1,
        });

        pointsRoute[trip.tripReference].line.setMap(mapService.map)

    });
}

elementProperty.addEventInElement('#get-trip-scheduled', 'onclick', function () {
    preload(true);
    $('#modal-trip-scheduled').modal('show');

    elementProperty.getElement('.scheduled-trips', these => {
            monitorController.filterTrip().then(({status, response}) => {

                if (!status)
                    return swal('Erro ao buscar viagens agendadas', 'Contate o suporte', 'error');

                let content = '';
                content += response.trips.data.map(item => {
                    return `
                        <li class="data-trip-scheduled col-lg-12" data="${JSON.stringify(item)}">
                            <span class="col-lg-12" style="display: flex"><b>Cliente</b>: ${returnValueByPosition(0, ' ', item.customerName)} </span>
                            <span class="col-lg-12" style="display: flex"><b>Telefone</b>: <a href="#">${item.customerPhone}</a> </span>
                            <span class="col-lg-12" style="display: flex"><b>Origem</b> : ${newSubstring(item.originAddress, 0, 30)}</span>
                            <span class="col-lg-12" style="display: flex"><b>Destino</b>: ${newSubstring(item.destinationAddress, 0, 30)}</span>
                            <span class="col-lg-12" style="display: flex"><b>Valor</b>: R$${Mask.maskMoney(parseFloat(item.price))}</span>
                            <span class="col-lg-12" style="display: flex"><b>Tipo</b>: ${item.tripType}</span>
                            <span class="col-lg-12" style="display: flex"><b>Data</b>: ${Mask.setDateCrazy(item.scheduleDate)}</span>
                        </li>
                        <hr>
                    `;
                }).join('');
                document.getElementById('mount-list-trip').innerHTML = content;
                preload(false);
            });

        document.getElementById('listTrips').style.display = '';
    });
});

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function showPointTrip(element) {
    if (element.classList.contains("active")) {
        element.classList.remove("active");
        return;
    }
    elementProperty.removeClass(".container-call-customer", "active");
    element.classList.add("active");
}

function getContentRoute(trip) {
    return `
    <div onclick='showPointTrip(this)' style="background-image: url('${environment.hosts.hostImageClient}${trip.customerPhoto}');" 
        class="container-call-customer">
        <div>
             <div style="background-image: url('${environment.hosts.hostImageClient}${trip.customerPhoto}');"></div>
            <div style="background-image: url('${environment.hosts.hostImageDriver}${trip.driverPhoto}');"></div>
        </div>
        <div id="status${trip.tripReference}">${descriptionStatus[trip.status]}</div>
     </div>  
    
    
    
    `;
}

function showPointCall(trip) {
    mapService.addCallPosition(trip);
}

function showQuantities({status, response}) {
    const amountDailyTrips = response[0];

    if (!amountDailyTrips) {
        elementProperty.getElement("#todayQuantity", element => {
            element.innerHTML = 0;
        });

        elementProperty.getElement("#totalTrips", element => {
            element.innerHTML = 0;
        });

        elementProperty.getElement("#totalPriceFinished", element => {
            element.innerHTML = '0,00';
        });

        elementProperty.getElement('#acceptedQuantity', element => {
            element.innerHTML = 0;
        });

        elementProperty.getElement('#totalCanceledByDriver', element => {
            element.innerHTML = 0;
        });

        elementProperty.getElement('#totalCanceledByCustomer', element => {
            element.innerHTML = 0;
        });

        elementProperty.getElement('#totalMoneyTrips', element => {
            element.innerHTML = 0;
        });

        elementProperty.getElement('#totalVoucherTrips', element => {
            element.innerHTML = 0;
        });
        elementProperty.getElement('#totalCardTrips', element => {
            element.innerHTML = 0;
        });

        elementProperty.getElement('#finally', element => {
            element.innerHTML = 0;
        });

        elementProperty.getElement('#totalCanceled', element => {
            element.innerHTML = 0;
        });

        elementProperty.getElement('#noAccepted', element => {
            element.innerHTML = `0/0/0`;
        });

        preload(false);
        return;
    }

    elementProperty.getElement("#todayQuantity", element => {
        element.innerHTML = amountDailyTrips.totalTodayTrips;
    });
    elementProperty.getElement("#totalTrips", element => {
        element.innerHTML = amountDailyTrips.totalTrips;
    });

    elementProperty.getElement("#totalPriceFinished", element => {
        if (parseInt(amountDailyTrips.totalPriceFinished) === 0)
            return element.innerHTML = '0,00';
        element.innerHTML = amountDailyTrips.totalPriceFinished;
    });

    let canceled = (parseInt(amountDailyTrips.totalCanceledByCustomer) + parseInt(amountDailyTrips.totalCanceledByDriver));

    elementProperty.getElement('#acceptedQuantity', element => {
        element.innerHTML = amountDailyTrips.totalAcceptedTrips;
    });

    elementProperty.getElement('#totalCanceledByDriver', element => {
        element.innerHTML = amountDailyTrips.totalCanceledByDriver;
    });

    elementProperty.getElement('#totalCanceledByCustomer', element => {
        element.innerHTML = amountDailyTrips.totalCanceledByCustomer;
    });

    elementProperty.getElement('#totalMoneyTrips', element => {
        element.innerHTML = amountDailyTrips.totalMoneyTrips;
    });

    elementProperty.getElement('#totalVoucherTrips', element => {
        element.innerHTML = amountDailyTrips.totalVoucherTrips;
    });
    elementProperty.getElement('#totalCardTrips', element => {
        element.innerHTML = amountDailyTrips.totalCardTrips;
    });

    elementProperty.getElement('#finally', element => {
        element.innerHTML = amountDailyTrips.quantityTripsFinished;
    });

    elementProperty.getElement('#totalCanceled', element => {
        element.innerHTML = canceled;
    });

    elementProperty.getElement('#noAccepted', element => {
        element.innerHTML = `${amountDailyTrips.quantityTripsNotAnswered}/${amountDailyTrips.quantityCustomersNotAnswered}/${amountDailyTrips.lostCustomersNotAnswered}`;
    });

    preload(false);

    elementProperty.getElement('#acceptedQuantityModal', element => {
        element.innerHTML = amountDailyTrips.totalAcceptedTrips;
    });

    elementProperty.getElement('#finallyModal', element => {
        element.innerHTML = amountDailyTrips.quantityTripsFinished;
    });

    elementProperty.getElement('#todayQuantityModal', element => {
        element.innerHTML = amountDailyTrips.totalTodayTrips;
    });

    elementProperty.getElement('#totalCanceledByDriverModal', element => {
        element.innerHTML = amountDailyTrips.totalCanceledByDriver;
    });

    elementProperty.getElement('#totalCanceledByCustomerModal', element => {
        element.innerHTML = amountDailyTrips.totalCanceledByCustomer;
    });

    elementProperty.getElement('#totalCanceledModal', element => {
        element.innerHTML = canceled;
    });

    elementProperty.getElement('#noAcceptedClientModal', element => {
        element.innerHTML = amountDailyTrips.quantityCustomersNotAnswered;
    });

    elementProperty.getElement('#noAcceptedClientLostModal', element => {
        element.innerHTML = amountDailyTrips.lostCustomersNotAnswered;
    });

    elementProperty.getElement('#noAcceptedTotalModal', element => {
        element.innerHTML = amountDailyTrips.quantityTripsNotAnswered;
    });

    elementProperty.getElement('#totalMoneyTripsModal', element => {
        element.innerHTML = amountDailyTrips.totalMoneyTrips;
    });

    elementProperty.getElement('#totalVoucherTripsModal', element => {
        element.innerHTML = amountDailyTrips.totalVoucherTrips;
    });
    elementProperty.getElement('#totalCardTripsModal', element => {
        element.innerHTML = amountDailyTrips.totalCardTrips;
    });

    elementProperty.getElement('#totalPriceFinishedModal', element => {
        if (parseInt(amountDailyTrips.totalPriceFinished) === 0)
            return element.innerHTML = '0,00';
        element.innerHTML = amountDailyTrips.totalPriceFinished;
    });
}

elementProperty.addEventInElement(".option-item-map", "onclick", function () {
    elementProperty.getElement(".container-option-monitor", element => {
        element.classList.add("active");
    });
});

elementProperty.addEventInElement("#cancelOptionMonitor", "onclick", function () {
    elementProperty.getElement(".container-option-monitor", element => {
        element.classList.remove("active");
    });
});

elementProperty.addEventInElement("#toFollowDriver", "onclick", function () {
    elementProperty.getElement(".container-option-monitor", element => {
        element.classList.remove("active");
    });
    elementProperty.getElement(".container-to-follow-driver", element => {
        element.classList.add("active");
    });
});

elementProperty.addEventInElement(".option-mobile", "onclick", function (e) {
    e.stopPropagation();

    elementProperty.getElement(".option-mobile", element => {
        element.classList.remove("active");
        removeClassOption(element.getAttribute("value"));
    });

    this.classList.add("active");

    const className = this.getAttribute("value");

    if (className.length === 0)
        return;

    elementProperty.addClass(`.${className}`, "active");
});

function removeClassOption(value) {
    if (value.length === 0)
        return;

    elementProperty.removeClass(`.${value}`, "active");
}

elementProperty.addEventInElement("#listDrivers", "onclick", function () {
    elementProperty.getElement(".container-option-monitor", element => {
        element.classList.remove("active");
    });
    elementProperty.getElement(".container-list-driver", element => {
        element.classList.add("active");
    });
});

elementProperty.addEventInElement("#listCustomers", "onclick", function () {
    elementProperty.getElement(".container-option-monitor", element => {
        element.classList.remove("active");
    });

    clearSearch();

    getListCustomer();

    elementProperty.getElement(".container-list-customer", element => {
        element.classList.add("active");
    });
});

elementProperty.addEventInElement("#cancelToFollowDriver", "onclick", function () {
    elementProperty.getElement(".container-to-follow-driver", element => {
        element.classList.remove("active");
    });
});

function createAutocompleteDriver(drivers) {

    autocomplete.initAutocomplete("#nameDriver", drivers, ["name"], ["name"], 5, "profileImage");

    autocomplete.setSrc(environment.hosts.hostImageDriver);

    Mask.idUrl().then(user => {
        if (user.length !== 0 && control === false) {
            autocomplete.findListByValue(user);
            elementProperty.getElement(".container-option-monitor", element => {
                element.classList.remove("active");
            });
            elementProperty.getElement(".container-to-follow-driver", element => {
                element.classList.add("active");
            });
            user = user.replace('%20', ' ');
            document.getElementById('nameDriver').value = user;
            control = true;
        }
    });

    autocomplete.getItemSelected(driver => {
        elementProperty.getElement(".container-to-follow-driver", element => {
            element.classList.remove("active");
        });

        mapService.map.setCenter({lat: parseFloat(driver.latitude), lng: parseFloat(driver.longitude)});
        mapService.map.setZoom(17);

        elementProperty.getElement("#nameDriver", element => {
            element.value = "";
        });

        mapService.addInfoDriver(driver.idDriver,
            `<div class='found-driver-in-map'>
                <div class="profile-image" 
                    style="background-image: url(${environment.hosts.hostImageDriver + driver.profileImage})"></div>
                <p>${driver.name}</p>
                <ul class="options-driver">
                    <li onclick="openOptionNotification(this)" value='${JSON.stringify(driver)}'>
                        <i class="material-icons">notification_important</i>
                        <span>Enviar notificação</span>
                    </li>
                    <li>
                        <a href="/driver/monitoring/${driver.idDriver}">
                            <i class="material-icons">map</i>
                            <span>Acompanhar Individual</span>
                        </a>
                    </li>
                </ul>
            </div>`);
    });

}


function openOptionNotification(element) {
    const driver = JSON.parse(element.getAttribute("value"));

    showNotificationOneUser(driver.userId, driver.name, environment.hosts.hostImageDriver + driver.profileImage);
}

function layoutStatusTrip(trip) {
    const driver = mapService.getNextDriver(trip.driversCalled);

    if (STATUS_SEARCH === trip.status || trip.status === STATUS_SEARCH_FAVORITE)
        return `<li>
                   <div class="search-driver">
                     <i class="material-icons option-trip-active" value='${btoa(unescape(encodeURIComponent((JSON.stringify(trip)))))}'>settings</i>
                        <div>
                            <span>CLIENTE</span>
                            <div style=" ${trip.customerPhoto === null ? "" :
            'background-image: url(' + environment.hosts.hostImageClient + trip.customerPhoto + ')'}"></div>
                            <span>${trip.customerName}</span>
                        </div>
                        <div>
                            <p>Origem: ${trip.originAddress}</p>
                            <p>Destino: ${trip.destinationAddress}</p>
                            <p>${new Date(trip.date).toLocaleString()}</p>
                        </div>
                    </div>
                    <p class="label-selected-driver">Solicitando o motorista</p>
                    <div class="driver-selected">
                            <div>
                                 <div style=" ${trip.customerPhoto === null ? "" :
            'background-image: url(' + environment.hosts.hostImageDriver + driver.profileImage + ')'}"></div>
                           
                            </div>
                             <span style="${!driver ? "display:none" : ""}">
                                <span>${driver.name}</span>
                                <span>Tipo: ${driver.type} </span>
                                <span>N: ${driver.rating}/ D: ${parseFloat(driver.proximity).toFixed(2)} </span>
                            </span>
                            </div>
                        <h4><span>Valor: R$${Mask.maskMoney(parseFloat(trip.price))}</span>
                                    <span>Tipo: ${trip.driverType === null ? "-" : trip.driverType}</span></h4>
                        <ul>
                            ${showListDriverCalled(trip.driversCalled)}
                        </ul>
                        <div class="info-trip">
                            <p> ${descriptionStatus[trip.status]} </p>
                            <p> ${trip.tripType} </p>
                            <p> ${trip.paymentForm} </p>
                        </div>
                    </li>`

    return `<li>
                        <div>
                                <i class="material-icons option-trip-active" value='${btoa(unescape(encodeURIComponent((JSON.stringify(trip)))))}'>settings</i>
                                <div>
                                    <span>CLIENTE</span>
                                    <div style=" ${trip.customerPhoto === null ? "" :
        'background-image: url(' + environment.hosts.hostImageClient + trip.customerPhoto + ')'}"></div>
                                    <span>${trip.customerName}</span>
                                </div>
                                <div>
                                    <span>MOTORISTA</span>
                                    <div style=" ${trip.driverPhoto === null ? "" :
        'background-image: url(' + environment.hosts.hostImageDriver + trip.driverPhoto + ')'}"></div>
                                    <span>${trip.driverName !== null ? trip.driverName : ""}</span>
                                </div>
                            </div>
                        <p>Origem: ${trip.originAddress}</p>
                        <p>Destino: ${trip.destinationAddress}</p>
                        <h4><span>Valor: R$${Mask.maskMoney(parseFloat(trip.price))}</span>
                            <span>Tipo: ${trip.driverType === null ? "-" : trip.driverType}</span></h4>
                            
                        <p>${trip.schedule === null ? new Date(trip.date).toLocaleString() : new Date(trip.schedule).toLocaleString()}</p>
                        <p> 
                            <span><b>CLIENTE</b>: ${trip.customerAppVersion != null ? trip.customerAppVersion : ''}</span> - 
                            <span><b>MOTORISTA</b>: ${trip.driverAppVersion != null ? trip.driverAppVersion : ''}</span>
                         </p>
                        <div class="info-trip">
                            <p> ${descriptionStatus[trip.status]} </p>
                            <p> ${trip.tripType} </p>
                            <p> ${trip.paymentForm} </p>
                        </div>
                    </li>`
}

function showListDriverCalled(driversCalled) {
    const driversExist = [];

    return driversCalled.map(driver => {
        const {driverSelect, count} = lastCalled(driversCalled, driver);

        if (driversExist.filter((driverLast) => {
            return driverLast.driverId === driver.driverId;
        }).length !== 0)
            return "";

        driversExist.push(driver);

        return `<li class="${driverSelect.status}">
                    ${driverSelect.nickname}
                    <label>${count}</label>
                </li>`
    }).join("")
}

function lastCalled(driversCalled, driverSelected) {
    const countDriver = driversCalled.filter(driver => {
        return driverSelected.driverId === driver.driverId;
    });

    return {driverSelect: countDriver[countDriver.length - 1], count: countDriver.length};
}

elementProperty.addEventInElement(".option-driver", "onclick", function () {
    statusDriver = this.getAttribute("value");

    elementProperty.getElement(".option-driver", element => {
        element.classList.remove("active");
    });

    filterDriverMap();

    this.classList.add("active");
});

function filterDriverMap() {
    Object.keys(mapService.drivers).map(index => {
        const driver = mapService.drivers[index];
        if (!statusDriver.includes(driver.status)) {
            mapService.drivers[index].marker.setMap(null);
            delete mapService.drivers[index];
        }
    });
}

elementProperty.addEventInElement("#updateQuantities", "onclick", function () {
    preload(true);
    monitorController.quantities().then(showQuantities);
});

monitorController.quantities().then(showQuantities);

verifyPanic();

function removeAccents(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function verifyPanic() {
    const cityId = Session.getLocal('citySelected').cityId
    NotificationController.getUnread().then(({status, response}) => {
        if (!status)
            return swal('Erro ao listar notificações', 'Contate o suporte', 'info');
        if (response === null)
            return false;

        response.map(item => {
            if (item.name === 'motorista') {
                let that = item?.admin_notifications;
                that.map(notification => {
                    if (notification.emergencyMonitoringTypeId === 6 && configAlertPhotoPanicButton) {
                        document.getElementById('alert-photo').innerHTML = `
                        <video src="${notification.picture}" 
                        controls
                        title="Visualizar Vídeo"
                        onclick="window.open('${notification.picture}', '_blank')"
                        style="width: 400px; height: 200px; border-radius: 10px; margin-top: 20px; cursor: pointer;"
                        />`;
                    }

                    if (removeAccents(notification.admin_notification_type.name) === removeAccents('BOTÃO DE PÂNICO') && notification.emergencyMonitoringTypeId === 6 && configAlertPhotoPanicButton) {
                        idNotification = notification.id;
                        name = notification.user.name;
                        document.getElementById('message-panic').innerHTML = notification.message;
                        return $('#modal-notification-panic').modal('show');
                    } else if(removeAccents(notification.admin_notification_type.name) === removeAccents('BOTÃO DE PÂNICO') && notification.emergencyMonitoringTypeId !== 6) {
                        idNotification = notification.id;
                        name = notification.user.name;
                        document.getElementById('message-panic').innerHTML = notification.message;
                        return $('#modal-notification-panic').modal('show');
                    }
                });
            }
        });
    });
    setTimeout(() => {
        verifyPanic()
    }, 30000)

    elementProperty.addEventInElement('#panic-read', 'onclick', function () {
        SwalCustom.confirm('Deseja marcar notificação como lida?', '').then(status => {
            if (!status)
                return false;

            NotificationController.notificationView(idNotification).then(({status, response}) => {
                if (!status)
                    return swal("Erro ao atualizar status da notificação", "Contate o suporte", "info");

                sendPush('Notificação atualizada com sucesso', '');
            });
        });
    });

    elementProperty.addEventInElement('#find-trip', 'onclick', function () {
        window.location.href = '/monitor/monitoring/' + name;
    });

    elementProperty.addEventInElement('#open-trip', 'onclick', function () {
        let trip = this.getAttribute('trip');
        window.location.href = `/trip/${trip}/details`;
    });
}
