const elementProperty = new ElementProperty();

const urlSplit = location.href.split("/");

const id = urlSplit[urlSplit.length - 1];

new MapService().importScriptWithPlaces().then(()=>{
    CustomerController.getCustomerById(id).then(({data,status,message})=>{
        if(!status){
            SwalCustom.messageDialog("",message,"info");
            return;
        }

        showDetailCustomer(data);
    });
});

function showDetailCustomer(customer) {
    const mapService = new MapService();

    elementProperty.getElement(".container-map", element => {
        mapService.initMap({lat: 0, lng: 0}, 12.81, element);
    });

    elementProperty.getElement(".option-trip", element => {
        elementProperty.getElement("#" + element.getAttribute("value"), elementChildren => {
            elementChildren.style.display = element.classList.contains("active") ? "block" : "none";
        });
    });

    const statusTrip = {
        not_answered: "não atendida",
        back_off: "desistência",
        finished: "finalizada",
        canceled: "cancelada",
        searching: "procurando",
        payment_refused: "pagamento recusado",
        accepted: "aceita",
        boarding: "embarcando",
        in_progress: "em corrida",
    };

    const searchListTrips = {
        page: 1,
        customerUserId: customer.idUser,
    };

    const setting = {
        currentPage: null,
        data: null,
        lastPage: null,
    };

    clearSearch();

    showTrips();

    elementProperty.addEventInElement(".option-trip", "onclick", function () {
        elementProperty.getElement(".option-trip", element => {
            element.classList.remove("active");

            elementProperty.getElement("#" + element.getAttribute("value"), element => {
                element.style.display = "none";
            });
        });

        this.classList.add("active");

        elementProperty.getElement("#" + this.getAttribute("value"), element => {
            element.style.display = "block";
        });
    });

    elementProperty.getElement(".container-detail-customer", element => element.classList.add("active"));

    elementProperty.getElement("#profileDriverImage", element => {
        const img = customer.profileImage !== null ?
            `${environment.hosts.hostImageClient}${customer.profileImage}` : "/webfiles/img/icon/user.png";

        element.style.backgroundImage = `url(${img})`;
    });

    elementProperty.getElement(".name-customer", element => {
        element.innerHTML = customer.name;
    });

    elementProperty.getElement(".email-customer", element => {
        element.innerHTML = customer.email;
    });

    elementProperty.getElement(".phone-customer", element => {
        element.innerHTML = customer.phone;
    });

    ///informacoes das viajens////


  //  elementProperty.getElement(".total-completed-trips", element => {
    //    element.innerHTML = customer.finished;
    //});

 //   elementProperty.getElement(".total-canceled-trips", element => {
     //   element.innerHTML = customer.canceled;
    //});


    function showTrip(trip) {
        const mapService = new MapService();

        elementProperty.getElement(".container-map", element => {
            mapService.initMap({lat: 0, lng: 0}, 12.81, element);
        });

        elementProperty.getElement(".option-trip", element => {
            elementProperty.getElement("#" + element.getAttribute("value"), elementChildren => {
                elementChildren.style.display = element.classList.contains("active") ? "block" : "none";
            });
        });
    };


    function showTrips() {
        TripController.listTripBy(searchListTrips)
            .then(({status, data, message}) => {
                if (!status) {
                    SwalCustom.messageDialog("", message, "info");
                    return;
                }

                setting.currentPage = data.currentPage;
                setting.data = data.data;
                setting.lastPage = data.lastPage;

                elementProperty.getElement("#listTripCustomer", element => {
                    element.innerHTML += setting.data.map(trip => {
                        const date = new Date(trip.date.date);

                        return `<li value="${trip.tripReference}" class="trip-item">
                                 <div>
                                     <p>${date.toLocaleString()}</p>
                                     <p>R$ ${Mask.maskMoney(parseFloat(trip.price))}</p>
                                 </div>
                                 <label>${statusTrip[trip.status]}</label>
                                 <p>${trip.originAddress}</p>
                                 <p>${trip.destinationAddress}</p>
                            </li>`;
                    }).join("");

                    elementProperty.addEventInElement(".trip-item", "onclick", function () {
                        TripController.get(this.getAttribute("value"))
                            .then(({status, response, message}) => {
                                if (!status)
                                    return SwalCustom.messageDialog("", message, "info");
                                fillDataTrip(response);
                            });
                    });
                });

                ///menssagens do client///
                elementProperty.getElement("#settingTripCustomer", element => {
                    element.innerHTML += setting.data.map(message => {
                        console.log(message)
                        const date = new Date(message.date.date);
                        return `<span id="${message.idContactUs}" class="trip-contact">
                                     <p>Data:${date.toLocaleString()}</p>
                                     <p>Status:${statusTrip[message.status]}</p>
                                     <p id="${customer.idUser} " >Mensagem:${message.message}</p>
                                    <hr>
                                 </span>`;
                    }).join("");

                })

            });
    }

    function fillDataTrip(trip) {

        getChat(trip);

        elementProperty.getElement("#originTripCustomer", element => {
            element.innerHTML = trip.originAddress;
        });
        elementProperty.getElement("#destinationTripCustomer", element => {
            element.innerHTML = trip.destinationAddress;
        });
        elementProperty.getElement("#tripReferenceTripCustomer", element => {
            element.innerHTML = trip.tripReference;
        });
        elementProperty.getElement("#dateTripCustomer", element => {
            element.innerHTML = Mask.setDateCrazy(trip.date)//new Date(trip.date.date).toLocaleString();
        });
        elementProperty.getElement("#paymentTripCustomer", element => {
            element.innerHTML = trip.paymentForm;
        });
        elementProperty.getElement("#stateTripCustomer", element => {
            element.innerHTML = "";
        });
        elementProperty.getElement("#valueTripCustomer", element => {
            element.innerHTML = "R$ " + Mask.maskMoney(trip.price);
        });
        elementProperty.getElement("#statusTripCustomer", element => {
            element.innerHTML = statusTrip[trip.status];
        });
        elementProperty.getElement("#cancelByCustomerTrip", element => {
            if (statusTrip[trip.status] === statusTrip.canceled) {
                element.innerHTML = `Cancelado por ${trip.canceledBy === "customer" ?
                    "cliente" :
                    "motorista"
                    }`;
                return;
            }

            element.innerHTML = "";
        });
        elementProperty.getElement("#stateTripCustomer", element => {
            element.innerHTML = trip.tripAudit;
        });
        if (trip.driver === null) {
            trip.driver = {
                name: "",
                email: "",
                brand: "",
                model: "",
                color: "",
                plate: "",
                phone: "",
                profileImage: null
            };

        }

        elementProperty.getElement("#driverNameTripCustomer", element => {
            element.innerHTML = trip.driverName;
        });
        elementProperty.getElement("#driverEmailTripCustomer", element => {
            // element.innerHTML = trip.driver.email;
        });
        elementProperty.getElement("#driverRatingTripCustomer", element => {
            element.innerHTML = "";
        });
        elementProperty.getElement("#driverCarTripCustomer", element => {
            // element.innerHTML = `${trip.driver.brand} ${trip.driver.model} 
            //                             ${trip.driver.color} ${trip.driver.plate}`;
        });
        elementProperty.getElement("#driverPhoneTripCustomer", element => {
            element.innerHTML = trip.driverPhone;
        });
        elementProperty.getElement(".profile-image-driver", element => {

            const img = trip.driverPhoto !== null ?
                `${environment.hosts.hostImageDriver}${trip.driverPhoto}` :
                "/webfiles/img/icon/user.png";

            element.style.backgroundImage = `url(${img})`;
        });

        const origin = {
            lat: parseFloat(trip.originLatitude),
            lng: parseFloat(trip.originLongitude)
        };

        const destination = {
            lat: parseFloat(trip.destinationLatitude),
            lng: parseFloat(trip.destinationLongitude)
        };



        mapService.showPointEventMap(origin, destination, trip.events);

        elementProperty.getElement("#listStatusDetailTrip", element => {
            const listStatus = trip.events.map((event, index) => {
                return `<li>
                            <img src="/webfiles/img/icon/point-${index}.png">
                            ${event.message} 
                            <div>${new Date(event.date).toLocaleString()}</div>
                        </li>`
            }).join("");

            element.innerHTML = `    
                            <li><img src="/webfiles/img/icon/origin.png">ORIGEM</li>
                            ${listStatus}
                            <li><img src="/webfiles/img/icon/destination.png">DESTINO</li>
            `
        })
    }

    function dryDataTrip() {


        elementProperty.getElement(".container-detail-customer", element => element.classList.remove("active"));

        elementProperty.getElement("#originTripCustomer", element => {
            element.innerHTML = "";
        });
        elementProperty.getElement("#destinationTripCustomer", element => {
            element.innerHTML = "";
        });
        elementProperty.getElement("#tripReferenceTripCustomer", element => {
            element.innerHTML = "";
        });
        elementProperty.getElement("#dateTripCustomer", element => {
            element.innerHTML = "";
        });
        elementProperty.getElement("#paymentTripCustomer", element => {
            element.innerHTML = "";
        });
        elementProperty.getElement("#stateTripCustomer", element => {
            element.innerHTML = "";

        });
        elementProperty.getElement("#valueTripCustomer", element => {
            element.innerHTML = "";
        });
        elementProperty.getElement("#statusTripCustomer", element => {
            element.innerHTML = "";
        });
        elementProperty.getElement("#cancelByCustomerTrip", element => {
            element.innerHTML = "";
        });
        elementProperty.getElement("#stateTripCustomer", element => {
            element.innerHTML = "";
        });
        elementProperty.getElement("#driverNameTripCustomer", element => {
            element.innerHTML = "";
        });
        elementProperty.getElement("#driverEmailTripCustomer", element => {
            element.innerHTML = "";
        });
        elementProperty.getElement("#driverRatingTripCustomer", element => {
            element.innerHTML = "";
        });
        elementProperty.getElement("#driverCarTripCustomer", element => {
            element.innerHTML = "";
        });
        elementProperty.getElement("#driverPhoneTripCustomer", element => {
            element.innerHTML = "";
        });
        elementProperty.getElement(".profile-image-driver", element => {
            element.style.backgroundImage = "";
        });
        elementProperty.getElement("#listStatusDetailTrip", element => {
            element.innerHTML = "";
        });
        elementProperty.getElement("#listTripCustomer", element => {
            element.innerHTML = "";
        });
        elementProperty.getElement("#listChatTripCustomer", element => {
            element.innerHTML = "";
        });
        elementProperty.getElement("#profileDriverImage", element => {
               element.style.backgroundImage = "";
        });
        elementProperty.getElement(".name-customer", element => {
            element.innerHTML = "";
        });

        elementProperty.getElement(".email-customer", element => {
            element.innerHTML = "";
        });

        elementProperty.getElement(".phone-customer", element => {
            element.innerHTML = "";
        });

        document.getElementById("dateStart").value = "";

        document.getElementById("dateEnd").value = "";

        clearSearch();

        mapService.clearEvent();
    }

    elementProperty.addEventInElement("#btnSearchTripIn", "onclick", function () {
        const dateStart = document.getElementById("dateStart").value;
        const dateEnd = document.getElementById("dateEnd").value;

        if (dateStart.length === 0) {
            SwalCustom.messageDialog("", "Por favor, informer a data inicial", "info").then(() => {
                document.getElementById("dateStart").focus();
            });
            return;
        }
        if (dateEnd.length === 0) {
            SwalCustom.messageDialog("", "Por favor, informer a data final", "info").then(() => {
                document.getElementById("dateEnd").focus();
            });
            return;
        }

        if (new Date(dateStart).getTime() > new Date(dateEnd)) {
            SwalCustom.messageDialog("", "Data final não pode ser menor que a data inicial").then(() => {
                document.getElementById("dateEnd").focus();
            });
            return;
        }

        clearSearch();

        const statusSelected = document.getElementById("statusTrip").value;

        if (statusSelected.length > 0) {
            searchListTrips.status = statusSelected;
        }

        searchListTrips.date = `${dateStart},${dateEnd}`;
        searchListTrips.date = `${dateStart},${dateEnd}`;

        showTrips();

    });

    elementProperty.addEventInElement("#listTripCustomer", "onscroll", function () {

        const element = event.target;

        if ((element.offsetHeight + element.scrollTop).toString().split(".")[0]
            === element.scrollHeight.toString()) {

            if (setting.currentPage >= setting.lastPage)
                return;

            searchListTrips.page += 1;
            showTrips();
        }
    });

    function clearSearch() {
        delete searchListTrips.status;
        delete searchListTrips.date;
        searchListTrips.page = 1;

        elementProperty.getElement("#listTripCustomer", element => element.innerHTML = "");
    }

    function getChat(trip) {
        ChatController.getChatTrip(trip.tripReference)
            .then(({status, data, message}) => {
                if (!status) {
                    SwalCustom.messageDialog("", message, "info");
                    return;
                }

                elementProperty.getElement("#listChatTripCustomer", element => {
                    element.innerHTML = data.map(chat => {
                        const messageBy = chat.isDriver ? "message-driver" : "message-client";

                        const content = chat.isAudio ? `<audio controls>
                                        <source src="${environment.hosts.hostAudio}${trip.tripReference}/${chat.message}" type="audio/mpeg">
                                    </audio>` : chat.message;

                        return `<li>
                                    <div class="${messageBy}">
                                        <div class="title-message"><p>${chat.name}</p><p>${new Date(chat.date.date).toLocaleString()}</p></div>
                                        <div class="container-message">${content}</div>
                                    </div>
                                </li>`
                    }).join("");
                })

            });

    }

    elementProperty.addEventInElement(".close-modal-customer-detail","onclick",dryDataTrip);
}


