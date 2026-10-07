preload(true);
let elementProperty = new ElementProperty();
init();

function init() {
    elementProperty.getElement('#mount-configs', element => {

        MapSettingController.getAll().then(callback => {
            Session.setLocal64('keysConfig', callback.response)
            element.innerHTML = callback.response.map((response, index) => {
                let type = response.type;
                return `
                    <div class="card" id="accordion${index}">
                        <div class="card-header" id='heading${index}'>
                            <h2 class="mb-0">
                            <button class="btn btn-link btn-block text-left" 
                            type="button" data-toggle="collapse" data-target="#collapse${index}" aria-expanded="true" aria-controls="collapse${index}">
                                ${type}
                            </button>
                            </h2>
                        </div>
                        <div id="collapse${index}" class="collapse" aria-labelledby="heading${index}" 
                            data-parent="#accordion${index}">
                            <div class="card-body row">
                                ${mountTypes(response.config)}
                            </div>
                        </div>
                    </div>`;
            }).join("");

            preload(false);

            function mountTypes(items) {
                return items.map(item => {
                    if (item.key === 'application_timezone') {
                        return `
                             <div  class="col-sm-3 mb-2">
                                <select class="form-control" id="select-timezone">
                                ${Timezones.brazil.map(timezone =>
                                    `<option value="${timezone}" ${timezone === item.value ? "selected" : ""}>${timezone}</option>`)
                            .join("")}
                                </select>
                                <small id="emailHelp" class="form-text text-muted">${item.description}</small>
                            </div>
                        `
                    }
                    return `
                            <div  class="col-sm-3 mb-2">
                                <input id="key_${item.key}" class="form-control show-btn" value="${item.value}">
                                <small id="emailHelp" class="form-text text-muted">${item.description}</small>
                                <button id="${item.key}" class="col-lg-12 btn btn-primary send-config key_${item.key}">Enviar</button>
                            </div>
                        `;
                }).join('')
            }

            elementProperty.addEventInElement('. show-btn', 'onclick', function () {
                let key = this.getAttribute('id');
                elementProperty.getElement('.' + key, button => {
                    button.style.display = 'block';
                });
            });

            elementProperty.addEventInElement('.send-config', 'onclick', function () {
                let id = this.getAttribute('id');
                elementProperty.getElement('#key_' + id, that => {
                    let key = id;
                    let data = {};
                    data[key] = document.getElementById('key_' + id).value;
                    if (data.description_trip_types === '' || data.description_trip_types === ' ') {
                        swal('Você precisa digitar um valor', '', 'info');
                        return;
                    }
                    SwalCustom.dialogConfirm('Você deseja alterar esses dados?', 'Certifique que está alterando o item certo', callback => {
                        if (callback) {
                            MapSettingController.update(data).then(resolve => {
                                if (resolve.status) {
                                    Session.setLocal64('keysConfig', resolve.response)
                                    swal('Modificado com sucesso', '', 'success');
                                    init();
                                    return;
                                }
                                swal('ops', 'Erro ao modificar atributo', 'error')
                            });
                            return;
                        }
                    })
                });
            });

            elementProperty.addEventInElement('#select-timezone', 'onchange', function () {
                let data = {};
                data['application_timezone'] = this.value;
                MapSettingController.update(data).then(resolve => {
                    if (resolve.status) {
                        swal('Modificado com sucesso', '', 'success');
                        init();
                        return;
                    }
                    swal('ops', 'Erro ao modificar atributo', 'error')
                });
            });
        });

    });
}
