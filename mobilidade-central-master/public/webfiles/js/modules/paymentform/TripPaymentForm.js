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
        elementProperty.addClass(".container-cards", "active");

        // Busca cartões atualizados do servidor antes de renderizar
        const fetchCards = (typeof CustomerCardController !== "undefined")
            ? new CustomerCardController().get()
            : Promise.resolve({ status: false });

        fetchCards.then(res => {
            if (res && res.status && Array.isArray(res.data)) {
                Session.setLocal("cards", res.data);
            }
            refreshCardsModalList().then(bindCardSelectEvents);
        }).catch(() => {
            refreshCardsModalList().then(bindCardSelectEvents);
        });
    };

    function bindCardSelectEvents() {
        const listItems = document.querySelectorAll("#listCardPaymentModal .cards-list-select");
        listItems.forEach(item => {
            item.onclick = function (e) {
                e.stopPropagation();
                elementProperty.removeClass(".container-cards", "active");
                try {
                    const rawVal = this.getAttribute("value");
                    const parsedCard = JSON.parse(rawVal);
                    if (callbackSelectCard !== null) {
                        callbackSelectCard(parsedCard);
                    }
                } catch (err) {
                    console.error("Erro ao selecionar cartão:", err);
                }
            };
        });
    }

    function refreshCardsModalList() {
        return new Promise(resolve => {
            const cards = Session.getLocal("cards") || [];
            const currentSelected = Session.getLocal("cardSelected") || {};
            const currentId = currentSelected.idCard || currentSelected.cardId || currentSelected.id || currentSelected.mpCardId;

            elementProperty.getElement("#listCardPaymentModal", element => {
                if (!cards.length) {
                    element.innerHTML = `<li class="cards-empty-state">
                        <div class="cards-empty-icon-wrapper">
                            <i class="material-icons">credit_card</i>
                        </div>
                        <h4 class="cards-empty-title">Nenhum cartão cadastrado</h4>
                        <p class="cards-empty-desc">Cadastre um cartão de crédito para pagar suas viagens de forma rápida e segura.</p>
                    </li>`;
                    resolve();
                    return;
                }

                element.innerHTML = cards.map(card => {
                    const thisId = card.idCard || card.cardId || card.id || card.mpCardId;
                    const isSelected = currentId && thisId && String(currentId) === String(thisId);
                    const last4 = card.last4 || card.last_four || card.lastFourDigits || card.mpLastFourDigits || (card.number ? String(card.number).slice(-4) : "••••");
                    const rawBrand = (card.brand || card.paymentMethodName || card.mpPaymentMethodName || card.mpPaymentMethodId || "Cartão").toLowerCase();
                    const brandDisplay = rawBrand.charAt(0).toUpperCase() + rawBrand.slice(1);
                    const exp = (card.expirationMonth && card.expirationYear) ? `${String(card.expirationMonth).padStart(2, '0')}/${String(card.expirationYear).slice(-2)}` : "";
                    const safe = JSON.stringify(card).replace(/'/g, "&apos;");

                    let brandBg = "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)";
                    if (rawBrand.includes("visa")) {
                        brandBg = "linear-gradient(135deg, #1a1f71 0%, #0d1242 100%)";
                    } else if (rawBrand.includes("master")) {
                        brandBg = "linear-gradient(135deg, #eb001b 0%, #f79e1b 100%)";
                    } else if (rawBrand.includes("elo")) {
                        brandBg = "linear-gradient(135deg, #00a4e8 0%, #000000 100%)";
                    } else if (rawBrand.includes("hiper")) {
                        brandBg = "linear-gradient(135deg, #b20000 0%, #660000 100%)";
                    }

                    return `<li class="cards-list-select ${isSelected ? 'active' : ''}" value='${safe}'>
                        <div style="display: flex; align-items: center; gap: 14px; min-width: 0;">
                            <div style="width: 48px; height: 32px; border-radius: 8px; background: ${brandBg}; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.18);">
                                ${brandDisplay.slice(0, 8)}
                            </div>
                            <div style="display: flex; flex-direction: column; min-width: 0; text-align: left;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-size: 14px; font-weight: 700; color: #0f172a; letter-spacing: 0.5px;">•••• ${last4}</span>
                                    ${isSelected ? '<span style="display: inline-block; padding: 2px 8px; font-size: 10px; font-weight: 700; background: #e0f2fe; color: #0284c7; border-radius: 10px;">Atual</span>' : ''}
                                </div>
                                <span style="font-size: 12px; color: #64748b; margin-top: 2px;">${brandDisplay}${exp ? ` • Validade ${exp}` : ''}</span>
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; flex-shrink: 0; margin-left: 12px;">
                            ${isSelected 
                                ? '<div style="width: 28px; height: 28px; border-radius: 50%; background: #0284c7; color: #ffffff; display: flex; align-items: center; justify-content: center;"><i class="material-icons" style="font-size: 18px;">check</i></div>'
                                : '<div style="width: 28px; height: 28px; border-radius: 50%; border: 2px solid #cbd5e1; background: #ffffff;"></div>'
                            }
                        </div>
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
                element.innerHTML = `<div onclick="choiceCard()" style="cursor: pointer; display: flex; align-items: center; gap: 8px;">
                    <i class="material-icons">credit_card</i>
                    <p style="margin: 0; font-weight: 500;">Selecionar cartão</p>
                </div>`;
            });
            return;
        }

        Session.setLocal("cardSelected", card);
        Session.set("cardSelected", card);

        const last4 = card.last4 || card.last_four || card.lastFourDigits || card.mpLastFourDigits || (card.number ? String(card.number).slice(-4) : "••••");
        const brand = (card.brand || card.paymentMethodName || card.mpPaymentMethodName || "Cartão").toUpperCase();

        viewController.elementProperty.getElement("#cardSelectedPayTrip", element => {
            element.style.display = "flex";
            element.innerHTML = `<div onclick="choiceCard()" style="cursor: pointer; display: flex; align-items: center; gap: 8px;">
                <i class="material-icons" style="color: #2563eb;">credit_card</i>
                <p style="margin: 0; font-weight: 600; color: #1e293b;">${brand} •••• ${last4}</p>
            </div>`;
        });

        const paymentCard = new PaymentCard();

        paymentCard.createToken(card, function (status, response) {
            const token = (response && response.id) || card.cardId || card.mpCardId || card.idCard || card.id || null;
            const finalCardId = card.idCard || card.cardId || card.id || card.mpCardId || token;

            Session.set("tokenCard", {
                token: token,
                cardId: finalCardId
            });
            Session.setLocal("tokenCard", {
                token: token,
                cardId: finalCardId
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

            const isCard = typeof isPaymentFormCard === "function"
                ? isPaymentFormCard(paymentForm)
                : (parseInt(paymentForm.paymentFormTypeId, 10) === PAYMENT_CARD_CREDIT
                   || parseInt(paymentForm.idTripPaymentForm, 10) === 3
                   || parseInt(paymentForm.idTripPaymentForm, 10) === 18);

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

    if (!card) {
        Session.delete("cardSelected");
        return;
    }

    const cardId = card.idCard || card.cardId || card.id || card.mpCardId;
    if (!cardId) {
        Session.delete("cardSelected");
        return;
    }

    if (cards.length > 0 && cards.filter(cardActive => (cardActive.idCard || cardActive.cardId || cardActive.id || cardActive.mpCardId) === cardId).length === 0) {
        Session.delete("cardSelected");
        viewController.elementProperty.getElement("#cardSelectedClient", element => {
            element.innerHTML = "----";
        });
    }
}

function showDataPaymentForm(idTripPaymentForm) {
    if (typeof isPaymentFormCard === "function" && isPaymentFormCard(idTripPaymentForm)) {
        getCardSelectedPayTrip(Session.getLocal("cardSelected"));
        return;
    }

    switch (parseInt(idTripPaymentForm, 10)) {
        case 1:
            showBalanceVoucherClient();
            break;
        case 3:
        case 18:
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
