preload(true);
init();
function init(company = '' , app = '') {
    let params = `&appId=${app}&company&appId=${company}`;
    elementProperty.get('#mount-list-publicity').then(these => {
        MarketingController.getAdvertising(params).then(({status,response}) => {
            if(!status){
                preload(false)
                return swal('Erro ao buscar listagem de publicidade','Contate o suporte','error');
            }

            if(response == null){
                preload(false)
                return swal('Não há publicidades para essa cidade','','info');
            }

            let content = '';
            content += response.map(item => {
                return `
                    <tr class="open-this-publicity" data-browse='${JSON.stringify(item)}'> 
                        <th>${item.description}</th>
                        <th>${item.company.fantasyName}</th>
                        <th>${item.city.cityName}</th>
                        <th>${Mask.setDateCrazy(item.dateStart,false)}</th>
                        <th>${Mask.setDateCrazy(item.dateEnd,false)}</th>
                        <th> 
                            <button id="${item.id}" title="Editar" class="btn btn-secondary edit-publicity">
                               <i class="material-icons">edit</i>
                            </button>
                            <button id="${item.id}" title="Remover Publicidade" class="btn btn-danger delete-publicity">
                                <i class="material-icons">delete</i>
                            </button>
                        </th>
                    </tr>
                `;
            }).join('');
            these.innerHTML = content;

            elementProperty.addEventInElement('.open-this-publicity','onclick',function () {
                elementProperty.getElement('#body-publicity',these => {
                    $('#this-publicity').modal('show');
                    let data = JSON.parse(this.getAttribute('data-browse'));
                    these.innerHTML = `
                        <div class="accordion" id="accordionExample">
                            <div class="card">
                            <div class="card-header" id="headingOne">
                                <h2 class="mb-0">
                                    <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                        Imagens
                                    </button>
                                </h2>
                            </div>
                            
                            <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                                <div class="card-body"> 
                                    <div class="row col-lg-12">
                                        <div class="form-group col-lg-12"> 
                                            <label>Banner</label>
                                            <img class="responsiveImage img-thumbnail img-fluid  col-lg-12" src="${data.banner}">
                                        </div>
                                        <div class="form-group col-lg-12"> 
                                            <label>Thumbnail</label>
                                            <img class="responsiveImage img-thumbnail img-fluid  col-lg-12" src="${data.thumbnail}">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div class="card">
                                <div class="card-header" id="headingTwo">
                                    <h2 class="mb-0">
                                        <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                            Informações gerais
                                        </button>
                                    </h2>
                                </div>
                                <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                                    <div class="col-lg-12 card-body"> 
                                        <p> 
                                            <label>Empresa: <b>${data.company['name']}</b></label>
                                        </p>
                                        <p> 
                                            <label>Nome fantasia: <b>${data.company['fantasyName']}</b></label>
                                        </p>
                                        <p> 
                                            <label>Cidade : <b>${data.city['cityName']}</b></label>
                                        </p> 
                                        <p> 
                                            <label>Aplicativo alvo : <b>${data.app['name']}</b></label>
                                        </p>
                                        <p> 
                                            <label>Link : <a href="${data.link}">${data.link}</a></label>
                                        </p>                                        
                                        <p> 
                                            <label>Email informativo : <b>${data.emailInformation}</b></label>
                                        </p>
                                        <p> 
                                            <label>Email redirecionamento : <b>${data.emailRedirect}</b></label>
                                        </p>
                                        <p> 
                                            <label>Genero : <b>${data.gender['name']}</b></label>
                                        </p>
                                        <p> 
                                            <label>Descrição : ${data.description}</label>
                                        </p>
                                        <p> 
                                            <label>Data : ${Mask.setDateCrazy(data.dateStart, false)} até ${Mask.setDateCrazy(data.dateEnd,false)}</label>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    `;
                })
            });

            elementProperty.addEventInElement('.edit-publicity', 'onclick', function (e) {
                e.stopPropagation();
                preload(true);
                elementProperty.getElement('#body-publicity-edit', (bodyPublicityEdit) => {
                    const id = this.getAttribute('id');
                    MarketingController.showPublicity(id).then(({ status, response }) => {
                        if (!status) {
                            preload(false);
                            return swal('Erro ao buscar os detalhes da publicidade', 'Contate o suporte', 'error');
                        }

                        const data = response;
                        $('#this-publicity-edit').modal('show');
                        openEditModal(data, bodyPublicityEdit);
                    });
                });
            });

            function openEditModal(data, bodyPublicityEdit) {
                bodyPublicityEdit.innerHTML = `
                <form id="edit-form">
                    <div class="modal-header">
                        <h5 class="modal-title">Editar Publicidade</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="general-publicidade w-100">
                            <div class="row col-lg-12 col-sm-12 container-form">
                                <div class="col-lg-12 col-sm-12">
                                    <div class="col-lg-12 col-sm-12">
                                        <div class="d-lg-flex align-items-center">
                                            <div class="col-lg-6">
                                                <span class="title-form-publicity"><b>Imagem para o modal</b> <label>(288 x 180)</label></span>
                                            </div>
                                            <div class="col-lg-6">
                                                <img height="90" width="auto" id="image-upload-item-edit"  src="${data.thumbnail}">
                                            </div>
                                        </div>
                                        <div class="custom-file mt-3">
                                            <input type="file" class="custom-file-input thumbnail" id="thumbnail-edit">
                                            <label class="custom-file-label" for="thumbnail-edit"><b>Carregar imagem</b></label>
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="col-lg-12 col-sm-12">
                                        <div class="d-lg-flex align-items-center">
                                            <div class="col-lg-6">
                                                <span class="title-form-publicity"><b>Banner promocional</b> <label>(324 x 108)</label></span>
                                            </div>
                                            <div class="col-lg-6">
                                                <img height="90" width="auto" id="image-upload-item-banner-edit"  src="${data.banner}">
                                            </div>
                                        </div>
                                        <div class="custom-file mt-3">
                                            <input type="file" class="custom-file-input" id="banner-edit">
                                            <label class="custom-file-label" for="banner-edit"><b>Carregar imagem</b></label>
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="col-lg-12 col-sm-12 form-group mt-4">
                                        <span class="title-form-publicity"><b>Data Ínicio</b></span>
                                        <input class="form-control time-publicidade" type="datetime-local" id="dateStart-edit" value="${data.dateStart}">
                                    </div>
                                    <div class="col-lg-12 col-sm-12 form-group mt-5">
                                        <span class="title-form-publicity"><b>Data Final</b></span>
                                        <input class="form-control time-publicidade" type="datetime-local" id="dateEnd-edit" value="${data.dateEnd}">
                                    </div>
                                    <div class="col-lg-12 col-sm-12 form-group mt-5">
                                        <span class="title-form-publicity"><b>Quantidade de vezes</b></span>
                                        <input type="number" class="form-control" id="amountOfTime-edit" min="0" value="${data.amountOfTime}">
                                    </div>
                                </div>
                                <div class="col-lg-12 col-sm-12">
                                    <div class="col-lg-12 col-sm-12">
                                        <span class="title-form-publicity"><b>Publico</b></span>
                                        <hr>
                                        <div id="mount-gender-edit" class="d-lg-flex justify-content-start mb-3 align-items-start"></div>
                                    </div>
                                    <div class="col-lg-12 col-sm-12">
                                        <span class="title-form-publicity"><b>Onde</b></span>
                                        <hr>
                                        <div id="mount-were-edit" class="d-lg-flex justify-content-start mb-3 align-items-start"></div>
                                    </div>
                                    <div class="col-lg-12">
                                        <span class="title-form-publicity"><b>App</b></span>
                                        <hr>
                                        <div id="mount-apps-edit" class="d-lg-flex justify-content-start mb-3 align-items-start"></div>
                                    </div>
                                    <div class="col-lg-12 col-sm-12">
                                        <span class="title-form-publicity"><b>Links</b></span>
                                        <hr>
                                        <div class="form-group mt-2">
                                            <span><b>Link 1</b></span>
                                            <input class="form-control" id="link-edit" value="${data.link}">
                                        </div>
                                        <div class="form-group mt-2">
                                            <span><b>Email de informação</b></span>
                                            <input class="form-control" id="email-information-edit" value="${data.emailInformation}">
                                        </div>
                                        <div class="form-group mt-2">
                                            <span><b>Email de redirecionamento</b></span>
                                            <input class="form-control" id="emailRedirect-edit" value="${data.emailRedirect}">
                                        </div>
                                        <div class="form-group mt-2">
                                            <span class="title-form-publicity"><b>Descrição</b></span>
                                            <textarea id="description-edit" rows="6"  placeholder="Texto" class="form-control">${data.description}</textarea>
                                        </div>
                                        <div class="form-group mt-2">
                                            <span class="title-form-publicity"><b>Empresa</b></span>
                                            <select class="custom-select form-control" id="mount-company-edit"></select>
                                        </div>
                                        <div class="form-group mt-2">
                                            <span class="title-form-publicity"><b>Gestor</b></span>
                                            <input class="form-control" disabled>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                        <button type="button" id="save-edit" class="btn btn-primary">Salvar</button>
                    </div>
                </div>
                </form>
                `;

                let imageOne;

                if (document.getElementById('thumbnail-edit') !== null) {
                    document.getElementById('thumbnail-edit').onchange = function () {
                        if (this.files && this.files[0]) {
                            let reader = new FileReader();

                            reader.onload = function (e) {
                                document.getElementById('image-upload-item-edit').setAttribute('src', e.target.result);
                                imageOne = e.target.result;
                            };

                            reader.readAsDataURL(this.files[0]);
                        }
                    };
                }
                if (document.getElementById('banner-edit') !== null) {
                    document.getElementById('banner-edit').onchange = function () {
                        if (this.files && this.files[0]) {
                            let reader = new FileReader();

                            reader.onload = function (e) {
                                document
                                    .getElementById('image-upload-item-banner-edit')
                                    .setAttribute('src', e.target.result);
                                imageOne = e.target.result;
                            };

                            reader.readAsDataURL(this.files[0]);
                        }
                    };
                }

                elementProperty.get('#mount-company-edit').then((these) => {
                    CompanyController.getAll().then(({ status, response }) => {
                        if (!status) return swal('Erro ao listar empresas', 'Contate o suporte', 'error');

                        const companyId = data.company.id;

                        let items = response
                            .map((item) => {
                                const selected = companyId === item.id ? 'selected' : '';
                                return `<option value="${item.id}" ${selected}>${item.name}</option>`;
                            })
                            .join('');
                        these.innerHTML += items;
                    });
                });

                elementProperty.get('#mount-apps-edit').then((these) => {
                    ConfigController.Apps().then(({ status, response }) => {
                        if (!status) return swal('Erro ao listar aplicativos', 'Contate o suporte', 'error');

                        const appId = data.app.idApp; // Obtém o idApp do objeto data.app

                        these.innerHTML = response
                            .map((app) => {
                                const checked = appId === app.idApp ? 'checked' : '';
                                return `
                <div class="form-check ml-2">
                    <input class="form-check-input" name="apps" type="radio" value="${app.idApp}" id="app-${app.idApp}" ${checked}>
                    <label class="form-check-label" for="app-${app.idApp}">
                        ${app.name}
                    </label>
                </div>
            `;
                            })
                            .join('');
                    });
                });

                elementProperty.get('#mount-were-edit').then((these) => {
                    MarketingController.wereAdvertising().then(({ status, response }) => {
                        if (!status)
                            return swal('Erro ao listar locais de publicidade', 'Contate o suporte', 'error');

                        const advertisingAppSiteId = data.advertisingAppSiteId;

                        these.innerHTML = response
                            .map((app) => {
                                const checked = app.id === advertisingAppSiteId ? 'checked' : '';
                                return `
                <div class="form-check ml-2">
                    <input name="advertisingAppSiteId" class="form-check-input" type="radio" value="${app.id}" id="where-${app.id}" ${checked}>
                    <label class="form-check-label" for="where-${app.id}">
                        ${app.name}
                    </label>
                </div>
            `;
                            })
                            .join('');
                    });
                });


                elementProperty.get('#mount-gender-edit').then((these) => {
                    ConfigController.Gender().then(({ status, response }) => {
                        if (!status)
                            return swal('Erro ao listar locais de publicidade', 'Contate o suporte', 'error');

                        const genderId = data.genderId;

                        let apps = response
                            .map((app) => {
                                // Marque o botão de rádio se o valor corresponder
                                const checked = app.id === genderId ? 'checked' : '';
                                return `
        <div class="custom-control custom-radio ml-2">
            <input type="radio" id="customRadio-${app.id}" name="type-gender" class="custom-control-input" value="${app.id}" ${checked}>
            <label class="custom-control-label" for="customRadio-${app.id}">${app.name}</label>
        </div>
        `;
                            })
                            .join('');
                        these.innerHTML += apps;
                        preload(false);
                    });
                });

                document.getElementById('save-edit').addEventListener('click', function () {
                    let dataForm = new FormData();

                    const thumbnailEdit = document.getElementById('thumbnail-edit').files[0];
                    const bannerEdit = document.getElementById('banner-edit').files[0];

                    if (thumbnailEdit) {
                        dataForm.append('thumbnail', thumbnailEdit);
                    }

                    if (bannerEdit) {
                        dataForm.append('banner', bannerEdit);
                    }

                    dataForm.append('description', document.getElementById('description-edit').value);
                    dataForm.append('companyId', document.getElementById('mount-company-edit').value);
                    dataForm.append('dateStart', document.getElementById('dateStart-edit').value);
                    dataForm.append('dateEnd', document.getElementById('dateEnd-edit').value);
                    dataForm.append('amountOfTime', document.getElementById('amountOfTime-edit').value);
                    dataForm.append('link', document.getElementById('link-edit').value);
                    dataForm.append('emailInformation', document.getElementById('email-information-edit').value);
                    dataForm.append('emailRedirect', document.getElementById('emailRedirect-edit').value);

                    const selectedApps = Array.from(document.querySelectorAll("input[name='apps']:checked")).map((checkbox) => checkbox.value);
                    dataForm.append('appId', selectedApps);

                    const selectedAdvertisingSites = Array.from(document.querySelectorAll("input[name='advertisingAppSiteId']:checked")).map((checkbox) => checkbox.value);
                    dataForm.append('advertisingAppSiteId', selectedAdvertisingSites);

                    const selectedGender = document.querySelector("input[name='type-gender']:checked").value;
                    dataForm.append('genderId', selectedGender);

                    dataForm.append('cityId', Session.getValueInSessionLocal('citySelected', 'cityId'));

                    preload(true);

                    MarketingController.updateAdvertising(data.id, dataForm).then(({ status, response }) => {
                        preload(false);

                        if (!status) {
                            return swal('Erro ao salvar as alterações', response[0], 'error');
                        }

                        swal('Alterações salvas com sucesso', '', 'success');
                        $('#this-publicity-edit').modal('hide');
                        init();
                    });
                });
            }

            elementProperty.addEventInElement('.delete-publicity','onclick',function (e) {
                e.stopPropagation();
                let id = this.getAttribute('id');
                SwalCustom.confirm('Você deseja apagar essa propaganda ?','Essa ação é irreversivel').then(status => {
                    if(!status)
                        return true;

                    MarketingController.deletePublicity(id).then(({status,response}) => {
                        if(!status)
                            return swal('Erro ao deletar','Contate o suporte','error');

                        swal('Deletado com sucesso','','success');
                        return init();
                    })
                })
            });
            preload(false);
        });
    });
}