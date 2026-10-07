Route.waitView().then(function () {
    viewController.elementProperty.addEventInElement("#addPaymentForm", "onclick", function () {
        const paymentCard = new PaymentCard();

        paymentCard.addCard();
    })
});


function getPaymentFormSelect(element) {

    const paymentForm = JSON.parse(element.getAttribute("payment"));

    Session.set("paymentForm", paymentForm);

    closePaymentForm();
    showPaymentForm();

    viewController.elementProperty.getElement(".payment-form-trip", element => {
        element.classList.remove("active");
    });

    element.classList.add("active");

    return parseInt(element.getAttribute("value"));
}

function getCardSelectedPayTrip(card, generateToken = false) {

    return new Promise((resolve, reject) => {
        if (Array.isArray(card)) {
            viewController.elementProperty.getElement("#cardSelectedPayTrip", element => {
                element.innerHTML = `<div onclick="choiceCard()"><img src="webfiles/img/icon/credit-card.png">
            <p>----</p></div>`
            });

            //reject("Nenhum cartão de crédito");

            return;
        }


        Session.set("cardSelected", card);

        viewController.elementProperty.getElement("#cardSelectedPayTrip", element => {
            element.innerHTML = `<div onclick="choiceCard()"><img src="webfiles/img/icon/${Mask.detectCardType(card.number)}.png">
            <p>${card.number.substr(-4)}</p></div>`
        });

        const paymentCard = new PaymentCard();

        if(!generateToken){
            resolve();
        }else {
            paymentCard.createToken({
                cardNumber: card.number,
                cardholderName: card.cardholderName,
                cardExpirationMonth: card.expirationMonth,
                cardExpirationYear: card.expirationYear,
                securityCode: card.cvv,
                identificationType: 'CPF',
                identificationNumber: card.holderDocument,
            }, function (response) {
                if (!response) {
                    SwalCustom.messageDialog("", "Ocorreu um error", undefined, "warning");
                    reject("Ocorreu um na solicitação do pagamento com cartão");
                    return;
                }

                Session.set("tokenCard", {
                    token: response.id,
                    cardId: card.idCard
                });

                resolve(Session.get("tokenCard"));

            });
        }
    });
}

function choiceCard() {
    showModalCards(getCardSelectedPayTrip);
}

function openPaymentForm() {
    Route.startClassesInComponent([{component: ".footer-payment-form", class: "active"}],
        () => {
            viewController.elementProperty.removeClass(".footer-payment-form", "active");
        }, COMPONENT_CREATE_TRIP);
}

function closePaymentForm() {
    Route.backPage();
}

function showPaymentForm(isOffer = false) {
    const paymentForm = Session.get("paymentForm");
    if (paymentForm && paymentForm?.length !== 0 && !isOffer) {
        viewController.elementProperty.getElement("#namePaymentForm", element => {
            element.innerHTML = paymentForm.name;
        });

        viewController.elementProperty.getElement("#cardSelectedPayTrip", element => {
            element.innerHTML = '';
        });

        updateCardSelected();

        managerTrip.paymentFormIdSelected = paymentForm?.idTripPaymentForm;

        showDataPaymentForm(paymentForm.paymentFormTypeId);

        return paymentForm.idTripPaymentForm;
    }

    viewController.elementProperty.getElement("#namePaymentForm", element => {
        element.innerHTML = getTextTranslate("home","p-payment-form");
    });

    managerTrip.paymentFormIdSelected = null;
    
    viewController.elementProperty.getElement("#cardSelectedPayTrip", element => {
        element.innerHTML = '';
    });

    return null;
}

function updateCardSelected() {
    const card = Session.get("cardSelected");

    if (Session.get("cards").filter(cardActive => {
        return cardActive.idCard === card.idCard;
    }).length === 0) {
        Session.delete("cardSelected");
        viewController.elementProperty.getElement("#cardSelectedClient", element => {
            element.innerHTML = "----";
        });
    }

    if (Session.get("cards").length === 0)
        Session.delete("cardSelected");

}

function showDataPaymentForm(paymentFormTypeId) {

    switch (parseInt(paymentFormTypeId)) {
        case 1:
            showBalanceVoucherClient();
            break;
        case 3:
        case 8:
            getCardSelectedPayTrip(Session.get("cardSelected"));
            break;
    }
}

function showBalanceVoucherClient() {
    viewController.elementProperty.getElement("#cardSelectedPayTrip", element => {
        element.innerHTML = `<label>
            ${CityConfig.getTypeCoin()} ${Mask.maskMoney(parseFloat(Session.get("currentBalanceClient")))}</label>`;
    });
}

const paymentForms = []

function getPaymentForm(callback, isOffer = false) {
    if (isOffer && paymentForms.length > 0) {
        return viewController.elementProperty.getElement(".list-payment-forms", element => {
            let filtered = paymentForms

            if(ConfigGeneral().get("enable_card_payment_type_inDriver_trip") == '0') {
                filtered = filtered.filter(payment => payment.paymentFormTypeId !== "3")
            }

            if (ConfigGeneral().get("enable_voucher_payment_type_inDriver_trip") == '0') {
                filtered = filtered.filter(payment => payment.paymentFormTypeId !== "1")
            }
            
            element.innerHTML = filtered.map(payment => {
                /* if(payment.idTripPaymentForm === "3")
                     return "";*/

                return `<li class="payment-form-trip" 
                            value="${payment.idTripPaymentForm}" 
                            payment='${JSON.stringify(payment)}'>
                        <i class="fa fa-money"></i>
                        <p>${payment.name}</p>
                     </li>`;
            }).join("");

            callback();
        });
    } else if (!isOffer && paymentForms.length > 0) {
        return viewController.elementProperty.getElement(".list-payment-forms", element => {
            element.innerHTML = paymentForms.map(payment => {
                /* if(payment.idTripPaymentForm === "3")
                     return "";*/

                return `<li class="payment-form-trip" 
                            value="${payment.idTripPaymentForm}" 
                            payment='${JSON.stringify(payment)}'>
                        <i class="fa fa-money"></i>
                        <p>${payment.name}</p>
                     </li>`;
            }).join("");

            callback();
        });
    }
    new TripPaymentFormController().getAll().then(({status, data}) => {
        if (!status)
            return;

            let filtered = data
            paymentForms.push(...data)
            if (isOffer) {
                filtered = data.filter(payment => payment.paymentFormTypeId !== "3")
            }

        viewController.elementProperty.getElement(".list-payment-forms", element => {
            element.innerHTML = filtered.map(payment => {
                /* if(payment.idTripPaymentForm === "3")
                     return "";*/

                return `<li class="payment-form-trip" 
                            value="${payment.idTripPaymentForm}" 
                            payment='${JSON.stringify(payment)}'>
                        <i class="fa fa-money"></i>
                        <p>${payment.name}</p>
                     </li>`;
            }).join("");

            callback();
        });
    }).catch((err) => {
        console.log(err)
        setTimeout(() => {
            getPaymentForm(callback);
        }, 5000)
    });
}

