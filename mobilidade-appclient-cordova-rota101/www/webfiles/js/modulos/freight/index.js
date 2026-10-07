const globalFreight = {
    mapService: null,
    priceTrip: null,
    type: null,
    infoCalculate: null,
    tripTypeSelected: null,
    tripItems: null
};


viewController.setObserver("view-freight", () => {
    if (globalFreight.mapService == null)
        globalFreight.mapService = new MapService();

    globalFreight.priceTrip = new PriceTrip();

    Route.pageDynamic(true);

    const userLogged = Session.get("user");

    initMap(Session.get("location"));
    getTripTypes();
    updateDataCustomer();
    initEventSearchPlaceFreight();

    function initMap(position) {
        setTimeout(() => {
            if (globalFreight.mapService.map != null)
                return;
            globalFreight.mapService.initMap("mapClientFreight", position, function () {
                initEventListFreight();
            });
        }, 1000);
    }

    function getTripTypes() {
        viewController.elementProperty.removeClass("#tripTypesActives", "is-loading");
        TripTypeController.actives().then(({data}) => {
            viewController.elementProperty.getElement("#tripTypesActives", element => {
                element.innerHTML = data.filter((item) => {
                    return item.freightOption == true;
                }).map(tripType => {
                    return `<li class="choice-trip-type" value='${JSON.stringify(tripType)}'>
                            <img src="${tripType.picture}">
                            <span>${tripType.type}</span>
                        </li>`;
                }).join("");

                viewController.elementProperty.addClass("#tripTypesActives", "is-loading");

                viewController.elementProperty.addEventInElement(".choice-trip-type", "onclick", getTripType);
            });
        })
    }

    function getTripType(event) {
        event.stopPropagation();
        if (!authorizedTravelUser()) return;

        globalFreight.tripTypeSelected = JSON.parse(this.getAttribute("value"));

        viewController.elementProperty.addEventInElement(".menu-close", "onclick", function () {
            Route.backPage();
            activeMenu();

            viewController.elementProperty.getElement(
                "#containerCustomerPlacesFreight",
                element => element.innerHTML = " "
            );

            viewController.elementProperty.getElement(".search-address-location-freight", element => {
                element.value = "";
            });

            positionFreight.originFreight = null;
            positionFreight.destinationFreight = null;
        });


        viewController.elementProperty.getElement(".btn-list-freight", element => {
            element.style.display = "none";
        });
        viewController.elementProperty.addClass(".container-choice-trip-type", "active");
        Route.startClassesInComponent([
            {component: ".content-address", class: "active"},
            {component: ".menu-close", class: "open"}
        ], () => {
            viewController.elementProperty.removeClass(".menu-close", "open");
            viewController.elementProperty.removeClass(".content-address", "active");
            viewController.elementProperty.removeClass(".container-choice-trip-type", "active");
            viewController.elementProperty.getElement(".btn-list-freight", element => {
                element.style = "";
            });
            globalFreight.mapService.removeDetailMap()
            // Route.backPage();
        })

        //getTripRouteAddress();
    }

    function updateDataCustomer() {
        const customerController = new CustomerController();

        customerController
            .find(userLogged.idUser)
            .then(({message, status, data}) => {
                if (!status) {
                    SwalCustom.messageDialog(message, "Atenção", updateDataCustomer, "warning");
                    return;
                }

                const config = Session.get("configGeneral");
                const picturesLink = config.find(item => {
                    return item.key === 'link_storage_pictures';
                });

                const finalLink = `${picturesLink.value}customer/profile/compressed/`;   

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
                    activeFreightScreen(data.trip);
                    viewController.elementProperty.addClass(".container-choice-trip-type", "active");
                } else {
                    viewController.elementProperty.removeClass(".container-choice-trip-type", "active");
                    Session.delete("tripReferenceFreight");
                    Session.delete("positionDriverTrip");
                    viewController.elementProperty.removeClass(".option-item-tab", "active");
                    viewController.elementProperty.addClass("#enableFreightApp", "active");
                    showTab();
                }
            })
            .catch((error) => {
                console.log(error);
                setTimeout(updateDataCustomer, 1500);
            });
    }


    new TripPaymentFormController().getAll().then(({status, data}) => {
        if (!status)
            return;

        if (createPaymentFormFreight)
            createPaymentFormFreight(data);
    });


    viewController.elementProperty.addEventInElement(".go-back-form-travel", "onclick", () => {
        Route.backPage();
    });
});
