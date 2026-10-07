<div class="container-default-monitor">
    <div class="container">
        <div class="accordion col-lg-12 col-sm-12" id="accordionExample">
            <div class="card">
                <div class="card-header" id="headingOne">
                    <h2 class="mb-0">
                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Lançamentos motorista
                        </button>
                    </h2>
                </div>

                <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-lg-6 col-sm-12">
                                <div class="list-group" id="list-type-trip" role="tablist">
                                </div>
                            </div>
                            <div class="col-lg-4 col-sm-12">
                                <div class="tab-content" id="nav-type-trip">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header" id="headingTwo">
                    <h2 class="mb-0">
                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                            Lista de lançamentos
                        </button>
                    </h2>
                </div>

                <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                    <div class="card-body">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Tipo de lançamento</th>
                                    <th>Fluxo</th>
                                    <th>Valor</th>
                                    <th>Dia do faturamento</th>
                                    <th>Categoria</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="listBalancePosting"></tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="card d-none" id='collapse-prepaid'>
                <div class="card-header" id="headingTree">
                    <h2 class="mb-0">
                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseTree" aria-expanded="true" aria-controls="collapseTree">
                            Tipos de créditos pré-pago
                        </button>
                    </h2>
                </div>

                <div id="collapseTree" class="collapse" aria-labelledby="headingTree" data-parent="#accordionExample">
                    <div class="card-body">
                        <button type="button" class="btn btn-primary mb-2" id="openPrePaidModal" data-toggle="modal">
                            Adicionar
                        </button>
                        <button type="button" id="listAllCities" class="btn btn-primary mb-2 d-none">Listar todas</button>
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Targeta</th>
                                        <th>Titulo</th>
                                        <th>Sub-Titulo</th>
                                        <th>Tipo</th>
                                        <th>Cidade</th>
                                        <th>Dias vendidos</th>
                                        <th>Dias comprados</th>
                                        <th>Valor da compra</th>
                                        <th>Valor do venda</th>
                                        <th>Dados da conta</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody id="listPrepaid"></tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
            <div class="card" id="collapse-prepaid-type">
                <div class="card-header" id="headingFour">
                    <h2 class="mb-0">
                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseFour" aria-expanded="true" aria-controls="collapseFour">
                            Modo de funcionamento do pré-pago
                        </button>
                    </h2>
                </div>

                <div id="collapseFour" class="collapse" aria-labelledby="headingFour" data-parent="#accordionExample">
                    <div class="card-body">
                        <div class="custom-control custom-switch ml-3">
                            <input type="checkbox" class="custom-control-input" id="pre-paid-switch">
                        <label class="custom-control-label" for="pre-paid-switch">Quando esta opção estiver destivada o pré-pago funcionará por crédito, caso contrário funcionará por período.</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="addPrepaidCredit" tabindex="-1" role="dialog" aria-labelledby="addPrepaidCreditLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Adicionar crédito pré-pago</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form id="addPrepaidPayment">
                <div class="modal-body">
                    <div class="form-group">
                        <label for="cardPrepaidCredit">Tarjeta</label>
                        <input type="text" class="form-control" id="cardPrepaidCredit" required>
                    </div>
                    <div class="form-group">
                        <label for="titlePrepaidCredit">Titulo</label>
                        <input type="text" class="form-control" id="titlePrepaidCredit" required>
                    </div>
                    <div class="form-group">
                        <label for="subTitlePrepaidCredit">Sub-Titulo</label>
                        <input type="text" class="form-control" id="subTitlePrepaidCredit" required>
                    </div>
                    <div class="form-group">
                        <label for="valuePrepaidBuy">Tipo de Pré-pago</label>
                        <select class="form-control" id="typePrepaid">
                            <Option value='1' default>Saldo</option>
                            <Option value='2'>Período</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="valuePrepaidBuy">Cidade</label>
                        <select class="form-control" id="citySelected"></select>
                    </div>
                    <div class="form-group valuePrepaidBuy">
                        <label for="valuePrepaidBuy">Valor de compra - (Valor que o usuário irá contratar)</label>
                        <input type="text" class="form-control input-mask-money" id="valuePrepaidBuy">
                    </div>
                    <div class="form-group valuePrepaidCredit">
                        <label for="valuePrepaidCredit">Valor de venda - (Valor que o usuário irá pagar)</label>
                        <input type="text" class="form-control input-mask-money" id="valuePrepaidCredit">
                    </div>
                    <div class="form-group quantityDaysSold">
                        <label for="valuePrepaidCredit">Dias Contratado - (Quantidade que o usuário irá contratar)</label>
                        <input type="number" class="form-control" id="quantityDaysSold">
                    </div>
                    <div class="form-group quantityDaysPurchased">
                        <label for="valuePrepaidCredit">Dias Liberados - (Quantidade que o usuário irá pagar)</label>
                        <input type="number" class="form-control" id="quantityDaysPurchased">
                    </div>
                    <div class="list-type-payment-prepaid"></div>
                    <hr />
                    <div class="form-group">
                        <label for="valueObsDeposit">Digite os dados de pagamento</label>
                        <textarea class="form-control" id="valueObsDeposit" rows="3" disabled></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">Salvar</button>
                </div>
            </form>
        </div>
    </div>
</div>