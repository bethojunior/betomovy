class SwalCustom {
    static dialogConfirmCustom(title, message, buttons) {
        return new Promise(resolve => {
            swal({
                    title: title,
                    text: message,
                    icon: 'info',
                    buttons,
                }
            ).then(function (status) {
                resolve(status);
            })
        })
    }

    static dialogConfirm(title, message, callback) {
        swal({
                title: title,
                text: message,
                icon: 'info',
                buttons: {
                    yes: {
                        text: "SIM!",
                        value: true,
                    },
                    no: {
                        text: "NÃO!",
                        value: false,
                    },
                },
            }
        ).then(function (status) {
            callback(status);
        })
    }

    static messageDialog(message, title, icon = "info") {
        return new Promise((resolve, reject) => {
            swal({
                title: title,
                text: message,
                icon: icon
            }).then(resolve).catch(reject);
        })
    }

    static dialogInfo(title, message) {
        swal({
                title: title,
                text: message,
                icon: 'success',
                buttons: {
                    Ok: {
                        text: "OK!",
                        value: true,
                    },
                },
            }
        ).then(function () {
            $(document).ready(function () {
                setTimeout(function () {
                    window.location.reload(1);
                }, 500);
            })
        })
    }

    static confirm(title, message) {
        return new Promise((resolve, reject) => {
            swal({
                title: title,
                text: message,
                icon: 'info',
                buttons: {
                    yes: {
                        text: "SIM!",
                        value: true,
                    },
                    no: {
                        text: "NÃO!",
                        value: false,
                    },
                },
            })
                .then(function (status) {
                    if (status) {
                        resolve(true);
                        return;
                    }
                    reject(false);
                });
        });
    }


}