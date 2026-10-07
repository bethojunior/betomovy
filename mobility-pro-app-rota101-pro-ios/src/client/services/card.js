
export default class PaymentCard {
  constructor() {
    this.mp = null;

    const nameComponent = 'mercadopago';

    /**new ElementProperty().getElement('.' + nameComponent, element => {
      element.remove();
    });**/
  }

  updateToken() {}

  createToken(card, callback) {
    /**if (ConfigGeneral().get('disable_mercado_pago_app') != true) {
      if (device.platform === 'iOS') {
        const page = cordova.InAppBrowser.open(
          `${HOST_SITE}app/createcardtoken?q=${btoa(
            JSON.stringify({
              key: Session.get('KEY_MERCADOPAGO'),
              card,
            }),
          )}`,
          '_blank',
          'toolbar=no',
        );

        page.addEventListener('loadstart', event => {
          if (event.url.split('#').length > 1) {
            const value = JSON.parse(atob(event.url.split('#')[1]));
            callback(value);
            page.close();
          }
        });
      } else {
        const iframeElement = document.createElement('iframe');
        iframeElement.setAttribute(
          'src',
          `${HOST_SITE}app/createcardtoken?q=${btoa(
            JSON.stringify({
              key: Session.get('KEY_MERCADOPAGO'),
              card,
            }),
          )}`,
        );
        iframeElement.setAttribute('id', 'generateTokenCard');
        iframeElement.style.width = '0px';
        iframeElement.style.height = '0px';
        iframeElement.onload = () => {
          setTimeout(() => {
            try {
              const value = JSON.parse(
                atob(
                  document
                    .querySelector('#generateTokenCard')
                    .contentWindow.document.querySelector('#codeInput').value,
                ),
              );
              callback(value);
            } catch (e) {
              callback(null);
            }
          }, 1500);
        };
        document.body.appendChild(iframeElement);
      }
    } else {*/
      callback({id: new Date().getTime(), card});
  }
}
