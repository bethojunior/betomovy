document.addEventListener("DOMContentLoaded", function () {
    const scheduleCorporateRoute = JSON.parse(atob(sessionStorage.getItem("scheduleCorporateRoute")));

    document.querySelector("#scheduleRoute").value = scheduleCorporateRoute.schedule;
    document.querySelector("#titleRoute").value = scheduleCorporateRoute.title;
    document.querySelector("#vacanciesRoute").value = scheduleCorporateRoute.vacancies;

    scheduleCorporateRoute.days.map(item => {
        document.querySelector(`.weekdays-option[value='${item.day}']`).checked = true;
    });

    document.querySelector("#formSchedule").addEventListener("submit", function (event) {
        event.preventDefault();

        const data = {
            "schedule": document.querySelector("#scheduleRoute").value,
            "title": document.querySelector("#titleRoute").value,
            "vacancies": parseInt(document.querySelector("#vacanciesRoute").value),
            "days": []
        };

        document.querySelectorAll(".weekdays-option:checked").forEach(element => {
            data.days.push({day: parseInt(element.value)})
        });

        if (data.days.length === 0)
            return SwalCustom.messageDialog("", "Selecione pelo menos um dia da semana");

        const element = document.querySelector("#btnAddSchedule");

        element.disabled = true;
        ScheduleCorporateRouteController.edit(scheduleCorporateRoute.id, data)
            .then(({message, status}) => {
                SwalCustom.messageDialog("", message, () => {
                    if (status) {
                        sessionStorage.clear();
                        location.href = "/corporateroute/"
                    }
                }, status ? "success" : "info");
            })
            .finally(() => {
                element.disabled = false;
            });

    });
});