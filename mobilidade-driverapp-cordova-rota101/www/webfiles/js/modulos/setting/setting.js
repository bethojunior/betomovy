Route.waitView().then(() => {
    const elementProperty = new ElementProperty();

    const setting = Session.get("setting").length === 0 ? {
        zoom: 17,
        route: 20,
        duration: 500,
        meters: 20
    } : Session.get("setting");

    elementProperty.getElement("#sensibilidadeRota", element => {
        element.value = setting.route;
    });
    elementProperty.getElement("#zoomMapa", element => {
        element.value = setting.zoom;
    });
    elementProperty.getElement("#tempoGiro", element => {
        element.value = setting.duration;
    });
    elementProperty.getElement("#distanciaMetros", element => {
        element.value = setting.meters;
    });

    elementProperty.addEventInElement("#saveSetting", "onclick", function () {

        const setting = {
            zoom: parseInt(document.getElementById("zoomMapa").value),
            duration: parseInt(document.getElementById("tempoGiro").value),
            route: parseInt(document.getElementById("sensibilidadeRota").value),
            meters: parseInt(document.getElementById("distanciaMetros").value),
        };

        Session.set("setting", setting);

        SwalCustom.messageDialog("Alterações salva com sucesso", "Atenção", () => {
        }, "success");

        window.mapService.setting = setting;

        window.mapService.map.setOptions({
            preferences: {
                zoom: {
                    minZoom: 14,
                    maxZoom: setting.zoom
                },
            }
        });

        window.mapService.map.setCameraZoom(setting.zoom);

    });
});
