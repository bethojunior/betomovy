<div class="container-default-monitor generalCostumers" id="generalCostumers">
    <div class="row col-lg-12 container-search">
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
                        <input class="form-check-input" type="radio" value="email" id="check-email"
                               name="filter-costumers">
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
                        <input class="form-check-input" type="radio" value="phone" id="check-phone"
                               name="filter-costumers">
                        <label class="form-check-label" for="check-phone">
                            Tel
                        </label>
                    </div>
                    <div class="form-check col-lg-4 col-sm-2">
                        <input class="form-check-input" type="radio" value="carPlate" id="check-car-plate"
                               name="filter-costumers">
                        <label class="form-check-label" for="check-car-plate">
                            Placa do Veículo
                        </label>
                    </div>
                </div>
            </div>
            <div class="col-2">
                <div class="form-group">
                    <label for="statusControlSelected">Tipo de Motorista</label>
                    <select class="form-control" id="driverTypeControlSelected" name="driverType">
                        <option value="">TODOS</option>
                    </select>
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
                    <input id="clear-filter" class="form-control clear-filter " type="button" value="Limpar filtro">
                </div>
            </div>
        </div>
        <div class="accordion" id="filter-mobile">
            <p>
                <a class="btn btn-primary" data-toggle="collapse" href="#collapseOne" role="button"
                   aria-expanded="false" aria-controls="collapseExample">
                    Filtros
                </a>
            </p>
            <div class="collapse" id="collapseOne">
                <div class="card card-body">
                    <div class="card-body">
                        <div class="col-lg-6">
                            <div style="position: relative" class="form-group relative">
                                <label for="do-filter">Filtros</label>
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
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" value="carPlate" id="check-car-plate"
                                           name="filter-costumers">
                                    <label class="form-check-label" for="check-car-plate">
                                        Placa do Veículo
                                    </label>
                                </div>
                            </div>
                        </div>
                        <br>
                        <div class="col-lg-2">
                            <div class="form-group">
                                <input id="search-costumer-mobile" class="form-control btn btn-primary" type="button"
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
                                <input id="clear-filter-mobile" class="form-control clear-filter" type="button"
                                       value="Limpar filtro">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row" id="mountListDriver"></div>
</div>

<div class="modal fade" id="modalBalance" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Adicionar ou Remover saldo</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="container-information-value">
                    <label for="Value">Valor</label>
                    <span class="material-icons d-inline-block"
                          data-toggle="tooltip"
                          tabindex="0"
                          title="Para Remover o saldo é necessário colocar o sinal negativo na frente do valor digitado">
                        info
                    </span>
                </div>
                <input id="valueBalance" class="form-control" placeholder="12,00" maxLength="7">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button id="insert-balance" type="button" class="btn btn-primary">Salvar</button>
            </div>
        </div>
    </div>
</div>

<div id="modal-balance" class="modal">
    <div class="modalContent">
        <i id="close-modal-balance" class="material-icons">close</i>

        <div class="center">
            <button>SALVAR</button>
        </div>
    </div>
</div>

<div class="modal fade" id="filterDriverPaymentFormModal" tabindex="-1" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Formas de pagamento</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" id="home-tab" data-toggle="tab" href="#driverFilter" role="tab"
                           aria-controls="home" aria-selected="false">Seleção do motorista</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="profile-tab" data-toggle="tab" href="#monitorFilter" role="tab"
                           aria-controls="profile" aria-selected="false">Bloqueio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="profile-tab" data-toggle="tab" href="#monitorImposition" role="tab"
                           aria-controls="profile" aria-selected="false">Imposição</a>
                    </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                    <div class="tab-pane fade show active  mt-2" id="driverFilter" role="tabpanel"
                         aria-labelledby="home-tab"></div>
                    <div class="tab-pane fade mt-2" id="monitorFilter" role="tabpanel" aria-labelledby="profile-tab">
                        <div id="listMonitorFilter"></div>
                        <hr/>
                        <div class="d-flex justify-content-end">
                            <button type="button" class="btn btn-primary" id="btnSaveBlockedPayment">Salvar</button>
                        </div>
                    </div>
                    <div class="tab-pane fade mt-2" id="monitorImposition" role="tabpanel"
                         aria-labelledby="profile-tab">
                        <div id="listMonitorFilterImposition"></div>
                        <hr/>
                        <div class="d-flex justify-content-end">
                            <button type="button" class="btn btn-primary" id="btnSaveImpositionPayment">Salvar</button>
                        </div>
                    </div>
                </div>
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

<div class="modal" tabindex="-1" id="modal-config-driver" >
    <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Configurações do motorista</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="information-driver"></div>
                <button class="btn btn-primary" id="btn-page"> Mostrar mais </button>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal" tabindex="-1" id="modalNoteDriver">
    <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Histórico de notas</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="list-notes"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal" tabindex="-1" id="modalBirthdayDriver">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Data de aniversário do motorista</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body body-criminal-record">
                <p class="text-justify">A data de aniversário é necessária para ser feita a verificação de antecedentes criminais</p>
                <input class="form-control" id="datOfBirthdayDriverInput" type="date"/>
                <input type="text" id="idDriverBirthday" hidden/>
                <div></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary btn-save btn-sm" data-dismiss="modal">Verificar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal" tabindex="-1" id="resultCriminalRecord">
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