preload(true);
const elementProperty = new ElementProperty();

const manager = {
    key: "",
};

const filter = {
    page: 1,
    status: null,
    driverId: null,
    customerUserId: null,
    date: null
};

let thisPage = 1;
let lastPage = 0;

const mapService = new MapService();

const autocompleteCustomer = new Autocomplete();
const autocompleteDriver = new Autocomplete();


const managerFilter = {
    timeoutcustomer: null,
    timeoutdriver: null
};


mapService.getKey().then(({status, data}) => {
    if (!status)
        return;
    manager.key = data;
    getListTrip(filter);
});

function getListTrip(filter, concat = false, header = false) {
    preload(true);
    elementProperty.getElement("#listTrips", element => {

            TripController.listTripBy(filter).then(({status, response}) => {
                if (!status) {
                    return SwalCustom.messageDialog("", "Ocorreu um erro ao buscar lista de viagem", "info");
                }

                let list = concat ? element.innerHTML : "";

                let item = response;
                let msgTripNotAttended = " Corrida não atendida";

                if (header) {
                    list += `
                    <li class="detail-trip-header"> 
                        <div class="form-group"> 
                            <label>Total em viagens</label>
                            <input class="form-control" value="R$${Mask.maskMoney(parseFloat(item.totalValue || 0))}" disabled>
                        </div> 
                        <div class="form-group"> 
                            <label>Total de viagens</label>
                            <input class="form-control" value="${item.trips.total}" disabled>
                        </div>
                    </li>
                `;
                }

                // Função para obter o valor de um cookie por nome
                function getCookie(cookieName) {
                    const name = cookieName + "=";
                    const decodedCookie = decodeURIComponent(document.cookie);
                    const cookieArray = decodedCookie.split(';');
                    for(let i = 0; i < cookieArray.length; i++) {
                        let cookie = cookieArray[i];
                        while (cookie.charAt(0) === ' ') {
                            cookie = cookie.substring(1);
                        }
                        if (cookie.indexOf(name) === 0) {
                            return cookie.substring(name.length, cookie.length);
                        }
                    }
                    return "";
                }

                const keyValueEncode = getCookie('text_whatsapp_trip_list_unanswered_support');
                const decodeValue = decodeBase64(keyValueEncode);
                const value = decodeValue.replace(/['"]+/g, '');

                function decodeBase64(encodedString) {
                    return atob(encodedString);
                }

                list += response.trips.data.map(trip => {
                    const nameInWhats = value !== "" ? value : NAME_APP;
                    return `<li class="detail-trip" tripReference="${trip.tripReference}">
                            <i class="material-icons">add</i>
                            <div class="container-item">
                                <div class="info-data-local-base">
                                    <div>${Mask.setDateCrazy(trip.date)}</div>
                                    <div>${trip.situation}</div>
                                </div>
                                <div class="info-base-trip">
                                    <div class="name-customer">
                                        <p>${trip.customerName != null ? trip.customerName : "-"} 
                                        ${trip.status === "not_answered" ? `
                                            <a target="_blank" 
                                                title="Entrar em contato com o cliente"
                                                href="https://api.whatsapp.com/send?phone=55${Mask.whats(trip.phone)}&text=Ol%C3%A1%2C%20somos%20o%20suporte%20da%20${nameInWhats}%20%2C%20gostar%C3%ADamos%20de%20falar%20sobre%3A${msgTripNotAttended}">
                                            <img src="/webfiles/img/icon/whatsapp.png">
                                            </a>`: ""}
                                        </p>
                                    </div>
                                    <div class="info-payment-form">
                                        <p>R$ ${Mask.maskMoney(parseFloat(trip.totalValue ?? trip.price))}</p>
                                        <p>${trip.paymentForm}</p>
                                    </div>
                                     <div class="status-trip-list">
                                        <p>Status: ${getStatus(trip.status)}</p>
                                        <p>${cancelBy(trip)}</p>
                                    </div>
                                </div>
                                <div class="more-info">
                                    ${trip.driverId != null
                        ? `<span class="tripStatusDriver" tripReference="${trip.tripReference}"></span>`
                        : `<span class="reject">Corrida não atendida</span>`}
                                    <ul>
                                        <li>
                                            <div>
                                                <span class="originAddress" tripReference="${trip.tripReference}"></span>
                                            </div>
                                        </li>
                                        ${trip.trip_way_points.length > 0 ? trip.trip_way_points.map(wayPoint => {
                                        return `<li>
                                                    <div>
                                                        <span class="wayPointAddress" tripReference="${trip.tripReference}" wayPointId="${wayPoint.id}">${wayPoint.address}</span>
                                                    </div>
                                                </li>`
                                            }).join("") : ""
                                        }
                                        <li>
                                            <div>
                                                <span class="destinationAddress" tripReference="${trip.tripReference}"></span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <footer>
                            ${trip.tripCallTypeId !== 7 ? `
                                <a href="/trip/${trip.tripReference}/details" target="_blank">
                                    Detalhes
                                    <i class="material-icons">arrow_forward</i>
                                </a>` :
                                `<a href="/trip/${trip.tripReference}/rideDetails" target="_blank">
                                    Detalhes
                                    <i class="material-icons">arrow_forward</i>
                                </a>`}
                            </footer>
                        </li>`
                }).join("");

                document.querySelector("#btnShowMoreTrip").hidden = (response.trips.next_page_url == null);

                elementProperty.addEventInElement("#btnShowMoreTrip", "onclick", function () {
                    if (response.trips.next_page_url != null) {
                        preload(true);
                        filter.page += 1;
                        getListTrip(filter, true);
                    }
                });

                element.innerHTML = list;

                elementProperty.addEventInElement('.detail-trip', 'onclick', function () {
                    const tripReference = this.getAttribute('tripReference');
                    const icon = this.getElementsByClassName("material-icons")[0];
                    if (!this.classList.contains("active")) {
                        preload(true);
                        TripController.getRouteTrip(tripReference).then((data) => {
                            preload(false);
                            document.querySelector(`.originAddress[tripReference='${tripReference}']`).innerHTML = data.response.originAddress;
                            document.querySelector(`.destinationAddress[tripReference='${tripReference}']`).innerHTML = data.response.destinationAddress;
                            document.querySelector(`.tripStatusDriver[tripReference='${tripReference}']`).innerHTML = `Viagem no ${data.response.tripType} com ${data.response.driverName}`;
                        }).finally(() => {
                            this.classList.add("active");
                            icon.innerHTML = "remove";
                        });
                    } else {
                        this.classList.remove("active");
                        icon.innerHTML = "add";
                    }
                });

                elementProperty.addEventInElement('.list', 'onclick', function () {
                    let id = this.getAttribute('id');
                    elementProperty.getElement('#map' + id, mapa => {
                        if (mapa.classList.contains('hidden')) {
                            mapa.classList.remove('hidden');
                            return;
                        }
                        mapa.classList.contains('hidden');
                    });
                });

                elementProperty.addEventInElement('.openChat', 'onclick', function () {
                    let id = this.getAttribute('id');
                    TripController.getChat(id).then(resolve => {
                        let dataChat = resolve.data;
                        if (dataChat.length === 0) {
                            swal("Sem mensagens no chat");
                            return;
                        }

                        elementProperty.getElement("#contentChat" + id, element => {
                            let textChat = dataChat.map(chat => {

                                return `
                                <div class="${chat.isDriver}">
                                    <img class="imageDriver" src="${chat.isDriver ? "https://cdn4.iconfinder.com/data/icons/professions-1-1/128/30-512.png" : ""}">
                                    ${chat.isAudio ? "<audio class='message' controls><source src='" + environment.hosts.hostAudio + id + '/' + chat.message + "'></audio>" : checkMessage(chat.isDriver, chat.message)}
                                    <label class="date">${Mask.returnHour(chat.date.date)}</label>
                                </div>
                            `;
                            }).join(" ");

                            function checkMessage(who, message) {
                                if (message === "call-number call-customer") {
                                    if (!who) {
                                        return "<span class='message'>Passageiro ligou</span>"
                                    }
                                    return "<span class='message'>Motorista ligou</span>"
                                }

                                return "<span class='message'>" + message + "</span>"
                            }

                            let modalChat = new Modal('#modalChat' + id);
                            modalChat.open();
                            element.innerHTML = textChat;
                        });
                    });
                });

                elementProperty.addEventInElement(".button-option", "onclick", showOptions);

                elementProperty.addEventInElement(".cancelTrip", "onclick", function () {
                    SwalCustom.dialogConfirm('Tem certeza que deseja cancelar?', 'Atenção', status => {
                        if (status) {
                            TripController.canceledTrip(this.getAttribute('id')).then(res => {
                                if (res.status) {
                                    swal('', res.message, 'success');
                                    return;
                                }
                                swal('ops..', res.message, 'error');
                            });
                            return;
                        }
                        swal('Ação cancelada');
                    });
                });
            }).finally(() => {
                preload(false);
            })
        }
    )
    ;
}


function showOptions() {

    if (this.classList.contains("active")) {
        this.classList.remove("active");
        return;
    }
    elementProperty.removeClass(".button-option", "active");
    this.classList.add("active");
}

window.addEventListener("click", function (e) {
    if (e.path.filter(elemet => {
        if (elemet.classList)
            return elemet.classList.contains("button-option");

        return false
    }).length === 0)
        elementProperty.removeClass(".button-option", "active");
});

function cancelBy(trip) {
    if (trip.status !== "canceled")
        return "";

    if (trip.canceledBy === null)
        return ``;
    let by = "";

    switch (trip.canceledBy) {
        case "driver":
            by = "motorista";
            break;
        case "customer":
            by = "cliente";
            break;

        default: {
            by = "Não definido";
        }
    }

    return `<span><span>Cancelada pelo ${by}</span></span>`;
}

function getStatus(status) {
    const allStatus = {
        "searching": "Buscando motorista",
        "searching_favorite": "Buscando motorista favorito",
        "pre_accepted": "Aceita por motorista em viagem",
        "accepted": "Aceita",
        "boarding": "Embarcando",
        "in_progress": "Em viagem",
        "finished": "Finalizada",
        "canceled": "Cancelada",
        "payment_refused": "Pagamento recusado",
        "not_answered": "Não atendida",
        "back_off": "Desistiu",
        "scheduled": "Agendado"
    };

    if (!allStatus[status])
        return 'Status não definido';

    return allStatus[status];
}

function getImgRoute(trip) {
    const origin = {
        lat: trip.originLatitude,
        lng: trip.originLongitude,
    };

    const destination = {
        lat: trip.destinationLatitude,
        lng: trip.destinationLongitude,
    };

    mapService.getImgMapTrip(manager.key, origin, destination).then(result => {
        elementProperty.getElement(`#route-${trip.tripReference}`, element => {
            element.setAttribute("src", result);
        });
    }).catch(error => {
        console.log(error);
    });

}

TripController.getStatusTrip().then(({response}) => {
    document.getElementById('filterStatus').innerHTML += response.map(data => {
        return `
                <option value="${data.id}">${data.text}</option>
            `
    }).join('')
});

elementProperty.addEventInElement("#openFilterTrip", "onclick", () => {
    $('#modal-filter').modal('show');
    document.getElementById("filterDateStart").valueAsDate = new Date();
    document.getElementById("filterDateEnd").valueAsDate = new Date();
});

elementProperty.addEventInElement("#filterClient", "oninput", (event) => {
    clearTimeout(managerFilter.timeoutcustomer);

    const value = event.srcElement.value;

    autocompleteCustomer.src = environment.hosts.hostImageClient;

    filter.driverId = null;

    managerFilter.timeoutcustomer = setTimeout(() => {
        CustomerController.listCustomerBy({name: value}).then(({status, response: {data: listCustomer}}) => {
            autocompleteCustomer.createAutoCompleteDynamic("#filterClient", listCustomer, "name", "profileImage");
            autocompleteCustomer.getItemSelected((customer) => {
                filter.customerUserId = customer.idUser;
            });

            elementProperty.addClass("#autocomplete-#filterClient", "customer-position")
        })
    }, 500);
});

elementProperty.addEventInElement("#filterDriver", "oninput", (event) => {
    clearTimeout(managerFilter.timeoutdriver);

    const value = event.srcElement.value;

    autocompleteDriver.src = environment.hosts.hostImageDriver;

    filter.driverId = null;

    managerFilter.timeoutdriver = setTimeout(() => {
        DriverController.listDriverBy({name: value}).then(({status, response: {data: listCustomer}}) => {
            autocompleteDriver.createAutoCompleteDynamic("#filterDriver", listCustomer, "name", "profileImage");
            autocompleteDriver.getItemSelected((driver) => {
                filter.driverId = driver.idDriver;
            });

            elementProperty.addClass("#autocomplete-#filterDriver", "customer-position")
        })
    }, 500);
});

elementProperty.addEventInElement("#filterTrip", "onclick", () => {

    const dateStart = document.getElementById("filterDateStart").value;
    const dateEnd = document.getElementById("filterDateEnd").value;

    filter.data = null;

    if (dateEnd.length > 0 || dateStart.length > 0) {
        if (dateStart.length === 0) {
            SwalCustom.messageDialog("", "Preencha a primeira data", "info");
            return;
        }
        if (dateEnd.length === 0) {
            SwalCustom.messageDialog("", "Preencha a ultima data", "info");
            return;
        }

        const dataStartDate = new Date(dateStart);
        const dataEndDate = new Date(dateEnd);

        if (dataStartDate.getTime() > dataEndDate.getTime()) {
            SwalCustom.messageDialog("", "Data Inicial deve ser menor ou igual a data final", "info");
            return;
        }
        filter.date = `${dateStart},${dateEnd}`;
    }

    filter.page = 1;
    filter.status = document.getElementById("filterStatus").value;
    filter.withTotalValue = 0;
    let showHeader = false;

    if (document.getElementById('filterHeader').checked) {
        filter.withTotalValue = 1;
        showHeader = true;
    }

    if (filter.status.length === 0) {
        filter.status = null;
    }
    preload(true);
    document.getElementById('filterClient').value = '';
    $('#modal-filter').modal('hide');
    getListTrip(filter, false, showHeader);
});

elementProperty.addEventInElement("#clearFilter", "onclick", function () {
    filter.page = 1;
    filter.status = null;
    filter.driverId = null;
    filter.customerUserId = null;
    filter.date = null;

    document.getElementById("filterClient").value = "";
    document.getElementById("filterDriver").value = "";
    document.getElementById("filterDateStart").valueAsDate = new Date();
    document.getElementById("filterDateEnd").valueAsDate = new Date();
    document.getElementById("filterStatus").selectedIndex = "0";


    getListTrip(filter, false, false);
});