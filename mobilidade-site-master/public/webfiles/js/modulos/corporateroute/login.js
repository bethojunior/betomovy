document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#formLogin").addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;

        const button = document.querySelector("#btnSubmit");
        button.disabled = true;
        AuthenticateController.authenticate(email, password).then(({response, status, message}) => {
            if (status) {
                Session.set("user", response);
                location.reload();
            } else {
                SwalCustom.messageDialog("", message, undefined, "info");
            }
        }).finally(() => {
            button.disabled = false;
        })
    });
});