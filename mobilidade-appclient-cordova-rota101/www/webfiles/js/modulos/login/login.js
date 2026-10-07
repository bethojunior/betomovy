viewController.setObserver("login", function () {
    const elementProperty = new ElementProperty();
    const customerController = new CustomerController();
    let push = new Push()

    const location = {
        latitude: null,
        longitude: null
    };

    const phone = {
        numberPhone: null
    };

    if (Session.get('user').length > 0) {
        //window.location = HOST + "call";
        Route.redirect("Client","Splash");
    }

    const dataLogin = {
        email: '',
        password: '',
        deviceToken: '',
    };

    if (!Array.isArray(Session.get("dataLogin"))) {
        const dataLogin = Session.get("dataLogin");
        document.getElementById('password').value = dataLogin.password;
        document.getElementById('email').value = dataLogin.email;
    }

    Route.pageDynamic(true);

    elementProperty.addEventInElement('#password', 'onkeypress', (event) => {
        dataLogin.password = document.getElementById('password').value;
        dataLogin.email = document.getElementById('email').value;
        dataLogin.deviceToken = Session.get("token");
        dataLogin.location = location;

        Handle.handleEnter(event)
            .then(() => auth(dataLogin))
    });

    function auth(dataLogin) {
        preload(true);
        customerController.authenticate(dataLogin).then(result => {
            if (!result.status) {
                swal("ops", "Usuário e/ou senha inválidos", "info");
                return;
            }
            Session.set("dataLogin", dataLogin);
            Session.set('user', result.data);
            //window.location = HOST;
            const permissions = cordova.plugins.permissions;

            new Promise((resolve, reject) => {
                permissions.requestPermission(permissions.RECORD_AUDIO, () => {
                    permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, () => {
                        resolve();
                    }, () => {
                        resolve();
                    })
                }, () => {
                    resolve();
                });
            }).then(() => {
                Route.redirect("Client","Splash");
            })                                
        }).catch((message) => {
            swal(message, "", "warning")
        }).finally(() => {
            preload(false);
        });
    }


    elementProperty.addEventInElement('.authenticate-user', 'onclick', () => {
        dataLogin.password = document.getElementById('password').value;
        dataLogin.email = document.getElementById('email').value;
        dataLogin.deviceToken = Session.get("token");
        dataLogin.location = location;

        auth(dataLogin)
    });

    elementProperty.addEventInElement("#googlePlusLogin", "onclick", function () {
        window.plugins.googleplus.login({},
            function (result) {
                Session.set("picture_social", {
                    data: result.imageUrl,
                    type: "google"
                });

                authenticateSocial({
                    email: result.email,
                    name: result.displayName,
                    nickname: result.givenName,
                    deviceToken: Session.get("token"),
                    location,
                    phone: phone.numberPhone
                });
                disconnectSessionGoogle();
            },
            function (result) {
            })
    });
    elementProperty.addEventInElement("#facebookLogin", "onclick", function () {
        facebookConnectPlugin.login(["public_profile", "email"], function (result) {
            facebookConnectPlugin.api("me?fields=email,name,id,picture",
                ["public_profile", "email"], function (userData) {
                    Session.set("picture_social", {
                        data: userData.picture,
                        type: "facebook"
                    });

                    authenticateSocial({
                        facebook_id: userData.id,
                        email: userData.email,
                        name: userData.name,
                        nickname: userData.name.split(" ")[0],
                        deviceToken: Session.get("token"),
                        location,
                        phone: phone.numberPhone
                    });
                });
        }, function (result) {
            console.log(result);
        })
    });

    function authenticateSocial(data) {
        preload(true);
        customerController.authenticateSocial(data).then(result => {
            preload(false);
            if (!result.status) {
                swal("ops", result.message, "info");
                return;
            }
            Session.set('user', result.data);
            //window.location = HOST;
            Route.redirect("Client","Splash");
        }).catch((message) => {
            preload(false);
            swal(message, "", "warning");
        })
    }

    Position.getPositionNetwork().then(result => {
        if (!Array.isArray(Session.get("location"))) {
            const locationNet = Session.get("location");

            location.latitude = locationNet.lat;
            location.longitude = locationNet.lng;
            return;
        }

        if (result.loc == null)
            return;

        const locationNet = result.loc.split(",");

        Session.set("location", {lat: parseFloat(locationNet[0]), lng: parseFloat(locationNet[1])});

        location.latitude = parseFloat(locationNet[0]);
        location.longitude = parseFloat(locationNet[1]);
    });

    cordova.plugins.permissions.checkPermission(cordova.plugins.permissions.ACCESS_FINE_LOCATION, status => {
            if(status.hasPermission) {
                Position.getCurrentPosition(position => {
                    Session.set("location", {lat: position.coords.latitude, lng: position.coords.longitude});
                    location.latitude = position.coords.latitude;
                    location.longitude = position.coords.longitude;


                    window.plugins.sim.requestReadPermission(() => {
                        window.plugins.sim.getSimInfo(result => {
                            const numbers = result.cards.filter(card => {
                                return card.phoneNumber !== undefined;
                            });
                            if (numbers[0]) {
                                phone.numberPhone = numbers[0].phoneNumber;
                                Session.set("numberPhoneCustomer", phone.numberPhone);
                            }
                        }, error => {
                            console.log(error)
                        });
                    }, function () {

                    });
                });
            }
        },
        (error) => {
            console.log(error)
        });

    function disconnectSessionGoogle() {
        window.plugins.googleplus.disconnect(function (msg) {
        });
    }

    elementProperty.addEventInElement("#openTermsOfUse", "onclick", () => {
        const config = Session.get("configGeneral");

        if (config.length === 0)
            return;

        const term = config.find(item => {
            return item.key === 'customer_terms_of_use';
        });

        const link =
        (!term.value.includes(".pdf")) ?
            HOST_SITE + 'privacidade' :
            encodeURI(HOST_SITE + 'privacidade');


        const page = cordova.InAppBrowser.open(link, device.platform === "iOS" ? '_system' :  '_blank',
            'usewkwebview=yes,beforeload=get,hidenavigationbuttons=no,hideurlbar=yes,toolbarcolor=#FFFFFF,zoom=no,closebuttoncolor=#000000,location=no,disallowoverscroll=no,closebuttoncaption=Voltar');

        page.show();
    });

    function verifyLoginSocial() {
        const config = Session.get("configGeneral");

        if (config.length === 0)
            return;

        console.log(config);

        config.find(el => el.key === 'enable_facebook_login').value === '1'
            ? document.getElementById("facebookLogin").style.display = "block"
            : document.getElementById("facebookLogin").style.display = "none"

        config.find(el => el.key === 'enable_google_login').value === '1'
            ? document.getElementById("googlePlusLogin").style.display = "block"
            : document.getElementById("googlePlusLogin").style.display = "none"
    }

    CityController.general().then(({status, data}) => {
        if (!status)
            return;

        Session.set("configGeneral", data);

        verifyLoginSocial();
    });

    verifyLoginSocial();
});
