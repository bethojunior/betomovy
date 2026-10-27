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
                const flatPrices = pricesList.filter(item => item != null);

                if (flatPrices.length === 0) {
                    element.innerHTML = '<p class="no-prices-msg" style="padding:24px;text-align:center;color:#6b7280;font-size:14px;width:100%;">Nenhuma categoria disponível no momento</p>';
                } else {
                    element.innerHTML = this.buildListPrices(flatPrices, true);
                }

                if (data && data.distance) Session.setLocal("distanceTrip", data.distance);
                if (data && data.duration) {
                    const durNum = parseFloat(String(data.duration).replace(',', '.'));
                    Session.setLocal("estimatedTripTime", isNaN(durNum) ? data.duration : durNum);
                }

                // Mantém compatibilidade com controle de container se existir
                const containerPrices = this.separateInContainer(data);
                this.createIndicationsContainer(containerPrices);
                this.initEventScrollPrice();
                this.verifyIndicationContainerPrice();
            } catch (e) {
                console.error("Erro ao renderizar precos:", e);
                element.innerHTML = '<p class="no-prices-msg" style="padding:24px;text-align:center;color:#6b7280;font-size:14px;width:100%;">Nenhuma categoria disponível</p>';
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

            const rawTagText = object.tag || object.name || object.priceName || '';
            const isCentral = /central/i.test(rawTagText) || /central/i.test(object.type || '');
            const isEntregaOrDrive = /entrega|drive|particular|carro/i.test(rawTagText);
            
            let tagText = rawTagText.trim();
            if (tagText) {
                tagText = tagText.charAt(0).toUpperCase() + tagText.slice(1).toLowerCase();
            }

            // Resolução robusta da imagem do tipo de viagem
            let rawPicture = object.picture || (object.tripType && object.tripType.picture) || '';
            const isMoto = !isEntregaOrDrive && !isCentral && (/\bmoto\b|mototaxi|motocicleta|motoboy/i.test(rawTagText) || /\bmoto\b/i.test(String(rawPicture)));
            const defaultCarImg = isCentral ? '/webfiles/img/icon/carro_eco.png' : '/webfiles/img/icon/carro_drive.png';
            const defaultImg = isMoto ? '/webfiles/img/icon/moto.png' : defaultCarImg;
            let pictureUrl = defaultImg;

            if (isEntregaOrDrive) {
                pictureUrl = '/webfiles/img/icon/carro_drive.png';
            } else if (isCentral) {
                pictureUrl = '/webfiles/img/icon/carro_eco.png';
            } else if (isMoto) {
                pictureUrl = '/webfiles/img/icon/moto.png';
            } else if (rawPicture && typeof rawPicture === 'string') {
                if (rawPicture.startsWith('/') || rawPicture.startsWith('webfiles/')) {
                    pictureUrl = rawPicture.startsWith('/') ? rawPicture : '/' + rawPicture;
                } else if (rawPicture.startsWith('http://') || rawPicture.startsWith('https://')) {
                    if (rawPicture.includes('s3-sa-east-1.amazonaws.com') || rawPicture.includes('s3.amazonaws.com') || rawPicture.includes('minio.704app')) {
                        pictureUrl = defaultImg;
                    } else {
                        pictureUrl = rawPicture;
                    }
                } else {
                    pictureUrl = defaultImg;
                }
            }
            object.picture = pictureUrl;

            if (index === 0 && existItemActive) {
                managerTrip.typeTaxi.picture = pictureUrl;
                try {
                    const btnConfirm = document.querySelector(".switch-type-trip .btn-search-trip:last-child");
                    if (btnConfirm) btnConfirm.innerHTML = `Escolha ${tagText || 'Viagem'}`;
                } catch(e) {}
            }

            const priceVal = (object.price !== undefined && object.price !== null) ? object.price : 0;
            const tripTypeIdVal = object.tripTypeId || object.idTripType || index;

            let durationMins = 3;
            try {
                const estTime = Session.getLocal("estimatedTripTime");
                if (estTime) {
                    const parsed = parseInt(String(estTime).replace(/\D+/g, ''));
                    if (!isNaN(parsed) && parsed > 0) durationMins = parsed;
                }
            } catch (e) {}

            let dropoffTime = "";
            try {
                if (typeof moment !== "undefined") {
                    dropoffTime = moment().add(durationMins, 'minutes').format("HH:mm");
                }
            } catch (e) {}
            if (!dropoffTime) {
                const d = new Date();
                d.setMinutes(d.getMinutes() + durationMins);
                dropoffTime = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
            }

            const capacityNum = isMoto ? 1 : 4;
            let cardSubtitle = "Opção acessível para o seu dia a dia";
            if (isMoto) cardSubtitle = "Rápido e econômico para 1 pessoa";
            else if (isEntregaOrDrive) cardSubtitle = "Carros confortáveis e bem avaliados";
            else if (isCentral) cardSubtitle = "Mais comodidade e tranquilidade";

            return `<div class="trip-type uber-ride-card ${className}"
                            value='${JSON.stringify(object)}'>
                        <div class="urc-left">
                            <img class="urc-vehicle-img" src="${pictureUrl}" alt="${tagText}" onerror="this.onerror=null; this.src='${defaultImg}';">
                        </div>
                        <div class="urc-center">
                            <div class="urc-name-row">
                                <span class="urc-name">${tagText}</span>
                                <span class="urc-capacity">
                                    <i class="material-icons urc-capacity-icon">person</i>
                                    <span>${capacityNum}</span>
                                </span>
                            </div>
                            <div class="urc-eta-row">
                                <span class="urc-eta-time">${dropoffTime}</span>
                                <span class="urc-eta-sep">•</span>
                                <span class="urc-eta-dist">${durationMins} min de distância</span>
                            </div>
                            <div class="urc-desc">${cardSubtitle}</div>
                        </div>
                        <div class="urc-right">
                            <p  
                                class="label-prices-trip urc-price"
                                id="valueTypeTrip${tripTypeIdVal}" 
                                valueDefault="${Mask.maskMoney(priceVal)}">
                                    <span class="urc-currency">${typeMoney}</span>
                                    <span class="urc-amount">${Mask.maskMoney(priceVal)}</span>
                            </p>
                        </div>
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