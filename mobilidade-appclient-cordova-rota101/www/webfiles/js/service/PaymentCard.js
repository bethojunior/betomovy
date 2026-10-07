class PaymentCard {

    constructor() {
        this.mp = null;

        const nameComponent = 'mercadopago';

        new ElementProperty().getElement("." + nameComponent, element => {
            element.remove();
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

        layoutBuild(views, js, css);
    }

    updateToken() {

    }

    createToken(card, callback) {
        if (ConfigGeneral().get("disable_mercado_pago_app") != true) {
            const element = document.querySelector("#generateTokenCard");
            if (element)
                element.remove();

            if (device.platform === "iOS") {
                const page = cordova.InAppBrowser.open(`${environment.hosts.hostSite}app/createcardtoken?q=${btoa(JSON.stringify({
                    key: Session.get('KEY_MERCADOPAGO'),
                    card
                }))}`, '_blank', 'toolbar=no');

                page.addEventListener('loadstart', (event) => {
                    if (event.url.split("#").length > 1) {
                        const value = JSON.parse(atob(event.url.split("#")[1]));
                        callback(value);
                        page.close();
                    }
                });
            }else{
                const iframeElement = document.createElement("iframe");
                iframeElement.setAttribute("src", `${environment.hosts.hostSite}app/createcardtoken?q=${btoa(JSON.stringify({
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
                    }, 1500);
                };
                document.body.appendChild(iframeElement);
            }
        } else {
            callback({id: new Date().getTime()})
        }
    }


}
