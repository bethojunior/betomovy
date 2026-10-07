<div class="container-main">
    <div class="nr-page">

        <!-- ── Cabeçalho ── -->
        <div class="nr-header">
            <h1 class="nr-title">Bairro para bairro</h1>
            <div class="nr-header__actions">
                <button type="button" id="activeNeighborhoodRide" class="nr-btn-toggle">
                    Ativar bairro para bairro
                </button>
                <button type="button" class="nr-btn-add valueByNeighborhood"
                        data-toggle="modal" data-target="#AddValueByNeighborhood">
                    + Cadastrar rota
                </button>
            </div>
        </div>

        <!-- ── Tabela ── -->
        <div class="nr-table-wrap">
            <table class="nr-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Origem</th>
                        <th>Destino</th>
                        <th>Valor</th>
                        <th>Cidade</th>
                        <th>Tipo</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="resultTable"></tbody>
            </table>
        </div>

        <div class="container-pagination"></div>

    </div>
</div>

<!-- ── Modal: Adicionar rota ── -->
<div class="modal fade" id="AddValueByNeighborhood" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content app-modal">

            <div class="modal-header app-modal__header">
                <h5 class="modal-title app-modal__title">Adicionar rota</h5>
                <button type="button" class="close app-modal__close" data-dismiss="modal">
                    <span>&times;</span>
                </button>
            </div>

            <div class="modal-body app-modal__body">

                <!-- Busca de bairro -->
                <div class="app-field">
                    <label class="app-label" for="nameZone">Bairro / Localidade</label>
                    <div class="nr-search-group">
                        <input type="text" class="app-input form-control"
                               id="nameZone" placeholder="Ex.: Aldeota, Fortaleza">
                        <button type="button" class="nr-btn-search" id="btnSearchLocal">
                            <i class="material-icons mi-md">search</i>
                            Pesquisar
                        </button>
                    </div>
                </div>

                <!-- Mapa + sugestões -->
                <div id="contentMap" hidden>
                    <div class="nr-map-wrap">
                        <div class="nr-suggestions">
                            <p class="nr-suggestions__title">Sugestões</p>
                            <ul id="listGroupAddress" class="nr-suggestions__list"></ul>
                        </div>
                        <div id="map" class="nr-map"></div>
                    </div>
                </div>

                <!-- Botão inserir local -->
                <button type="button" class="nr-btn-insert" id="save-location">
                    <i class="material-icons mi-md">add_location_alt</i>
                    Inserir local
                </button>

                <!-- Locais selecionados -->
                <ul class="nr-locations">
                    <li class="nr-location origin-data-container" hidden>
                        <div class="nr-location__row">
                            <span class="nr-location__dot nr-location__dot--origin"></span>
                            <span id="origin-data" class="nr-location__name"></span>
                            <button type="button" class="nr-location__remove" id="origin-data-btn">&times;</button>
                        </div>
                    </li>
                    <li class="nr-location destiny-data-container" hidden>
                        <div class="nr-location__row">
                            <span class="nr-location__dot nr-location__dot--destiny"></span>
                            <span id="destiny-data" class="nr-location__name"></span>
                            <button type="button" class="nr-location__remove" id="destiny-data-btn">&times;</button>
                        </div>
                    </li>
                </ul>

                <!-- Valor + Tipo -->
                <div class="nr-form-row">
                    <div class="app-field">
                        <label class="app-label" for="price">Valor (R$)</label>
                        <input type="number" class="app-input form-control"
                               id="price" placeholder="0,00">
                    </div>
                    <div class="app-field">
                        <label class="app-label" for="tripTypes">Tipo de viagem</label>
                        <select class="app-input app-select custom-select" id="tripTypes"></select>
                    </div>
                </div>

                <!-- Toggle ativada -->
                <label class="nr-toggle-label" for="toggle">
                    <input type="checkbox" class="custom-control-input nr-checkbox" id="toggle" checked>
                    <span class="nr-toggle-track">
                        <span class="nr-toggle-thumb"></span>
                    </span>
                    <span class="nr-toggle-text">Ativada</span>
                </label>

            </div>

            <div class="modal-footer app-modal__footer">
                <button type="button" class="app-btn app-btn--cancel" data-dismiss="modal">Cancelar</button>
                <button type="button" class="app-btn app-btn--confirm" id="btnAddZone">Salvar rota</button>
            </div>

        </div>
    </div>
</div>
