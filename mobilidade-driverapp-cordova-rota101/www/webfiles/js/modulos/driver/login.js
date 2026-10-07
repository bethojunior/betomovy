Route.waitView().then(function () {

    $('.modal').modal();

    const elementProperty = new ElementProperty();
    const driverController = new DriverController();
    const KEY_ENTER = 13;
    const push = new Push();
    
    let logger;
    getPulseLogger().then(l => logger = l).catch(() => {});

    elementProperty.getElement(".title-menu", element => {
        element.innerHTML = 'Login'
    });

    const savedLogin = localStorage.getItem("lastLogin");
    if (savedLogin) {
        const auth = JSON.parse(savedLogin);
        document.getElementById("email").value = auth.email;
        document.getElementById("password").value = auth.password;
    }

    elementProperty.addEventInElement("#authenticateUser", "onclick", authenticate);

    elementProperty.addEventInElement('#togglePassword', 'onclick', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const passwordEl = document.getElementById('password');
        const toggleIcon = document.getElementById('togglePassword');
        if (passwordEl.type === 'password') {
            passwordEl.type = 'text';
            toggleIcon.textContent = 'visibility';
        } else {
            passwordEl.type = 'password';
            toggleIcon.textContent = 'visibility_off';
        }
    });

    elementProperty.addEventInElement(".back-to", "onclick", function () {
        Route.redirect("Main");
    });

    window.addEventListener('keyboardDidShow', function () {
        elementProperty.getElement("#authenticateUser", element => {
            element.classList.add("active");
        });
    });

    window.addEventListener('keyboardDidHide', function () {
        elementProperty.getElement("#authenticateUser", element => {
            element.classList.remove("active");
        });
    });

    elementProperty.addEventInElement(".custom", "onkeypress", function (event) {
        if (event.keyCode === KEY_ENTER) {
            const inputs = elementProperty.getElements(".custom")

            for (let i in inputs) {
                const input = inputs[i];

                if (input.value.length === 0) {
                    input.focus();
                    return;
                }
            }
            authenticate();
        }
    });

    function authenticate() {
        const user = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            deviceToken: push.token,
        };

        if (!ValidateForm.validateEmail(user.email)) {
            SwalCustom.messageDialog(getTextTranslate("login","message-invalid-email"), getTextTranslate("login","title-invalid-email"), () => {}, "warning");
            return
        }
        if (user.password.length <= 0) {
            document.getElementById("password").focus();
            return;
        }

        document.getElementById("form-login").style.display = "none";
        document.getElementById("preloadLogin").style.display = "block";

        driverController.authenticate(user).then(result => {
            document.getElementById("preloadLogin").style.display = "none";
            document.getElementById("form-login").style.display = "block";

            if (!result.status) {
                SwalCustom.messageDialog(result.message, getTextTranslate("login","title-error-auth"), () => {}, "info");
                return;
            }
            
            localStorage.setItem("lastLogin", JSON.stringify({
                email: user.email,
                password: user.password
            }));

            Session.set('user', result.data);

            const permissions = cordova.plugins.permissions;

            new Promise((resolve, reject) => {
                permissions.requestPermission(permissions.RECORD_AUDIO, 
                    () => {
                        permissions.requestPermission(permissions.POST_NOTIFICATIONS,
                            () => {
                                permissions.requestPermission(
                                    permissions.WRITE_EXTERNAL_STORAGE, () => {
                                        resolve();
                                    },
                                    () => {
                                        resolve();
                                    }
                                );
                            },
                            () => {
                                permissions.requestPermission(
                                    permissions.WRITE_EXTERNAL_STORAGE, () => {
                                        resolve();
                                    },
                                    () => {
                                        resolve();
                                    }
                                );
                            }
                        );
                    },
                    () => {
                        resolve();
                    }
                );
            }).then(
                () => Route.redirect("Driver")
            );

        }).catch(error => {
            document.getElementById("form-login").style.display = "block";
            document.getElementById("preloadLogin").style.display = "none";
            if (logger) logger.critical(`Erro crítico no login: ${error.message || error}`);
            SwalCustom.messageDialog(getTextTranslate("login","message-error-auth"), getTextTranslate("login","title-error-auth"));
        })
    }

    Route.pageDynamic();

    // Exibir versão do app
    displayAppVersion("login-version");

});

function preload(status) {
    if (status) {
        document.getElementById("preloadLogin").style.display = "block";
        return;
    }
    document.getElementById("preloadLogin").style.display = "none";
}

function forgetPassword() {
    Route.redirectDynamic("Main","ForgetPassword");
}
