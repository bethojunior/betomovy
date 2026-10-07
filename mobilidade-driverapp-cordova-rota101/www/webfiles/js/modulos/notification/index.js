function showDetailNotification(notification) {
    function getURLBucket() {
        const arrayString = PATH_IMAGE.split("/");
        arrayString.splice(-4);
        return arrayString.join("/") + "/";
    }

    if (notification.image) {
        viewController.elementProperty.getElement(".background-banner", element => {
            element.classList.add("loading");
            element.style.backgroundImage = `url(${getURLBucket()}${notification.image})`;

            let img = new Image();
            img.onload = function(){
                element.classList.remove("loading");
            };

            img.src = `${getURLBucket()}${notification.image}`;
        });
        viewController.elementProperty.addClass(".background-banner", "active")
    } else {
        viewController.elementProperty.removeClass(".background-banner", "active")
    }

    if (notification.link) {
        viewController.elementProperty.addClass(".link-action-notification", "active")
    } else {
        viewController.elementProperty.removeClass(".link-action-notification", "active")
    }

    viewController.elementProperty.getElement(".title-notification", element => {
        element.innerHTML = notification.title;
    });

    viewController.elementProperty.getElement(".message-notification", element => {
        element.innerHTML = notification.message;
    });

    viewController.elementProperty.addEventInElement(".link-action-notification", "onclick", function () {
        window.open(notification.link, "_system");
    });

    viewController.elementProperty.addEventInElement(".back-page", "onclick", function () {
        Route.backPage();
    });

    Route.startClassesInComponent([{component: ".container-notification-detail", class: "active"}], () => {
        viewController.elementProperty.removeClass(".container-notification-detail", "active");
    })
}


function showDetailNotificationByPush(notification) {
    const user = Session.get("user");

    viewController.elementProperty.removeClass(".content-notify-driver", "active");
    NotificationController.viewed(user.idUser, notification.additionalData.idNotification);

    if (notification.image) {
        viewController.elementProperty.getElement(".background-banner", element => {
            element.classList.add("loading");
            element.style.backgroundImage = `url(${notification.image})`;

            let img = new Image();
            img.onload = function(){
                element.classList.remove("loading");
            };

            img.src = `${notification.image}`;
        });
        viewController.elementProperty.addClass(".background-banner", "active")
    } else {
        viewController.elementProperty.removeClass(".background-banner", "active")
    }

    if (notification.additionalData.link) {
        viewController.elementProperty.addClass(".link-action-notification", "active")
    } else {
        viewController.elementProperty.removeClass(".link-action-notification", "active")
    }

    viewController.elementProperty.getElement(".title-notification", element => {
        element.innerHTML = notification.title;
    });

    viewController.elementProperty.getElement(".message-notification", element => {
        element.innerHTML = notification.message;
    });

    viewController.elementProperty.addEventInElement(".link-action-notification", "onclick", function () {
        const page = cordova.InAppBrowser.open(notification.additionalData.link, '_system');

        page.show();
    });

    viewController.elementProperty.addEventInElement(".back-page", "onclick", function () {
        Route.backPage();
    });

    Route.startClassesInComponent([{component: ".container-notification-detail", class: "active"}], () => {
        viewController.elementProperty.removeClass(".container-notification-detail", "active");
    })
}
