Route.waitView().then(() => {
    let isOpen = false;
    let isActive = false;

    checkPermission();

    document.addEventListener("resume", () => {
        checkPermission();
    });


    function checkPermission() {
        getPermission();
    }


    function getPermission() {
        if(isActive)
            return;
        if (isOpen)
            return;

        const permissions = cordova.plugins.permissions;

        TermsUsePolicyController.find('customer').then(({data}) => {
            permissions.checkPermission(permissions.ACCESS_FINE_LOCATION, status => {
                isActive = status.hasPermission;
                if (!status.hasPermission) {
                    isOpen = true;
                    navigator.notification.confirm(data.description,
                        (index) => {
                            switch (index) {
                                case 1: {
                                    isOpen = false;
                                    window.plugins.appMinimize.minimize();
                                    break;
                                }
                                case 2: {
                                    permissions.requestPermission(permissions.ACCESS_FINE_LOCATION, (status) => {
                                        if (!status.hasPermission) {
                                            isOpen = false;
                                            getPermission();
                                        }
                                    }, () => {

                                    });
                                }
                            }
                        },
                        `IMPORTANTE \nLeia antes de prosseguir`
                        , ["Não", "Aceito"])
                } else {
                    if (device.platform !== "iOS") {
                        RequestIgnoreBatteryOptimizationCordova.requestPermission();
                    }
                }
            }, (error) => {
                console.log(error)
            });
        });

    }
});
