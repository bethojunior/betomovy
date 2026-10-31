class PaymentCard {

    static isStripeAcquirer() {
        const acquirer = Session.getLocal("ACQUIRER") || Session.get("ACQUIRER") || {};
        const name = String(acquirer.name || acquirer.Name || "").toUpperCase();
        const id = parseInt(acquirer.idFinancialIntermediary || acquirer.id || 0, 10);
        return id === 17 || id === 6 || name.includes("STRIPE");
    }

    static isMercadoPagoAcquirer() {
        const acquirer = Session.getLocal("ACQUIRER") || Session.get("ACQUIRER") || {};
        const name = String(acquirer.name || acquirer.Name || "").toUpperCase();
        const id = parseInt(acquirer.idFinancialIntermediary || acquirer.id || 0, 10);
        return id === 1 || name.includes("MERCADO");
    }

    constructor() {
        if (PaymentCard.isMercadoPagoAcquirer()) {
            this.loadMercadoPagoSdk();
        }
    }

    loadMercadoPagoSdk() {
        const nameComponent = "mercadopago";
        new ElementProperty().getElement("." + nameComponent, element => {
            element.remove();
        });

        const script = document.createElement("script");
        script.setAttribute("src", "https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js");
        script.setAttribute("class", nameComponent);
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        script.addEventListener("load", () => {
            const key = Session.getLocal("KEY_MERCADOPAGO");
            if (key && !Array.isArray(key) && typeof Mercadopago !== "undefined") {
                Mercadopago.setPublishableKey(key);
            }
        });
    }

    addCard() {
        viewController.nameView = "add-card";
        const container = document.querySelector(".container-add-card");
        if (container) {
            container.classList.add("active");
        }
        if (typeof window.initAddCardForm === "function") {
            window.initAddCardForm();
        }
    }

    updateToken() {
        if (PaymentCard.isMercadoPagoAcquirer()) {
            this.loadMercadoPagoSdk();
        }
    }

    createToken(card, callback) {
        if (PaymentCard.isStripeAcquirer() || !PaymentCard.isMercadoPagoAcquirer()) {
            const pmId = card.cardId || card.mpCardId || null;
            callback(200, { id: pmId });
            return;
        }

        const form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.innerHTML = `
            <select data-checkout="cardId">
                <option value="${card.mpCardId}"
                        first_six_digits="${card.mpFirstSixDigits || ""}"
                        security_code_length="${card.mpSecurityCodeLength || 3}" selected>
                    ${card.mpPaymentMethodName || "card"} terminado com ${card.mpLastFourDigits || ""}
                </option>
            </select>
            <input type="text" value="${card.cvv || ""}" data-checkout="securityCode" hidden/>`;

        if (typeof Mercadopago === "undefined") {
            callback(400, { cause: [{ code: "SDK" }] });
            return;
        }

        Mercadopago.createToken(form, callback);
    }
}
