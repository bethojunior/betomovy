function showPriceOfferModal(trip) {
    preload(false)
    Mask.setMoneyField("#priceOfferTrip");

    document.querySelector("#priceOfferTrip").value = Mask.maskMoney(parseFloat(trip.price));
    const maximumValue = parseFloat(trip.price) * 2

    calculateSuggestedValues(parseFloat(trip.price), maximumValue);

    viewController.elementProperty.addEventInElement("#decreaseOfferValue","onclick",function(){
        const value = Mask.removeMaskMoney(document.querySelector("#priceOfferTrip").value) - 1;
        const thirtyPercent = parseFloat(trip.price) * 0.30;

        if(parseFloat(trip.price) - thirtyPercent >= value)
            return;
            
        document.querySelector("#priceOfferTrip").value = Mask.maskMoney(value);
        calculateSuggestedValues(value, maximumValue);
    });

    viewController.elementProperty.addEventInElement("#increaseOfferValue","onclick",function(){
        const value = Mask.removeMaskMoney(document.querySelector("#priceOfferTrip").value) + 1;
        
        if(maximumValue < value)
            return;

        document.querySelector("#priceOfferTrip").value = Mask.maskMoney(value);
        calculateSuggestedValues(value, maximumValue);
    })

    Route.startClassesInComponent([
        {
            component: ".price-offer-modal",
            class: "active"
        }
    ], () => {
        viewController.elementProperty.removeClass(".price-offer-modal", "active");
    });

    viewController.elementProperty.addEventInElement(".go-back", "onclick", function () {
        Route.backPage();
    });

    viewController.elementProperty.addEventInElement("#btnConfirmValueOffer", "onclick", function () {
        const value = Mask.removeMaskMoney(document.querySelector("#priceOfferTrip").value);

        if (value === 0)
            return SwalCustom.messageDialog("", "Informe o valor para continuar!");

        Route.backPage();

        trip.oldPrice = trip.price;
        trip.isOffer = true;
        trip.price = value;
        trip.isFavorite = false;

        verifyPaymentFormTrip(trip);
    });
}

function calculateSuggestedValues(value, maximumValue = null){
    function calculateWithPercent(value,percent){
        return value + (value * percent)
    }

    viewController.elementProperty.getElement("#suggestedValues",element=>{
        element.innerHTML = [0.1,0.2,0.3].map(percent=>{
            const suggestedValue = calculateWithPercent(value, percent);
            if(suggestedValue < maximumValue)
            return `<li class="item-suggested-value" value="${suggestedValue}">${Mask.maskMoney(suggestedValue)}</li>`;
        }).join("")
        viewController.elementProperty.addEventInElement(".item-suggested-value","onclick",function(){
            const value = parseFloat(this.getAttribute("value"));
            document.querySelector("#priceOfferTrip").value = Mask.maskMoney(value);
            calculateSuggestedValues(value, maximumValue);

        })
    });
}

function startTripBidOfferScreen(trip, type = null) {
    Session.set("tripReference", trip.tripReference);
    viewController.elementProperty.getElement("#listAddressTripBidOffer", elemenet => {
        elemenet.innerHTML = `<li>
                        <span>${trip.origin.address}</span>
                    </li>
                    ${trip.tripWayPoints.map(item => {
            return `<li>
                                    <span>${item.address}</span>
                                </li>`;
        }).join("")}
                    <li>
                        <span>${trip.destination.name}</span>
                    </li>
            `;
    });

    viewController.elementProperty.getElement("#listOfferByDriver",element=>{
        element.setAttribute("text-content",getTextTranslate("offer","content-list-empty"))
        const offerSend = trip?.tripBids?.find((item) => {
            return item.price == trip?.price}) // PODE FAZER UM FILTER E FAZER UM MAP OU FOREACH, VERIFICAR REGRA DE NEGOCIO
            const config = Session.get("configGeneral");
            const enableOnlyClientOffer = config.find(item => {
                return item.key === 'enable_only_client_accept_offer'
            });
      
        if (type === 'modified' && offerSend && trip?.tripBids.length > 0 && enableOnlyClientOffer?.value == '1') { // PS : FALTANDO APENAS COLOCAR JUNTAMENTE COM A CHAVE DO MONITOR
            SwalCustom.messageDialog("", `${offerSend?.name} aceitou sua oferta no valor de ${CityConfig.getTypeCoin()} ${Mask.maskMoney(parseFloat(offerSend?.price))}. Aguardando sua confirmação!`);
        }
        const audio = new Audio("./webfiles/assets/songs/alertArrival.mp3");
        type === 'modified' && trip.tripBids.length > 0 && audio.play();
        
        element.innerHTML = trip.tripBids ? trip.tripBids.map(item=>{
            return `<li>
            <div class="data-driver-offer">
                <div class="profile-driver-offer" style="background-image: url(${item.driver.profilePicture})"></div>
                <div class="info-driver-trip-bid">
                    <span>${item.driver.name}</span>
                    <span><i class="material-icons">star</i><span>${item.driver.driverRating}</span> </span>
                </div>
                <h4>${CityConfig.getTypeCoin()} ${Mask.maskMoney(parseFloat(item.price))}</h4>
            </div>
            <div class="data-car-driver-offer">
                <span>${item.driver.car.brand} ${item.driver.car.model}</span>
                <span>${item.duration || 0} min/${(parseFloat(item.distance || 0) / 1000).toFixed(3)} km</span>
            </div>
            <div class="container-driver-trip-bid-option">
                <button type="button" class="refuse-trip-bid-offer" trip='${btoa(JSON.stringify(item))}'>Recusar</button>
                <button type="button" class="accept-trip-bid-offer" trip='${btoa(JSON.stringify(item))}'>Aceitar</button>
            </div>
        </li>`
        }).join("") : "";

        viewController.elementProperty.addEventInElement(".refuse-trip-bid-offer","onclick",function(){
            preload(true)
            const trip = JSON.parse(atob(this.getAttribute("trip")));
            TripBidController.actionRefuse(trip.id).then(()=>preload(false));
        })
        viewController.elementProperty.addEventInElement(".accept-trip-bid-offer","onclick",function(){
            preload(true);
            const trip = JSON.parse(atob(this.getAttribute("trip")))
            TripBidController.actionAccept(trip.id).then((response)=>{
                preload(false);
                response?.status === false && SwalCustom.messageDialog("", response?.message);
            });
        })
    })

    viewController.elementProperty.addEventInElement('#btnCancelTripBidOffer', 'onclick', function () {
        managerTrip.tripCurrent = trip;

        viewController.elementProperty.getElement(
            "#messageCancelTrip",
            element => {
                element.innerHTML = ``;
            }
        );
        cancelSearchTrip(STATUS_BACK_OFF);
    });

    viewController.elementProperty.addEventInElement("#changeValueTripOffer","onclick",function(){
        changeValueTripOffer(trip);
    });

    document.querySelector("#valueTripBidOfferCustomer").innerHTML = `Valor Ofertado: ${CityConfig.getTypeCoin()} ${Mask.maskMoney(parseFloat(trip.price))}`;
    viewController.elementProperty.addClass(".trip-bid-offer-modal", "active");

    if (!managerTrip.isSearch){
        managerTrip.isSearch = true;
        observerRealtime();
    }
}

function changeValueTripOffer(trip) {
    Mask.setMoneyField("#priceOfferTrip");

    document.querySelector("#priceOfferTrip").value = Mask.maskMoney(parseFloat(trip.price));

    const maximumValue = parseFloat(trip.price) * 2

    calculateSuggestedValues(parseFloat(trip.price), maximumValue);

    viewController.elementProperty.addEventInElement("#decreaseOfferValue","onclick",function(){
        const value = Mask.removeMaskMoney(document.querySelector("#priceOfferTrip").value) - 1;

        if(parseFloat(trip.price) > value)
            return;

        document.querySelector("#priceOfferTrip").value = Mask.maskMoney(value);
        calculateSuggestedValues(value, maximumValue);
    });

    viewController.elementProperty.addEventInElement("#increaseOfferValue","onclick",function(){
        const value = Mask.removeMaskMoney(document.querySelector("#priceOfferTrip").value) + 1;

        if(maximumValue < value)
            return;

        document.querySelector("#priceOfferTrip").value = Mask.maskMoney(value);
        calculateSuggestedValues(value, maximumValue);
    })


    Route.startClassesInComponent([
        {
            component: ".price-offer-modal",
            class: "active"
        }
    ], () => {
        viewController.elementProperty.removeClass(".price-offer-modal", "active");
    });

    viewController.elementProperty.addEventInElement(".go-back", "onclick", function () {
        Route.backPage();
    });

    viewController.elementProperty.addEventInElement("#btnConfirmValueOffer", "onclick", function () {
        const value = Mask.removeMaskMoney(document.querySelector("#priceOfferTrip").value);

        if (value === 0)
            return SwalCustom.messageDialog("", "Informe o valor para continuar!");

        Route.backPage();

        preload(true);

        TripBidController.actionChangePrice(trip.tripReference, value).then(()=> preload(false));

    });
}
