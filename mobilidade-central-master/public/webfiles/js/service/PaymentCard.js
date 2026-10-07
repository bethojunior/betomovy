class PaymentCard {

    constructor() {
        const url = `https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js`;

        const nameComponent = 'mercadopago';

        new ElementProperty().getElement("." + nameComponent, element => {
            element.remove();
        });

        const script = document.createElement('script');

        script.setAttribute('src', url);

        script.setAttribute('class', nameComponent);

        script.async = true;

        script.defer = true;

        document.body.appendChild(script);

        script.addEventListener('load', () => {
            if (!Array.isArray(Session.getLocal("KEY_MERCADOPAGO")))
                Mercadopago.setPublishableKey(Session.getLocal("KEY_MERCADOPAGO"));
        });
    }

    addCard() {
        viewController.nameView = "add-card";

        const css = ['card/add'];
        const views = [
            'card/add',
            'preload/index'
        ];
        const js = [
            'modulos/paymentform/add',
            'controllers/CustomerCardController'
        ];


        css.map(item => {
            Route.importStyleByName(item);
        });

        views.map((view) => {
            const nameComponent = view.replace("/", "-");

            if (document.getElementsByClassName(`view-${nameComponent}`).length > 0) {
                viewController.elementProperty.getElement(`.view-${nameComponent}`, element => {
                    element.style.display = "";
                });
                return;
            }

            $("#containerViews").append(`<div id="includeContainer${numberViews}" class="view-${nameComponent} views-dynamic"></div>`);

            renderView(view, numberViews);
            numberViews++;
        });

        Route.waitView().then(() => {
            js.map(item => {
                Route.importScriptByName(item);
            });
        });
    }

    updateToken() {
        const url = `https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js`;

        const nameComponent = 'mercadopago';


        new ElementProperty().getElement("." + nameComponent, element => {
            element.remove();
        });

        if (document.getElementsByClassName(nameComponent).length > 0)
            return;

        const script = document.createElement('script');

        script.setAttribute('src', url);

        script.setAttribute('class', nameComponent);

        script.async = true;

        script.defer = true;

        document.body.appendChild(script);

        script.addEventListener('load', () => {
            if (!Array.isArray(Session.getLocal("KEY_MERCADOPAGO")))
                Mercadopago.setPublishableKey(Session.getLocal("KEY_MERCADOPAGO"));
        });
    }

    createToken(card,callback){
        const form = document.createElement("form");
        form.setAttribute("method","POST");
        form.innerHTML = `
            <select data-checkout='cardId'>
                <option value="${card.mpCardId}"
                        first_six_digits="${card.mpFirstSixDigits}"
                            security_code_length=${card.mpSecurityCodeLength} selected>
                                ${card.mpPaymentMethodName} terminado com ${card.mpLastFourDigits}
                    </option>
            </select>
            <input type="text" value="${card.cvv}"  data-checkout="securityCode" hidden/>`;

        Mercadopago.createToken(form, callback);
    }


}