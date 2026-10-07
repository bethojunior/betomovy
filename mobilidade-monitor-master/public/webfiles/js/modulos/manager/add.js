document.addEventListener("DOMContentLoaded",function(){
    Mask.setMoneyField("#valueManagerMot");
    Mask.setMoneyField("#valueManagerCli");

    const manager = {
        userId:"",
        valueCommission:"",
        valueTypeCommission:"",
    };

    $('#selectManager').select2({
        placeholder: 'Selecione o responsável',
        width: '100%',
        ajax: {
            url: environment.hosts.hostRequest + "user/search/panel",
            headers: {
                'token': Session.getValueInSession('user', 'api_token'),
                'userid': Session.getValueInSession('user', 'idUser')
            },
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term,
                };
            },
            processResults: function (result, params) {
                params.page = params.page || 1;

                return {
                    results: result.response.map(user => {
                        return {
                            id: user.idUser,
                            text: user.name,
                            email: user.email,
                            phone: user.phone
                        }
                    }),
                };
            },
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        minimumInputLength: 1,
        templateResult: formatSelecting,
        templateSelection: formatRepoSelection
    });

    function formatSelecting(result) {
        if (result.loading) {
            return "Buscando...";
        }

        return `<div class="item-select2">
                    <div>
                        ${result.text}
                    </div>
                    <div>
                        ${result.email}
                    </div>
                    <div>
                        ${result.phone}
                    </div>
                </div>`;
    }

    function formatRepoSelection(result) {
        manager.userId = result.id;
        return result.text;
    }

    elementProperty.addEventInElement("#btnSaveManager", "onclick", function() {
        preload(true);

        // Motorista
        const motValueTypeCommission = document.querySelector("input[name='typeValueMot']:checked").value;
        const motValueCommission = Mask.removeMaskMoney(document.getElementById("valueManagerMot").value);

        // Cliente Comissionado
        const cliValueTypeCommission = document.querySelector("input[name='typeValueCli']:checked").value;
        const cliValueCommission = Mask.removeMaskMoney(document.getElementById("valueManagerCli").value);

        if (manager.userId.length === 0) {
            SwalCustom.messageDialog("", "Selecione o usuário que será gestor", "info");
            return;
        }

        const data = {
            motValueTypeCommission,
            motValueCommission,
            cliValueTypeCommission,
            cliValueCommission,
            userId: manager.userId,
            cityId: Session.getValueInSessionLocal("citySelected", "cityId")
        };

        ManagerController.insert(data).then(({ status, response }) => {

            if (!status) {
                preload(false);
                SwalCustom.messageDialog("", response, "info");
                return;
            }

            preload(false);
            SwalCustom.messageDialog("", response, "success").then(() => {
                location.href = `/manager`;
            });
        });
    });


});