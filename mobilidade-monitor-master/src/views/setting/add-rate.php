<div class="container-add-rate">
    <div class="list-prices">
        <div class="add-new-type">
            <div class="center">
                <div><i class="material-icons">add</i></div>
            </div>
            <div class="center">
                <div><span>Adicionar novo</span></div>
            </div>
        </div>
        <ul id="typeRates">
        </ul>
    </div>
    <div class="container-rates-change">
        <div class="option-menu-rate" value="1">
            <details>
                <summary>Política de preço</summary>
                <div>
                    <div hidden>
                        <input type="number" id="citySelected" value="" autocomplete="off" hidden>
                    </div>
                    <div>
                        <label for="description">Etiqueta(10)</label>
                        <input type="text" id="description" maxlength="10" autocomplete="off">
                    </div>
                    <div class="container-color-tag">
                        <label for="color">Cor da Etiqueta</label>
                        <input type="color" id="color" autocomplete="off">
                    </div>
                </div>
                <div>
                    <div>
                        <label for="priceMin">preço minimo*</label>
                        <input type="tel" class="simulation-price" id="priceMin" autocomplete="off">
                    </div>
                    <div>
                        <label for="promotional_price_temp">preço mínimo promocional</label>
                        <input type="tel" class="simulation-price" id="promotional_price_temp" autocomplete="off">
                    </div>
                    <div>
                        <label for="priceBase">preço base*</label>
                        <input type="tel" class="simulation-price" id="priceBase" autocomplete="off">
                    </div>
                    <div>
                        <label for="priceKm">preço km*</label>
                        <input type="tel" class="simulation-price" id="priceKm" autocomplete="off">
                    </div>
                </div>
                <div>
                    <div>
                        <label for="priceMinute">preço minuto*</label>
                        <input type="tel" class="simulation-price" id="priceMinute" autocomplete="off">
                    </div>
                    <div>
                        <label for="priceWaypoint">preço por parada</label>
                        <input type="tel" class="simulation-price" id="priceWaypoint" autocomplete="off">
                    </div>
                    <hr>
                </div>
                <div>
                    <div class="center">
                        <div><b>Bonus de longa distancia</b></div>
                    </div>
                    <div style="margin-left: 3vw" class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" id="long_distance_value_to_final_price">
                        <label class="custom-control-label" for="long_distance_value_to_final_price">Pago pelo
                            cliente</label>
                    </div>
                    <div>
                        <label for="long_distance_per_km">Raio de chamado (Km)</label>
                        <input style="text-align: right" type="tel" id="long_distance_radius" autocomplete="off">
                    </div>
                    <div>
                        <label for="long_distance_per_km"><b>R$</b> do bonus</label>
                        <input type="tel" class="simulation-price" id="long_distance_per_km" autocomplete="off">
                    </div>
                    <?php if ($this->hasPermissionGroup(GroupConst::FRETE)) { ?>
                        <div>
                            <label for="long_distance_delivery_price">taxa de entrega de longa distância</label>
                            <input type="tel" class="simulation-price" id="long_distance_delivery_price"
                                   autocomplete="off">
                        </div>
                    <?php } ?>
                    <hr>
                    <div>
                        <label for="reward_driver_min_price">valor bonus(promocional)</label>
                        <input type="tel" class="simulation-price" id="reward_driver_min_price" autocomplete="off">
                    </div>
                </div>
                <div>
                    <div>
                        <label for="idealListCommonPrice">lista ideal de motoristas próximos (dinâmica)</label>
                        <input style="text-align: right" type="number" id="idealListCommonPrice" autocomplete="off"
                               value="1" min="1"
                               onblur="if(this.value.length == 0 || this.value == 0)
                                        this.value = 1;">
                    </div>
                    <div>
                        <label for="disableAfterKm">máx km para tarifa</label>
                        <input type="text" id="disableAfterKm" autocomplete="off">
                    </div>
                    <hr>
                    <div class="input-duplicate">
                        <label for="">Taxa de Imposto</label>
                        <input type="tel" class="simulation-price" id="taxRate" autocomplete="off">
                        <p>
                            <input type="radio" name="typeTaxRate" id="typeTaxRate"
                                   value="%">%<br>
                            <input type="radio" name="typeTaxRate" id="typeTaxRate"
                                   value="$">$<br>
                        </p>
                        <!-- <input type="text" class="simulation-price" id="descriptionTaxRate"
                                placeholder="Descrição" autocomplete="off">-->
                    </div>
                    <div class="form-group text-area-field">
                        <label for="taxRateTextarea">Descrição (Taxa de imposto)</label>
                        <textarea class="form-control" id="taxRateTextarea" rows="3"></textarea>
                    </div>
                    <hr />
                    <div class="input-duplicate">
                        <label for="">Taxa Extra</label>
                        <input type="tel" class="simulation-price" id="surcharge" autocomplete="off">
                        <p>
                            <input type="radio" name="typeSurcharge" id="typeSurcharge"
                                   value="%" checked>%<br>
                            <input type="radio" name="typeSurcharge" id="typeSurcharge"
                                   value="$">$<br>
                        </p>
                        <!-- <input type="tel" class="simulation-price" id="descriptionSurcharge"
                                placeholder="Descrição" autocomplete="off">-->
                    </div>
                    <div class="form-group text-area-field">
                        <label for="surchargeTextarea">Descrição (Taxa Extra)</label>
                        <textarea class="form-control" id="surchargeTextarea" rows="3"></textarea>
                    </div>
                    <hr>
                    <div>
                        <label for="disableAfterKm">Distancia para cobrar valor adicional</label>
                        <input type="tel" class="simulation-price" id="km_to_additional_value" autocomplete="off">
                    </div>
                    <div>
                        <label for="disableAfterKm">Valor da distancia <br>adicional</label>
                        <input type="tel" class="simulation-price" id="additional_value_after_km" autocomplete="off">
                        <p style="margin-top: 2vw;">
                            <input id="$" type="radio" name="type_additional_value_after_km"
                                   value="$">&nbsp;$<br>
                            <input id="km" type="radio" name="type_additional_value_after_km"
                                   value="km">&nbsp;km<br>
                        </p>
                    </div>
                </div>
            </details>
            <details>
                <summary>Calculos Motoristas</summary>
                <div>
                    <div class="input-duplicate">
                        <label for="">Taxa de serviço</label>
                        <input type="tel" class="simulation-price" id="serviceCharge" autocomplete="off">
                        <p>
                            <input type="radio" name="typeServiceCharge" id="typeServiceCharge"
                                   value="%" checked>%<br>
                            <input type="radio" name="typeServiceCharge" id="typeServiceCharge"
                                   value="$">$<br>
                        </p>
                        <!-- <input type="text" class="simulation-price" id="descriptionServiceCharge"
                                placeholder="Descrição" autocomplete="off">-->
                    </div>
                    <div class="">
                        <p>
                            <input type="checkbox" id="disableOnPromotional">
                            <label for="disableOnPromotional">Desabilitar comissão no preço promocional</label>
                        </p>
                        <!-- <input type="text" class="simulation-price" id="descriptionServiceCharge"
                            placeholder="Descrição" autocomplete="off">-->
                    </div>
                </div>
            </details>

            <details>
                <summary>Formas de Pagamentos/Taxas</summary>
                <div id="typePaymentTrip"></div>
            </details>

            <?php if ($this->hasPermission(GroupConst::TARIFAS, 'cashback')) { ?>
                <details>
                    <summary>CashBack</summary>
                    <div style="margin-left: 0vw" class="row">
                        <div class="col-lg-4  form-group">
                            <input class="col-lg-12 form-control" id="value-cash-back">
                        </div>
                        <div style="display: inline; margin-top: -0.3vw" class="col-lg-1">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="valueType" id="exampleRadios1"
                                       value="%" checked>
                                <label class="form-check-label" for="exampleRadios1">
                                    %
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="valueType" id="exampleRadios2"
                                       value="$">
                                <label class="form-check-label" for="exampleRadios2">
                                    $
                                </label>
                            </div>
                        </div>
                        <div style="margin-left: -1vw" class="col-lg-12">
                            <div class="form-check">
                                <div class="custom-control custom-switch">
                                    <input type="checkbox" class="custom-control-input" id="addToFinalPrice">
                                    <label class="custom-control-label" for="addToFinalPrice">Soma a tarifa
                                        final</label>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <b>Saldo direcionado para</b>
                        </div>
                        <div class="col-lg-12">
                            <div class="col-lg-12">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="backToTripBalance" id="voucher"
                                           value="false" checked>
                                    <label class="form-check-label" for="voucher">
                                        Voucher
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="backToTripBalance" id="app"
                                           value="true">
                                    <label class="form-check-label" for="app">
                                        Conta App
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12">
                            <table class="table table-striped">
                                <thead>
                                <tr>
                                    <th scope="col">Criado em</th>
                                    <th scope="col">Valor</th>
                                </tr>
                                </thead>
                                <tbody id="mount-table-cashback">

                                </tbody>
                            </table>
                        </div>
                        <div class="center">
                            <button id="save-cash-back" class="btn btn-primary">Salvar CashBack</button>
                        </div>
                    </div>
                </details>
            <?php } ?>
            <details id="price-range-list">
                <summary>Faixa de preços</summary>
                <div class="row col-lg-12">
                    <div class="col-lg-12">
                        <form class="form-group col-lg-12">
                            <span>Descrição</span>
                            <textarea id="description_value" class="form-control col-lg-12"></textarea>
                        </form>
                    </div>
                    <div class="col-lg-12">
                        <div class="col-lg-3 form-group">
                            <label class="">De R$</label>
                            <input id="min_value" class="form-control">
                        </div>
                        <div class="col-lg-3 form-group">
                            <label class="">Até R$</label>
                            <input id="max_value" class="form-control">
                        </div>
                        <span style="margin-top: 1.5vw">=</span>
                        <div class="col-lg-3 form-group">
                            <label class="">Cobrar R$</label>
                            <input id="new_value" class="form-control">
                        </div>
                        <div class="col-lg-3">
                            <button id="save-prince-range" class="btn">Salvar</button>
                        </div>
                    </div>

                    <div class="col-lg-12">
                        <table class="table table-striped">
                            <thead>
                            <tr>
                                <th scope="col">Nome</th>
                                <th scope="col">Inicial</th>
                                <th scope="col">Final</th>
                                <th scope="col">Fixo</th>
                                <th scope="col">Tipo</th>
                            </tr>
                            </thead>
                            <tbody style="font-size: 1vw" id='mount-price-range'>
                            </tbody>
                        </table>
                    </div>
                </div>
            </details>
            <details id="fees-option">
                <summary>Taxas</summary>
                <div class="row col-lg-13 d-flex justify-content-center">
                    <div id="mount-list-tax" class="d-flex flex-column"></div>
                    <div id="newForm"></div>
                    <div class="d-flex justify-content-center flex-column w-100">
                        <button class="btn btn-primary mt-1" id="addForToNewFee">Nova Taxa</button>
                    </div>
                </div>
            </details>

            <hr>
            <button type="button" id="updateRatePrice">ATUALIZAR</button>
            <hr>
            <button type="button" id="disable-trip-type">DESABILITAR CHAMADO</button>

        </div>
        <div class="option-menu-rate center" value="2">
            <img id="inprogress-calculate" style="width: 10vw">
        </div>
    </div>
</div>

<div class="container-option-price">
    <ul>
        <li class="btn-option-menu" value="1">
            <i class="material-icons">settings</i>
        </li>
        <li class="btn-option-menu" value="2">
            <i class="material-icons">map</i>
        </li>
    </ul>
</div>


<div class="modal" tabindex="-1" role="dialog" id="modal-type-trip">
    <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Adicionar nova tarifa</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="mount-here-trip-types">
            </div>
        </div>
    </div>
</div>



