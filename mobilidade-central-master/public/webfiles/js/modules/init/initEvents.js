document.addEventListener("deviceready", function () {
    const elementProperty = new ElementProperty();
    const supportController = new SupportController();


    function notifyChat() {
        if (viewController.currentView === "chat-trip")
            return;

        elementProperty.getElement(".chat-client", element => {
            element.classList.add("active");
        });

        elementProperty.getElement("#songMessage", element => {
            element.play();
        })
    }

    Position.getPositionNetwork().then(result => {
        if (!Array.isArray(Session.getLocal("location")))
            return;
        if (result.loc === undefined)
            return;

        const location = result.loc.split(",");

        Session.setLocal("location", {lat: parseFloat(location[0]), lng: parseFloat(location[1])});
    });

    if (!Array.isArray(Session.get("user"))) {
        supportController.getConfig("mp_public_key").then(({status, data}) => {
            if (!status)
                return;

            Session.setLocal("KEY_MERCADOPAGO", data);
        });
    }

});

function showOptionsReturn() {
    Route.startClassesInComponent([
        {component: "#modalInfoReturn",class:"active"}],()=>{
        viewController.elementProperty.removeClass("#modalInfoReturn","active")
    },COMPONENT_CREATE_TRIP);
}

function closeOptionsReturn() {
    new ElementProperty().getElement("#modalInfoReturn", element => {
        element.classList.remove("active");
    });
}
