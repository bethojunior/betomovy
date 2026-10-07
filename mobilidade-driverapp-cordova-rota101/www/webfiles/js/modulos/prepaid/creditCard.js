viewController.setObserver("prepaid-pay-credit-card", function (paymentForm) {
    console.log(paymentForm);
    const elementProperty = new ElementProperty();
    const paymentCard = new PaymentCard();
    const customerCardController = new CustomerCardController();
    const userLogged = Session.get("user");
    let mpCard = null;
    let cardSelected = null;
    showCards(Session.get("cards"));

    elementProperty.addEventInElement("#addPaymentFormIndex", "onclick", function () {
        if (Session.get("cards").length >= 5) {
            SwalCustom.messageDialog("", "Você só pode ter no maximo 5 cartões adicionados.", undefined, "info");
            return;
        }
        paymentCard.addCard();
        elementProperty.addClass(".container-add-card", "active");
    });


    window.getCards = function () {
        preload(true);
        customerCardController.get().then(({status, data}) => {
            preload(false);
            if (!status)
                return;

            Session.set("cards", data);

            showCards(data);
        });
    };

    function showCards(cards) {
        elementProperty.getElement("#listCardPaymentIndex", element => {
            element.innerHTML = cards.map(card => {
                const lastFourDigits = card.number.substring(card.number.length - 4);

                return `<li class="cards-credit-client" value='${JSON.stringify(card)}'>
                                <img src="webfiles/img/icon/defaultcard.svg">
                                <span>****${lastFourDigits}</span>
                                <i class="material-icons remove-card-user" value='${JSON.stringify(card)}'>close</i>
                        </li>`;
            }).join("");

            elementProperty.addEventInElement(".cards-credit-client", "onclick", function () {
                window.plugins.spinnerDialog.show();
                const card = JSON.parse(this.getAttribute("value"));
                paymentCard.createToken(card, (response) => {
                    window.plugins.spinnerDialog.hide();
                    if (!response) {
                        preload(false);
                        return errorAddCreditCard(response);
                    }
                    cardSelected = card;
                    mpCard = response;
                    viewController.elementProperty.removeClass(".cards-credit-client", "active");
                    this.classList.add("active");
                });

            });

            elementProperty.addEventInElement(".remove-card-user", "onclick", function (event) {
                event.stopPropagation();

                const card = JSON.parse(this.getAttribute("value"));

                SwalCustom.dialogConfirm("Deseja remover cartão ?", "", (status) => {
                    if (!status)
                        return;
                    this.parentElement.remove();
                    preload(true);
                    customerCardController.remove(card.idCard)
                        .then(({status, data}) => {
                            preload(false)
                            if (!status)
                                return SwalCustom.messageDialog("Ops", "não foi possível remover o cartão", "warning");
                            getCards();
                            cardSelected = null;
                            mpCard = null;
                        });
                });
            });

        })
    }

    elementProperty.addEventInElement(".go-back", "onclick", function () {
        Route.backPage();
    });

    function errorAddCreditCard(error) {
        if (!error || !error.cause || !Array.isArray(error.cause)) {
            SwalCustom.messageDialog("", "Erro desconhecido no cartão", undefined, "error");
            return;
        }
        
        error.cause.map(cause => {
            if (cause.code === "E301") {
                SwalCustom.messageDialog("",
                    "Numero do cartão inválido !", undefined,
                    "warning");
                return;
            }
            if (cause.code === "325" || cause.code === "326") {
                SwalCustom.messageDialog("",
                    "Data de vencimento inválida !", undefined,
                    "warning");
                return;
            }
            if (cause.code === "E302") {
                SwalCustom.messageDialog("", "CVV inválido");
            }
        })
    }

    function preload(status) {
        if (status) {
            window.plugins.spinnerDialog.show();
        } else {
            window.plugins.spinnerDialog.hide();
        }
    }

    getCards();

    elementProperty.addEventInElement("#btnPaymentCreditPrepaid", "onclick", function () {
        if (cardSelected == null)
            return SwalCustom.messageDialog("", "Selecione o cartão", undefined, "warning");
        
        if (!paymentForm || !paymentForm.creditPrepaidId || !paymentForm.paymentFormId) {
            return SwalCustom.messageDialog("", i18n.t("prepaid.error-payment-data"), undefined, "error");
        }

        preload(true);
        PrepaidController
            .purchase({
                "creditPrepaidId": paymentForm.creditPrepaidId,
                "paymentFormId": paymentForm.paymentFormId,
                "cardId": cardSelected.idCard,
                "mpToken": mpCard.id
            })
            .then(({status}) => {
                if(!status)
                    return SwalCustom.messageDialog("","Não foi possível fazer a compra", undefined, "warning");

                SwalCustom.messageDialog("","Compra feita com sucesso!",undefined,"success");
                Route.backPage();
                Route.backPage();
            })
            .catch((error) => {
                console.error('Erro na compra do pré-pago:', error);
                SwalCustom.messageDialog("", i18n.t("prepaid.error-communication"), undefined, "error");
            })
            .finally(() => {
                preload(false)
            })
    });
});