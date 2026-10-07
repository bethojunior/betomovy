viewController.setObserver("web-app", function () {
    const iframe = document.querySelector("#iframeWebApp");

    iframe.src = "https://www.704apps.com.br";

    iframe.onload = function () {
        viewController.elementProperty.addClass(".web-view-iframe", "active");
    };

    viewController.onBack(function () {
        viewController.elementProperty.removeClass(".web-view-iframe", "active");

        iframe.src = "";
    });
});