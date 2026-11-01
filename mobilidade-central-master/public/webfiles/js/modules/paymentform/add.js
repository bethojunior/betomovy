(function () {
    let initialized = false;

    window.initAddCardForm = function initAddCardForm() {
        if (initialized) {
            document.querySelector(".container-add-card")?.classList.add("active");
            return;
        }
        initialized = true;

        const elementProperty = new ElementProperty();
        const paymentCard = new PaymentCard();
        paymentCard.updateToken();
        const customerCardController = new CustomerCardController();

        window.addCardManager = { callback: undefined };

        Mask.setMaskCpf("#documentCard");
        Mask.setMonthYear("#dateMonthYear");
        Mask.setCreditCard("#cardNumber");

        elementProperty.addEventInElement("#backPaymentForm", "onclick", function () {
            elementProperty.removeClass(".container-add-card", "active");
        });

        elementProperty.addEventInElement("#addCard", "onsubmit", function (event) {
            event.preventDefault();

            const cardNumber = document.getElementById("cardNumber").value;
            const cleanNumber = cardNumber.split(" ").join("");

            if (existCard(cleanNumber)) {
                SwalCustom.messageDialog("", "Cartão já está cadastrado", undefined, "warning");
                return;
            }

            if (!ValidateForm.validateCpf(document.getElementById("documentCard").value.replace(/\D/g, ""))) {
                SwalCustom.messageDialog("", "Cpf inválido", undefined, "warning");
                return false;
            }

            if (!detectCardType(cleanNumber)) {
                SwalCustom.messageDialog("", "Numero do cartão invalido !", undefined, "warning");
                return false;
            }

            if (!validateDate()) {
                SwalCustom.messageDialog("", "Data de vencimento do cartão é invalida !");
                return false;
            }

            if (document.getElementById("securityCode").value.length === 0) {
                SwalCustom.messageDialog("", "CVV inválido");
                return false;
            }

            document.getElementById("docNumber").value =
                document.getElementById("documentCard").value.replace(/\D/g, "");

            preload(true);

            if (PaymentCard.isStripeAcquirer() || !PaymentCard.isMercadoPagoAcquirer()) {
                saveCardStripe(cleanNumber);
                return false;
            }

            Mercadopago.createToken(this, sdkResponseHandler);
            return false;
        });

        function existCard(number) {
            const cards = Session.getLocal("cards") || [];
            return cards.filter(card => String(card.number || "").replace(/\s/g, "") === number).length > 0;
        }

        function validateDate() {
            const dueDate = document.getElementById("dateMonthYear").value.split("/");
            const year = parseInt(new Date().getFullYear() / 100, 10);

            if (!dueDate[0] || !dueDate[1]) return false;
            if (dueDate[0].length !== 2 || dueDate[1].length !== 2) return false;

            document.getElementById("cardExpirationMonth").value = dueDate[0];
            document.getElementById("cardExpirationYear").value = year + "" + dueDate[1];
            return true;
        }

        function buildCardPayload(extra) {
            const cleanNumber = document.getElementById("cardNumber").value.split(" ").join("");
            return Object.assign({
                cardNumber: cleanNumber,
                cvv: document.getElementById("securityCode").value,
                expirationMonth: document.getElementById("cardExpirationMonth").value,
                expirationYear: document.getElementById("cardExpirationYear").value,
                cardholderName: document.getElementById("cardholderName").value,
                docNumber: document.getElementById("docNumber").value,
                firstSixDigits: cleanNumber.substr(0, 6),
                paymentMethodName: detectCardType(cleanNumber),
                securityCodeLength: document.getElementById("securityCode").value.length,
                lastFourDigits: cleanNumber.substr(-4)
            }, extra || {});
        }

        function saveCardStripe() {
            customerCardController.insert(buildCardPayload()).then((res) => {
                preload(false);
                const ok = res && (res.status === true || res.status === 200 || res.status === 201);
                if (!ok) {
                    const msg = res?.message || (res?.response && (typeof res.response === 'string' ? res.response : Object.values(res.response).flat().join('\n'))) || "Não foi possível adicionar o cartão !";
                    SwalCustom.messageDialog("", msg, undefined, "warning");
                    return;
                }
                onCardSaved();
            }).catch((err) => {
                preload(false);
                const msg = (typeof err === "string" ? err : err?.message) || "Não foi possível adicionar o cartão !";
                SwalCustom.messageDialog("", msg, undefined, "warning");
            });
        }

        function sdkResponseHandler(status, response) {
            if (status !== 200 && status !== 201) {
                preload(false);
                errorAddCreditCard(response);
                return;
            }

            customerCardController.insert(buildCardPayload({
                mpToken: response.id,
                firstSixDigits: response.first_six_digits,
                securityCodeLength: response.security_code_length,
                lastFourDigits: response.last_four_digits
            })).then(({ status: ok }) => {
                preload(false);
                if (!ok) {
                    SwalCustom.messageDialog("", "Não foi possível adicionar o cartão !", undefined, "warning");
                    return;
                }
                onCardSaved();
            });
        }

        function onCardSaved() {
            SwalCustom.messageDialog("", "Cartão adicionado com sucesso !", function () {
                if (typeof getCards === "function") getCards();
                if (addCardManager.callback !== undefined) addCardManager.callback();
                getCardsClient();
                elementProperty.removeClass(".container-add-card", "active");
                clearForm();
            }, "success");
        }

        function clearForm() {
            ["cardNumber", "securityCode", "docNumber", "cardholderName", "documentCard", "dateMonthYear"].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = "";
            });
            paymentCard.updateToken();
        }

        function errorAddCreditCard(error) {
            const causes = (error && error.cause) || [];
            causes.forEach(cause => {
                if (cause.code === "E301") {
                    SwalCustom.messageDialog("", "Numero do cartão inválido !", undefined, "warning");
                } else if (cause.code === "325" || cause.code === "326") {
                    SwalCustom.messageDialog("", "Data de vencimento inválida !", undefined, "warning");
                } else if (cause.code === "E302") {
                    SwalCustom.messageDialog("", "CVV inválido");
                }
            });
            if (!causes.length) {
                SwalCustom.messageDialog("", "Não foi possível tokenizar o cartão", undefined, "warning");
            }
        }

        function detectCardType(number) {
            const types = {
                visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
                mastercard: /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/,
                amex: /^3[47][0-9]{13}$/
            };
            for (let key in types) {
                if (types[key].test(number)) return key;
            }
            return false;
        }

        function getCardsClient() {
            customerCardController.get().then(({ status, data }) => {
                if (!status) return;
                Session.setLocal("cards", data || []);
            });
        }

        document.querySelector(".container-add-card")?.classList.add("active");
    };

    document.addEventListener("DOMContentLoaded", function () {
        // Pré-inicializa listeners do formulário embutido na home
        if (document.getElementById("addCard")) {
            window.initAddCardForm();
            document.querySelector(".container-add-card")?.classList.remove("active");
        }
    });
})();
