<div class="container-default-monitor">
    <div class="w-100 d-flex justify-content-center">
        <div id="accordion" class="w-75 mt-4">
            <div class="card">
                <div class="card-header" id="headingOne">
                    <h5 class="mb-0">
                        <button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne"
                                aria-expanded="true" aria-controls="collapseOne">
                            Taxa de retorno de entrega (maquineta)
                        </button>
                    </h5>
                </div>
                <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
                <div class="custom-radio row mt-4">
                        <div class="col-6 center">
                            <input  class="custom-control-input" type="radio" id="tripRateFixed" name="typeFee" value="0">
                            <label class="custom-control-label" for="tripRateFixed">Taxa fixa</label>
                        </div>
                        <div class="col-6 center">
                            <input class="custom-control-input" type="radio" id="tripRatePerKm" name="typeFee" value="1">
                            <label class="custom-control-label" for="tripRatePerKm">Taxa por Km</label>
                        </div>
                    </div>
                    <div style="margin-left: 1.5rem; margin-bottom: 10px; margin-top: 10px" class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" id="paidByCentral">
                        <label class="custom-control-label" for="paidByCentral">Pago pela central</label>
                    </div>
                    <div class="card-body pt-0 d-flex flex-column align-items-end">
                        <input class="form-control input-fee-central">
                        <button class="btn btn-primary mt-2 btn-update-fee">Salvar</button>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header" id="headingTwo">
                    <h5 class="mb-0">
                        <button class="btn btn-link" data-toggle="collapse" data-target="#collapseTwo"
                                aria-expanded="true" aria-controls="collapseOne">
                            Finalizar a viagem apenas pela central, essa opção apenas valida
                            para viagem com retorno a central
                        </button>
                    </h5>
                </div>
                <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
                    <div class="card-body d-flex flex-column align-items-end">
                        <div class="w-100">
                            <div class="custom-control custom-radio">
                                <input type="radio" id="valueFinishOnlyCentralRadio1" name="valueFinishOnlyCentralRadio" class="custom-control-input" value="1" >
                                <label class="custom-control-label" for="valueFinishOnlyCentralRadio1">Ativar</label>
                            </div>
                            <div class="custom-control custom-radio">
                                <input type="radio" id="valueFinishOnlyCentralRadio2" name="valueFinishOnlyCentralRadio" class="custom-control-input" value="0">
                                <label class="custom-control-label" for="valueFinishOnlyCentralRadio2">Desativar</label>
                            </div>
                        </div>
                        <button class="btn btn-primary mt-2  update-finish-only-central">Salvar</button>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header" id="headingThree">
                    <h5 class="mb-0">
                        <button class="btn btn-link" data-toggle="collapse" data-target="#collapseThree"
                                aria-expanded="true" aria-controls="collapseOne">
                            Forma de Pagamento da Compra de Voucher
                        </button>
                    </h5>
                </div>
                <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                    <div class="card-body d-flex flex-column align-items-end">
                        <div class="w-100">
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="voucherPaymentFormCard">
                                <label class="custom-control-label" for="voucherPaymentFormCard">Cartão</label>
                            </div>
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="voucherPaymentFormPix">
                                <label class="custom-control-label" for="voucherPaymentFormPix">PIX</label>
                            </div>
                        </div>
                        <button class="btn btn-primary mt-2 btn-update-voucher-payment-form">Salvar</button>
                    </div>
            </div>
        </div>
            <div class="card">
                <div class="card-header" id="headingFor">
                    <h5 class="mb-0">
                        <button class="btn btn-link" data-toggle="collapse" data-target="#collapseFor"
                                aria-expanded="true" aria-controls="collapseOne">
                            Habilitar Tipo de Chamados
                        </button>
                    </h5>
                </div>
                <div id="collapseFor" class="collapse" aria-labelledby="headingFor" data-parent="#accordion">
                    <div class="card-body d-flex flex-column align-items-end">
                        <div class="w-100">
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="centralCallTypeSearchCustomer">
                                <label class="custom-control-label" for="centralCallTypeSearchCustomer">Procurar Cliente</label>
                            </div>
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="centralCallTypeToCentral">
                                <label class="custom-control-label" for="centralCallTypeToCentral">Chamar Para Central</label>
                            </div>
                        </div>
                        <button class="btn btn-primary mt-2 btn-update-central-call-type">Salvar</button>
                    </div>
            </div>
        </div>
            <div class="card">
                <div class="card-header" id="headingFive">
                    <h5 class="mb-0">
                        <button class="btn btn-link"
                                type="button" id="collapsePriceRangeCentral"
                                data-toggle="collapse" data-target="#collapseFive"
                                aria-expanded="true" aria-controls="collapseOne">
                            Faixa de Preços (Também pode ser configurada em Tarifas >> Tipos de Viagem)
                        </button>
                    </h5>
                </div>
                <div id="collapseFive" class="collapse" aria-labelledby="headingFive" data-parent="#accordion">
                    <div class="card-body d-flex flex-column">
                        <div class="w-100">
                            <label for="descriptionValue">Descrição</label>
                            <textarea class="form-control" id="descriptionValue" rows="3"></textarea>
                        </div>
                        <div class="row mt-3" style="padding: 14px;">
                            <select class="form-control col-md-12" id="tripTypeId">
                                <option value="" disabled selected class="text-center">Selecionar Tipo de Viagem</option>
                            </select>
                        </div>
                        <div class="row" style="padding: 14px;">
                            <select class="form-control col-md-12 w-100" id="mountCentral" multiple></select>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-3">
                                <label for="minValuePrice" class="mb-0">De R$</label>
                                <input type="text"
                                       class="form-control"
                                       id="minValuePrice"
                                       placeholder="0,00"
                                       style="text-align: right;">
                            </div>
                            <div class="col-md-3">
                                <label for="maxValuePrice" class="mb-0">Até R$</label>
                                <input type="text"
                                       class="form-control"
                                       id="maxValuePrice"
                                       placeholder="0,00"
                                       style="text-align: right;">
                            </div>
                            <span style="margin:30px 16px 0;">=</span>
                            <div class="col-md-3">
                                <label for="newValuePrice" class="mb-0">Cobrar R$</label>
                                <input type="text"
                                       class="form-control"
                                       id="newValuePrice"
                                       placeholder="0,00"
                                       style="text-align: right;">
                            </div>
                            <div class="mt-2 col-md-2">
                                <button style="margin-top: 15px;" class="btn btn-primary btn-save-price-range">Salvar</button>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-12">
                        <table class="table table-striped">
                            <thead>
                            <tr>
                                <th scope="col">Central</th>
                                <th scope="col">Inicial</th>
                                <th scope="col">Final</th>
                                <th scope="col">Fixo</th>
                                <th scope="col">Tipo</th>
                                <th scope="col"></th>
                            </tr>
                            </thead>
                            <tbody style="font-size: 1vw" id='mount-price-range-central'>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>