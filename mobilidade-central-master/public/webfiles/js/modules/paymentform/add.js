(function () {
    let initialized = false;
    const STRIPE_PUB_KEY = "pk_live_51URZgX2SfI6K7NRjVgiptTfgHl0MLTCUwIToULhdq5hTztOcJTVRjO4ML4u2zhWgVzOcSxp5xE9IBTuuZ7agpEx200Mgqd1yyj";

    window.initAddCardForm = function initAddCardForm() {
        const isStripe = typeof PaymentCard !== "undefined" && PaymentCard.isStripeAcquirer();
        setupFieldsVisibility(isStripe);

        if (initialized) {
            document.querySelector(".container-add-card")?.classList.add("active");
            if (isStripe) initStripeElements();
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

        if (isStripe) {
            initStripeElements();
        }

        elementProperty.addEventInElement("#backPaymentForm", "onclick", function () {
            elementProperty.removeClass(".container-add-card", "active");
        });

        elementProperty.addEventInElement("#addCard", "onsubmit", function (event) {
            event.preventDefault();

            const cardholderName = (document.getElementById("cardholderName")?.value || "").trim();
            if (cardholderName.length < 2) {
                SwalCustom.messageDialog("", "Informe o nome completo no cartão", undefined, "warning");
                return false;
            }

            const rawCpf = (document.getElementById("documentCard")?.value || "").replace(/\D/g, "");
            if (!ValidateForm.validateCpf(rawCpf)) {
                SwalCustom.messageDialog("", "CPF inválido", undefined, "warning");
                return false;
            }

            document.getElementById("docNumber").value = rawCpf;

            // ════════ FLUXO STRIPE SEGURO (Stripe.js / Elements) ════════
            if (PaymentCard.isStripeAcquirer() || !PaymentCard.isMercadoPagoAcquirer()) {
                if (window._stripeInstance && window._stripeCardElementInstance) {
                    preload(true);
                    window._stripeInstance.createPaymentMethod({
                        type: "card",
                        card: window._stripeCardElementInstance,
                        billing_details: {
                            name: cardholderName,
                        }
                    }).then((result) => {
                        if (result.error) {
                            preload(false);
                            const msg = result.error.message || "Dados do cartão incorretos na Stripe.";
                            SwalCustom.messageDialog("", msg, undefined, "warning");
                            return;
                        }

                        const pm = result.paymentMethod;
                        const last4 = pm.card?.last4 || "0000";
                        const brand = pm.card?.brand || "visa";
                        const expM = String(pm.card?.exp_month || 12).padStart(2, "0");
                        const expY = String(pm.card?.exp_year || 2028);

                        const payload = {
                            token: pm.id,
                            stripeToken: pm.id,
                            cardholderName: cardholderName,
                            docNumber: rawCpf,
                            firstSixDigits: "424200",
                            lastFourDigits: last4,
                            paymentMethodName: brand,
                            securityCodeLength: 3,
                            expirationMonth: expM,
                            expirationYear: expY,
                            cardNumber: "424200000000" + last4,
                            cvv: "000"
                        };

                        customerCardController.insert(payload).then((res) => {
                            preload(false);
                            const ok = res && (res.status === true || res.status === 200 || res.status === 201);
                            if (!ok) {
                                const msg = res?.message || (res?.response && (typeof res.response === "string" ? res.response : Object.values(res.response).flat().join("\n"))) || "Não foi possível adicionar o cartão !";
                                SwalCustom.messageDialog("", msg, undefined, "warning");
                                return;
                            }
                            onCardSaved();
                        }).catch((err) => {
                            preload(false);
                            const msg = (typeof err === "string" ? err : err?.message) || (err?.response && (typeof err.response === "string" ? err.response : Object.values(err.response).flat().join("\n"))) || "Não foi possível adicionar o cartão !";
                            SwalCustom.messageDialog("", msg, undefined, "warning");
                        });
                    }).catch((err) => {
                        preload(false);
                        SwalCustom.messageDialog("", "Erro ao comunicar com a Stripe: " + (err?.message || err), undefined, "warning");
                    });
                    return false;
                }

                // Fallback direto se Elements não montou
                const cardNumber = document.getElementById("cardNumber").value;
                const cleanNumber = cardNumber.split(" ").join("");
                if (!detectCardType(cleanNumber)) {
                    SwalCustom.messageDialog("", "Número do cartão inválido !", undefined, "warning");
                    return false;
                }
                if (!validateDate()) {
                    SwalCustom.messageDialog("", "Data de vencimento inválida !");
                    return false;
                }
                if (document.getElementById("securityCode").value.length === 0) {
                    SwalCustom.messageDialog("", "CVV inválido");
                    return false;
                }
                preload(true);
                saveCardStripe();
                return false;
            }

            // ════════ FLUXO MERCADO PAGO ════════
            const cardNumber = document.getElementById("cardNumber").value;
            const cleanNumber = cardNumber.split(" ").join("");

            if (existCard(cleanNumber)) {
                SwalCustom.messageDialog("", "Cartão já está cadastrado", undefined, "warning");
                return false;
            }

            if (!detectCardType(cleanNumber)) {
                SwalCustom.messageDialog("", "Número do cartão inválido !", undefined, "warning");
                return false;
            }

            if (!validateDate()) {
                SwalCustom.messageDialog("", "Data de vencimento inválida !");
                return false;
            }

            if (document.getElementById("securityCode").value.length === 0) {
                SwalCustom.messageDialog("", "CVV inválido");
                return false;
            }

            preload(true);
            Mercadopago.createToken(this, sdkResponseHandler);
            return false;
        });

        function setupFieldsVisibility(isStripe) {
            const stripeBox = document.getElementById("stripeCardContainer");
            const legacyBox = document.getElementById("legacyCardFields");
            if (stripeBox) stripeBox.style.display = isStripe ? "block" : "none";
            if (legacyBox) legacyBox.style.display = isStripe ? "none" : "block";
        }

        function initStripeElements() {
            if (typeof Stripe === "undefined") {
                const s = document.createElement("script");
                s.src = "https://js.stripe.com/v3/";
                s.onload = () => initStripeElements();
                document.head.appendChild(s);
                return;
            }

            if (!window._stripeInstance) {
                window._stripeInstance = Stripe(STRIPE_PUB_KEY);
            }

            const container = document.getElementById("stripeCardElement");
            if (container && !window._stripeCardElementInstance) {
                const elements = window._stripeInstance.elements({ locale: "pt-BR" });
                window._stripeCardElementInstance = elements.create("card", {
                    style: {
                        base: {
                            fontSize: "15px",
                            color: "#1e293b",
                            fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
                            "::placeholder": { color: "#94a3b8" }
                        },
                        invalid: { color: "#dc2626" }
                    }
                });
                window._stripeCardElementInstance.mount("#stripeCardElement");
                window._stripeCardElementInstance.on("change", (e) => {
                    const errEl = document.getElementById("stripeCardErrors");
                    if (errEl) errEl.textContent = e.error ? e.error.message : "";
                });
            }
        }

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
            const cleanNumber = (document.getElementById("cardNumber")?.value || "").split(" ").join("");
            return Object.assign({
                cardNumber: cleanNumber,
                cvv: document.getElementById("securityCode")?.value || "000",
                expirationMonth: document.getElementById("cardExpirationMonth")?.value || "12",
                expirationYear: document.getElementById("cardExpirationYear")?.value || "2028",
                cardholderName: document.getElementById("cardholderName")?.value || "",
                docNumber: document.getElementById("docNumber")?.value || "",
                firstSixDigits: cleanNumber.substr(0, 6) || "424200",
                paymentMethodName: detectCardType(cleanNumber) || "visa",
                securityCodeLength: (document.getElementById("securityCode")?.value || "").length || 3,
                lastFourDigits: cleanNumber.substr(-4) || "0000"
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
                const msg = (typeof err === "string" ? err : err?.message) || (err?.response && (typeof err.response === "string" ? err.response : Object.values(err.response).flat().join("\n"))) || "Não foi possível adicionar o cartão !";
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
            if (window._stripeCardElementInstance) {
                try { window._stripeCardElementInstance.clear(); } catch(e) {}
            }
            paymentCard.updateToken();
        }

        function errorAddCreditCard(error) {
            const causes = (error && error.cause) || [];
            causes.forEach(cause => {
                if (cause.code === "E301") {
                    SwalCustom.messageDialog("", "Número do cartão inválido !", undefined, "warning");
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
        if (isStripe) initStripeElements();
    };

    document.addEventListener("DOMContentLoaded", function () {
        if (document.getElementById("addCard")) {
            window.initAddCardForm();
            document.querySelector(".container-add-card")?.classList.remove("active");
        }
    });
})();
