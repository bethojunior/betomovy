viewController.setObserver("buy-voucher",function(){
    const elementProperty = new ElementProperty();
    const customerController = new CustomerController();
    const userLogged = Session.get("user");
    const { lat, lng } = Session.get("location");

    function mountListVoucher() {
        preload(true);
        VoucherPurchaseController.getAllVoucher(lat, lng).then((response) => {
            const { data } = response;

            viewController.elementProperty.getElement(
                ".list-voucher",
                element => {
                    element.innerHTML = data.map(item => {
                        return `
                        <li class="type-voucher" value='{"amount":${item.amount}, "value":${item.value}}'>
                            <div>
                                <h4>${CityConfig.getTypeCoin()}${Mask.maskMoney(parseFloat(item.amount))}</h4>
                                <div>
                                    <span>-${parseInt(item.percentage)}%</span>
                                    <p>${getTextTranslate('buy-voucher','description-item')}</p>
                                    <p><span>${CityConfig.getTypeCoin()}${Mask.maskMoney(parseFloat(item.amount))}</span><span>R$${Mask.maskMoney(parseFloat(item.value))}</span></p>
                                </div>
                            </div>
                        </li>
                        `;
                    }).join('');
                    preload(false);

                    elementProperty.addEventInElement(".type-voucher","onclick",function(){
                        Session.set("typeVoucher",JSON.parse(this.getAttribute("value")));
                        Route.redirectDynamic("Payment","Pay");
                    });
                }
            );
        });
    }

    mountListVoucher();

    function updateBalance() {
        customerController.find(userLogged.idUser).then(({message, status, data}) => {
            if (!status) {
                updateBalance();
                return;
            }

            elementProperty.getElement("#currentBalanceClient", element => {
                element.innerHTML = `${CityConfig.getTypeCoin()}${Mask.maskMoney(parseFloat(data.tripBalance))}`;
            });
        }).catch(updateBalance);
    }

    elementProperty.addEventInElement(".go-back","onclick",function(){
        Route.backPage();
    });

    updateBalance();
});
