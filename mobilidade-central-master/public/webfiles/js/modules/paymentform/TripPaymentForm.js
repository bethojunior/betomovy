document.addEventListener("DOMContentLoaded",function () {
    viewController.elementProperty.addEventInElement("#addPaymentForm", "onclick", function () {
        const paymentCard = new PaymentCard();
        paymentCard.addCard();
    })
});


function getPaymentFormSelect(element) {
    const paymentForm = JSON.parse(element.getAttribute("payment"));

    if (paymentForm && paymentForm.name) {
        paymentForm.name = paymentForm.name.replace(/\s*(ou|\/|\+)?\s*pix\b/gi, '').trim() || paymentForm.name;
    }

    Session.setLocal("paymentForm", paymentForm);

    closePaymentForm();
    showPaymentForm();

    viewController.elementProperty.getElement(".payment-form-trip", element => {
        element.classList.remove("active");
    });

    element.classList.add("active");

    return parseInt(element.getAttribute("value"));
}

function getCardSelectedPayTrip(card) {
    return new Promise((resolve, reject) => {
        if (Array.isArray(card)) {
            viewController.elementProperty.getElement("#cardSelectedPayTrip", element => {
                element.innerHTML = `<div onclick="choiceCard()"><img src="webfiles/img/icon/credit-card.png">
            <p>----</p></div>`
            });

            //reject("Nenhum cartão de crédito");

            return;
        }


        Session.setLocal("cardSelected", card);

        viewController.elementProperty.getElement("#cardSelectedPayTrip", element => {
            element.innerHTML = `<div onclick="choiceCard()"><img src="webfiles/img/icon/${card.mpPaymentMethodName}.png">
            <p>${card.mpLastFourDigits}</p></div>`
        });

        const paymentCard = new PaymentCard();

        paymentCard.createToken(card, function (status, response) {

            if (status !== 200 && status !== 201) {
                SwalCustom.messageDialog("", "Ocorreu um error", undefined, "warning");
                reject("Ocorreu um na solicitação do pagamento com cartão");
                return;
            }

            Session.set("tokenCard", {
                token: response.id,
                cardId: card.idCard
            });

            resolve(Session.getLocal("tokenCard"));

        });
    });
}

function choiceCard() {
    showModalCards(getCardSelectedPayTrip);
}

function openPaymentForm() {
    if (document.querySelector(".footer-schedule-form")?.classList.contains("active")) {
        Route.backPage();
    }

    Route.startClassesInComponent([{component:".footer-payment-form",class:"active"}],
        ()=>{
            viewController.elementProperty.removeClass(".footer-payment-form","active");
        },COMPONENT_CREATE_TRIP);
}

function closePaymentForm() {
    Route.backPage();
}

function showPaymentForm() {
    let paymentForm = Session.getLocal("paymentForm");

    if (paymentForm && typeof paymentForm === "object" && !Array.isArray(paymentForm)) {
        const name = (paymentForm.name || '').toLowerCase();
        if (name.includes('pix') || paymentForm.paymentFormTypeId === 12) {
            Session.delete("paymentForm");
            paymentForm = null;
        }
    }

    if (paymentForm && paymentForm.length !== 0 && paymentForm.name) {
        paymentForm.name = paymentForm.name.replace(/\s*(ou|\/|\+)?\s*pix\b/gi, '').trim() || paymentForm.name;
        viewController.elementProperty.getElement("#namePaymentForm", element => {
            element.innerHTML = paymentForm.name;
        });

        if(paymentForm.paymentFormTypeId === PAYMENT_VOUCHER_CENTRAL){
            preload(true);
            CentralRepository.getBalance(Session.getValueInSession("centralSelected", "responsibleId")).then(({response, status}) => {
                preload(false);

                if(!status){
                    return SwalCustom.messageDialog(
                        "Tente novamente ou escolha outra forma de pagamento",
                        "Não foi possível encontrar o saldo de sua central",
                        undefined,
                        "info"
                    );
                }

                document.querySelector('.btn-search-trip').setAttribute('balanceTrip', response.tripBalance);

                viewController.elementProperty.getElement("#cardSelectedPayTrip", element => {
                    element.innerHTML = Mask.maskMoney(response.tripBalance);
                    element.style.display = 'block';
                });

                if(parseFloat(response.tripBalance) <= 0 || parseFloat(response.tripBalance) < parseFloat(managerTrip.typeTaxi.price)){
                    return viewController.elementProperty.getElement(".btn-search-trip", element => {
                        if (element.id === 'list-active-drivers') return;
                        element.style.backgroundColor = 'gray';
                        element.style.cursor = 'not-allowed';
                        element.setAttribute('disabled', '');
                    });
                }
            });
        } else {
            document.querySelector('.btn-search-trip').removeAttribute('balanceTrip');

            viewController.elementProperty.getElement("#cardSelectedPayTrip", element => {
                element.style.display = 'none';
            });

            viewController.elementProperty.getElement(".btn-search-trip", element => {
                if (element.id === 'list-active-drivers') return;
                element.style.backgroundColor = 'var(--main-color)';
                element.style.cursor = 'pointer';
                element.removeAttribute('disabled', '');
            });
        }

        updateCardSelected();

        showDataPaymentForm(paymentForm.idTripPaymentForm);

        return paymentForm.idTripPaymentForm;
    }

    return null;
}

function updateCardSelected() {
    const card = Session.getLocal("cardSelected");

    if (Session.getLocal("cards").filter(cardActive => {
        return cardActive.idCard === card.idCard;
    }).length === 0) {
        Session.delete("cardSelected");
        viewController.elementProperty.getElement("#cardSelectedClient", element => {
            element.innerHTML = "----";
        });
    }

    if (Session.getLocal("cards").length === 0)
        Session.delete("cardSelected");

}

function showDataPaymentForm(idTripPaymentForm) {

    switch (parseInt(idTripPaymentForm)) {
        case 1:
            showBalanceVoucherClient();
            break;
        case 3:
            getCardSelectedPayTrip(Session.getLocal("cardSelected"));
            break;
    }
}

function showBalanceVoucherClient() {
    viewController.elementProperty.getElement("#cardSelectedPayTrip", element => {
        const typeMoney = JSON?.parse(localStorage?.getItem('cityConfig'))?.typeMoney || Session.getLocal('cityConfig')?.typeMoney || 'R$';
        if(Array.isArray(Session.getLocal("currentBalanceClient")))
            return element.innerHTML = `<label>${typeMoney} 0,00</label>`;
        element.innerHTML = `<label>
            ${typeMoney} ${Mask.maskMoney(parseFloat(Session.getLocal("currentBalanceClient")))}</label>`;
    });
}

function getPaymentForm(callback) {
    TripPaymentFormRepository.getAll().then(({status, response}) => {
        if (!status)
            return;

        viewController.elementProperty.getElement(".list-payment-forms", element => {
            const rawList = Array.isArray(response) ? response : [];
            const filteredPayments = rawList.filter(payment => {
                if (!payment) return false;
                const name = (payment.name || '').toLowerCase();
                const desc = (payment.description || '').toLowerCase();

                // Bloquear terminantemente qualquer forma de pagamento PIX
                if (name.includes('pix') || desc.includes('pix')) return false;
                if (payment.paymentFormTypeId === 12) return false;

                // Permitir apenas Dinheiro (2), Pagamento no Local (4) e Voucher Central (11)
                return payment.paymentFormTypeId === 2 || payment.paymentFormTypeId === 4 || payment.paymentFormTypeId === 11;
            }).map(payment => {
                let cleanName = (payment.name || '').replace(/\s*(ou|\/|\+)?\s*pix\b/gi, '').trim();
                return {
                    ...payment,
                    name: cleanName || payment.name
                };
            });

            element.innerHTML = filteredPayments.map(payment => {
                return `<li class="payment-form-trip" 
                            value="${payment.idTripPaymentForm}" 
                            payment='${JSON.stringify(payment)}'>
                        <i class="fa fa-money"></i>
                        <p>${payment.name}</p>
                     </li>`;
            }).join("");

            callback();
        });
    }).catch((e) => {
        //console.log(e)
        getPaymentForm(callback)
    });
}

