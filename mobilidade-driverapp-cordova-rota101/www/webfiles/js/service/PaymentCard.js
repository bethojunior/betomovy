class PaymentCard {

    constructor(callback = undefined) {
        this.mp = null;

        const nameComponent = 'mercadopago';

        new ElementProperty().getElement("." + nameComponent, element => {
            element.remove();
        });

        if(callback)
            callback();
    }

    addCard() {
        viewController.nameView = "add-card";

        const css = ['card/add'];
        const views = [
            'card/add',
            'preload/index'
        ];
        const js = [
            'controllers/CustomerCardController',
            'modulos/card/add'
        ];

        viewController.nameView = "add-card";

        layoutBuild(views, js, css);
    }

    updateToken() {

    }

    createToken(card, callback) {
        if (ConfigGeneral().get("disable_mercado_pago_app") != true) {
            const element = document.querySelector("#generateTokenCard");
            if (element)
                element.remove();


            const iframeElement = document.createElement("iframe");
            iframeElement.setAttribute("src", `${HOST_SITE}app/createcardtoken?q=${btoa(JSON.stringify({
                key: Session.get('KEY_MERCADOPAGO'),
                card
            }))}`);
            iframeElement.setAttribute("id", "generateTokenCard");
            iframeElement.style.width = "0px";
            iframeElement.style.height = "0px";
            iframeElement.onload = () => {
                setTimeout(() => {
                    try {
                        const value = JSON.parse(atob(document.querySelector("#generateTokenCard").contentWindow.document.querySelector("#codeInput").value));
                        callback(value);
                    } catch (e) {
                        callback(null)
                    }
                }, 2000);
            };
            document.body.appendChild(iframeElement);

        } else {
            callback({id: new Date().getTime()})
        }
    }


}
