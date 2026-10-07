class PriceTrip {

    constructor() {
        this.priceController = new PriceController();
        this.estates = [];
        this.placeSelected = null;
    }

    getEstates() {
        EstateController.getAll().then(({data}) => {
            this.estates = data;
        });
    }

    setPrace(place) {
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

    showPriceTrip(originTrip, destinationTrip, waypointsTrip, optimized, isOptimized, noDestination = false,neighborhoodId = null) {

        viewController.elementProperty.getElement(".footer-container-trip", element => {
            element.classList.add("active");
            updateBtnCallTripVisibility();
            scheduleMapResize();
        });

        viewController.elementProperty.getElement(".type-cars", element => {
            element.innerHTML = "";
        });
        // preload(true);
        let waypointsType = isOptimized ? optimized.filter(res => res.km == 0) : waypointsTrip
        const lastIndex = optimized.length - 1

        const origin = {
            address: isOptimized ? optimized[0].address : document.querySelector("*[place='origin']").value,
            latitude: isOptimized ? optimized[0].lat : originTrip.lat,
            longitude: isOptimized ? optimized[0].lng : originTrip.lng
        };

        const destination = {
            address: isOptimized ? optimized[lastIndex].address : document.querySelector("*[place='destination']").value,
            latitude: isOptimized ? optimized[lastIndex].lat : destinationTrip.lat,
            longitude: isOptimized ? optimized[lastIndex].lng : destinationTrip.lng
        };

        const waypoints = waypointsType.map(({lat, lng}) => {
            return {latitude:  lat, longitude: lng};
        });

        const isNeighborhoodRides = Session.get('neighborhoodRides') || '0'

        return new Promise(resolve => {
            viewController.elementProperty.addClass(".container-box-price", "update");

            const central = Session.get("centralSelected");

            let promiseResponse = noDestination ? CentralRepository.calculatePriceNoDistance(origin,central.id, neighborhoodId)  : CentralRepository.calculate(
                origin,
                destination,
                waypoints, central.showAllPrices != null ? central.showAllPrices == false : false, 1,
                central.id);

            isNeighborhoodRides == "1" ? promiseResponse = CentralRepository.calculateNeighborhoodRides(origin, destination, central.id, neighborhoodId) : null

            promiseResponse.then((result) => {
                if (!result.status)
                    return this.errorCaculatePrice(result);

                this.calculatePriceCustomer(result, resolve);
            }).catch((err) => {
                console.log(err);
                this.errorCaculatePrice();
            });
        });
    }

    calculatePriceCustomer({message, status, data: response}, resolve) {

        preload(false);

        // Voltar caso acontece algo durante a listagem de preços
        // if (!Route.isGroupComponentActive(COMPONENT_CREATE_TRIP))
        //     return;

        if (!status) {
            document.querySelector("*[place='origin']").disabled = false;
            document.querySelector("*[place='destination']").disabled = false;
            SwalCustom.messageDialog(response[0] || "",
                message, undefined, "warning");
            initProcessingCallTrip();
            return;
        }

        this.createLayoutPrices(response);

        resolve(response);
    }

    createLayoutPrices(data) {
        viewController.elementProperty.getElement("#callRunning", element => {
            element.setAttribute("class", "container-logo");
        });

        viewController.elementProperty.getElement(".type-cars", element => {
            data = this.verifyOrderPrices(data);

            let containerPrices = this.separateInContainer(data);

            element.innerHTML = containerPrices.map((prices, index) => {
                return `<div><div>${this.buildListPrices(prices, index === 0)}</div></div>`;
            }).join("");

            Session.setLocal("distanceTrip", data.distance);
            Session.setLocal("estimatedTripTime", data.duration);

            this.createIndicationsContainer(containerPrices);
            this.initEventScrollPrice();
            this.verifyIndicationContainerPrice();
            viewController.elementProperty.removeClass(".container-box-price", "update");
            scheduleMapResize();
        });
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
        return prices.map((object, index) => {

            let className = "";

            if (index === 0 && existItemActive) {
                managerTrip.typeTaxi.priceId = object.idPrice;
                managerTrip.typeTaxi.tripTypeId = object.tripTypeId;
                managerTrip.typeTaxi.price = object.price;
                managerTrip.typeTaxi.priceName = object.priceName;
                className = "active";
            }

            return `<div class="trip-type ${className}"
                            value='${JSON.stringify(object)}'>
                            <span style="background-color: ${object.color}">${object.tag}</span>
                            <img src="${object.picture}">
                            <p  
                                class="label-prices-trip"
                                id="valueTypeTrip${object.tripTypeId}" 
                                valueDefault="${Mask.maskMoney(object.price)}">
                                    <span>${JSON?.parse(localStorage?.getItem('cityConfig'))?.typeMoney}</span>${Mask.maskMoney(object.price)}</p>
                        </div>`;
        }).join("");
    }

    initEventScrollPrice() {
        let item = 0;

        viewController.elementProperty
            .addEventInElement(".next-container-price", "onclick", () => {
                item = 1;
                moveScroll();
                setTimeout(() => {
                    this.verifyIndicationContainerPrice();
                }, 200);
            });


        viewController.elementProperty
            .addEventInElement(".prev-container-price", "onclick", () => {
                item = -1;
                moveScroll();
                setTimeout(() => {
                    this.verifyIndicationContainerPrice();
                }, 200);
            });

        const moveScroll = () => {
            const width = document.querySelector(".type-cars").scrollWidth;
            const positionScroll = document.querySelector(".type-cars").scrollLeft;

            const positionItem = (positionScroll * 100 / width);

            const widthBlock = document.querySelector(".type-cars").childNodes[0].offsetWidth;

            let itemSelect = parseInt(Math.round((positionItem * document.querySelector(".type-cars")
                .childNodes.length) / 100)) + item;

            if (itemSelect < 0)
                itemSelect = 0;

            $('.type-cars')
                .animate({scrollLeft: itemSelect * widthBlock}, 150);

            document.querySelector(".indication-list-prices").childNodes.forEach(item => {
                item.classList.remove("active");
            });

            document.querySelector(".indication-list-prices").childNodes[itemSelect].classList.add("active");
        }

    }

    verifyOrderPrices(data) {
        if (Session.getLocal("orderPrices").length === 0)
            return data;

        const newOrderPrices = Session.getLocal("orderPrices").map(item => {
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


        return data;
    }

    errorCaculatePrice(error) {
        preload(false);
        document.querySelector("*[place='origin']").disabled = false;
        document.querySelector("*[place='destination']").disabled = false;
        if (error) {
            SwalCustom.messageDialog(error.errors.message, error.message, () => {
                closeAddressTrip();
            });
        } else {
            SwalCustom.messageDialog("", "Ocorreu um erro ao tentar calcular o preços da rota", () => {
                closeAddressTrip();
            });
        }
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
        viewController.elementProperty.getElement(".trip-type", element => {
            const priceType = JSON.parse(element.getAttribute("value"));

            element.classList.remove("active");

            if (priceType.tripTypeId === TYPE_RETURN_ID) {
                managerTrip.typeTaxi.tripTypeId = priceType.tripTypeId;
                managerTrip.typeTaxi.price = priceType.price;
                managerTrip.typeTaxi.priceName = priceType.priceName;

                element.classList.add("active");
            }

            const count = priceType.typeDrivers.filter(typeDriver => {
                if (type === null)
                    return true;

                return typeDriver.userTypeId === type;
            }).length;

            if (count > 0) {
                element.style.display = "";
                return;
            }

            element.style.display = "none";
        });
    }
}