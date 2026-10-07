viewController.setObserver("corporate-route", () => {
    updateList();

    document.querySelector("#dateScheduleCorporateRoute").min = DateCustom.getDate();

    viewController.elementProperty.addEventInElement("#dateScheduleCorporateRoute", "onchange", function () {
        Route.redirectDynamic("Route", "AddScheduleCorporate");
    });

    viewController.onResume("corporate-route", () => {
        updateList();
    });

    function updateList() {
        ScheduleCorporateRouteController.tripsByDriver(Session.getValueInSession("user", "idDriver")).then(({data}) => {
            document.querySelector("#listScheduleCorporateRoute").innerHTML = data.map(item => {
                return `<li>
                        <p><b>Rota:</b> <span>${item.title}</span></p>
                        <p><b>Horário:</b><span>${new Date(item.schedule).toLocaleString()}</span></p>
                        <button type="button" class="btn-cancel-schedule-corporate-route" item='${btoa(JSON.stringify(item))}'>Cancelar</button>
                    </li>`
            }).join("");

            viewController.elementProperty.addEventInElement(".btn-cancel-schedule-corporate-route", "onclick", function () {
                const item = JSON.parse(atob(this.getAttribute("item")));
                SwalCustom.dialogConfirm("Deseja cancelar essa viagem?", "", status => {
                    if (status) {
                        new DriverController().cancelTrip(
                            {
                                tripReference:item.tripReference,
                                driverId: Session.getValueInSession("user","idDriver"),
                                cancellationReasonsId: 4
                            }
                        ).then(({status}) =>{
                            if(status){
                                SwalCustom.messageDialog("","Viagem cancelada",()=> updateList(),"success");
                            }else{
                                SwalCustom.messageDialog("","Ocorreu um erro ao cancelar viagem",null,"success");
                            }
                        });
                    }
                });
            })
        });
    }
});
