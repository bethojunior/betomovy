<div class="container-default-monitor">
    <div class="container">
        <a href="<?php echo Host::getLocal() ?>manager/signup" class="btn btn-primary">Adicionar Gestor</a>

        <div>
            <div class="row title-list">
                <div class="col-md-3">Nome</div>
                <div class="col-md-2">Telefone</div>
                <div class="col-md-3">E-mail</div>
                <div class="col-md-1">Comissão</div>
                <div class="col-md-1">Tipo</div>
                <div class="col-md-2">Ação</div>
            </div>
            <ul id="listManager" class="list-group"></ul>
        </div>
    </div>
</div>

<!-- Editar Gestor -->
<div class="modal fade" id="editManagerModal" tabindex="-1" aria-labelledby="countryModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editManagerModalLabel">Editar Gestor</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <form class="container">
                        <div class="form-group row">
                            <div class="col-md-12">
                                <label for="selectManagerEdit"><h3>Gestor</h3></label>
                                <select id="selectManagerEdit" class="form-control"></select>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group row-mot">
                            <label>Motorista</label>
                            <div class="driver d-flex">
                                <div class="col-md-6">
                                    <label for="valueManagerMot">Valor</label>
                                    <input type="text" class="form-control" id="valueManagerMot">
                                </div>
                                <div class="col-md-6 mot">
                                    <p>Tipo</p>
                                    <div class="mot-row">
                                        <div class="col-6 form-check mot">
                                            <input class="form-check-input" type="radio" name="typeValueMot" id="typeMoneyMot" value="$" checked>
                                            <label class="form-check-label" for="typeMoneyMot">$</label>
                                        </div>
                                        <div class="col-6 form-check mot">
                                            <input class="form-check-input" type="radio" name="typeValueMot" id="typePercentMot" value="%">
                                            <label class="form-check-label" for="typePercentMot">%</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr>
                        <div class="form-group row-cli">
                            <label>Cliente Comissionado</label>
                            <div class="client d-flex">
                                <div class="col-md-6">
                                    <label for="valueManager">Valor</label>
                                    <input type="text" class="form-control" id="valueManagerCli">
                                </div>
                                <div class="col-md-6 cli">
                                    <p>Tipo</p>
                                    <div class="cli-row">
                                        <div class="col-12 form-check cli">
                                            <input class="form-check-input" type="radio" name="typeValueCli" id="typeMoneyCli" value="$" checked>
                                            <label class="form-check-label" for="typeMoneyCli">$</label>
                                        </div>
                                        <div class="col-12 form-check cli">
                                            <input class="form-check-input" type="radio" name="typeValueCli" id="typePercentCli" value="%">
                                            <label class="form-check-label" for="typePercentCli">%</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                            <button type="button" id="updateManagerConfirm" class="btn btn-primary">Confirmar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Remover Gestor -->
<div class="modal fade" id="removeManagerModal" tabindex="-1" aria-labelledby="countryModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="removeManagerModal">Remove Gestor</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <p>Deseja realmente remover o gestor <span id="managerName"></span>?</p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" id="removeManagerConfirm" class="btn btn-primary">Confirmar</button>
            </div>
        </div>
    </div>
</div>
