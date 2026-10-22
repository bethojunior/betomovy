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

    calculatePriceCustomer(result, resolve) {
        preload(false);

        const status = result?.status !== false;
        const message = result?.message || "";
        let response = result?.data || result?.response || result;

        if (!status) {
            document.querySelector("*[place='origin']").disabled = false;
            document.querySelector("*[place='destination']").disabled = false;
            viewController.elementProperty.removeClass(".container-box-price", "update");
            const errDetail = Array.isArray(response) ? (response[0] || "") : (typeof response === "string" ? response : "");
            SwalCustom.messageDialog(errDetail, message || "Não foi possível calcular o preço", undefined, "warning");
            initProcessingCallTrip();
            return;
        }

        this.createLayoutPrices(response);

        if (resolve) resolve(response);
    }

    createLayoutPrices(data) {
        viewController.elementProperty.getElement("#callRunning", element => {
            element.setAttribute("class", "container-logo");
        });

        viewController.elementProperty.getElement(".type-cars", element => {
            try {
                data = this.verifyOrderPrices(data);

                let containerPrices = this.separateInContainer(data);

                if (!containerPrices || containerPrices.length === 0) {
                    element.innerHTML = '<p class="no-prices-msg" style="padding:15px;text-align:center;color:#666;font-size:13px;width:100%;">Nenhuma categoria disponível no momento</p>';
                } else {
                    element.innerHTML = containerPrices.map((prices, index) => {
                        return `<div><div>${this.buildListPrices(prices, index === 0)}</div></div>`;
                    }).join("");
                }

                if (data && data.distance) Session.setLocal("distanceTrip", data.distance);
                if (data && data.duration) Session.setLocal("estimatedTripTime", data.duration);

                this.createIndicationsContainer(containerPrices);
                this.initEventScrollPrice();
                this.verifyIndicationContainerPrice();
            } catch (e) {
                console.error("Erro ao renderizar precos:", e);
                element.innerHTML = '<p class="no-prices-msg" style="padding:15px;text-align:center;color:#666;font-size:13px;width:100%;">Nenhuma categoria disponível</p>';
            } finally {
                viewController.elementProperty.removeClass(".container-box-price", "update");
                scheduleMapResize();
            }
        });
    }

    verifyIndicationContainerPrice() {
        const typeCars = document.querySelector(".type-cars");
        if (!typeCars) return;

        viewController.elementProperty.addClass(".prev-container-price", "active");
        viewController.elementProperty.addClass(".next-container-price", "active");

        const width = typeCars.scrollWidth;
        const positionScroll = typeCars.scrollLeft;

        const positionItem = (positionScroll * 100 / (width || 1));
        const amountContainer = typeCars.childNodes.length;

        const itemSelect = parseInt(Math.round((positionItem * amountContainer) / 100));

        if (itemSelect === 0)
            viewController.elementProperty.removeClass(".prev-container-price", "active");

        if (itemSelect === amountContainer - 1)
            viewController.elementProperty.removeClass(".next-container-price", "active");
    }

    createIndicationsContainer(containerPrices) {
        if (!Array.isArray(containerPrices) || containerPrices.length === 0) {
            viewController.elementProperty.getElement(".indication-list-prices", element => {
                element.innerHTML = "";
            });
            return;
        }
        viewController.elementProperty.getElement(".indication-list-prices", element => {
            element.innerHTML = containerPrices.map(() => {
                return `<div></div>`;
            }).join("");

            if (element.childNodes && element.childNodes[0] && element.childNodes[0].classList) {
                element.childNodes[0].classList.add("active");
            }
        });
    }

    separateInContainer(data) {
        let pricesList = [];
        if (data && Array.isArray(data.prices)) {
            pricesList = data.prices;
        } else if (Array.isArray(data)) {
            pricesList = data;
        } else if (data && typeof data === 'object') {
            if (Array.isArray(data.response)) {
                pricesList = data.response;
            } else if (Array.isArray(data.data)) {
                pricesList = data.data;
            }
        }
        if (!Array.isArray(pricesList)) pricesList = [];

        const auxPrices = pricesList.filter(item => item != null).map(item => item);
        let containerPrices = [];
        while (auxPrices.length) {
            containerPrices.push(auxPrices.splice(0, 3));
        }
        return containerPrices;
    }

    buildListPrices(prices, existItemActive = false) {
        if (!Array.isArray(prices)) return "";
        return prices.map((object, index) => {
            if (!object) return "";
            let className = "";

            if (index === 0 && existItemActive) {
                managerTrip.typeTaxi.priceId = object.idPrice || object.id;
                managerTrip.typeTaxi.tripTypeId = object.tripTypeId || object.idTripType;
                managerTrip.typeTaxi.price = object.price || 0;
                managerTrip.typeTaxi.priceName = object.priceName || object.name || "Padrão";
                className = "active";
            }

            let typeMoney = 'R$';
            try {
                const config = JSON.parse(localStorage.getItem('cityConfig')) || Session.getLocal('cityConfig');
                if (config && config.typeMoney) typeMoney = config.typeMoney;
            } catch (e) {
                const config = Session.getLocal('cityConfig');
                if (config && config.typeMoney) typeMoney = config.typeMoney;
            }

            const tagText = object.tag || object.name || object.priceName || '';
            const tagBg = object.color ? `background-color: ${object.color}` : 'background-color: #333';
            
            // Resolucao robusta da imagem do tipo de viagem (carro ou moto)
            let rawPicture = object.picture || (object.tripType && object.tripType.picture) || '';
            const isMoto = /moto|motocicleta|bike|entrega/i.test(tagText) || /moto/i.test(String(rawPicture));
            const defaultImg = isMoto ? 'webfiles/img/icon/moto.png' : 'webfiles/img/icon/carro_eco.png';
            let pictureUrl = defaultImg;

            if (rawPicture && typeof rawPicture === 'string') {
                if (rawPicture.startsWith('http://') || rawPicture.startsWith('https://')) {
                    if (rawPicture.includes('s3-sa-east-1.amazonaws.com') || rawPicture.includes('s3.amazonaws.com') || rawPicture.includes('minio.704app')) {
                        const filename = rawPicture.split('/').pop();
                        pictureUrl = isMoto ? 'webfiles/img/icon/moto.png' : 'https://api.movymob.com/uploads/tripType/' + filename;
                    } else {
                        pictureUrl = rawPicture;
                    }
                } else if (rawPicture.startsWith('webfiles/') || rawPicture.startsWith('/')) {
                    pictureUrl = rawPicture;
                } else {
                    pictureUrl = isMoto ? 'webfiles/img/icon/moto.png' : 'https://api.movymob.com/uploads/tripType/' + rawPicture;
                }
            }
            object.picture = pictureUrl;

            if (index === 0 && existItemActive) {
                managerTrip.typeTaxi.picture = pictureUrl;
            }

            const priceVal = (object.price !== undefined && object.price !== null) ? object.price : 0;
            const tripTypeIdVal = object.tripTypeId || object.idTripType || index;

            return `<div class="trip-type ${className}"
                            value='${JSON.stringify(object)}'>
                            <span style="${tagBg}">${tagText}</span>
                            <img src="${pictureUrl}" onerror="this.onerror=null; this.src='${defaultImg}';">
                            <p  
                                class="label-prices-trip"
                                id="valueTypeTrip${tripTypeIdVal}" 
                                valueDefault="${Mask.maskMoney(priceVal)}">
                                    <span>${typeMoney}</span> ${Mask.maskMoney(priceVal)}</p>
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
        if (!data) return { prices: [] };
        if (Array.isArray(data)) {
            data = { prices: data };
        } else if (!data.prices && (data.response || data.data)) {
            data.prices = Array.isArray(data.response) ? data.response : (Array.isArray(data.data) ? data.data : []);
        }
        if (!Array.isArray(data.prices)) data.prices = [];

        const orderPrices = Session.getLocal("orderPrices");
        if (!Array.isArray(orderPrices) || orderPrices.length === 0)
            return data;

        const newOrderPrices = orderPrices.map(item => {
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
        viewController.elementProperty.removeClass(".container-box-price", "update");
        document.querySelector("*[place='origin']").disabled = false;
        document.querySelector("*[place='destination']").disabled = false;
        let msg = error?.errors?.message || error?.message || "Ocorreu um erro ao tentar calcular os preços da rota";
        let title = error?.message && error?.errors?.message ? error.message : "Atenção";
        if (typeof msg === 'string' && (msg.includes("não estamos na sua cidade") || msg.includes("Infelizmente"))) {
            title = "Área Fora de Cobertura";
            msg = "O endereço selecionado está fora da área de atuação desta cidade ou ainda não há tarifas configuradas. Verifique se o endereço está dentro do polígono cadastrado no Monitor em Configurações > Áreas de Cidade.";
        }
        SwalCustom.messageDialog(msg, title, () => {
            closeAddressTrip();
        });
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