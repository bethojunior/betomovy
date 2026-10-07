viewController.setObserver("list-coupon", () => {
    updateListCoupons();

    document.querySelector("#listCouponActive").innerHTML = "";

    viewController.elementProperty.addEventInElement(".go-back-close", "onclick", () => {
        Route.backPage();
    });

    function updateListCoupons() {
        viewController.elementProperty.getElement("#listCouponActive", element => {
            DiscountCouponController.findActivated().then(({status, data}) => {
                element.innerHTML = " " + data.map(coupon => {

                    let label = `Válido de valores acima de ${CityConfig.getTypeCoin()}${coupon.fromValue}`;

                    if (coupon.limitedTo != null)
                        label = `Válido para valores de ${CityConfig.getTypeCoin()}${coupon.fromValue} até ${CityConfig.getTypeCoin()}${coupon.limitedTo}`;

                    return ` <li>
                            <div>
                                <img src="webfiles/img/svg/coupon.svg" />
                                <span>${coupon.code}</span>
                                <h4><span>${coupon.valueType}</span>${coupon.value}</h4>
                            </div>
                            <label>${label}</label>
                            <footer>
                                <i class="material-icons">access_time</i>
                                <span>Expira em ${new Date(coupon.dateEnd).toLocaleDateString()}</span>
                            </footer>
                        </li>`
                }).join(" ")
            });
        });
    }

    viewController.elementProperty.addEventInElement(".floating-icon-coupon", "onclick", () => {
        Route.startClassesInComponent([{component: ".modal-add-coupon", class: "active"}],
            () => {
                viewController.elementProperty.removeClass(".modal-add-coupon", "active");
                viewController.elementProperty.removeClass(".container-get-code", "active");
                document.querySelector("#codeCoupon").value = "";
            });
    });

    viewController.elementProperty.addEventInElement("#closeModalCoupon", "onclick", () => {
        Route.backPage();
    });

    viewController.elementProperty.addEventInElement("#btnApplyCoupon", "onclick", function () {
       const code = document.querySelector("#codeCoupon").value;

        if (code.length === 0)
            return SwalCustom.messageDialog("", "Digite o código promocional");

        const {lat, lng} = Session.get("location");

        this.disabled = true;

        DiscountCouponController.active({code, lat, lng}).then(({status, data, message}) => {
            if (!status)
                return SwalCustom.messageDialog("", message, () => {
                }, "info");

            document.querySelector(`#detailDiscountCoupon`).innerHTML =
                `<span>${data.valueType}</span><span>${checkFormatValue(data.valueType,data.value)}</span>`;

            viewController.elementProperty.addClass(".container-get-code", "active");

            updateListCoupons();
        }).finally(() => {
            this.disabled = false;
        });
    });

    function checkFormatValue(type,text){
        switch (type) {
            case "%":{
                return parseInt(text);
            }
            case "R$":{
                return Mask.maskMoney(parseFloat(text))
            }
            default:{
                return text;
            }
        }
    }
});
