const managerCouponTrip = {
    couponSelected: null,
    couponCurrent: null,
};

function showCouponActive(event) {
    const paymentForm = Session.get("paymentForm");
    if(paymentForm.length === 0)
        return SwalCustom.messageDialog(getTextTranslate("home", "message-select-payment-form"));
    managerCouponTrip.couponCurrent = null;

    event.stopPropagation();

    Route.startClassesInComponent([{component: ".apply-cupom-view", class: "active"}], () => {
        viewController.elementProperty.removeClass(".apply-cupom-view", "active");
        document.querySelector("#btnApplyCouponTrip").classList.remove("active");
        document.querySelector("#applyCoupon").innerHTML = '';
    });

    viewController.elementProperty.addEventInElement(".close-apply-coupon", "onclick",
        () => Route.backPage());

    createListCoupon(this);

}

function createListCoupon(elementContainer) {
    viewController.elementProperty.getElement("#applyCoupon", element => {
        DiscountCouponController.findActivated().then(({status, data}) => {
            element.innerHTML = data.map(coupon => {
                const price = parseFloat(elementContainer.getAttribute("price"));

                let classNameItem = "";

                if (parseFloat(coupon.fromValue) > price)
                    classNameItem = "disabled";

                if (parseFloat(coupon.limitedTo) < price)
                    classNameItem = "disabled";

                let label = `Válido de valores acima de ${coupon.currency}${coupon.fromValue}`;

                if (coupon.limitedTo != null)
                    label = `Válido para valores de ${coupon.currency}${coupon.fromValue} até ${coupon.currency}${coupon.limitedTo}`;

                return ` <li coupon='${JSON.stringify(coupon)}' class="item-type-coupon ${classNameItem}" value="${coupon.id}">
                            <input type="radio" name="couponSelected" value="${coupon.id}"/>
                            <div>
                                <img src="webfiles/img/svg/coupon.svg" />
                                <span>${coupon.code}</span>
                                <h4>
                                    <span>${coupon.currency}</span>
                                    ${Mask.maskMoney(calculateDiscountByCoupon(parseFloat(elementContainer.getAttribute("price")),coupon))}
                                 </h4>
                            </div>
                            <label>${label}</label>
                            <label>Valor do cupom: ${coupon.valueType} ${coupon.value}</label>
                            <label>Valido para corridas em: ${coupon.tripPaymentForm || "Todos"}</label>
                            <footer>
                                <i class="material-icons">access_time</i>
                                <span>Expira em ${new Date(coupon.dateEnd).toLocaleDateString()}</span>
                            </footer>
                        </li>`
            }).join("");

            if (managerCouponTrip.couponSelected != null) {
                document.querySelector(`input[type='radio'][name='couponSelected'][value='${managerCouponTrip.couponSelected.id}']`).checked = true;
                let item = document.querySelector(`.item-type-coupon[value='${managerCouponTrip.couponSelected.id}']`);
                item.classList.add("active");
                document.querySelector("#btnApplyCouponTrip").classList.add("active");
            }

            viewController.elementProperty.addEventInElement(".item-type-coupon", "onclick", function () {
                viewController.elementProperty.removeClass(".item-type-coupon", "active");
                this.classList.add("active");
                document.querySelector("#btnApplyCouponTrip").classList.add("active");
                managerCouponTrip.couponCurrent = JSON.parse(this.getAttribute("coupon"));
                document.querySelector(`input[type='radio'][name='couponSelected'][value='${managerCouponTrip.couponCurrent.id}']`).checked = true;
            });

            viewController.elementProperty.addEventInElement("couponSelected", "onclick", function () {
                viewController.elementProperty.removeClass(".item-type-coupon", "active");
                let item = document.querySelector(`.item-type-coupon[value='${this.getAttribute("value")}']`);
                item.classList.add("active");
                document.querySelector("#btnApplyCouponTrip").classList.add("active");
                managerCouponTrip.couponCurrent = JSON.parse(item.getAttribute("coupon"));
            });

            viewController.elementProperty.addEventInElement("#btnApplyCouponTrip", "onclick", function () {
                const price = parseFloat(elementContainer.getAttribute("price"));
                const paymentForm = Session.get("paymentForm");

                if(managerCouponTrip.couponCurrent.tripPaymentForm !== null)
                    if(paymentForm.name !== managerCouponTrip.couponCurrent.tripPaymentForm) {
                        return SwalCustom.messageDialog(
                            getTextTranslate("coupon", "message-validate-type-payment-form"),
                            getTextTranslate("coupon", "title-message-validate-type-payment-form")
                        );
                    }

                managerCouponTrip.couponSelected = managerCouponTrip.couponCurrent;

                elementContainer.innerHTML = `<img src="webfiles/img/svg/coupon.svg" />
                                              <span><span>${managerCouponTrip.couponCurrent.currency} </span>${
                    Mask.maskMoney(calculateDiscount(price))
                }</span>`;

                elementContainer.classList.add("active");

                document.querySelector(".trip-type.active").classList.add("remove-price-old");
                Route.backPage();
            });
        });
    });
}


function calculateDiscountByCoupon(price,coupon) {
    let discount = 0;
    if (coupon.valueType === "%") {
        discount = (price * (parseFloat(coupon.value) / 100));
        if (discount > parseFloat(coupon.maxDiscountValue))
            discount = parseFloat(coupon.maxDiscountValue);
    } else {
        discount = coupon.value
    }

    if (discount >= parseFloat(coupon.limitedTo))
        discount = parseFloat(coupon.limitedTo);

    let newValue = price - discount;

    if (newValue <= 0)
        return 0;

    return newValue;
}


function calculateDiscount(price) {
    let discount = 0;
    if (managerCouponTrip.couponSelected.valueType === "%") {
        discount = (price * (parseFloat(managerCouponTrip.couponSelected.value) / 100));
        if (discount > parseFloat(managerCouponTrip.couponSelected.maxDiscountValue))
            discount = parseFloat(managerCouponTrip.couponSelected.maxDiscountValue);
    } else {
        discount = managerCouponTrip.couponCurrent.value
    }

    if (discount >= parseFloat(managerCouponTrip.couponSelected.limitedTo))
        discount = parseFloat(managerCouponTrip.couponSelected.limitedTo);

    let newValue = price - discount;

    if (newValue <= 0)
        return 0;

    return newValue;
}

function clearCouponApply() {
    managerCouponTrip.couponCurrent = null;
    managerCouponTrip.couponSelected = null;

    viewController.elementProperty.removeClass(".trip-type", "remove-price-old");

    viewController.elementProperty.getElement(".show-coupon-active", element => {
        element.classList.remove("active");

        element.innerHTML = `<img src="webfiles/img/svg/coupon.svg" />
                            <span>Veja Cupom</span>`;
    });
}
