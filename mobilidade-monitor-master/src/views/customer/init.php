<div class="generalCostumers" id="generalCostumers">
    <div class="row col-lg-12 container-search m-0 p-0"
    ">
    <div class="filter filter-costumers col-lg-12 row">
        <div class="col-lg-6">
            <div class="form-group relative">
                <label for="do-filter">Filtro</label>
                <input class="form-control" id="do-filter" aria-describedby="emailHelp">
                <button title="Buscar" id="search-costumer"
                        class="btn btn-primary btn-sm search-costumer material-icons absolute">search
                </button>
            </div>
            <div class="row col-lg-12">
                <div class="form-check col-lg-2 col-sm-2">
                    <input checked class="form-check-input" type="radio" value="name" id="check-name"
                           name="filter-costumers">
                    <label class="form-check-label" for="check-name">
                        Nome
                    </label>
                </div>
                <div class="form-check col-lg-2 col-sm-2">
                    <input class="form-check-input" type="radio" value="email" id="check-email" name="filter-costumers">
                    <label class="form-check-label" for="check-email">
                        Email
                    </label>
                </div>
                <div style="margin-right: 2vw" class="form-check col-lg-1 col-sm-2">
                    <input class="form-check-input" type="radio" value="document" id="check-document"
                           name="filter-costumers">
                    <label class="form-check-label" for="check-document">
                        Cpf
                    </label>
                </div>
                <div class="form-check col-lg-2 col-sm-2">
                    <input class="form-check-input" type="radio" value="phone" id="check-phone" name="filter-costumers">
                    <label class="form-check-label" for="check-phone">
                        Tel
                    </label>
                </div>
            </div>
        </div>
        <div class="col-2">
            <div class="form-group">
                <label for="statusControlSelected">Status</label>
                <select class="form-control" id="statusControlSelected">
                    <option value="">TODOS</option>
                </select>
            </div>
        </div>
        <div class="col-lg-2">
            <div class="form-group">
                <label>&nbsp;</label>
                <input id="clear-filter" class="form-control" type="button" value="Limpar filtro">
            </div>
        </div>
        <?php if ($this->hasPermission(GroupConst::CLIENTE, 'filtro_militar')) { ?>
            <div class="col-lg-2">
                <div class="form-group">
                    <label>&nbsp;</label>
                    <input id="open-modal-filter-military" class="form-control btn btn" type="button"
                           value="Filtro militar">
                </div>
            </div>
        <?php } ?>
    </div>
    <div class="accordion m-0" id="filter-mobile">
        <div class="card">
            <div data-toggle="collapse" data-target="#collapseOne" class="card-header container-filters"
                 id="headingOneFilters">
                <h2 class="mb-0">
                    <button class="btn btn-link" type="button" aria-expanded="true" aria-controls="collapseOne">
                        Filtros para o cliente
                    </button>
                </h2>
                <span class="material-icons">
                         keyboard_arrow_down
                    </span>
            </div>

            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                <div class="card-body">
                    <div class="col-lg-6">
                        <div style="position: relative" class="form-group relative">
                            <label for="do-filter">Filtro</label>
                            <input class="form-control" id="do-filter-mobile" aria-describedby="emailHelp">
                        </div>
                        <div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" value="name" id="check-name"
                                       name="filter-costumers">
                                <label class="form-check-label" for="check-name">
                                    Nome
                                </label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" value="email" id="check-email"
                                       name="filter-costumers">
                                <label class="form-check-label" for="check-email">
                                    Email
                                </label>
                            </div>
                            <div style="margin-right: 2vw" class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" value="document" id="check-document"
                                       name="filter-costumers">
                                <label class="form-check-label" for="check-document">
                                    Cpf
                                </label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" value="phone" id="check-phone"
                                       name="filter-costumers">
                                <label class="form-check-label" for="check-phone">
                                    Tel
                                </label>
                            </div>
                        </div>
                    </div>
                    <br>
                    <div class="col-lg-2 col-sm-12">
                        <div class="form-group">
                            <input id="search-costumer-mobile" class="form-control btn-primary" type="button"
                                   value="Buscar">
                        </div>
                    </div>
                    <div class="col-lg-2 col-sm-12">
                        <div class="form-group">
                            <label for="statusControlSelected">Status</label>
                            <select class="form-control" id="statusControlSelectedMobile">
                                <option value="">TODOS</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-lg-2">
                        <div class="form-group">
                            <label>&nbsp;</label>
                            <input id="clear-filter-mobile" class="form-control" type="button" value="Limpar filtro">
                        </div>
                    </div>
                    <?php if ($this->hasPermission(GroupConst::CLIENTE, 'filtro_militar')) { ?>
                        <div class="col-lg-3">
                            <div class="form-group">
                                <label>&nbsp;</label>
                                <input id="open-modal-filter-military" class="form-control btn btn" type="button"
                                       value="Filtro militar">
                            </div>
                        </div>
                    <?php } ?>
                </div>
            </div>
        </div>
    </div>
</div>
<ul class="row col-lg-12" id="mountListCostumers"></ul>
</div>

<div class="modal" id="modal-filter-military" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Filtro Militar</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <label class="input-group-text" for="mount-military">Força</label>
                    </div>
                    <select class="custom-select" id="mount-military">
                    </select>
                </div>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <label class="input-group-text" for="graduationMilitary">Patente</label>
                    </div>
                    <select class="custom-select" id="graduationMilitary">
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="search-by-military">Buscar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal" tabindex="-1" role="dialog" id="modal-pendecies">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Pendencias</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="accordion" id="accordionExample">
                    <div class="card">
                        <div class="card-header" id="headingOne">
                            <h2 class="mb-0">
                                <button class="btn btn-link collapsed" type="button" data-toggle="collapse"
                                        data-target="#collapseOnePendency" aria-expanded="false"
                                        aria-controls="collapseOne">
                                    Pendencias do usuário
                                </button>
                            </h2>
                        </div>

                        <div id="collapseOnePendency" class="collapse" aria-labelledby="headingOne"
                             data-parent="#accordionExample" style="">
                            <table class="table table-striped">
                                <thead>
                                <tr>
                                </tr>
                                </thead>
                                <tbody id="pendecies-user">
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header" id="headingTwo">
                            <h2 class="mb-0">
                                <button class="btn btn-link collapsed" type="button" data-toggle="collapse"
                                        data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    Inserir pendencias
                                </button>
                            </h2>
                        </div>
                        <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo"
                             data-parent="#accordionExample">
                            <div class="card-body row">
                                <select id="listPendency" class="col-lg-5 custom-select">
                                    <option value="" disabled="" selected="">Selecione o tipo de pendencia</option>
                                </select>
                                <div class="col-lg-2"></div>
                                <select class="col-lg-5 custom-select" id="statusPendency">
                                    <option value="" disabled="" selected="">Selecione o status da pendencia</option>
                                </select>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary" id="insert-pendencies-user">Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal" tabindex="-1" id="modalObservation" name="observationModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Observações</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body observation-body">
                <input type="text" class="form-control observation-input" maxlength="50">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary observation-edit">Editar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal" tabindex="-1" id="modalDependent">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Dependentes</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body dependent-modal-body">
                <table class="table table-striped table-responsive table-dependent">
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th>Grau de parentesco</th>
                    </tr>
                    </thead>
                    <tbody class="list-dependents"></tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal" id="documentModal">
    <div class="modal-dialog modal-lg"">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Documentos do cliente</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="list-documents-user row" id="contentGallery"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal" tabindex="-1" id="modalCriminalRecord">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Resultado</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body modal-result">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary btn-unlock btn-sm" data-dismiss="modal">Desbloquear</button>
            </div>
        </div>
    </div>
</div>