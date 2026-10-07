document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#inputOrderMinPrice").value = Mask.maskMoney(parseFloat(document.querySelector("#inputOrderMinPrice").value));
    Mask.setMoneyField(".mask-money-input");

    elementProperty.addEventInElement(".checked-day-week", "onchange", function () {
        const checked = this.checked;
        const day = this.getAttribute("value");

        const start = document.querySelector(`input[name='day[${day}][hourStart]']`);
        const end = document.querySelector(`input[name='day[${day}][hourStop]']`);

        start.readOnly = !checked;
        end.readOnly = !checked;
        start.required = checked;
        end.required = checked;

        if (!checked) {
            start.valueAsDate = null;
            end.valueAsDate = null;
        }
    });

    elementProperty.addEventInElement(".change-date-start", "onchange", function () {
        const day = this.getAttribute("day");
        const end = document.querySelector(`input[name='day[${day}][hourStop]']`);

        // if (this.value) end.min = this.value;
    });

    elementProperty.addEventInElement("#formOrderMinPrice", "onsubmit", function (event) {
        event.preventDefault();
        document.querySelector("#inputOrderMinPrice").value = Mask.removeMaskMoney(document.querySelector("#inputOrderMinPrice").value);
        this.submit();
    })
});
