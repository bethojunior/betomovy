<div class="modal-edit-scheduled-trip">
    <div>
        <div class="data-customer">
            <i class="material-icons data-customer-icon">edit</i>
            <h6><strong>Editar viagem agendada</strong></h6>
            <i class="material-icons close-edit-scheduled-trip">close</i>
        </div>
        <div class="data-trip">
            <div class="edit-scheduled-field">
                <label>Origem</label>
                <input type="text" id="editScheduledOrigin" class="edit-scheduled-address-input" readonly autocomplete="off" placeholder="Local de partida">
            </div>

            <div class="edit-scheduled-field">
                <label>Paradas</label>
                <div id="editScheduledWaypoints"></div>
                <a href="#" class="edit-scheduled-add-waypoint-btn" id="btnAddEditScheduledWaypoint">
                    <i class="material-icons">add</i> Adicionar parada
                </a>
            </div>

            <div class="edit-scheduled-field">
                <label>Destino</label>
                <input type="text" id="editScheduledDestination" class="edit-scheduled-address-input" readonly autocomplete="off" placeholder="Para onde ?">
            </div>

            <div class="edit-scheduled-row">
                <div class="edit-scheduled-field">
                    <label>Valor (R$)</label>
                    <div class="edit-scheduled-price-row">
                        <input type="text" id="editScheduledPrice" class="input-value-price">
                        <button type="button" id="btnRecalculateScheduledPrice" class="edit-scheduled-recalculate-btn" aria-disabled="true">
                            <i class="material-icons">refresh</i>
                            <span class="app-tooltip">Recalcular preço</span>
                        </button>
                    </div>
                </div>
                <div class="edit-scheduled-field">
                    <label>Data e hora do agendamento</label>
                    <input type="datetime-local" id="editScheduledDate">
                </div>
            </div>
            <span class="edit-scheduled-recalc-hint" id="editScheduledRecalcHint">Endereços alterados — recalcule o preço antes de salvar.</span>

            <div class="edit-scheduled-group-field" id="editScheduledGroupField" style="display: none">
                <label class="edit-scheduled-group-check" for="editScheduledApplyGroup">
                    <input type="checkbox" id="editScheduledApplyGroup">
                    Aplicar endereço, paradas e valor às outras viagens deste lote
                </label>
            </div>
        </div>
        <div class="data-footer">
            <button type="button" id="btnSaveEditScheduledTrip">SALVAR</button>
            <button type="button" id="btnCancelEditScheduledTrip">CANCELAR</button>
        </div>

        <div class="edit-scheduled-search-local">
            <i class="material-icons back-edit-scheduled-search">arrow_back</i>
            <div class="edit-scheduled-search-content">
                <input type="text" class="edit-scheduled-search-input" autocomplete="off" placeholder="Buscar endereço...">
            </div>
            <ul id="editScheduledSearchResults"></ul>
        </div>
    </div>
</div>
