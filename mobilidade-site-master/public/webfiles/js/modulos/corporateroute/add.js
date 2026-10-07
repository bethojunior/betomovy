document.addEventListener("DOMContentLoaded", function () {
    const user = Session.get("user");
    CorporateRouteController.all(user.company_worker.companyId).then(({response}) => {
        document.querySelector("#corporateRouteSelect").innerHTML += response.map(item => {
            return `<option value="${item.id}">${item.route.name}</option>`;
        }).join("");
        $('select').material_select();
    });

    document.querySelector("#formSchedule").addEventListener("submit", function (event) {
        event.preventDefault();

        const data = {
            "schedule": document.querySelector("#scheduleRoute").value,
            "title": document.querySelector("#titleRoute").value,
            "vacancies": parseInt(document.querySelector("#vacanciesRoute").value),
            "corporateRouteId": parseInt(document.querySelector("#corporateRouteSelect").value),
            "days": []
        };

        document.querySelectorAll(".weekdays-option:checked").forEach(element => {
            data.days.push({day: parseInt(element.value)})
        });

        if (data.days.length === 0)
            return SwalCustom.messageDialog("", "Selecione pelo menos um dia da semana");

        const element = document.querySelector("#btnAddSchedule");

        element.disabled = true;
        ScheduleCorporateRouteController.add(data)
            .then(({message, status}) => {
                SwalCustom.messageDialog("", message, () => {
                    if (status) {
                        location.href = "/corporateroute/"
                    }
                }, status ? "success" : "info");
            })
            .finally(() => {
                element.disabled = false;
            });

    });
});