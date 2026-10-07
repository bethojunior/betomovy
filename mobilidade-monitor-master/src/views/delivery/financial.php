<div class="accordion" id="accordionExample">
    <div class="card">
        <div class="card-header" id="headingOne">
            <h2 class="mb-0">
                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne"
                        aria-expanded="true" aria-controls="collapseOne">
                    Gerar perfil de cobrança
                </button>
            </h2>
        </div>

        <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
            <div class="card-body">
                <form>
                    <div class="form-row">
                        <div class="form-group col-md-3">
                            <label for="delivery-1">Dia da cobrança <i class="material-icons " data-toggle="modal"
                                                                       data-target="#modal-info">info_outline</i></label>
                            <select class="form-control" id="billingDate">
                                <option value="" disabled selected>Selecione o dia da cobrança</option>
                                <option value="1">1</option>
                                <option value="5">5</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                                <option value="25">25</option>
                            </select>
                        </div>
                        <div class="col-lg-12">
                            <hr/>
                            <button type="button" class="btn btn-primary add-charge" data-toggle="modal"
                                    data-target="#addCharge">
                                Adicionar cobrança
                            </button>
                        </div>
                        <table class="table table-striped">
                            <thead>
                            <tr>
                                <th scope="col">Nome</th>
                                <th scope="col">Valor fixo</th>
                                <th scope="col">R$ por entrega</th>
                                <th scope="col">% por entrega</th>
                                <th scope="col">Dia do cadastro</th>
                                <th scope="col"></th>
                            </tr>
                            </thead>
                            <tbody id="listCharges">
                            </tbody>
                        </table>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="card">
        <div class="card-header" id="headingTwo">
            <h2 class="mb-0">
                <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo"
                        aria-expanded="false" aria-controls="collapseTwo">
                    Forma de pagamentos
                </button>
            </h2>
        </div>
        <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
            <div class="card-body">
                <button type="button" class="btn btn-danger mb-2" data-toggle="modal"
                        data-target="#addPaymentFormDeliveryModal">Adicionar forma de pagamento
                </button>
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th>Descrição</th>
                        <th>Tipo</th>
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody id="listPaymentDelivery"></tbody>
                </table>
            </div>
        </div>
    </div>

</div>


<div id="modal-info" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Dia de cobrança</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p>
                    Este campo você preenche para emissão da cobrança mensal,
                    automaticamente o sistema vai emitir no dia informado neste campo um e-mail para seu cliente
                    informando o valor de sua fatura.
                    OBS: Está data é valida para todos os estabelecimentos.
                </p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">Entendi</button>
            </div>
        </div>
    </div>
</div>

<div class="modal" id="addPaymentFormDeliveryModal" tabindex="-1" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Adicionar forma de pagamento</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="namePaymentFormDelivery">Descrição</label>
                    <input type="text" class="form-control" id="namePaymentFormDelivery">
                </div>
                <div class="form-group">
                    <label for="paymentFormTypeId">Tipo de forma de pagamento</label>
                    <select class="form-control" id="paymentFormTypeId"></select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" id="btnAddPaymentFormDelivery">Salvar</button>
            </div>
        </div>
    </div>
</div>
<div class="modal" id="editPaymentFormDeliveryModal" tabindex="-1" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Editar forma de pagamento</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="namePaymentFormDeliveryEdit">Descrição</label>
                    <input type="text" class="form-control" id="namePaymentFormDeliveryEdit">
                </div>
                <div class="form-group">
                    <label for="paymentFormTypeIdEdit">Tipo de forma de pagamento</label>
                    <select class="form-control" id="paymentFormTypeIdEdit"></select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" id="btnEditPaymentFormDelivery">Salvar</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="addCharge">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Cobrança</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="delivery-2">Nome</label>
                    <input type="text" class="form-control" id="nameCharge">
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <label for="delivery-2">Valor fixo</label>
                        <input type="number" class="form-control maskmoney" id="fixedValueCharge">
                    </div>
                    <div class="col-md-4">
                        <label for="delivery-2">R$ por entrega</label>
                        <input type="number" class="form-control maskmoney" id="orderValueCharge">
                    </div>
                    <div class="col-md-4">
                        <label for="delivery-2">% por entrega</label>
                        <input type="number" class="form-control maskmoney" id="orderPercentageCharge">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="insertCharge">Adicionar</button>
            </div>
        </div>
    </div>
</div>