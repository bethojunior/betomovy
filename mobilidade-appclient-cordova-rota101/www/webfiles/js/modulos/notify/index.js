Route.waitView().then(() => {
    updateNotificationsApp();

    viewController.elementProperty.addEventInElement(".button-notify-user", "onclick", function () {
        this.classList.remove("active");
        Route.startClassesInComponent([{component: ".content-notify-driver", class: "active"}], () => {
            viewController.elementProperty.removeClass(".content-notify-driver", "active");
        })
    });

    viewController.elementProperty.addEventInElement(".go-back", "onclick", function () {
        Route.backPage();
    })
});

function updateNotificationsApp(){
    const user = Session.get("user");

    NotificationController.findByUser(user.idUser, 1).then(({data}) => {
        document.querySelector("#listNotifyMonitor").innerHTML = data.map(notification => {
            const viewed = notification.viewed == true;
            if (!viewed)
                viewController.elementProperty.addClass(".button-notify-user", "active");

            return `<li class="open-notification-user ${viewed && "active"}" value='${btoa(unescape(encodeURIComponent(JSON.stringify(notification))))}'>
                        <div>
                            <p>${notification.title}</p>
                            <small>${notification.message}</small>
                        </div>
                        <i class="material-icons">chevron_right</i>
                    </li>`;
        }).join("");

        viewController.elementProperty.addEventInElement(".open-notification-user", "onclick", function () {
            const notification = JSON.parse(decodeURIComponent(escape(atob(this.getAttribute("value")))));
            showDetailNotification(notification);
            this.classList.add("active");
            NotificationController.viewed(user.idUser, notification.idNotification);
        });
    });
}


function showDetailNotification(notification) {
    function getURLBucket() {
        const config = Session.get("configGeneral");
        const picturesLink = config.find(item => {
            return item.key === 'link_storage_pictures';
        });
            
        const finalLink = `${picturesLink.value}driver/profile/compressed/`;

        const arrayString = finalLink.split("/");
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
        const page = cordova.InAppBrowser.open(notification.link, '_system');

        page.show();
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
