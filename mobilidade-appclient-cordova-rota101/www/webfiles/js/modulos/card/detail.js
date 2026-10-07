viewController.setObserver("detail-card", function () {
    const elementProperty = new ElementProperty();
    const customerCardController = new CustomerCardController();
    const card = Session.get("detailCard");

    const typeCard = {
        visa: "**** **** ***** ",
        mastercard: "**** **** ***** ",
        amex: "**** ****** *"
    };

    elementProperty.getElement("#numberCardView", element => {
        element.value = typeCard[Mask.detectCardType(card.number)] + card.number.substr(-4);
    });
    elementProperty.getElement("#dueDateView", element => {
        element.value = card.expirationMonth + "/" + card.expirationYear;
    });
    elementProperty.getElement("#typeCardDetail", element => {
        element.innerHTML = Mask.detectCardType(card.number);
    });
    elementProperty.addEventInElement("#removeCardDetail", "onclick", function () {
        SwalCustom.dialogConfirm(getTextTranslate("card","confirm-remove-card"), "", "info").then(() => {
            preload(true);

            customerCardController.remove(card.idCard)
                .then(({status, data}) => {
                    preload(false);
                    if (!status) {
                        SwalCustom.messageDialog("Ops", "não foi possível remover o cartão", "warning");
                        return;
                    }
                    getCards();
                    Route.backPage();
                }).catch(() => {
                preload(false);
            });

        });
    });

    elementProperty.addEventInElement(".go-back","onclick",function(){
        Route.backPage();
    });
});
