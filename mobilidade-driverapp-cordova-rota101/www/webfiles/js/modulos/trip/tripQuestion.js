class TripQuestion {

    constructor() {

        this.elementProperty = new ElementProperty();

        this.position = new Position();

        this.isAvailable = "0";

        this.preAvailable = "1";

        this.typeTaxi = "3";

        this.isActive = false;

        this.tripReference = null;

        this.cityConfig = null;

        this.initEvent();

    }

    setDetail(callback = undefined) {
        this.isActive = true;
        this.statusAccept = false;
        this.trip = Session.get("trip");
        
        // Processamento de waypoints
        if (this.trip?.tripWayPoints?.length > 0) {
            requestAnimationFrame(() => {
                this.initializeWaypoints();
            });
        } else {
            const element = document.getElementById('tripWayPoints');
            if (element) {
                element.classList.remove('show', 'single-waypoint');
            }
        }

        pushEvent.addEvent("stopCall", () => {
            this.closeQuestion();
            this.triggerCallback(false);
        });

        this.tripReference = this.trip.tripReference;

        this.elementProperty.getElement("#progressCustomerWait", element => {
            element.style.width  = '0%';
        });

        document.querySelector('.btn-accept-trip').innerHTML = getTextTranslate("call","trip-title");

        this.countTimeAccept(parseInt(this.trip.missingSeconds), parseInt(this.trip.timeLimitToAccept));

        this.userLogged = Session.get("user");

        this.callback = callback;

        this.vibrateIn();

        const typeSong = `#songCallCar`;

        this.elementProperty.getElement(typeSong, element => {
            element.play();
        });

        this.elementProperty.getElement(".container-hush", element => {
            element.classList.add("active");
        });

        this.elementProperty.getElement("#clientName",element=>{
            const quantityTrips = this.isToShowField("quantityTripsCustomer") ? ` - ${this.trip.quantityTripsCustomer} ${getTextTranslate("call","trip")}` : "";

            element.innerHTML = `${this.trip.nameCustomer}${quantityTrips}`;
        });

        this.elementProperty.getElement("#favoriteTrip", element => {
            const favoriteTrip = this.trip?.status === STATUS_SEARCHING_FAVORITE;

            const elementIconFavorite = document?.getElementById('iconFavorite');

            element.style.display = 'none';

            if (favoriteTrip == true && this.isToShowField("favorite") == true) {
                element.innerHTML = "Favorito";
                element.style.display = 'block';
                elementIconFavorite.style.display = 'block';
            } else {
                element.style.display = 'none';
                
                elementIconFavorite.style.display = 'none';
            }
        });

        this.elementProperty.getElement("#ratingCustomer",element=>{
            element.innerHTML = `${this.trip.ratingCustomer}` ?? " -- ";
        });

        this.elementProperty.getElement("#tripType",element=>{
            element.innerHTML = this.trip.type || "";
        });

        this.elementProperty.getElement("#versionsApp",element=>{
            element.innerHTML = `${getTextTranslate("call", "version")}: ${Session.get("version")}`;
        });

        this.elementProperty.getElement("#haveReturn",element=>{
            const haveReturn = this.trip.haveReturn;

            element.style.display = 'none';

            if (haveReturn == true) {
                element.innerHTML = getTextTranslate("call", "have-return-trip");
                element.style.display = 'block';
            }

            
        });

        this.elementProperty.getElement("#priceTrip", async (element) => {
            const cityConfig = Session.get("cityConfig");

            let stringPrice = `${
                this.trip?.tripDiscountCoupon?.value == '100' && this.trip?.tripDiscountCoupon?.valueType == '%' ? this.trip.tripDiscountCoupon?.oldPrice : 
                parseFloat(cityConfig.showNetValueForDriverOnCall == false ?
                this.trip.price : this.trip.driverValue)}`;

            if (this.trip.multiplierDynamic > 0) {
                document.getElementById('dynamicPriceContent').style.display = 'flex';
                document.getElementById('tripPriceDynamic').innerHTML = `${CityConfig.getTypeCoin()} ${Mask.maskMoney(parseFloat(stringPrice/this.trip.multiplierDynamic))}`;
                document.getElementById('multiplierValueDynamic').innerHTML = `${this.trip.multiplierDynamic}x`;
            } else {
                document.getElementById('dynamicPriceContent').style.display = 'none';
            }

            const showPriceField = this.isToShowField("price");
            if (!showPriceField) {
                const appName = await getUnifiedAppName();
                const pulse = new Pulse(`${appName}_${PULSE_APP}`, PULSE_GROUPID);

                pulse.send(
                    `O campo de preço da viagem não está visível para o motorista. Referência da viagem: ${this.tripReference}`,
                    "www/webfiles/js/modulos/trip/tripQuestion",
                    "critical"
                );
            }

            element.innerHTML = `${CityConfig.getTypeCoin()}`+ (
                showPriceField ? ` ${Mask.maskMoney(parseFloat(stringPrice))}` : " -- "
            );
        });

        let totalBonus = 0;

        if (this.trip.tripLongDistance !== null){
           totalBonus = this.trip.tripLongDistance.value;
        }

        if(this.trip.rewardTrip !== null){
            totalBonus = totalBonus != 0 ? totalBonus : this.trip.rewardTrip.value;
        }

        this.elementProperty.getElement("#bonusTrip", element => {
            if(totalBonus !== 0 && this.isToShowField('reward') === true) {
                element.innerHTML = `+ ${CityConfig.getTypeCoin()} ${Mask.maskMoney(totalBonus)} (Bônus)`;
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });

        this.getTripAndValueBonus(this.trip);

        this.elementProperty.getElement("#formPayment", element => {
            element.innerHTML = this.trip.tripPaymentForm;

            if (this.isToShowField("paymentForm") === false) {
                element.style.display = 'none';
            }
        });

        this.elementProperty.getElement("#addressOrigin", element => {
            element.innerHTML = this.trip.startAddress;

            if (this.isToShowField('origin') === false) {
                document.getElementById('liAddressOrigin').style.display = 'none';
            }
        });

        this.elementProperty.getElement("#estimatedStartTrip", element => {
            const estimatedDistance = this.isToShowField('estimatedDistance') ? `${this.trip.estimative.distance.text}` : false;
            const estimatedTime = this.isToShowField('estimatedTime') ? `${this.trip.estimative.duration.text}` : false;

            if (estimatedDistance && estimatedTime) {
                element.innerHTML = `${estimatedDistance} / ${estimatedTime}`;
            }

            if (estimatedDistance && !estimatedTime) {
                element.innerHTML = `${estimatedDistance}`;
            }

            if (!estimatedDistance && estimatedTime) {
                element.innerHTML = `${estimatedTime}`;
            }

            if (!estimatedDistance && !estimatedTime) {
                element.style.display = 'none';
            }
        });

        this.elementProperty.getElement("#addressDestination", element => {
            const haveReturn = this.trip.haveReturn;
            if (haveReturn == true) {
                const waypoints = this.trip.tripWayPoints || this.trip.trip_way_points || [];
                
                if (waypoints.length > 0) {
                    element.innerHTML = waypoints[waypoints.length - 1].address;
                }
            } else {
                element.innerHTML = this.isToShowField('destination') ? this.trip.endAddress : getTextTranslate("call", "no-destination-info");
            }
        });

        this.elementProperty.getElement("#estimatedEndTrip", element => {
            element.innerHTML = `${this.trip.distance}km / ${this.trip.estimatedTripTime}min`;

            if (this.isToShowField('destination') === false) {
                element.style.display = 'none';
            }
        });

        this.elementProperty.getElement("#toll", element => {
            if (this.trip.tolls.length !== 0) {
                element.innerHTML = `${getTextTranslate("call", "toll")}: ${this.trip.tolls.length}`;
            } else {
                element.innerHTML = '';
            }
        });

        this.elementProperty.getElement("#versionApp", element => {
            element.innerHTML = Session.get("version");
        });

        this.elementProperty.getElement("#tripReference", element => {
            element.innerHTML = `${getTextTranslate("call", "key")}: ${this.tripReference}`;
        });


        this.elementProperty.getElement("#riskAreaOrigin", element => {
            if(this?.trip?.riskArea?.origin) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });

        this.elementProperty.getElement("#riskAreaDestination", element => {
            if(this?.trip?.riskArea?.destination) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
    }

    initializeWaypoints() {
        this.processWaypoints();
    }
    
    processWaypoints() {
        const element = document.getElementById('tripWayPoints');
        if (!element) return false;
        
        const waypointsCount = this.trip.tripWayPoints?.length || 0;
        
        if (waypointsCount === 0) {
            element.classList.remove('show', 'single-waypoint');
            return false;
        }
        
        this.showWaypointsContainer(element);
        
        const elements = this.getWaypointsElements();
        
        this.resetWaypointsState(elements);
        
        if (waypointsCount === 1) {
            element.classList.add('single-waypoint');
            this.handleSingleWaypoint(elements);
        } else {
            element.classList.remove('single-waypoint');
            this.handleMultipleWaypoints(elements, waypointsCount);
        }
        
        return true;
    }
    
    showWaypointsContainer(element) {
        element.classList.add('show');
    }
    
    getWaypointsElements() {
        return {
            firstWaypoint: document.getElementById('firstWayPointAddress'),
            moreBtn: document.getElementById('waypointsMoreBtn'),
            moreText: document.getElementById('waypointsMoreText'),
            list: document.getElementById('waypointsList'),
            toggle: document.getElementById('waypointsToggle')
        };
    }
    
    resetWaypointsState(elements) {
        if (elements.toggle) elements.toggle.classList.remove('expanded');
        if (elements.list) {
            elements.list.classList.remove('expanded');
            elements.list.innerHTML = '';
        }
    }
    
    handleSingleWaypoint(elements) {
        if (elements.firstWaypoint) {
            elements.firstWaypoint.innerHTML = this.trip.tripWayPoints[0].address;
        }
    }
    
    handleMultipleWaypoints(elements, waypointsCount) {
        if (elements.firstWaypoint) elements.firstWaypoint.innerHTML = '';
        if (elements.moreText) {
            elements.moreText.innerHTML = `+ ${waypointsCount} paradas`;
        }
        
        this.populateWaypointsList(elements);
        this.setupWaypointsToggle(elements);
    }
    
    populateWaypointsList(elements) {
        if (!elements.list) return;
        
        const listHtml = this.trip.tripWayPoints
            .map(waypoint => `<li>${waypoint.address}</li>`)
            .join('');
        
        elements.list.innerHTML = listHtml;
    }
    
    setupWaypointsToggle(elements) {
        if (!elements.moreBtn) return;
        
        elements.moreBtn.onclick = () => {
            if (elements.toggle) elements.toggle.classList.toggle('expanded');
            if (elements.list) elements.list.classList.toggle('expanded');
        };
    }

    getTripAndValueBonus(trip) {
        if(Number(trip?.price) != 0 ) return;
        TripController.actionGet(this.tripReference).then(({data}) => {
            const trip = data;
            if(trip?.tripDiscountCoupon?.value == '100' && trip?.tripDiscountCoupon?.valueType == '%') {
                const elementBonusTrip = document.getElementById('bonusTrip');
                
               elementBonusTrip.innerHTML = `+ ${CityConfig.getTypeCoin()} ${Mask.maskMoney(parseFloat(trip?.tripDiscountCoupon?.oldPrice))} (Bônus)`;
                elementBonusTrip.style.display = 'block';
            }
        })

    }

    countTimeAccept(second, timeLimit) {
        if (!this.isActive)
            return;

        const timeElapsed = second * 100 / timeLimit;

        this.elementProperty.getElement(".progress-time-to-accept", element => {
            element.style.width = `${timeElapsed}%`;
        });

        if (timeElapsed > 100) {
            this.closeQuestion();
            this.triggerCallback(false);
            return;
        }

        second++;

        setTimeout(() => {
            this.countTimeAccept(second, timeLimit);
        }, 1000)
    }

    initEvent() {
        this.elementProperty.addEventInElement("#closeContainerHush", "onclick", (event) => {

            this.elementProperty.getElement(".container-hush", element => {
                element.classList.remove("active");
            });

            event.stopPropagation();

            Session.delete("trip");

            const trips = Session.get("tripsDeniedDriver");

            new DriverController().refuseTrip(this.userLogged.idDriver, this.trip.tripReference);

            Session.set("tripError", "recusada", false);

            trips.push({
                tripReference: this.trip.tripReference,
                date: new Date()
            });

            Session.set("tripsDeniedDriver", trips);

            this.triggerCallback(false);
        });

        this.elementProperty.addEventInElement(".btn-accept-trip", "onclick", () => {
            const {modeAcceptTrip} = Session.get("appSetting");

            if (!modeAcceptTrip.enableClick)
                return;

            this.confirmationAcceptTrip();
        });

        new EventTouche().addEventDistanceTop(".container-hush", -30, () => {
            const {modeAcceptTrip} = Session.get("appSetting");

            if (!modeAcceptTrip.enableTouch)
                return;

            this.confirmationAcceptTrip();
        });
    }

    confirmationAcceptTrip() {
        if (this.statusAccept)
            return;

        this.statusAccept = true;

        document.querySelector('.btn-accept-trip').innerHTML = getTextTranslate("call", "confirm-trip");

        setTimeout(() => {
            this.elementProperty.getElement(".container-hush", element => {
                element.classList.remove("active");
            });

            const typeSong = `#songCallCar`;

            this.elementProperty.getElement(typeSong, element => {
                element.pause();
            });
        }, 1500);

        const boardingEstimate = {
            distance: this.trip.estimative.distance.value,
            time: this.trip.estimative.duration.value,
            tripReference: this.trip.tripReference
        };
        Session.set("boardingEstimate", boardingEstimate);

        new DriverController().acceptTrip(
            this.trip.tripReference,
            this.userLogged.idDriver,
            this.trip.estimative.duration.value,
            this.trip.estimative.distance.value)
            .then(result => {
                if (result.data.tripReference) {
                        Session.set("ifoodTripReference", result.data.tripReference);
                }
                if (!result.status) {
                    SwalCustom.messageDialog("Essa viagem não está mais disponível", "Atenção");
                    Session.set("tripError", "indisponivel", false);
                    this.triggerCallback(false);
                    return;
                }

                switch (this.userLogged.preAvailable) {
                    case this.isAvailable:
                        this.acceptTrip(result.data);
                        break;
                    case this.preAvailable: {
                        if (Array.isArray(Session.get("tripDriver"))) {
                            this.acceptTrip(result.data);
                            return;
                        }
                        this.acceptPreAvailable(result.data);
                        break;
                    }
                }

            })
            .catch((error) => {
                this.closeQuestion();
                this.triggerCallback(false);
                SwalCustom.messageDialog(`${error}`, "Atenção");
            })
    }

    isToShowField(field) {
        if (!this.cityConfig) {
            this.cityConfig = Session.get("cityConfig");
        }

        if (this.cityConfig?.enabledDriverFields?.accept) {
            return this.cityConfig?.enabledDriverFields?.accept[field] === true;
        } else {
            Pulse.send("[TripQuestion]: isToShowField", this.tripReference, 'critcal');
            return false;
        }
    }

    acceptTrip(trip) {
        lastPositionCapture = null;
        auxLastPositionCapture = null;
        Session.delete("dateTimeInProgress");
        Session.delete("routeTraveled");

        this.sendMessageBot(trip);

        this.closeQuestion();

        Session.set("tripDriver", trip);

        this.triggerCallback(true);

        Route.goHomeBack();
    }

    acceptPreAvailable(trip) {

        this.sendMessageBot(trip, 2);

        const userLogged = Session.get("user");

        userLogged.preAvailableTrip = trip;

        Session.set("preAvailableTrip", trip);
        Session.set("tripInWait", trip.tripReference);
        Session.set("user", userLogged);

        this.closeQuestion();

        checkPreAvailable();
    }

    sendMessageBot(trip, chatBotTripTypeId) {
        setTimeout(() => {
            ChatBotTripController.sendMessage(trip.driver.userId, trip.tripReference, chatBotTripTypeId);
        }, 5000);
    }

    closeQuestion() {
        this.isActive = false;

        Session.delete("trip");

        Session.delete("tripError");

        this.statusAccept = false;

        this.elementProperty.getElement(".container-hush", element => {
            element.classList.remove("active");
        });
        
        this.elementProperty.getElement(".progress-time-to-accept", element => {
            element.style.width = `0%`;
        });

        const typeSong = `#songCallCar`;

        this.elementProperty.getElement(typeSong, element => {
            element.pause();
        });
    }

    triggerCallback(status) {

        this.isActive = false;

        this.elementProperty.getElement(".container-hush", element => {
            element.classList.remove("active");
        });

        this.elementProperty.getElement("#songCallCar", element => {
            element.pause();
        });

        this.elementProperty.getElement("#songCallTaxi", element => {
            element.pause();
        });

        if (this.callback !== undefined)
            this.callback(status);
    }

    vibrateIn() {
        navigator.vibrate([300, 600, 300, 600, 1000]);
    }
}

