<div class="container-monitor">
    <div class="container-list-city">
        <label>Cidade:</label>
        <h4 id="citySelectedMap">-</h4>
        <ul>
            <li class="option-mobile active" value="">Mapa</li>
            <li class="option-mobile" value="menu-verical">Corridas</li>
            <li class="option-mobile" value="details-footer">Detalhes</li>
        </ul>
    </div>
    <div class="option-item-map">
        <i class="material-icons">more_vert</i>
    </div>
    <div class="menu-verical">
        <div class="current-trips">
            <h4>Viagens</h4>
            <ul id="listTrips">
            </ul>
            <ul class="trip-scheduled">
                <div id="get-trip-scheduled">
                    <button class="btn btn-primary icon arrow-list">Agendadas</button>
                </div>
            </ul>
        </div>
    </div>
    <div id="map" class="map-monitor"></div>

    <ul class="option-driver-map">
        <li class="option-driver" value="disponivel,desligado,corrida">Todos</li>
        <li class="option-driver active" value="disponivel,corrida">Ativos</li>
    </ul>
        <div class="details-footer">
        <button type="button" id="updateQuantities">Atualizar valores</button>
        <div>
            <label>Viagens</label>
            <p id="todayQuantity">-</p>
            <div>
                <div>
                    <span id="acceptedQuantity">-</span>
                    <label>Aceitas</label>
                </div>
                <div>
                    <span id="finally">-</span>
                    <label>Finalizadas</label>
                </div>
            </div>
        </div>
        <div>
            <label>Canceladas</label>
            <p id="totalCanceled">-</p>
            <div>
                <div>
                    <span id="totalCanceledByDriver">-</span>
                    <span>motorista</span>
                </div>
                <div>
                    <span id="totalCanceledByCustomer">-</span>
                    <span>cliente</span>
                </div>

            </div>
        </div>
        <div>
            <label>Corridas</label>
            <ul>
                <li>Dinheiro: <span id="totalMoneyTrips">-</span></li>
                <li>Voucher: <span id="totalVoucherTrips">-</span></li>
                <li>Cartão: <span id="totalCardTrips">-</span></li>
            </ul>
        </div>
        <div>
            <label>Não atendidas</label>
            <p id="noAccepted">-</p>
            <div>&nbsp;</div>
        </div>
        <div class="total-price-container">
            <button class="material-icons more-information" data-target="#modal-details" data-toggle="modal">info</button>
            <label>Total Hoje</label>
            <p id="totalPriceFinished">-</p>
        </div>
    </div>
</div>

<div class="modal" tabindex="-1" id="modal-trip-scheduled" role="dialog">
        <div class="modal-dialog" role="document">
               <div class="modal-content">
                        <div class="modal-header">
                               <h5 class="modal-title">Viagens Agendadas</h5>
                               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                               </button>
                        </div>
                        <div class="modal-body modal-body-trip-scheduled">
                                <ul class="scheduled-trips show-scheduled" id="mount-list-trip"> </ul>
                        </div>
                        <div class="modal-footer">
                                <button type="button" class="btn btn-primary" data-dismiss="modal">Fechar</button>
                        </div>
               </div>
        </div>
</div>

<div class="modal" tabindex="-1" role="dialog" id="modal-trip">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Modal title</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p>Modal body text goes here.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
            </div>
        </div>
    </div>
</div>

<div id="modal-notification-panic" class="modal" tabindex="-1" role="dialog" style=" background: rgba(255, 0, 0,0.5)">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Botão de pânico acionado</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="mount-notifications">
                <div class="row col-lg-12">
                    <div style="margin-top: 1vw" class="col-lg-12">
                        <div class="col-lg-12">
                            <div id="what-do"></div>
                            <span class="col-lg-12 center" id="message-panic"></span>
                            <div id="alert-photo"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <!--                    <button id="find-trip" name="" type="button" class="btn btn-info" data-dismiss="modal">Abrir no mapa</button>-->
                    <button style="display: none" id="open-trip" trip="" type="button" class="btn btn-info" data-dismiss="modal">Abrir viagem</button>
                    <button id="panic-read" type="button" class="btn btn-info" data-dismiss="modal">Marcar como lido</button>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal" tabindex="-1" role="dialog" id="modal-details">
    <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Detalhes das viagens de hoje</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body details-modal-body">
                <ul class="list-group">
                    <h6>Viagens</h6>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Aceitas</span>
                        <span id="acceptedQuantityModal"></span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Finalizadas</span>
                        <span id="finallyModal"></span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between list-group-item-secondary">
                        <span>Total de viagens</span>
                        <span id="todayQuantityModal"></span>
                    </li>
                </ul>
                <ul class="list-group">
                    <h6>Viagens Canceladas</h6>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Por motorista</span>
                        <span id="totalCanceledByDriverModal"></span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Por cliente</span>
                        <span id="totalCanceledByCustomerModal"></span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between list-group-item-secondary">
                        <span>Total de cancelamentos</span>
                        <span id="totalCanceledModal"></span>
                    </li>
                </ul>
                <ul class="list-group">
                    <h6>Corridas não atendidas</h6>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Clientes que não conseguiram viagem</span>
                        <span id="noAcceptedClientModal"></span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Clientes perdidos</span>
                        <span id="noAcceptedClientLostModal"></span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between list-group-item-secondary">
                        <span>Total de viagens não atendidas</span>
                        <span id="noAcceptedTotalModal"></span>
                    </li>
                </ul>
                <ul class="list-group">
                    <h6>Corridas</h6>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Em dinheiro</span>
                        <span id="totalMoneyTripsModal"></span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Em voucher</span>
                        <span id="totalVoucherTripsModal"></span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between">
                        <span>Cartão</span>
                        <span id="totalCardTripsModal"></span>
                    </li>
                </ul>
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between list-group-item-secondary total-today-container">
                        <span>Total de hoje</span>
                        <span id="totalPriceFinishedModal"></span>
                    </li>
                </ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">Fechar</button>
            </div>
        </div>
    </div>
</div>
