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


function updateNotificationsApp() {
    const user = Session.get("user");

    NotificationController.findByUser(user.idUser, 1).then(({data, status}) => {
        if (data?.length === 0 || !status) {
            document.querySelector("#listNotifyMonitor").innerHTML = `
                            <div
                            class="container-no-notifications"
                            > 
                                <p>Nenhuma notificação</p>
                                <img src="webfiles/img/icon/sem-spam.png" alt="Nenhuma notificação" />
                            </div>
                        `;
            return;
        }
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
