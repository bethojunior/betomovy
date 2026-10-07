<div class="container-detail-customer">
    <div class="info-customer">
        <div class="profile-driver">
            <div id="profileDriverImage"></div>
        </div>
        <div class="data-driver">
            <p>
                <i class="material-icons">
                    person_outline
                </i>
                <span class="name-customer"></span>
            </p>
            <p>
                <i class="material-icons">
                    email
                </i>
                <span class="email-customer"></span>
            </p>
            <p>
                <i class="material-icons">
                    phone
                </i>
                <span class="phone-customer"></span>
            </p>
            <p>
                <i class="material-icons">stars</i>
                <span class="rating-driver">0</span>
            </p>
        </div>
        <div class="info-trips-driver">
            <p>Informações de viagem</p>
            <div>
                <div>
                    <label>Total de viagem</label>
                    <p class="total-trips">0</p>
                </div>
                <div>
                    <label>Total de finalizadas</label>
                    <p class="total-completed-trips">0</p>
                </div>
                <div>
                    <label>Total de canceladas</label>
                    <p class="total-canceled-trips">0</p>
                </div>
            </div>
        </div>
    </div>
    <div class="info-trips-customer">
        <div>
            <select id="statusTrip">
                <option value="">TODOS</option>
                <option value="not_answered">não atendida</option>
                <option value="back_off">desistência</option>
                <option value="finished">finalizada</option>
                <option value="canceled">cancelada</option>
                <option value="searching">procurando</option>
                <option value="payment_refused">pagamento recusado</option>
                <option value="accepted">aceita</option>
                <option value="boarding">embarcando</option>
                <option value="in_progress">em corrida</option>

            </select>
            <div>
                <label for="dateStart">De</label>
                <input type="date" id="dateStart">
            </div>
            <div>
                <label for="dateEnd">Até</label>
                <input type="date" id="dateEnd">
            </div>
            <button type="button" id="btnSearchTripIn">PESQUISAR</button>
        </div>
        <ul id="listTripCustomer"></ul>
    </div>
    <div class="info-trip">
        <ul>
            <li class="option-trip active" value="generalInformation">INFORMAÇÕES GERAIS</li>
            <li class="option-trip" value="chatTripCustomer">CHAT</li>
            <li style="display: none" class="option-trip" value="settingTripCustomer">OPÇÕES</li>
            <li style="display: none" class="option-trip" value="settingTripCustomerMap">MAPA</li>
            <li class="close-modal-customer-detail"><i class="material-icons">close</i></li>
        </ul>
        <div id="generalInformation">
            <div>
                <p>Origem: <span id="originTripCustomer"></span></p>
                <p>Destino: <span id="destinationTripCustomer"></span></p>
            </div>
            <div>
                <div>
                    <p>Código: <span id="tripReferenceTripCustomer"></span></p>
                    <p>Data: <span id="dateTripCustomer"></span></p>
                    <p>Pagamento: <span id="paymentTripCustomer"></span></p>

                </div>
                <div>
                    <p>Status: <span id="statusTripCustomer"></span></p>
                    <p id="cancelByCustomerTrip"></p>
                    <p>Valor:<span id="valueTripCustomer"></span></p>
                    <p style="opacity: 0;">Estado: <span id="stateTripCustomer"></span></p>
                </div>
            </div>
            <div style="background: white">
                <div class="profile-image-driver"></div>
                <div>
                    <div>
                        <p>Motorista: <span id="driverNameTripCustomer"></span></p>
                    </div>
                    <div>
                        <p>Contato: <span id="driverPhoneTripCustomer"></span></p>
                    </div>
                </div>
            </div>
        </div>
        <div id="chatTripCustomer">
            <ul id="listChatTripCustomer">
            </ul>
        </div>
        <div id="settingTripCustomer">

        </div>
        <div id="settingTripCustomerMap">
            <div class="map-trip-customer">
                <ul id="listStatusDetailTrip"></ul>
                <div class="container-map"></div>
            </div>
        </div>
        
    </div>
</div>