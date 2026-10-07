document.addEventListener("DOMContentLoaded", function () {
    Mask.setMoneyField("#rateInput");

    document.querySelectorAll(".mask-money").forEach(element => {
        element.innerHTML = Mask.maskMoney(parseFloat(element.getAttribute("value")));
    })

    document.querySelector("#addRateForm").onsubmit = function (event) {
        event.preventDefault();
        Preload.show();

        document.querySelector("#rateInput").value = Mask.removeMaskMoney(document.querySelector("#rateInput").value);

        this.submit();
    };
});
