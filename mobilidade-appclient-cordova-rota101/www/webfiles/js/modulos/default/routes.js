let updateListRoutes = null;

viewController.setObserver("home-routes", function () {
    Route.pageDynamic(true);

    const tripRepository = new TripRepository();

    updateRouteUser();
    updateDataUser();
    checkTravelActive();
    updateHistoric();
    checkTripRoute();


    function checkTripRoute() {
        if (!Array.isArray(Session.get("tripReferenceRide"))) {
            const tripRepository = new TripRepository();
            tripRepository.getTrip(Session.get("tripReferenceRide"),()=>{
                TripController.get(Session.get("tripReferenceRide")).then(({data}) => {
                    if (data.status === STATUS_FINISHED) {
                        Session.delete("tripReferenceRide");
                    }
                    checkTravelActive();
                });
            });
        }
    }

    function updateDataUser() {
        new CustomerController().find(Session.getValueInSession("user", "idUser")).then(({status, data, message}) => {
            if (!status) {
                SwalCustom.messageDialog(message, "Atenção", updateDataUser, "warning");
            } else {
                const config = Session.get("configGeneral");
                const picturesLink = config.find(item => {
                    return item.key === 'link_storage_pictures';
                });
                const finalLink = `${picturesLink.value}customer/profile/compressed/`;       

                const userLogged = Session.get("user");
                userLogged.customerRegisterStatusId = data.customerRegisterStatusId;
                userLogged.idPartner = data.idPartner;
                userLogged.partnerRegisterStatusId = data.partnerRegisterStatusId;
                userLogged.partnerRegisterStatus = data.partnerRegisterStatus;
                // userLogged.profileImage = `${PATH_IMAGE_PROFILE + data.profileImage}`;
                userLogged.profileImage = `${finalLink + data.profileImage}`;
                userLogged.document = data.document;
                userLogged.phone = data.phone;
                userLogged.name = data.name;
                userLogged.nickname = data.nickname;
                userLogged.nameEstablishment = data.nameEstablishment;
                userLogged.function = data.function;
                userLogged.userTypeId = data.userTypeId;
                userLogged.dateOfBirth = data.dateOfBirth;
                userLogged.referralMonetization = data.referralMonetization;
                userLogged.rg = data.rg;
                userLogged.rgFrontPicture = data.rgFrontPicture;
                userLogged.rgBackPicture = data.rgBackPicture;
                userLogged.isDependent = data.isDependent;
                userLogged.gender = data?.gender;

                Session.set("user", userLogged);

                if (data.trip) {
                    Session.set("tripReferenceRide", data.trip.tripReference);
                } else {
                    Session.delete("tripReferenceRide");
                }
            }
        });
    }

    if (!Array.isArray(Session.get("cityConfig")))
        tripRepository.checkTripByCallType(TYPE_RIDE, result => {
            updateListRoutes();
        });

    viewController.elementProperty.addEventInElement("#btnUpdateStatusRate", "onclick", function () {
        const list = document.querySelector("#listRouteAvailable");
        list.classList.remove("empty");
        list.innerHTML = "";

        updateListRoutes();
        checkTravelActive();
    });

    function checkTravelActive() {
        if (!Array.isArray(Session.get("tripReferenceRide"))) {
            viewController.elementProperty.addClass(".btn-accompany-trip", "active");
            hideTab();
        } else {
            viewController.elementProperty.removeClass(".btn-accompany-trip", "active");
            showTab();
        }
    }

    viewController.elementProperty.addEventInElement(
        ".item-tab",
        "onclick",
        function () {
            viewController.elementProperty.removeClass(
                ".container-option-tab",
                "active"
            );
            viewController.elementProperty.removeClass(".item-tab", "active");
            this.classList.add("active");

            document
                .querySelector(`div[for='${this.getAttribute("value")}']`)
                .classList.add("active");
        }
    );

    initCarouselHome();

    function initCarouselHome() {
        if (document.querySelector("#promotionalBannerRoute").innerHTML.length > 0)
            return;
        RoutePromotionalBannerController.findAll().then(({data}) => {
            document.querySelector("#promotionalBannerRoute").innerHTML = data.map(item => {
                return `<div class="item">
                <div class="photo-item-carousel" style="background-image: url(${item.path})"></div>
            </div>`
            }).join("");

            $('.owl-carousel').slick({
                infinite: true,
                dots: false,
                speed: 300,
                slidesToShow: 1,
                arrows: false,
                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                            infinite: true,
                            dots: true
                        }
                    },
                    {
                        breakpoint: 600,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                ]
            });
        });
    }

    const location = Session.get("location");

    if (!Array.isArray(location)) {
        showRouteByPosition(location);
        getConfigCityByPosition(location);
    }

    Position.getCurrentPosition(
        ({coords: {latitude: lat, longitude: lng}}) => {
            showRouteByPosition({lat, lng});
        }
    );

    updateListRoutes = () => {
        showRouteByPosition(location);
        updateRouteUser();
    };


    function updateRouteUser() {
        CustomerRideController.findActives().then(({data}) => {
            data.map(item => {
                if (!Array.isArray(Session.get("cityConfig")))
                    tripRepository.getTrip(item.ride.tripReference, result => {
                        if (result.status == STATUS_ACCEPTED || result.status == STATUS_IN_PROGRESS || result.status == STATUS_BOARDING) {
                            Session.set("tripReferenceRide", item.ride.tripReference);
                            checkTripRoute();
                            checkTravelActive();
                        }
                    })
            });


            document.querySelector("#listRouteUser").innerHTML = data.map(item => {
                return createLayoutRoute(item)
            }).join("");

            viewController.elementProperty.addEventInElement(".chat-trip-ride", "onclick", function () {
                const tripReference = this.getAttribute("tripReference");
                preload(true);
                TripController.get(tripReference).then(({data}) => {
                    preload(false);
                    viewController.addParams("chat-trip-selected-rider", {
                        userId: Session.getValueInSession("user", "idUser"),
                        driver: data.driver,
                        trip: data
                    });
                    Route.redirectDynamic("Ride", "ChatSelected");
                });
            });

            viewController.elementProperty.addEventInElement(".cancel-trip-ride", "onclick", function () {
                SwalCustom.dialogConfirm("Deseja cancelar sua viagem?", "Sua viagem será cancelada caso confirme o cancelamento").then(() => {
                    CustomerRideController.cancelByCustomer(this.getAttribute("tripReference")).then(() => {
                        updateRouteUser();

                        const location = Session.get("location");

                        if (!Array.isArray(location)) {
                            showRouteByPosition(location);
                        }
                    });
                });
            });
        })
    }

    function createLayoutRoute(item) {
        return `<li>
                             <div>
                                  <p><b>Rota:</b>${item.name}</p>
                                  <p><b>Horário:</b>${new Date(item.ride.schedule).toLocaleString()}</p>
                             </div>
                             <ul>
                                ${item.ride.riders.filter((rider) => {
            return rider.userId === Session.getValueInSession("user", "idUser");
        }).map(rider => {
            return `<li>
                                                 <p><b>Cliente:</b>${rider.name}</p>
                                                 ${rider.waypoints.map(place => {
                return `<p><b>${place.routePitStopType}:</b>${place.address}</p>`
            }).join("")}
                                            </li>`
        }).join("")}
                             </ul>
                             ${createActionRoute(item)}
                        </li>`;
    }

    function createActionRoute(item) {
        let list = '';

        if (item.ride.status != STATUS_FINISHED)
            list += `<button type="button" class="chat-trip-ride" tripReference="${item.ride.tripReference}">Mensagens</button>`;

        if (item.ride.status != STATUS_FINISHED)
            list += `<button type="button" class="cancel-trip-ride" tripReference="${item.ride.tripReference}">Cancelar viagem</button>`;

        return list;
    }


    function updateHistoric() {
        CustomerRideController.findByUser().then((response) => {
            const {data} = response;

            document.querySelector("#listRouteHistoric").innerHTML = data.map(item => {
                return createLayoutRoute(item)
            }).join("");
        });
    }

    function showRouteByPosition({lat, lng}) {
        CustomerRideController.find({lat, lng}).then(response => {
            const {data} = response;

            viewController.elementProperty.getElement(
                "#listRouteAvailable",
                element => {
                    if (data.length == 0) {
                        element.innerHTML = "";
                        return element.classList.add("empty");
                    }


                    element.classList.remove("empty");

                    element.innerHTML = data
                        .map(item => {
                            const dateSchedule = new Date(item.ride.schedule);
                            let time = dateSchedule.toLocaleTimeString();

                            return `<li class="open-detail-travel" value='${btoa(JSON.stringify(item))}'>
                                            <div class="datetime-travel">
                                                <div class="vacancies-travel">
                                                    <span>VAGAS</span>
                                                    <div>${parseInt(item.ride.seatsAvailable) - item.ride.riders.length}</div>
                                                </div>
                                                <span class="travel-date">${dateSchedule.toLocaleDateString()}</span>
                                                <span class="travel-time">${time.substring(0, time.length - 3)}h</span>
                                            </div>
                                            <div class="detail-travel">
                                                <div>
                                                    <div class="driver-travel">
                                                        <img src="webfiles/img/svg/automobile.svg">
                                                        <div>                           
                                                            <i class="material-icons">star</i>
                                                            <i class="material-icons">star</i>
                                                            <i class="material-icons">star</i>
                                                            <i class="material-icons">star</i>
                                                            <i class="material-icons">star</i>
                                                        </div>
                                                        <span>Resenhas</span>
                                                    </div>
                                                    <div class="description-travel">
                                                        <p>Rota</p>
                                                        <p>${item.name}</p>
                                                        <p>${parseInt(item.estimatedDistance / 1000)}km - ${(item.estimatedTime / 60).toFixed(2)}min</p>
                                                        <p></p>
                                                    </div>
                                                </div>
                                                <div class="container-shipped-travel">
                                                ${item.ride.riders.map(() => {
                                return `<img src="webfiles/img/svg/user.svg">`;
                            }).join("")}
                                                </div>
                                            </div>
                                            <div class="values-travel">
                                                <div>
                                                    <span>Valor ${CityConfig.getTypeCoin()}</span>
                                                    <span><span></span><span>${Mask.maskMoney(parseFloat(item.ride.price))}</span></span>
                                                </div>
                                                <div class="another-values">
                                                    <p>Outros valores:</p>
                                                    <p>*Encomenda</p>
                                                    <p>*Embarques</p>
                                                </div>
                                            </div>
                                        </li>`;
                        }).join("");
                    viewController.elementProperty.addEventInElement(
                        ".open-detail-travel",
                        "onclick",
                        function () {
                            const routes = JSON.parse(atob(this.getAttribute("value")));

                            const vacancies = parseInt(routes.ride.seatsAvailable) - routes.ride.riders.length;

                            if (vacancies === 0)
                                return SwalCustom.dialogConfirm("Ops..., todas as vagas já estão ocupadas.",
                                    "Quer ser avisado caso haja uma desistência?", "info").then(() => {
                                    SwalCustom.messageDialog("", "Iremos te informar se surgir uma vaga!", undefined, "success")
                                });

                            openScreenReserveTrip(routes);
                        }
                    );
                }
            );
        });
    }

    viewController.elementProperty.addEventInElement(".btn-accompany-trip", "onclick", function () {
        if (Array.isArray(Session.get("tripReferenceRide")))
            return this.classList.remove("active");
        Route.redirectDynamic("Ride", "AccompanyTrip");
    });

    new TripPaymentFormController().getAll().then(({status, data}) => {
        if (!status)
            return;

        document.querySelector("#listPaymentFormRoute").innerHTML = data.map(item => {
            return `<li class="item-payment-route" value="${item.idTripPaymentForm}">${item.name}</li>`
        }).join("");

        viewController.elementProperty.addEventInElement(".item-payment-route", "onclick", function () {
            viewController.elementProperty.removeClass(".item-payment-route", "active");
            this.classList.add("active");
        });
    });

    viewController.onBack(() => {
        checkTravelActive();
    })
});
