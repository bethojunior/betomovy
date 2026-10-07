document.addEventListener("DOMContentLoaded", function () {
getData();

function getData() {
    preload(true);
    additionalAppSettingsController.getSettings().then(({response}) => {
        document.querySelector('.card-container').innerHTML = response.map((item, index) => {
            return `
                <div class="card">
                    <div class="card-header" id="heading${index}">
                        <h2 class="mb-0">
                            <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${index}"
                                    aria-expanded="false" aria-controls="collapseOne"> ${item.description}
                            </button>
                        </h2>
                    </div>
                
                    <div id="collapse${index}" class="collapse" aria-labelledby="heading${index}" style>
                        <div class="card-body">
                            <div class="col-lg-6">
                              <div class="form-group">
                                <input class="form-control" id="input-${item.key}" value="${item.value || ""}">
                              </div>
                              <button id="${item.key}" type="button" class="btn btn-primary btn-save-setting">Salvar</button>
                            </div>
                          </div>
                    </div>
                </div>
                  `
        }).join("");
        preload(false);
        elementProperty.addEventInElement('.btn-save-setting', 'onclick', function() {
            let key = this.getAttribute('id');
            let value = document.getElementById(`input-${key}`).value;
            let data = {};
            data[key] = value;

            if (data[key] === '' || data[key] === ' ') {
                swal('Você precisa digitar um valor', '', 'info');
                return;
            }

            SwalCustom.dialogConfirm('Você deseja alterar esse dado?', 'Certifique-se que está alterando o item certo!', callback => {
                preload(true);
                if (callback) {
                    MapSettingController.update(data).then(resolve => {
                        if (resolve.status) {
                            preload(false);
                            swal('Modificado com sucesso', '', 'success');
                            getData();
                            return;
                        }
                        swal('ops', 'Erro ao modificar atributo', 'error')
                    });
                }
            });
        })
    })
    }
});