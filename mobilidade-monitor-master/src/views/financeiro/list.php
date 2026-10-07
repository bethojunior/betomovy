<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">
            <a class="btn btn-primary pull-right" role="button" data-toggle="collapse" href="#collapseFilters" aria-expanded="false" aria-controls="collapseFilters">
                Filtros
            </a>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="collapse" id="collapseFilters">
                <div class="well">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="form-group">
                                <label class="control-label" for="Nome">Nome</label>
                                <input type="text" class="form-control input-filter" name="name" id="Nome" placeholder="">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label class="control-label" for="Telefone">Telefone</label>
                                <input type="text" class="form-control input-filter" name="phone" id="Telefone" placeholder="">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label class="control-label" for="Cpf">CPF</label>
                                <input type="text" class="form-control input-filter" name="document" id="Cpf" placeholder="">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group form-check mt-4">
                                <input type="checkbox" class="form-check-input input-filter" name="paid" id="onlyPending">
                                <label class="form-check-label mt-2" for="onlyPending">Apenas Pendentes</label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3">
                            <div class="form-group">
                                <label class="control-label" for="dateStart">A partir de</label>
                                <input type="date" class="form-control input-filter" name="dateStart" id="dateStart" placeholder="">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="form-group">
                                <label class="control-label" for="dateEnd">Até</label>
                                <input type="date" class="form-control input-filter" name="dateEnd" id="dateEnd" placeholder="">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-1">
                            <button type="button" class="btn btn-primary" id="to-filter">Buscar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12 table-responsive">
            <table class="table table-striped table-withdraw">
                <thead>
                    <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Data</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Status</th>
                    <th scope="col">Valor</th>
                    <th scope="col">Ações</th>
                    </tr>
                </thead>
                <tbody id="tbody-withdraw">
                </tbody>
            </table>
        </div>
    </div>
</div>

<div class="modal fade" id="show-withdraw-modal" tabindex="-1" role="dialog" aria-labelledby="showWithdrawModal" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="showWithdrawModal"></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
      </div>
    </div>
  </div>
</div>

<div class="modal" tabindex="-1" id="modalPagueLogo">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Pague Logo</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p>Foi identificado que sua adquirente é a Pague Logo, como você deseja pagar essa solicitação?</p>
                <div id="saldContent" class="text-center"></div>
                <div class="d-flex justify-content-center">
                <select class="form-control w-75 select-payment-forms">
                    <option value="cartao" selected>Cartão</option>
                    <option value="boleto">Boleto</option>
                </select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary btn-sm" id="selectFormPayment">Confirmar</button>
            </div>
        </div>
    </div>
</div>