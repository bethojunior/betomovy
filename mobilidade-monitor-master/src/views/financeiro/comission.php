<div class="container-default-monitor">
    <button
            id="openCommissionModal"
            type="button"
            style="margin: 10px;"
            class="btn btn-primary"
            data-toggle="modal"
    >
        Inserir monetização
    </button>

    <button
            type="button"
            style="margin: 10px; display: none"
            class="btn btn-info"
            id="listAllMonetization"
    >
        Listar todas monetizações
    </button>
    <div class="tab-pane fade show table-responsive" id="list-second" role="tabpanel" aria-labelledby="list-home-list">
        <table class="table">
            <thead class="thead-dark">
            <tr>
                <th scope="col">Level</th>
                <th scope="col">Indicações</th>
                <th scope="col">Tipo de corrida</th>
                <th scope="col">Valor</th>
                <th scope="col">Tipo do valor</th>
                <th scope="col">Cidade</th>
                <th scope="col">Destino do bônus</th>
                <th scope="col">Data</th>
                <th scope="col">Excluir</th>
            </tr>
            </thead>
            <tbody id="mount-list-levels">
            </tbody>
        </table>
    </div>
</div>

<div class="modal fade" id="insertMonetization">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="titleMonetization">Monetização</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="form-group col-sm-4">
                        <label for="name-commission">Classe</label>
                        <input type="" class="form-control" id="name-commission" aria-describedby="emailHelp">
                        <small id="emailHelp" class="form-text text-muted">Nomenclatura para nivel da monetização</small>
                    </div>
                    <div class="form-group col-sm-4">
                        <label for="indications-comission">Indicações</label>
                        <input type="number" class="form-control" id="indications-comission" aria-describedby="emailHelp">
                        <small id="indications-comission" class="form-text text-muted">Quantidade de indicações</small>
                    </div>
                    <div class="col-sm-4">
                        <div class="form-group">
                                <label for="backToTripBalance">Destino do bônus</label>
                                <span
                                        class="material-icons d-inline-block"
                                        tabindex="0"
                                        data-toggle="tooltip"
                                        title="Opção disponível apenas para cliente. O motorista sempre receberá no saldo em conta."
                                >
                                    info
                                </span>
                            <div class="col-sm-12">
                                <div class="custom-control custom-radio custom-control-inline">
                                    <input type="radio" id="opt-balance" name="backToTripBalance" class="custom-control-input" value="0" selected>
                                    <label class="custom-control-label" for="opt-balance">Saldo em Conta</label>
                                </div>
                                <br>
                                <div class="custom-control custom-radio custom-control-inline">
                                        <input type="radio" id="opt-voucher" name="backToTripBalance" class="custom-control-input" value="1">
                                        <label class="custom-control-label" for="opt-voucher">Voucher (apenas cliente)</label>
                                </div>
                            </div>
                            <small id="backToTripBalance" class="form-text text-muted"></small>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-4">
                        <label for="mount-trip-types">Tipo de corrida</label>
                        <select class="form-control select-trip-type" id="mount-trip-types">
                        </select>
                    </div>
                    <div class="col-sm-4">
                        <div class="form-group">
                            <label for="value-comission">Valor</label>
                            <input type="number" class="form-control" id="value-comission" aria-describedby="emailHelp">
                            <small id="value-comission" class="form-text text-muted">Valor da comissão</small>
                        </div>
                    </div>

                    <div class="col-sm-2 type-value">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="valueType" id="inlineRadio1" value="$">
                            <label class="form-check-label" for="inlineRadio1">$</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="valueType" id="inlineRadio1" value="%">
                            <label class="form-check-label" for="inlineRadio1">%</label>
                        </div>
                    </div>
                </div>
                <div class="cities"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary insertCommission">Inserir</button>
            </div>
        </div>
    </div>
</div>
