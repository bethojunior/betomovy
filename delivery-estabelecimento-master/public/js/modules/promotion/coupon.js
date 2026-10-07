document.addEventListener("DOMContentLoaded", function () {
    Mask.setMoneyField(".mask-money");

    const elementProperty = new ElementProperty();

    elementProperty.addEventInElement("#dateStart", "onchange", function () {
        document.querySelector("#dateEnd").min = this.value;
    });

    elementProperty.addEventInElement("#formAddCoupon", "onsubmit", function (event) {
        event.preventDefault();

        const value = Mask.removeMaskMoney(document.getElementById("value").value);

        if (value === 0)
            return alert("Informe o valor do cupom");

        document.getElementById("value").value = value;

        document.getElementById("fromValue").value = Mask.removeMaskMoney(document.getElementById("fromValue").value);

        $('#addCouponModal').modal('hide')

        event.target.submit();

    });

});
