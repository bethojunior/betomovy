document.addEventListener("DOMContentLoaded", function () {


    ConfigController.getRealtimeDatabase().then(({status, response: data}) => {
        if (data.status) {
            elementProperty.addClass("#buttonEnabledRealtime", "active");
        } else {
            elementProperty.addClass("#buttonEnabledRealtime", "disabled");
        }

        elementProperty.addEventInElement("#buttonEnabledRealtime", "onclick", function () {
            SwalCustom.dialogConfirm("Deseja mudar o modo de sincronização de dados ?", "", (result) => {
                if(!result)
                    return;

                this.disabled = true;

                const status = !this.classList.contains("active");

                ConfigController.updateRealtimeDatabase(status).then(() => {
                    this.disabled = false;

                    if (status) {
                        elementProperty.addClass("#buttonEnabledRealtime", "active");
                        elementProperty.removeClass("#buttonEnabledRealtime", "disabled");
                    } else {
                        elementProperty.removeClass("#buttonEnabledRealtime", "active");
                        elementProperty.addClass("#buttonEnabledRealtime", "disabled");
                    }
                });
            });
        });
    });
});