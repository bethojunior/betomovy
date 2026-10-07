class PriceTrip {

    constructor() {
        this.priceController = new PriceController();
        this.estates = [];
        this.placeSelected = null;
        this.listHistoryPrices = null;
        this.typeDriverSelected = null;
        this.canOnlyRunner = false;
    }

    getEstates() {
        EstateController.getAll().then(({data}) => {
            this.estates = data;
        });
    }

    setPlace(place) {
        this.placeSelected = place;
    }

    getCityByPlace(place) {

        if (place.cityId) {
            return new Promise((resolve) => {
                resolve(parseInt(place.cityId))
            })
        }

        const estate = this.estates.filter(estate => {
            return estate.nome === this.searchInPlace("administrative_area_level_1", place);
        })[0];

        return new Promise((resolve, reject) => {
            if (!estate) {
                reject();
                return;
            }

            CityController.getAll(estate.id).then(({data}) => {
                const city = data.filter(city => {
                    return city.nome === this.searchInPlace("administrative_area_level_2", place) ||
                        city.nome === this.searchInPlace("locality", place);
                })[0];

                if (city === undefined) {
                    reject(parseInt(city.id));
                    return;
                }

                resolve(parseInt(city.id));
            })
        });
    }

    showPriceTrip(originTrip, destinationTrip, waypointsTrip, typeCalculatePrice = "forMe", noDestination = false) {
        viewController.elementProperty.getElement(".footer-container-trip", element => {
            element.classList.add("active");
        });

        viewController.elementProperty.getElement("#iconPaymentForm", element => {
            element.innerHTML = getTextTranslate("price-trip", "type_icon");
        });

        if (noDestination) {
            viewController.elementProperty.addClass(".type-cars", "without-destination");
            viewController.elementProperty.addClass(".btn-qrcode-driver-trip", "hidden");
        } else {
            viewController.elementProperty.removeClass(".type-cars", "without-destination");
            viewController.elementProperty.removeClass(".btn-qrcode-driver-trip", "hidden");
        }
        viewController.elementProperty.getElement(".type-cars", element => {
            element.innerHTML = "";
        });
        // preload(true);

        const origin = {
            address: document.getElementById("origin").value,
            latitude: originTrip.lat,
            longitude: originTrip.lng
        };

        const destination = {
            address: document.getElementById("destination").value,
            latitude: destinationTrip.lat,
            longitude: destinationTrip.lng
        };

        const waypoints = waypointsTrip.map(({lat: latitude, lng: longitude}) => {
            return {latitude, longitude};
        });

        return new Promise(resolve => {
            viewController.elementProperty.addClass(".container-box-price", "update");

            if (typeCalculatePrice === "forAnother") {
                this.priceController.calculate(origin, destination, waypoints).then(
                    (result) => {
                        this.calculatePriceCustomer(result, resolve);
                    }).catch(() => {
                    this.errorCaculatePrice();
                });
                return;
            }

            const time = !Array.isArray(Session.get("dateScheduleTrip")) ? Session.get("dateScheduleTrip") : null;

            this.priceController.calculateAll(null, origin, destination, waypoints, time, noDestination).then((result) => {
                this.calculatePriceCustomer(result, resolve);
            }).catch(() => {
                this.errorCaculatePrice();
            });
        });
    }

    calculatePriceCustomer({message, status, data, errors}, resolve) {

        preload(false);

        if (!Route.isGroupComponentActive(COMPONENT_CREATE_TRIP))
            return;

        if (!status) {
            document.getElementById("origin").disabled = false;
            document.getElementById("destination").disabled = false;
            SwalCustom.messageDialog(message, errors ? errors.message : "Não foi possível construir uma rota e calcular o preço dessa viagem",
                undefined, "warning");
            initProcessingCallTrip();
            return;
        }

        this.listHistoryPrices = data;
        if (this.typeDriverSelected == null) {
            this.createLayoutPrices(data);
        } else {
            this.showPricesByTypeDriver(this.typeDriverSelected);
        }

        resolve(data);
    }

    createLayoutPrices(data) {
        viewController.elementProperty.getElement("#callRunning", element => {
            element.setAttribute("class", "container-logo");
        });

        viewController.elementProperty.getElement(".type-cars", element => {
            data = this.verifyOrderPrices(data);

            data.prices = data.prices.filter(item => {
                return item.tripType.freightOption == false;
            });

            let containerPrices = this.separateInContainer(data);

            Session.set("hasDiscountCoupon", data.hasDiscountCoupon || false);

            element.innerHTML = containerPrices.map((prices, index) => {
                return `<div><div>${this.buildListPrices(prices, index === 0)}</div></div>`;
            }).join("");

            viewController.elementProperty.addEventInElement('.label-trip-bid-offer', 'onclick', function () {
                if (element.classList.contains("knob-trip")) {
                        initTripKnob();
                        return;
                    }
                    initNewTrip();
            })

            Session.set("listPrices", data.prices);
            if (data.tolls)
                Session.set("tolls", data.tolls);

            this.createAds(data.ads);
            this.createIndicationsContainer(containerPrices);
            this.checkExistCancellationFee(data.prices);
            this.initEventScrollPrice();
            this.verifyIndicationContainerPrice();
            this.initEventCoupon();
            viewController.elementProperty.removeClass(".container-box-price", "update");
        });
    }

    checkExistCancellationFee(prices) {
        const result = prices.some(item => {
            return item.cancellationFee > 0
        });

        const cityConfig = Session.get("cityConfig");

        viewController.elementProperty.removeClass(".text-cancellation-fee", "active");

        if (!Array.isArray(cityConfig))
            if (cityConfig.showCancellationFeeForCustomer == true && result)
                viewController.elementProperty.addClass(".text-cancellation-fee", "active");
    }

    initEventCoupon() {
        viewController.elementProperty.addEventInElement(".show-coupon-active", "onclick", showCouponActive);
    }

    verifyIndicationContainerPrice() {

        viewController.elementProperty.addClass(".prev-container-price", "active");
        viewController.elementProperty.addClass(".next-container-price", "active");

        const width = document.querySelector(".type-cars").scrollWidth;
        const positionScroll = document.querySelector(".type-cars").scrollLeft;

        const positionItem = (positionScroll * 100 / width);

        const amountContainer = document.querySelector(".type-cars")
            .childNodes.length;

        const itemSelect = parseInt(Math.round((positionItem * amountContainer) / 100));


        if (itemSelect === 0)
            viewController.elementProperty.removeClass(".prev-container-price", "active");

        if (itemSelect === amountContainer - 1)
            viewController.elementProperty.removeClass(".next-container-price", "active");

    }

    createIndicationsContainer(containerPrices) {
        viewController.elementProperty.getElement(".indication-list-prices", element => {
            element.innerHTML = containerPrices.map(() => {
                return `<div></div>`;
            }).join("");

            document.querySelector(".indication-list-prices").childNodes[0].classList.add("active");
        });
    }

    separateInContainer(data) {
        const auxPrices = data.prices.map(item => item);

        let containerPrices = [];

        while (auxPrices.length) {
            containerPrices.push(auxPrices.splice(0, 3));
        }

        return containerPrices;
    }

    buildListPrices(prices, existItemActive = false) {
        if (this.canOnlyRunner == false) {
            if (prices && prices.length > 0 ) {
                const priceUnic = prices[0]?.tripType?.offerOption == "1" || false;  
                this.canOnlyRunner = priceUnic
            }
        }

        showPaymentForm(this.canOnlyRunner);

        getPaymentForm(function () {
            elementProperty.addEventInElement(
                ".payment-form-trip",
                "onclick",
                function () {
                    clearCouponApply();
                    managerTrip.paymentFormIdSelected = getPaymentFormSelect(this, this.canOnlyRunner);
                }
            );
        }, this.canOnlyRunner);
        return prices.map((object, index) => {
            
            let className = "";

            if (index === 0
                 && existItemActive)
                className = "active";

            if(object.tripType.offerOption == true || ConfigGeneral().get("travel_only_by_offer") == true)
                className += " type-trip-offer";

            return `<div class="trip-type ${className}" label-offer="${getTextTranslate('offer','label-after')}"
                            value='${JSON.stringify(object)}'>
                            <span style="background-color: ${object.color}">${object.tag}</span>
                            <img src="${object.picture}">
                            <p  
                                class="label-prices-trip"
                                id="valueTypeTrip${object.tripTypeId}" 
                                valueDefault="${Mask.maskMoney(object.price)}">
                                    <span>${CityConfig.getTypeCoin()}</span>${Mask.maskMoney(object.price)}</p>
                                ${this.showCouponSelected(object.price)}
                            <div class="label-trip-bid-offer">
                                <img src="webfiles/img/icon/bid.png" />
                                <span>${getTextTranslate("offer","label-bid")}</span>
                            </div>    
                        </div>`;
        }).join("");
    }

    showCouponSelected(price) {
        if (!Session.get("hasDiscountCoupon"))
            return "";

        return `<div class="show-coupon-active" price="${price}">
                    <img src="webfiles/img/svg/coupon.svg" />
                    <span>Veja Cupom</span>
                </div>`
    }

    initEventScrollPrice() {

        let timeout = null;

        viewController.elementProperty
            .addEventInElement(".type-cars", "ontouchend", (event) => {
                clearTimeout(timeout);

                timeout = setTimeout(() => {
                    const width = document.querySelector(".type-cars").scrollWidth;
                    const positionScroll = document.querySelector(".type-cars").scrollLeft;

                    const positionItem = (positionScroll * 100 / width);

                    const widthBlock = document.querySelector(".type-cars").childNodes[0].offsetWidth;

                    const itemSelect = parseInt(Math.round((positionItem * document.querySelector(".type-cars")
                        .childNodes.length) / 100));

                    $('.type-cars')
                        .animate({scrollLeft: itemSelect * widthBlock}, 150);

                    document.querySelector(".indication-list-prices").childNodes.forEach(item => {
                        item.classList.remove("active");
                    });

                    document.querySelector(".indication-list-prices").childNodes[itemSelect].classList.add("active");

                    this.verifyIndicationContainerPrice();

                }, 300);

            });

    }

    verifyOrderPrices(data) {
        if (Session.get("orderPrices").length === 0) {
            data.prices.sort((priceA, priceB) => {
                if (priceA.tripTypeId == managerTrip.typeTaxi.tripTypeId)
                    return -1;

                if (priceB.tripTypeId == managerTrip.typeTaxi.tripTypeId)
                    return 1;

                return 0;
            });
            return data;
        }

        const newOrderPrices = Session.get("orderPrices").map(item => {
            return data.prices.filter(price => {
                return item === parseInt(price.tripTypeId);
            })[0];
        }).filter((item) => {
            return item != null;
        });

        const notExistInListOrder = data.prices.filter(price => {
            return newOrderPrices.filter(item => {
                return item.tripTypeId === price.tripTypeId;
            })[0] == null;
        });

        data.prices = [...newOrderPrices, ...notExistInListOrder];

        data.prices.sort((priceA, priceB) => {
            if (priceA.tripTypeId == managerTrip.typeTaxi.tripTypeId)
                return -1;

            if (priceB.tripTypeId == managerTrip.typeTaxi.tripTypeId)
                return 1;

            return 0;
        });


        return data;
    }

    errorCaculatePrice() {
        preload(false);
        document.getElementById("origin").disabled = false;
        document.getElementById("destination").disabled = false;
        SwalCustom.messageDialog("", "Ocorreu um erro ao tentar calcular o preços da rota");
    }

    searchInPlace(name, place) {
        if (!place.address_components)
            return;

        const data = place.address_components.filter(data => {
            return data.types.includes(name);
        });

        if (data.length === 0)
            return "";

        return data[0].long_name;
    }


    showPricesByTypeDriver(type = null) {
        this.typeDriverSelected = type;

        return new Promise(resolve => {
            let objectTemp = {...this.listHistoryPrices};
            objectTemp.prices = this.listHistoryPrices.prices.filter(price => {
                return price.typeDrivers.filter(item => {
                    return item.userTypeId === type;
                }).length > 0;
            });

            this.createLayoutPrices(objectTemp);

            resolve();
        });
    }

    createAds(ads) {
        viewController.elementProperty.getElement(".container-advertising", element => {
            element.innerHTML = ads.map(ad => {
                return `<li class="open-publicity" style="background-image: url(${ad.thumbnail})" value='${JSON.stringify(ad)}'>
                             <!--<div><span>30%</span></div>-->
                         </li>`;
            }).join("")
        });

        viewController.elementProperty.addEventInElement(".open-publicity", "onclick", function () {
            if (this.classList.contains("active"))
                return;

            Route.startClassesInComponent([{component: ".container-publicity-app", class: "active"}], () => {
                viewController.elementProperty.removeClass(".container-publicity-app", "active");
            });

            showModalPublicity(JSON.parse(this.getAttribute("value")));
        });
    }
}