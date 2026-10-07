class SwalCustom {
    static dialogConfirm(title, message, icon, buttons = undefined) {
        if (!buttons)
            buttons = {
                yes: {
                    text: "SIM!",
                    value: true,
                },
                no: {
                    text: "NÃO!",
                    value: false,
                },
            };

        return new Promise((resolve, reject) => {
            swal({
                    title: title,
                    text: message,
                    icon: icon,
                    buttons
                }
            ).then(value => {
                if (value)
                    return resolve();
                reject();
            })
        });
    }

    static dialogHTML(title, message, icon, buttons = undefined, html = '') {
        if (!buttons)
            buttons = {
                yes: {
                    text: "SIM!",
                    value: true,
                    className: "",
                },
                no: {
                    text: "NÃO!",
                    value: false,
                    className: "",
                },
            };

        const content = document.createElement("div");
        content.innerHTML = html;

        return new Promise((resolve, reject) => {
            swal({
                    title: title,
                    text: message,
                    content,
                    icon: icon,
                    buttons
                }
            ).then(value => {
                if (value) {
                    resolve();
                    return;
                }
                reject();
            })
        });
    }

    static messageDialog(message, title, callback = function () {
    }, icon = "info") {
        swal({
            title: title,
            text: message,
            icon: icon
        }).then(value => {
            if (callback)
                callback();
        });
    }
}