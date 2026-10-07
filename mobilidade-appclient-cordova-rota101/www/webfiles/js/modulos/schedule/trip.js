Route.waitView().then(() => {

    const dateNow = new Date();

    const dayOfWeek = createDayOfWeek();

    const monthYear = createMonthYear();

    document.querySelector("#tripDateSchedule").valueAsDate = dateNow;
    document.querySelector("#tripTimeSchedule").value = dateNow.toLocaleTimeString();

    setDate(dateNow);

    setTime(dateNow);

    document.querySelector("#tripDateSchedule").setAttribute("min", DateCustom.getDate());

    viewController.elementProperty.addEventInElement("#btnScheduleTrip", "onclick", openScheduleTrip);

    function openScheduleTrip() {
        document.querySelector(`#tripDateSchedule`).value = "";
        document.querySelector("span[for='tripDateSchedule']").innerHTML = "Clique para definir a data";
        Route.startClassesInComponent([
            {component: ".container-schedule-trip", class: "active"}
        ], () => {
            Session.delete("dateScheduleTrip");
            viewController.elementProperty.removeClass(".container-schedule-trip", "active");
        }, COMPONENT_CREATE_TRIP);

        viewController.elementProperty.addEventInElement("#tripDateSchedule", "onchange", function () {
            if (this.value.length === 0)
                return document.querySelector("span[for='tripDateSchedule']").innerHTML = '-';
            const date = new Date(`${this.value.replace(/-/g, "/")} 09:00:00`);

            setDate(date);
        });

        viewController.elementProperty.addEventInElement("#tripTimeSchedule", "onchange", function () {
            if (this.value.length === 0)
                return document.querySelector("span[for='tripTimeSchedule']").innerHTML = `-`;

            const date = new Date();

            const splitDate = this.value.split(":");

            date.setHours(splitDate[0]);
            date.setMinutes(splitDate[1]);

            setTime(date);
        });
    }


    function setDate(date) {
        document.querySelector("span[for='tripDateSchedule']").innerHTML =
            `${dayOfWeek[date.getDay()]}, ${date.getDate()} ${monthYear[date.getMonth()]} ${date.getFullYear()}`;
    }

    function setTime(date) {
        const firstDate = date.toLocaleTimeString().slice(0, 5);

        date.setMinutes(date.getMinutes() + 10);
        const lastDate = date.toLocaleTimeString().slice(0, 5);

        document.querySelector("span[for='tripTimeSchedule']").innerHTML = `${firstDate} - ${lastDate}`;
    }


    viewController.elementProperty.addEventInElement("#btnConfirmScheduledTrip", "onclick", () => {
        if (document.querySelector(`#tripDateSchedule`).value.length === 0 ||
            document.querySelector(`#tripTimeSchedule`).value.length === 0)
            return SwalCustom.messageDialog("Informe a data e o horário do agendamento", "Atenção", "warning");

        Route.backPage();

        Route.startClassesInComponent(
            [
                {component: ".switch-type-trip", class: "hide"}
            ],
            () => {
                viewController.elementProperty.removeClass(".switch-type-trip", "hide");
                Session.delete("dateScheduleTrip");
                calculatePriceCustomer(Session.get("typeCalculatePrice"));
            },
            COMPONENT_CREATE_TRIP);

        viewController.elementProperty.getElement(".switch-type-trip", element => {
            if (element.classList.contains("is-content-schedule"))
                element.classList.remove("hide");
        });

        Session.set("dateScheduleTrip",
            `${
                document.querySelector("#tripDateSchedule").value
            } ${
                document.querySelector("#tripTimeSchedule").value
            }`);

        viewController.elementProperty.getElement("#descriptionScheduledTrip", element => {

            element.innerHTML = `${
                document.querySelector("span[for='tripDateSchedule']").innerHTML
            } ${
                document.querySelector("span[for='tripTimeSchedule']").innerHTML
            }`;
        });

        calculatePriceCustomer(Session.get("typeCalculatePrice"));
    });

    viewController.elementProperty.addEventInElement(".close-schedule", "onclick", () => Route.backPage());

    viewController.elementProperty.addEventInElement(".btn-confirm-scheduled-trip", "onclick", () => {
        initNewTrip();
    });
});

function getScheduled() {
    if (Array.isArray(Session.get("dateScheduleTrip")))
        return null;


    return Session.get("dateScheduleTrip");
}


function getScheduledISO() {
    if (Array.isArray(Session.get("dateScheduleTrip")))
        return null;


    return new Date(Session.get("dateScheduleTrip").replace(" ", "T")).toISOString();
}

function showScheduleTrip(tripReference) {
    preload(true);
    TripController.get(tripReference).then(({status, data}) => {
        if (!status)
            return;

        document.querySelector("#addressScheduleTrip").innerHTML = data.destination.name;
        document.querySelector("#descriptionDateTimeScheduleTrip").innerHTML = getDescriptionScheduleTrip(data.schedule.schedule);
        document.querySelector("#priceScheduleTrip").innerHTML = `${CityConfig.getTypeCoin()}${Mask.maskMoney(parseFloat(data.price))}`;

        viewController.elementProperty.addEventInElement("#closeDetailScheduleTrip", "onclick", () => {
            initProcessingCallTrip();
            viewController.elementProperty.removeClass(".container-detail-schedule-trip", "active");
        });

        viewController.elementProperty.addClass(".container-detail-schedule-trip", "active");
    }).finally(() => {
        preload(false);
    });
}

function createDayOfWeek() {
    return Array('dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb');
}

function createMonthYear() {
    return Array('jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez');
}

function getDescriptionScheduleTrip(dateString) {
    return new Date(dateString.replace(" ", "T")).toLocaleString();
}


function verifyConnectionNetwork() {

    const cityConfig = Session.get("cityConfig");
    const socketConnection = io.connect(`${environment.hosts.hostSocket}${cityConfig.configDriverLocation.port_url}`);

    socketConnection.on("connect", () => {
        viewController.elementProperty.removeClass(".container-connection-internet", "active");
    });

    socketConnection.on("disconnect", () => {

        viewController.elementProperty.addClass(".container-connection-internet", "active");
    });


}