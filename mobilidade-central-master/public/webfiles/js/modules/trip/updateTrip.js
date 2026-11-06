const managerTripViewCurrent = {
    isVisible: true,
    request: null
};

let searchStatusPollIntervalId = null;

function startSearchStatusPoll(tripReference) {
    stopSearchStatusPoll();

    const pollTrip = () => {
        TripRepository.get(tripReference).then(({ status, response }) => {
            if (!status || !response) return;
            if (response.status === STATUS_SEARCHING || response.status === STATUS_SEARCHING_FAVORITE) return;

            checkStatusTrip(response, tripRealtime.typeModified);
        }).catch(() => {});
    };

    // Executa imediatamente na inicialização
    pollTrip();

    // Polling contínuo de alta frequência (400ms) para resposta instantânea
    searchStatusPollIntervalId = setInterval(pollTrip, 400);
}

function stopSearchStatusPoll() {
    if (searchStatusPollIntervalId) {
        clearInterval(searchStatusPollIntervalId);
        searchStatusPollIntervalId = null;
    }
}

function verifyTrip(initialTrip) {
    Route.removeGroupComponent(COMPONENT_CREATE_TRIP);

    const tripReference = Session.getLocal("tripReference");
    if (!tripReference || (typeof tripReference === 'string' && tripReference.trim().length === 0) || (Array.isArray(tripReference) && tripReference.length === 0)) return;

    if (!unsubscribeIds.has(tripReference)) {
        subscribeToTrip(tripReference);
    }

    if (initialTrip) {
        handleInitialTrip(initialTrip);
    }
}

function subscribeToTrip(tripReference) {
    const unsubscribeId = tripRealtime.getTrip(tripReference, checkStatusTrip);
    unsubscribeIds.set(tripReference, unsubscribeId);
}

function handleInitialTrip(trip) {
    checkStatusTrip(trip, tripRealtime.typeAdded);
}

function initRace(trip) {
    // managerTrip.timeOut = setTimeout(verifyTrip, 3000);

    stopProgressTrip();
    clearDataCar();

    managerTrip.inTrip = true;

    managerTrip.tripCurrent = trip;

    viewController.elementProperty.getElement(".info-trip", element => {
        if (trip.status !== STATUS_ACCEPTED && trip.status !== STATUS_PRE_ACCEPTED) {
            element.style.display = "none";
            return;
        }
        element.style.display = "block";
    });

    if (trip.status === STATUS_IN_PROGRESS) {
        viewController.elementProperty.getElement("#cancelTrip", element => {
            element.style.display = "none";
        });
    } else {
        viewController.elementProperty.getElement("#cancelTrip", element => {
            element.style.display = "flex";
        });
    }

    viewController.elementProperty.addEventInElement("#cancelTrip", "onclick", function (e) {
        if (e && e.stopPropagation) e.stopPropagation();
        viewController.elementProperty.getElement("#messageCancelTrip", element => {
            element.innerHTML = "Deseja realmente cancelar esta corrida com o motorista?";
        });
        cancelSearchTrip(STATUS_CANCELED);
    });


    viewController.elementProperty.addEventInElement("#dataTripInfo", "onclick", function () {
        //  InfoTrip.showDataClientTrip(trip);
    });

    // viewController.elementProperty.getElement(".footer-container-trip", element => {
    //     element.classList.remove("active");
    // });
    viewController.elementProperty.getElement(".trip-client", element => {
        element.classList.add("active");
    });

    viewController.elementProperty.addEventInElement("#btnMinimizeTripClient", "onclick", function () {
        const card = document.querySelector(".trip-client-card");
        if (card) {
            card.classList.toggle("minimized");
        }
    });
    // viewController.elementProperty.getElement(".footer-container-trip", element => {
    //     element.classList.remove("active");
    // });
    viewController.elementProperty.getElement("#mapWrapper", element => {
        element.classList.remove("active");
        element.classList.add("in-trip");
    });
    updateBtnCallTripVisibility();
    scheduleMapResize();
    viewController.elementProperty.getElement(".footer-payment-form", element =>
        element.classList.remove("active"));

    const driver = trip.driver || {};
    const driverName = driver.nickname || driver.name || "Motorista";
    viewController.elementProperty.getElement(".name-driver-trip", element => {
        element.innerHTML = driverName;
    });

    const car = Array.isArray(driver.car) ? (driver.car[0] || {}) : (driver.car || {});
    viewController.elementProperty.getElement(".car-plate-driver", element => {
        element.innerHTML = car.plate || "";
    });
    viewController.elementProperty.getElement(".car-brand-driver", element => {
        const brand = car.brand ? `<span>Marca: ${car.brand}</span>` : "";
        const model = car.model ? `<span>Modelo: ${car.model}</span>` : "";
        const color = car.color ? `<span>Cor: ${car.color}</span>` : "";
        element.innerHTML = `${brand} ${model} ${color}`.trim();
    });
    viewController.elementProperty.getElement(".image-profile-driver", element => {
        element.style.backgroundColor = '#e2e8f0';
        element.style.backgroundPosition = 'center';
        element.style.backgroundSize = 'cover';
        element.style.backgroundRepeat = 'no-repeat';

        const fallbackAvatar = '/webfiles/img/icon/avatar.png';
        const rawPhoto = (
            driver.profileImage ||
            driver.profileImageUrl ||
            driver.driverImage ||
            driver.profilePhoto ||
            driver.photo ||
            driver.avatar ||
            driver.image ||
            trip.driverPhoto ||
            trip.driverImage ||
            trip.driverProfileImage ||
            trip.driverProfileImageUrl ||
            ""
        ).toString().trim();

        if (!rawPhoto || rawPhoto === 'null' || rawPhoto === 'undefined' || rawPhoto === 'user.png' || rawPhoto.endsWith('/user.png')) {
            element.style.backgroundImage = `url('${fallbackAvatar}')`;
            return;
        }

        const candidates = [];
        const pushCandidate = (url) => {
            if (url && !candidates.includes(url)) {
                candidates.push(url);
            }
        };

        if (rawPhoto.startsWith('http://') || rawPhoto.startsWith('https://')) {
            pushCandidate(rawPhoto);
            if (rawPhoto.includes('/driver/profile/')) {
                const sub = rawPhoto.slice(rawPhoto.indexOf('/driver/profile/'));
                pushCandidate(`https://minio.704app.com.br/rota101fb704${sub}`);
            }
        } else {
            const cleanPath = rawPhoto.replace(/^\/+/, '');
            let subPath = cleanPath;
            if (subPath.startsWith('driver/profile/')) {
                subPath = subPath.replace(/^driver\/profile\//, '');
            }
            if (subPath.startsWith('compressed/')) {
                subPath = subPath.replace(/^compressed\//, '');
            }

            // 1. MinIO rota101fb704 (storage oficial em produção)
            pushCandidate(`https://minio.704app.com.br/rota101fb704/driver/profile/compressed/${subPath}`);
            pushCandidate(`https://minio.704app.com.br/rota101fb704/driver/profile/${subPath}`);

            // 2. hostImageDriver configurado no ambiente da central
            if (typeof environment !== 'undefined' && environment.hosts && environment.hosts.hostImageDriver) {
                const envBase = environment.hosts.hostImageDriver.replace(/\/+$/, '');
                pushCandidate(`${envBase}/${subPath}`);
            }

            // 3. API endpoints com fallback
            pushCandidate(`https://api.movymob.com/driver/profile/compressed/${subPath}`);
            pushCandidate(`https://api.movymob.com/driver/profile/${subPath}`);
            pushCandidate(`https://api.movymob.com/uploads/driver/${subPath}`);

            // 4. S3 direto
            pushCandidate(`https://s3-sa-east-1.amazonaws.com/rota101fb704/driver/profile/compressed/${subPath}`);
            pushCandidate(`https://s3-sa-east-1.amazonaws.com/rota101fb704/driver/profile/${subPath}`);
        }

        // Tentar carregar candidatos em cascata até uma imagem carregar com sucesso
        let candidateIndex = 0;
        function tryNextImage() {
            if (candidateIndex >= candidates.length) {
                element.style.backgroundImage = `url('${fallbackAvatar}')`;
                return;
            }
            const currentUrl = candidates[candidateIndex++];
            const testImg = new Image();
            testImg.onload = function () {
                element.style.backgroundImage = `url('${currentUrl}')`;
            };
            testImg.onerror = function () {
                tryNextImage();
            };
            testImg.src = currentUrl;
        }

        tryNextImage();
    });

    viewController.elementProperty.getElement("#tripClientOriginText", element => {
        element.innerHTML = trip.origin?.address || trip.originAddress || "Local de partida";
    });
    viewController.elementProperty.getElement("#tripClientDestText", element => {
        element.innerHTML = trip.destination?.address || trip.destAddress || "Destino";
    });
    mapService.removeRoute();

    //const positionWait = getDestination(trip);

    showStatusTrip(managerTrip.tripCurrent.status);

    /*if (mapService.isImportMap) {
        mapService.addPointClientWait(positionWait);
        getCurrentPositionDriver(trip);
        //updateMapTripDriver();
    }*/
    // driverInDriver.progressTime(3,checkStatusTrip);
}

function updateMapTripDriver(trip, latitude, longitude) {

    const positionDriver = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
    };

    const positionWait = getDestination(managerTrip.tripCurrent);

    let waypoint = [];

    if (trip.status === STATUS_IN_PROGRESS) {
        waypoint = trip.tripWayPoints.filter((waypoint) => {
            return waypoint.confirmed === "0";
        }).map(({latitude: lat, longitude: lng}) => {
            return {lat: parseFloat(lat), lng: parseFloat(lng)};
        })
    }

    mapService.updateRouteInMap(positionWait, positionDriver, waypoint);
}

function stopProgressTrip() {
    stopSearchStatusPoll();
    try {
        if (typeof searchTripProgress !== "undefined" && searchTripProgress?.stopProgress) {
            searchTripProgress.stopProgress();
        }
    } catch (e) {}

    viewController.elementProperty.getElement(".preloader-search-trip", element => {
        element.classList.remove("active");
    });

    viewController.elementProperty.removeClass(".search-driver-in-trip", "active");
    updateBtnCallTripVisibility();

    try {
        if (mapService.pointCustomer != null && typeof mapService.pointCustomer.setMap === 'function') {
            mapService.pointCustomer.setMap(mapService.map);
        }
    } catch (e) {}

    try {
        if (mapService.map && typeof mapService.map.setOptions === 'function') {
            mapService.map.setOptions({styles: mapService.getStyleMapDefault()});
        }
    } catch (e) {}

    try {
        if (mapService.infoSearch !== null && typeof mapService.infoSearch.setMap === 'function') {
            mapService.infoSearch.setMap(null);
        }
    } catch (e) {}
}

function clearDataCar() {
    viewController.elementProperty.getElement(".name-driver-trip", element => {
        element.innerHTML = "";
    });
    viewController.elementProperty.getElement(".car-plate-driver", element => {
        element.innerHTML = ""
    });
    viewController.elementProperty.getElement(".car-brand-driver", element => {
        element.innerHTML = "";
    });
}

function initCloseTrip() {
    viewController.elementProperty.addClass(".menu-close", "open");
}

function closeAddressTrip(event) {
    if (event)
        event.stopPropagation();
    initProcessingCallTrip();
    verifyListTripActivePartner();
    managerTripViewCurrent.isVisible = true;
    Route.backPage();
}

function closePaymentFormKey() {
    viewController.elementProperty.removeClass(".type-cars", "trip-type-selected");
    const paymentFooter = document.querySelector(".footer-payment-form");
    if (paymentFooter) {
        paymentFooter.classList.remove("active");
    }
}


function getTaxiType() {
    const object = JSON.parse(this.getAttribute("value"));

    managerTrip.typeTaxi.priceId = object.idPrice;
    managerTrip.typeTaxi.price = parseFloat(object.price);
    managerTrip.typeTaxi.tripTypeId = object.tripTypeId;
    managerTrip.typeTaxi.priceName = object.priceName || object.name;
    managerTrip.typeTaxi.tripType = object.tripType;
    managerTrip.typeTaxi.picture = object.picture || (object.tripType && object.tripType.picture);
    managerTrip.typeTaxi.priceDynamicValue = object.priceDynamicValue;
    if (object.centralNeighborhoodId) {
        managerTrip.typeTaxi.centralNeighborhoodId = object.centralNeighborhoodId;
        managerTrip.typeTaxi.nameNeighborhood = object.nameNeighborhood;
    } else {
        managerTrip.typeTaxi.centralNeighborhoodId = null;
        managerTrip.typeTaxi.nameNeighborhood = null;
    }

    viewController.elementProperty.getElement(".trip-type", element => element.classList.remove("active"));

    this.classList.add("active");

    try {
        const btnConfirm = document.querySelector(".switch-type-trip .btn-search-trip:last-child");
        if (btnConfirm) btnConfirm.innerHTML = 'Avançar';
    } catch (e) {}
}

function populateSearchDriverCard(data) {
    try {
        const typeTaxi = managerTrip?.typeTaxi || {};
        const rawCategoryName = typeTaxi.priceName || typeTaxi.name || "Movy";
        let categoryName = rawCategoryName.trim();
        if (categoryName) {
            categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();
        }

        const isCentral = /central/i.test(rawCategoryName) || /central/i.test(typeTaxi.type || '');
        const isEntregaOrDrive = /entrega|drive|particular|carro/i.test(rawCategoryName);
        const isMoto = !isEntregaOrDrive && !isCentral && (
            /\bmoto\b|mototaxi|motocicleta|motoboy/i.test(rawCategoryName) || 
            /\bmoto\b/i.test(String(typeTaxi.picture || '')) ||
            /\bmoto\b/i.test(String(data?.tripTypeId || ''))
        );
        const defaultCarImg = isCentral ? "/webfiles/img/icon/carro_eco.png" : "/webfiles/img/icon/carro_drive.png";
        const vehicleDefault = isMoto ? "/webfiles/img/icon/moto.png" : defaultCarImg;

        const vehicleImgEl = document.getElementById("searchTripVehicleImg");
        if (vehicleImgEl) {
            if (isEntregaOrDrive) {
                vehicleImgEl.src = "/webfiles/img/icon/carro_drive.png";
            } else if (isCentral) {
                vehicleImgEl.src = "/webfiles/img/icon/carro_eco.png";
            } else if (isMoto) {
                vehicleImgEl.src = "/webfiles/img/icon/moto.png";
            } else {
                let pic = typeTaxi.picture || (typeTaxi.tripType && typeTaxi.tripType.picture);
                if (pic && typeof pic === "string" && !pic.includes("minio.704app") && (pic.startsWith("http") || pic.startsWith("/"))) {
                    vehicleImgEl.src = pic;
                } else {
                    vehicleImgEl.src = defaultCarImg;
                }
            }
            vehicleImgEl.onerror = function() {
                this.onerror = null;
                this.src = vehicleDefault;
            };
        }

        const catBadgeEl = document.getElementById("searchTripCategoryName");
        if (catBadgeEl) catBadgeEl.innerText = categoryName;

        // Atualiza o badge pill wrapper
        const pillEl = document.getElementById("searchTripCategoryPill");
        if (pillEl) pillEl.setAttribute('data-category', categoryName);

        const phraseEl = document.getElementById("pharseTrip");
        if (phraseEl) {
            phraseEl.innerText = "Procurando motorista...";
        }

        let typeMoney = 'R$';
        try {
            const config = JSON.parse(localStorage.getItem('cityConfig')) || Session.getLocal('cityConfig');
            if (config && config.typeMoney) typeMoney = config.typeMoney;
        } catch (e) {
            const config = Session.getLocal('cityConfig');
            if (config && config.typeMoney) typeMoney = config.typeMoney;
        }

        const priceVal = (data?.price !== undefined && data?.price !== null) 
            ? data.price 
            : ((data?.priceValue !== undefined && data?.priceValue !== null) 
                ? data.priceValue 
                : (typeTaxi.price || 0));

        const priceEl = document.getElementById("searchTripPriceValue");
        if (priceEl) {
            priceEl.innerText = `${typeMoney} ${typeof Mask !== "undefined" ? Mask.maskMoney(priceVal) : Number(priceVal).toFixed(2)}`;
        }

        const dist = Session.getLocal("distanceTrip");
        const duration = Session.getLocal("estimatedTripTime");
        const etaEl = document.getElementById("searchTripEta");
        if (etaEl) {
            const formatted = typeof formatTripEta === "function"
                ? formatTripEta(duration, dist)
                : (function () {
                    let parts = [];
                    let minutes = parseFloat(String(duration || "").replace(",", "."));
                    if (!isNaN(minutes) && minutes > 0) {
                        if (minutes >= 180) minutes = minutes / 60;
                        parts.push(`${Math.max(1, Math.round(minutes))} min`);
                    }
                    let km = parseFloat(String(dist || "").replace(",", "."));
                    if (!isNaN(km) && km >= 0) {
                        if (km >= 100) km = km / 1000;
                        parts.push(`${km.toFixed(2)} km`);
                    }
                    return parts.join(" • ");
                })();
            etaEl.innerText = formatted || "Calculando...";
        }

        const paymentFormEl = document.getElementById("namePaymentForm");
        const payEl = document.getElementById("searchTripPayment");
        if (payEl) {
            payEl.innerText = (paymentFormEl && paymentFormEl.innerText.trim()) ? paymentFormEl.innerText.trim() : "Dinheiro";
        }

        const originInput = document.querySelector("*[place='origin']");
        const destInput = document.querySelector("*[place='destination']");
        const originTxt = document.getElementById("searchTripOriginText");
        const destTxt = document.getElementById("searchTripDestText");
        if (originTxt && originInput) originTxt.innerText = originInput.value || "Local de embarque";
        if (destTxt && destInput) destTxt.innerText = destInput.value || "Destino final";
    } catch (e) {
        console.error("Erro ao preencher dados do card de busca:", e);
    }
}

function initSearchTrip(data) {
    window.isCreatingTrip = true;
    managerTripViewCurrent.isVisible = true;
    managerTrip.tripCurrent = data;

    // Preserva a rota e os marcadores de origem/destino desenhados no mapa conforme vídeo de referência
    // mapService.removeRoute();

    viewController.elementProperty.removeClass(".footer-container-trip", "active");
    updateBtnCallTripVisibility();
    viewController.elementProperty.getElement("#mapWrapper", (element) => { 
        element.classList.remove("active"); 
    });
    scheduleMapResize();

    viewController.elementProperty.getElement(".container-simple-delivery", (element) => {
            element.classList.remove("active");
    });

    viewController.elementProperty.getElement(".footer-payment-form",(element) => 
        element.classList.remove("active")
    );

    activeMenu();

    handleSearchTrip(data);
    handleScheduledTrip(data);
    window.isCreatingTrip = false;
}

function handleSearchTrip(data) {
    // Som do chamado deve tocar no APP do motorista (Android/iOS), não na Central.
    try {
        populateSearchDriverCard(data);
    } catch (e) {
        console.warn("populateSearchDriverCard error:", e);
    }

    try {
        if (typeof mapService !== "undefined" && typeof mapService.searchDriver === "function") {
            mapService.searchDriver(data);
        }
    } catch (e) {
        console.warn("mapService.searchDriver error:", e);
    }

    try {
        if (typeof showToastByStatusTrip === "function") {
            showToastByStatusTrip(data);
        }
    } catch (e) {
        console.warn("Toast error:", e);
    }

    if (data?.status !== STATUS_SCHEDULED) {
        viewController.elementProperty.addClass(
            ".search-driver-in-trip",
            "active"
        );
        updateBtnCallTripVisibility();

        const tripReference = Session.getLocal("tripReference");
        if (tripReference && (typeof tripReference === 'string' ? tripReference.length > 0 : true)) {
            startSearchStatusPoll(typeof tripReference === 'string' ? tripReference : String(tripReference));
        }
    }

    try {
        viewController.elementProperty.getElement(".car-return", (element) => {
            element.src = `webfiles/img/logo/return-${data?.tripTypeId || 1}-d.png`;
        });
    } catch (e) {}

    const dateInitTrip = Session.getLocal("dateInitTrip");
    if (!dateInitTrip || (Array.isArray(dateInitTrip) && dateInitTrip.length === 0)) {
        Session.setLocal("dateInitTrip", DateCustom.getNow());
    }

    const timePhrase = Session.getLocal("timePhrase");
    if (!timePhrase || (Array.isArray(timePhrase) && timePhrase.length === 0) || (typeof timePhrase === 'object' && Object.keys(timePhrase).length === 0)) {
        sortTimePhrase();
    }

    initEventSearch();

    managerTrip.isSearch = true;

    verifyTrip();
}

function handleScheduledTrip(data) {
    // Usa utilitário que verifica o estado do menu antes de alterar o botão
    updateBtnCallTripVisibility();
    
    if (data?.status === STATUS_SCHEDULED && !data?.driver) {
        SwalCustom.messageDialog(
            "Agendamento de viagem realizado com sucesso.",
            "Viagem registrada",
            null,
            "success"
        );
    }
}

function initEventSearch() {
    viewController.elementProperty.addEventInElement(".cancel-search-trip", "onclick", function () {
        viewController.elementProperty.getElement("#messageCancelTrip", element => {
            element.innerHTML = "Estamos quase encontrando sua viagem.";
        });
        cancelSearchTrip(STATUS_BACK_OFF)
    });
}
