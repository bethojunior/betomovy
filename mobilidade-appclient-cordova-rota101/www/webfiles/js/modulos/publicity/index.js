Route.waitView().then(() => {

    viewController.elementProperty.addEventInElement(".back-publicity", "onclick", function (event) {
        event.stopPropagation();
        Route.backPage();
    });
});

function showAdvertising() {
    AdvertisingController.get(Session.get("location")).then(({status, data}) => {
        if (!status)
            return;

        Session.set("lastPublicity", data);

        const tripReference = Session.get("tripReference");

        if (!Array.isArray(tripReference))
            return;

        if (data != null) {
            viewController.elementProperty.removeClass(".floating-icon-coupon", "active");
            if (!document.querySelector(".btn-call-trip").classList.contains("active"))
                viewController.elementProperty.removeClass(".container-publicity-app", "hidden");

            viewController.elementProperty.getElement(".container-publicity-app", element => {
                element.style.backgroundImage = `url('${data.banner}')`;
            });

            viewController.elementProperty.addEventInElement(".container-publicity-app", "onclick", function () {
                if (this.classList.contains("active"))
                    return;

                showModalPublicity(data);
            });
        }
    });
}

function verifyExistPublicity() {
    if (Array.isArray(Session.get("lastPublicity")) || Session.get("lastPublicity") == null)
        return;
    if (!document.querySelector(".btn-call-trip").classList.contains("active"))
        viewController.elementProperty.removeClass(".container-publicity-app", "hidden");
}

function showModalPublicity(publicity) {
    viewController.elementProperty.getElement("#imgPublicityApp", element => {
        element.style.backgroundImage = `url('${publicity.thumbnail}')`;
    });
    
    const description = publicity.description.replace(/'\r\n'/g, "<br>")

    document.querySelector("#descriptionPublicity").innerText = description;

    viewController.elementProperty.addEventInElement("#sharePublicity", "onclick", function () {
        window.plugins.socialsharing.shareWithOptions({
            message: `${publicity.description}\n`,
            subject: NAME_APP,
            url: publicity.link,
        }, (result) => {
        }, (error) => {
        });
    });

    viewController.elementProperty.addEventInElement("#buttonOpenBrowser", "onclick", function () {
        preload(true);
        AppController.insertCountAds(null, publicity.id).then(() => {
            preload(false);
            cordova.InAppBrowser.open(publicity.link, '_system');
        });
    });

    Route.startClassesInComponent([{component: ".container-publicity-app", class: "active"}], () => {
        viewController.elementProperty.removeClass(".container-publicity-app", "active");
    });
}
