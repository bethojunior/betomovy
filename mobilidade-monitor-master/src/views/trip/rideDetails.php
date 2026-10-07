<div class="container-default-monitor">
    <div class="container">
        <div class="container-details-trip">
            <div>
                <p id="dateTimeTrip">-</p>
                <div class="info-driver">
                    <div class="photo-driver"></div>
                    <div class="status-trip">
                        <span class="name-driver"></span>
                        <span class="type-driver"></span>
                        <span class="balance-in-start-call-driver" style="font-size: 18px"></span>
                    </div>
                </div>
<!--                <button type="button" class="btn btn-link" id="openModalMap">Ver mais detalhes no mapa</button>-->
                <img id="imageTrip">
                <div class="container-info-trip">
                    <div>
                        <span>Tipo</span>
                        <p id="tripType">-</p>
                    </div>
                    <div>
                        <span>Km Original</span>
                        <p id="km"></p>
                    </div>
                    <div>
                        <span>Duração Original</span>
                        <p id="durationTrip">-</p>
                    </div>
                    <div>
                        <span>Preço Total</span>
                        <p class="price-trip-total">-</p>
                    </div>
                </div>
                <div class="container-info-trip" id="contentRecalculated" style="display: none">
                    <div>
                        <span></span>
                        <p>Real</p>
                    </div>
                    <div>
                        <span>Km Real</span>
                        <p id="kmRecalculated">-</p>
                    </div>
                    <div>
                        <span>Duração Real</span>
                        <p id="durationTripRecalculated">-</p>
                    </div>
                    <div>
                        <span>Preço Real</span>
                        <p id="priceRecalculated">-</p>
                    </div>
                </div>
                <ul>
                    <li>
                        <div id="originTrip">-</div>
                    </li>
                    <li>
                        <div id="destinationTrip">-</div>
                    </li>
                </ul>
                <span id="gps-fake"> </span>
            </div>
            <div>
                <div>
                    <ul class="list-driver-called"></ul>
                </div>
                <p class="font-weight-bold">Clientes do Chamado: </p>
                <div class="client-request d-flex justify-content-center"></div>

                <div class="d-flex justify-content-between mt-2">
                    <p class="font-weight-bold" id="fieldClient">Cliente: </p>
                    <div class="client-name"></div>
                </div>

                <div class="observation-container justify-content-between mt-4" style="display: none">
                    <p class="font-weight-bold">Motivo da viagem:</p>
                    <p id="observationTrip" class="text-right"></p>
                </div>
                <hr/>
                <div class="container-info-trip-details">
                    <div>
                        <span>Status</span>
                        <p id="currentStatusTrip"></p>
                    </div>
                    <div id="tripCanceledContainer" class=" justify-content-between" style="display: none">
                        <span>Cancelada por</span>
                        <p id="tripCanceledBy"></p>
                    </div>
                    <div>
                        <span>Situação</span>
                        <p id="situationTrip">-</p>
                    </div>
                    <div>
                        <span>Tipo de chamado</span>
                        <p id="tripCallType">-</p>
                    </div>
                </div>
                <p></p>
                <ul>
                    <li>
                        <span>Total cobrado</span>
                        <span class="price-trip-total">-</span>
                    </li>
                </ul>
                <div class="container-list-button">
                    <button type="button" class="btn btn-dark" id="btnReleaseTrip" hidden>Liberar Corrida</button>
                    <button type="button" class="btn btn-dark" id="viewMessage">Ver Mensagens</button>
                    <button type="button" class="btn btn-dark" id="cancelTrip" hidden>Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal" id="customerRideTrip">
    <div class="modal-dialog modal-lg"
    ">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Dados Cliente</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body"><div class="documents-user row" id="customerRideTripDetails" style="margin-left: 5px"></div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
        </div>
    </div>
</div>
