document.addEventListener("DOMContentLoaded", function () {
    viewController.elementProperty.addEventInElement("#addPaymentForm", "onclick", function () {
        const paymentCard = new PaymentCard();
        paymentCard.addCard();
    });

    initCardsModal();
    loadPaymentAcquirer();
});

function loadPaymentAcquirer() {
    const controller = new CustomerCardController();
    if (typeof controller.verifyAcquirer !== "function") return;

    controller.verifyAcquirer().then(({ status, data, response }) => {
        const acquirer = data || response;
        if (!status || !acquirer) return;
        Session.setLocal("ACQUIRER", acquirer);
    }).catch(() => {});
}

function initCardsModal() {
    const elementProperty = new ElementProperty();
    let callbackSelectCard = null;

    elementProperty.addEventInElement(".close-cards-modal", "onclick", function () {
        elementProperty.removeClass(".container-cards", "active");
    });

    window.showModalCards = function (callback) {
        if (callback !== undefined) callbackSelectCard = callback;
        refreshCardsModalList().then(bindCardSelectEvents);
        elementProperty.addClass(".container-cards", "active");
    };

    function bindCardSelectEvents() {
        elementProperty.addEventInElement(".cards-list-select", "onclick", function () {
            elementProperty.removeClass(".container-cards", "active");
            if (callbackSelectCard !== null) {
                callbackSelectCard(JSON.parse(this.getAttribute("value")));
            }
        });
    }

    function refreshCardsModalList() {
        return new Promise(resolve => {
            const cards = Session.getLocal("cards") || [];
            elementProperty.getElement("#listCardPaymentModal", element => {
                if (!cards.length) {
                    element.innerHTML = `<li><i class="material-icons">credit_card</i><p></p></li>`;
                    resolve();
                    return;
                }

                element.innerHTML = cards.map(card => {
                    const last4 = card.mpLastFourDigits || (card.number ? String(card.number).substr(-4) : "----");
                    const safe = JSON.stringify(card).replace(/'/g, "&apos;");
                    return `<li class="cards-list-select" value='${safe}'>
                        <i class="material-icons">credit_card</i>
                        <p>${last4}</p>
                    </li>`;
                }).join("");
                resolve();
            });
        });
    }

    elementProperty.addEventInElement("#addCardModal", "onclick", function () {
        const cards = Session.getLocal("cards") || [];
        if (cards.length >= 5) {
            SwalCustom.messageDialog("", "Você só pode ter no máximo 5 cartões adicionados.", undefined, "info");
            return;
        }
        elementProperty.removeClass(".container-cards", "active");
        new PaymentCard().addCard();
        window.addCardManager = window.addCardManager || {};
        addCardManager.callback = function () {
            setTimeout(function () {
                showModalCards(callbackSelectCard);
            }, 400);
        };
    });
}

function getPaymentFormSelect(element) {
    const paymentForm = JSON.parse(element.getAttribute("payment"));

    if (paymentForm && paymentForm.name) {
        paymentForm.name = paymentForm.name.replace(/\s*(ou|\/|\+)?\s*pix\b/gi, "").trim() || paymentForm.name;
    }

    Session.setLocal("paymentForm", paymentForm);

    closePaymentForm();
    showPaymentForm();

    viewController.elementProperty.getElement(".payment-form-trip", el => {
        el.classList.remove("active");
    });

    element.classList.add("active");

    return parseInt(element.getAttribute("value"), 10);
}

function getCardSelectedPayTrip(card) {
    return new Promise((resolve, reject) => {
        const cardEl = document.querySelector("#cardSelectedPayTrip");
        if (cardEl) cardEl.style.display = "flex";

        if (!card || Array.isArray(card)) {
            viewController.elementProperty.getElement("#cardSelectedPayTrip", element => {
                element.style.display = "flex";
                element.innerHTML = `<div onclick="choiceCard()"><i class="material-icons">credit_card</i>
            <p>Selecionar cartão</p></div>`;
            });
            return;
        }

        Session.setLocal("cardSelected", card);
        Session.set("cardSelected", card);

        const last4 = card.mpLastFourDigits || (card.number ? String(card.number).substr(-4) : "----");

        viewController.elementProperty.getElement("#cardSelectedPayTrip", element => {
            element.style.display = "flex";
            element.innerHTML = `<div onclick="choiceCard()"><i class="material-icons">credit_card</i>
            <p>${last4}</p></div>`;
        });

        const paymentCard = new PaymentCard();

        paymentCard.createToken(card, function (status, response) {
            if (status !== 200 && status !== 201) {
                SwalCustom.messageDialog("", "Ocorreu um error", undefined, "warning");
                reject("Ocorreu um na solicitação do pagamento com cartão");
                return;
            }

            const token = (response && response.id) || card.cardId || card.mpCardId || null;

            Session.set("tokenCard", {
                token: token,
                cardId: card.idCard
            });
            Session.setLocal("tokenCard", {
                token: token,
                cardId: card.idCard
            });

            resolve(Session.get("tokenCard") || Session.getLocal("tokenCard"));
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

    getPaymentForm();

    Route.startClassesInComponent([{ component: ".footer-payment-form", class: "active" }],
        () => {
            viewController.elementProperty.removeClass(".footer-payment-form", "active");
        }, COMPONENT_CREATE_TRIP);
}

function closePaymentForm() {
    viewController.elementProperty.removeClass(".footer-payment-form", "active");
    if (typeof Route !== "undefined" && typeof Route.backPage === "function") {
        Route.backPage();
    }
}

function showPaymentForm() {
    let paymentForm = Session.getLocal("paymentForm");

    if (paymentForm && typeof paymentForm === "object" && !Array.isArray(paymentForm)) {
        const name = (paymentForm.name || "").toLowerCase();
        if (name.includes("pix") || paymentForm.paymentFormTypeId === 12) {
            Session.delete("paymentForm");
            paymentForm = null;
        }
    }

    if (paymentForm && paymentForm.length !== 0 && paymentForm.name) {
        paymentForm.name = paymentForm.name.replace(/\s*(ou|\/|\+)?\s*pix\b/gi, "").trim() || paymentForm.name;
        viewController.elementProperty.getElement("#namePaymentForm", element => {
            element.innerHTML = paymentForm.name;
        });

        if (paymentForm.paymentFormTypeId === PAYMENT_VOUCHER_CENTRAL) {
            preload(true);
            CentralRepository.getBalance(Session.getValueInSession("centralSelected", "responsibleId")).then(({ response, status }) => {
                preload(false);

                if (!status) {
                    return SwalCustom.messageDialog(
                        "Tente novamente ou escolha outra forma de pagamento",
                        "Não foi possível encontrar o saldo de sua central",
                        undefined,
                        "info"
                    );
                }

                document.querySelector(".btn-search-trip").setAttribute("balanceTrip", response.tripBalance);

                viewController.elementProperty.getElement("#cardSelectedPayTrip", element => {
                    element.innerHTML = Mask.maskMoney(response.tripBalance);
                    element.style.display = "block";
                });

                if (parseFloat(response.tripBalance) <= 0 || parseFloat(response.tripBalance) < parseFloat(managerTrip.typeTaxi.price)) {
                    return viewController.elementProperty.getElement(".btn-search-trip", element => {
                        if (element.id === "list-active-drivers") return;
                        element.style.backgroundColor = "gray";
                        element.style.cursor = "not-allowed";
                        element.setAttribute("disabled", "");
                    });
                }
            });
        } else {
            document.querySelector(".btn-search-trip")?.removeAttribute("balanceTrip");

            const isCard = parseInt(paymentForm.paymentFormTypeId, 10) === PAYMENT_CARD_CREDIT
                || parseInt(paymentForm.idTripPaymentForm, 10) === 3;

            viewController.elementProperty.getElement("#cardSelectedPayTrip", element => {
                element.style.display = isCard ? "flex" : "none";
            });

            viewController.elementProperty.getElement(".btn-search-trip", element => {
                if (element.id === "list-active-drivers") return;
                element.style.backgroundColor = "var(--main-color)";
                element.style.cursor = "pointer";
                element.removeAttribute("disabled", "");
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
    const cards = Session.getLocal("cards") || [];

    if (!card || !card.idCard) {
        Session.delete("cardSelected");
        return;
    }

    if (cards.filter(cardActive => cardActive.idCard === card.idCard).length === 0) {
        Session.delete("cardSelected");
        viewController.elementProperty.getElement("#cardSelectedClient", element => {
            element.innerHTML = "----";
        });
    }

    if (cards.length === 0) Session.delete("cardSelected");
}

function showDataPaymentForm(idTripPaymentForm) {
    switch (parseInt(idTripPaymentForm, 10)) {
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
        const typeMoney = JSON?.parse(localStorage?.getItem("cityConfig"))?.typeMoney || Session.getLocal("cityConfig")?.typeMoney || "R$";
        if (Array.isArray(Session.getLocal("currentBalanceClient")))
            return element.innerHTML = `<label>${typeMoney} 0,00</label>`;
        element.innerHTML = `<label>
            ${typeMoney} ${Mask.maskMoney(parseFloat(Session.getLocal("currentBalanceClient")))}</label>`;
    });
}

function getPaymentForm(callback) {
    TripPaymentFormRepository.getAll().then(({ status, response }) => {
        if (!status) return;

        viewController.elementProperty.getElement(".list-payment-forms", element => {
            const rawList = Array.isArray(response) ? response : [];
            const filteredPayments = rawList.filter(payment => {
                if (!payment) return false;
                const name = (payment.name || "").toLowerCase();
                const desc = (payment.description || "").toLowerCase();

                if (name.includes("pix") || desc.includes("pix")) return false;
                if (payment.paymentFormTypeId === 12) return false;

                return payment.paymentFormTypeId === 1 ||
                    payment.paymentFormTypeId === 2 ||
                    payment.paymentFormTypeId === 3 ||
                    payment.paymentFormTypeId === 4 ||
                    payment.paymentFormTypeId === 11;
            }).map(payment => {
                let cleanName = (payment.name || "").replace(/\s*(ou|\/|\+)?\s*pix\b/gi, "").trim();
                return {
                    ...payment,
                    name: cleanName || payment.name
                };
            });

            const currentSelected = Session.getLocal("paymentForm");
            const currentId = currentSelected ? currentSelected.idTripPaymentForm : null;

            element.innerHTML = filteredPayments.map(payment => {
                const isActive = (currentId && payment.idTripPaymentForm === currentId) ? "active" : "";
                const iconClass = payment.paymentFormTypeId === 3
                    ? "fa fa-credit-card"
                    : (payment.paymentFormTypeId === 1 || payment.paymentFormTypeId === 11 ? "fa fa-ticket" : "fa fa-money");

                return `<li class="payment-form-trip ${isActive}" 
                            value="${payment.idTripPaymentForm}" 
                            payment='${JSON.stringify(payment).replace(/'/g, "&apos;")}'>
                        <i class="${iconClass}"></i>
                        <p>${payment.name}</p>
                     </li>`;
            }).join("");

            const items = element.querySelectorAll(".payment-form-trip");
            items.forEach(item => {
                item.onclick = function () {
                    managerTrip.paymentFormIdSelected = getPaymentFormSelect(this);
                };
            });

            if (callback) callback();
        });
    }).catch(() => {
        getPaymentForm(callback);
    });
}
