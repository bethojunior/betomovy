function openScheduledTime() {
    managerSchedule.schedule.date = null;
    managerSchedule.schedule.time = null;

    Route.startClassesInComponent([
        {component: ".container-scheduled-time", class: "active"},
    ], () => {
        viewController.elementProperty.removeClass(".container-scheduled-time", "active");
        Route.backPage();
    }, COMPONENT_CREATE_TRIP);

    viewController.elementProperty.addEventInElement("#btnScheduledTime", "onclick", () => {
        viewController.elementProperty.removeClass(".container-scheduled-time", "active");

        showTypeFreight();
    });

    viewController.elementProperty.addEventInElement("#btnScheduledDatetime", "onclick", () => {
        openScheduledDatetime();
    });
}

const managerSchedule = {
    schedule: {
        date: null,
        time: null
    }
};


function openScheduledDatetime() {

    managerSchedule.schedule.date = null;
    managerSchedule.schedule.time = null;

    viewController.elementProperty.removeClass(".container-scheduled-time", "active");

    viewController.elementProperty.getElement("#inputScheduledDate", element => {
        element.value = new Date().toLocaleDateString();
    });

    viewController.elementProperty.addEventInElement("#inputScheduleTime", "onchange", function () {
        viewController.elementProperty.getElement(".show-value-time", element => {
            element.innerHTML = this.value;

            managerSchedule.schedule.time = this.value;
        });
    });

    viewController.elementProperty.getElement(".show-value-time", element => {
        let date = new Date();

        date.setMinutes(date.getMinutes() + 60);

        managerSchedule.schedule.time = date.toLocaleTimeString().substr(0, 5);

        element.innerHTML = date.toLocaleTimeString().substr(0, 5);
    });

    viewController.elementProperty.getElement("#inputScheduleTime", element => {
        let date = new Date();

        date.setMinutes(date.getMinutes() + 60);

        element.value = date.toLocaleTimeString();
    });

    Route.startClassesInComponent([
        {component: ".container-scheduled-datetime", class: "active"},
    ], () => {
        viewController.elementProperty.removeClass(".container-scheduled-datetime", "active");
        viewController.elementProperty.addClass(".container-scheduled-time", "active");
    }, COMPONENT_CREATE_TRIP);

    $("#inputScheduledDate").datepicker({
        inline: true,
        showOtherMonths: true,
        dateFormat: 'dd/mm/yy',
        dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
        dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    });

    viewController.elementProperty.addEventInElement(".inputScheduledDate", "oninput", function () {
        managerSchedule.schedule.date = this.value;
    });


    viewController.elementProperty.addEventInElement("#btnConfirmScheduleDatetime", "onclick", function () {

        managerSchedule.schedule.time = document.querySelector("#inputScheduleTime").value;
        managerSchedule.schedule.date = document.querySelector("#inputScheduledDate").value;

        try {
            validateScheduledDatetime();

            viewController.elementProperty.removeClass(".container-scheduled-datetime", "active");

            showTypeFreight();

        } catch (e) {
            SwalCustom.messageDialog("", e);
        }
    })
}


function validateScheduledDatetime() {
    const date = document.getElementById("inputScheduledDate").value;

    managerSchedule.schedule.date = date;

    let dividerDate = date.split("/");

    if (!dividerDate[0])
        throw "Data está inválida";

    if (!dividerDate[1])
        throw "Data está inválida";

    if (!dividerDate[2])
        throw "Data está inválida";

    if (dividerDate[0].length < 2)
        throw "Data está inválida";

    if (dividerDate[1].length < 2)
        throw "Data está inválida";

    if (dividerDate[2].length < 4)
        throw "Data está inválida";


    const dateInfo = new Date(
        `${dividerDate[2]}-${dividerDate[1]}-${dividerDate[0]} ${managerSchedule.schedule.time}`);

    const dateLimit = new Date();

    dateLimit.setMinutes(dateLimit.getMinutes() + 59);

    dateLimit.setSeconds(0);

    if (dateInfo.getTime() < dateLimit.getTime())
        throw "Desculpe, você só pode agendar com antecedencia minima de 60 minutos";

    return true;
}

function getScheduledFreight() {
    if (managerSchedule.schedule.date == null)
        return null;

    const dateArray = managerSchedule.schedule.date.split("/");

    return `${dateArray[2]}-${dateArray[1]}-${dateArray[0]} ${managerSchedule.schedule.time}`;
}


function getScheduledISOFreight(){

    return new Date(getScheduledFreight()).toISOString();
}
