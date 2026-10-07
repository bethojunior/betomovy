viewController.setObserver("trip-report",function(){
    const elementProperty = new ElementProperty();

    elementProperty.addEventInElement("#sendReportTrip","onclick",function(){

        const message = document.getElementById("messageRequestRelease").value;

        if(message.trim().length <= 0){
            SwalCustom.messageDialog("Por favor, relate o problema","",undefined,"warning");
            return;
        }

        TripController.report({
            tripReference: Session.get("tripReferenceRelease"),
            message
        });

        SwalCustom.messageDialog("Aguarde o retorno de 24h","Recebemos sua solicitação",function(){
            Route.backPage();
        },"info");
    })
});