document.addEventListener("DOMContentLoaded", function () {
    const url = location.href.split("/");

    const type = url[url.length - 2];
    const userId = url[url.length - 1];
    const code  = "";

    AppSharingController.insert({type, userId, code});

    switch (type) {
        case "customer":
            window.location.href = "https://play.google.com/store/apps/details?id=br.com.taxireturn.client";
            break;
        case "driver":
            window.location.href = "https://play.google.com/store/apps/details?id=br.com.taxireturn.driver";
            break;
        default:
            break;
    }
});