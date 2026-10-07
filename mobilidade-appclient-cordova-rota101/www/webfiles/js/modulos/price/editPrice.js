function openEditPrice() {
    resetPricesEdited();

    Route.startClassesInComponent([
        {component: ".container-edit-price", class: "active"}
    ], () => {
        viewController.elementProperty.removeClass(".container-edit-price", "active");
    }, COMPONENT_CREATE_TRIP);

    viewController.elementProperty.addEventInElement("#closeEditPrice", "onclick", function () {
        Route.backPage();
    });

    viewController.elementProperty.getElement(".logo-price-selected", element => {
        const price = managerTrip.prices.find(item => {
            return managerTrip.typeTaxi.priceId === item.idPrice;
        });

        element.style.backgroundImage = `url('${price.picture}')`;
    });

    viewController.elementProperty.getElement("#typeEditPrice", element => {
        element.innerHTML = managerTrip.typeTaxi.priceName;
    });

    Mask.setMoneyField("#valueNewPrice");

    viewController.elementProperty.getElement("#valueNewPrice", element => {
        element.value = Mask.maskMoney(managerTrip.typeTaxi.price);
    });

    viewController.elementProperty
        .addEventInElement("#btnConfirmationNewPrice", "onclick", function () {

            const value = Mask.removeMaskMoney(document.getElementById("valueNewPrice").value);

            if(value === 0){
                SwalCustom.messageDialog("","Informe o valor da viagem",undefined,"info");
                return;
            }

            createNewPrice(value);

            Route.backPage();
        });
}

function createNewPrice(value){
    managerTrip.recalculatedTrip = {
        oldPrice: managerTrip.typeTaxi.price,
        newPrice: value
    };

    document.querySelector(`#valueTypeTrip${managerTrip.typeTaxi.tripTypeId}`).innerHTML =
        `<span>${CityConfig.getTypeCoin()}</span>${Mask.maskMoney(value)}`;

}

function resetPricesEdited(){
    managerTrip.recalculatedTrip = null;

    viewController.elementProperty.getElement(".label-prices-trip",element =>{
        element.innerHTML = `<span>${CityConfig.getTypeCoin()}</span>${element.getAttribute("valueDefault")}`;
    });
}
