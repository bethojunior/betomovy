viewController.setObserver("pay", function () {
    const elementProperty = new ElementProperty();
    const voucherSelected = Session.get("typeVoucher");
    const paymentCard = new PaymentCard();
    const TYPE_CARD = 1;
    const voucherPurchaseController = new VoucherPurchaseController();
    paymentCard.updateToken();

    if (!Array.isArray(Session.get("cardSelected")))
        getCard(Session.get("cardSelected"));

    elementProperty.getElement("#voucherPay", element => {
        element.innerHTML = `${CityConfig.getTypeCoin()}` + Mask.maskMoney(voucherSelected.amount);
    });

    elementProperty.getElement("#totalPay", element => {
        element.innerHTML = `${CityConfig.getTypeCoin()}` + Mask.maskMoney(voucherSelected.value);
    });

    elementProperty.addEventInElement(".go-back", "onclick", function () {
        Route.backPage();
    });

    elementProperty.addEventInElement("#selectedPaymentForm", "onclick", function () {
        showModalCards(getCard);
    });

    function getCard(card) {
        console.log(card);
        if (Session.get("cards").filter(cardActive => {
            return cardActive.idCard === card.idCard;
        }).length === 0) {
            Session.delete("cardSelected");
            elementProperty.getElement("#cardSelectedClient", element => {
                element.innerHTML = "----";
            });
            return;
        }

        Session.set("cardSelected", card);
        elementProperty.getElement("#cardSelectedClient", element => {
            element.innerHTML = `<img src="webfiles/img/icon/${card.mpPaymentMethodName}.png">
                <p>${card.mpLastFourDigits}</p>`
        });

        elementProperty.getElement("#cardIdSelected", element => {
            element.innerHTML = `<option value="${card.mpCardId}"
                        first_six_digits="${card.mpFirstSixDigits}"
                            security_code_length=${card.mpSecurityCodeLength} selected>
                                ${card.mpPaymentMethodName} terminado com ${card.mpLastFourDigits}
                    </option>`
        });

        elementProperty.getElement("#cvvCardSelect", element => {
            element.setAttribute('value', card.cvv);
        });
    }

    elementProperty.addEventInElement("#payBuy", "onclick", function () {
        elementProperty.getElement("#payBuyClient", element => {
            if (Array.isArray(Session.get("cardSelected"))) {
                SwalCustom.messageDialog("", "Selecione um cartão de crédito", undefined, "info");
                return;
            }
            preload(true);

            const card = Session.get("cardSelected");

            paymentCard.createToken({
                cardNumber: card.number,
                cardholderName: card.cardholderName,
                cardExpirationMonth: card.expirationMonth,
                cardExpirationYear: card.expirationYear,
                securityCode: card.cvv,
                identificationType: 'CPF',
                identificationNumber: card.holderDocument,
            }, responsePayment)
        })
    });

    function responsePayment(response) {
        if (!response) {
            preload(false);
            SwalCustom.messageDialog("", "Pagamento não autorizado", undefined, "warning");
            return;
        }

        const card = Session.get("cardSelected");

        voucherPurchaseController.customerInsert({
            amount: voucherSelected.amount,
            paymentFormId: TYPE_CARD,
            value: voucherSelected.value,
            cardId: card.idCard,
            mpToken: response.id
        }).then(({status, data, errors}) => {
            preload(false);
            if (!status) {
                paymentCard.updateToken();
                SwalCustom.messageDialog("", errors.message, undefined, "warning");
                return;
            }

            elementProperty.getElement("#valuePayClient", element => {
                element.innerHTML = `${CityConfig.getTypeCoin()}` + Mask.maskMoney(voucherSelected.value)
            });

            elementProperty.getElement("#voucherPayClient", element => {
                element.innerHTML = `${CityConfig.getTypeCoin()}` + Mask.maskMoney(voucherSelected.amount)
            });

            elementProperty.addClass(".container-finish-pay", "active");

            elementProperty.addEventInElement("#btnConfirmationFinishPay",
                "onclick", function () {
                    elementProperty.removeClass(".container-finish-pay", "active");
                    updateBalance();
                    Route.backPage();
                    Route.backPage();

                }, "success");

        }).catch(() => {
            preload(false);
        })

    }

});
