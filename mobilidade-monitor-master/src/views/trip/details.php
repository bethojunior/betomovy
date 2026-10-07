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
                <button type="button" class="btn btn-link" id="openModalMap">Ver mais detalhes no mapa</button>
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
                        <span>Preço Original</span>
                        <p class="price-trip">-</p>
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
                    <div id="wayPointsTripDetails"></div>
                    <li>
                        <div id="destinationTrip">-</div>
                    </li>
                </ul>
                <span id="gps-fake"> </span>
                <hr />
                <div>
                    <p>Bônus gerados ao motorista:</p>
                    <ul id="listFareTrip"></ul>
                </div>
                <div>
                    <ul id="tripCancellationFee"></ul>
                </div>
            </div>
            <div>
                <p>Motoristas chamados</p>
                <div>
                    <ul class="list-driver-called"></ul>
                </div>
                <p class="font-weight-bold">Titular do Chamado: </p>
                <div class="client-request"></div>
                <hr>

                <div class="d-flex justify-content-between mt-2">
                    <p class="font-weight-bold" id="fieldClient">Cliente: </p>
                    <div class="client-name"></div>
                </div>

                <div class="client-documents d-flex justify-content-between mt-4">
                    <p class="font-weight-bold">Documentos do cliente</p>
                    <button class="btn-sm btn-dark w-25" id="btnDocumentClient">Ver</button>
                </div>
                <div class="observation-container justify-content-between mt-4" style="display: none">
                    <p class="font-weight-bold">Motivo da viagem:</p>
                    <p id="observationTrip" class="text-right"></p>
                </div>
                <hr />
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
                <p>Detalhamento do preço</p>
                <ul>
                    <li>
                        <span>Multiplicador (Dinâmica,Bandeiras,Gatilhos)</span>
                        <span id="multiplierDynamic">-</span>
                    </li>
                    <li>
                        <span>Preço base</span>
                        <span class="price-base-trip">-</span>
                    </li>
                    <li>
                        <span>Preço KM <span id="resumePriceKm"></span></span>
                        <span class="price-km-trip">-</span>
                    </li>
                    <li>
                        <span>Preço minuto <span id="resumePriceMin"></span></span>
                        <span class="price-min-trip">-</span>
                    </li>
                    <li>
                        <span>Taxa motorista <span id="resumeTaxDriver"></span></span>
                        <span id="taxDriver">-</span>
                    </li>
                    <li id="partnerCommission" style="display: none;">

                    </li>
                    <li>
                        <span>Taxa 1 <span id="tax1Description"></span></span>
                        <span id="tax1">-</span>
                    </li>
                    <li>
                        <span>Taxa 2 <span id="tax2Description"></span></span>
                        <span id="tax2">-</span>
                    </li>
                    <li>
                        <span>Taxa por forma de pagamento <span id="taxPayDescription"></span></span>
                        <span id="taxPay">-</span>
                    </li>
                    <li id="dynamicsFee" class="flex-column">

                    </li>
                    <li style="flex-direction: column;">
                        <p>Pedágios</p>
                        <ul id="listTolls">
                        </ul>
                    </li>
                    <li id="liCancellationFeePaid" class="flex-column">
                        <div class="d-flex justify-content-between">
                            <span>Taxa de Cancelamento</span>
                            <span id="cancellationFeePaid"></span>
                        </div>
                        <span id="tripReferenceCancellationFeeGenerated" class="ml-3 mt-3"></span>
                    </li>
                    <li>
                        <span>Paradas <span id="resumeWaypoint"></span></span>
                        <span id="valueWaypoint">-</span>
                    </li>
                    <li>
                        <span>Valor por longa distância</span>
                        <span id="tripLongDistance">-</span>
                    </li>
                    <li>
                        <span>Distância para cobrar valor adicional</span>
                        <span class="km-additional">-</span>
                    </li>
                    <li>
                        <span>Valor adicional</span>
                        <span class="price-to-km-additional">-</span>
                    </li>
                    <li>
                        <span>Preço estimado</span>
                        <span class="price-trip">-</span>
                    </li>
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

<div class="modal" id="documentModal">
    <div class="modal-dialog modal-lg" ">
    <div class=" modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Documentos do cliente</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <div class="documents-user row" id="contentGallery"></div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
        </div>
    </div>
</div>
</div>