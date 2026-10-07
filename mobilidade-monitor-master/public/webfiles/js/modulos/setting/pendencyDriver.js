document.addEventListener("DOMContentLoaded", () => {
    Mask.setMoneyField(".penalty-input");

    getData();

    function getData() {
        preload(true);
        SettingController.listPendency().then(({response}) => {
            document.querySelector('.list-table').innerHTML = response.map(item => {
                return `
                    <div>
                    <tr>
                        <th>${item.name}</th>
                        <th>${parseFloat(item.valueRating).toFixed(2)}</th>
                        <th><button class="btn btn-primary material-icons btn-edit" data-toggle="modal" data-target="#modal-edit" id="${item.idUserPenaltyType}">edit</button></th>
                    </tr>
                    </div>
            `
            }).join('');
            preload(false);

            elementProperty.addEventInElement('.btn-edit', 'onclick', function() {
                const id = document.querySelector('.btn-edit');
                id.setAttribute('id', this.id);
            });
        });
    }

        elementProperty.addEventInElement('.save-penalty', 'onclick', function() {
            const id = document.querySelector('.btn-edit').getAttribute('id');
            const penaltyValue = document.querySelector('.penalty-input').value;

            if (Mask.removeMaskMoney(penaltyValue) > 0.5) {
                return swal('', 'Valor inserido não é permitido', 'error');
            }

            data = {
                value : Mask.removeMaskMoney(penaltyValue)
            }

            SwalCustom.confirm("Desejar alterar a pontuação?", " ",).then(() => {
                preload(true);
                SettingController.updatePendency(id, data).then(({status}) => {
                    preload(false);
                    if(!status)
                        SwalCustom.messageDialog("Tente novamente", "Ocorreu um erro ao atualizar a pontuação!", "error");

                    SwalCustom.messageDialog("", "Pontuação atualizada com sucesso!", "success");
                    $('#modal-edit').modal('hide');
                    document.querySelector('.penalty-input').value = '0,00';
                    getData();
                });
            });
        });
});

