<div class="container-main">
    <div class="td-page">

        <!-- ── Cabeçalho ── -->
        <div class="td-header">
            <div class="td-header__left">
                <a href="/trip/list" class="td-back" title="Voltar para Viagens">
                    <i class="material-icons">arrow_back</i>
                </a>
                <div class="td-header__info">
                    <div class="td-header__badge-row">
                        <span class="td-badge td-badge--primary">Auditoria de Viagem</span>
                        <span class="td-badge td-badge--return" id="haveReturn" style="display: none;"></span>
                    </div>
                    <h1 class="td-title">Detalhes da Corrida</h1>
                    <span class="td-subtitle" id="dateTimeTrip">Carregando dados da viagem...</span>
                </div>
            </div>
            <div class="td-header__actions">
                <button type="button" class="td-btn td-btn--outline" onclick="window.print()">
                    <i class="material-icons">print</i>
                    <span>Imprimir Comprovante</span>
                </button>
            </div>
        </div>

        <!-- ── Layout de Detalhes ── -->
        <div class="td-grid">

            <!-- Coluna Principal (Esquerda): Mapa, Indicadores e Rota -->
            <div class="td-col-main">

                <!-- Card do Mapa Estático -->
                <div class="td-card td-card--map">
                    <div class="td-map-wrap">
                        <img id="imageTrip" alt="Mapa do Trajeto da Corrida" class="td-map-img">
                        <div class="td-map-overlay">
                            <span class="td-map-tag"><i class="material-icons">map</i> Trajeto Percorrido</span>
                        </div>
                    </div>

                    <!-- Métricas Principais da Corrida -->
                    <div class="container-info-trip td-metrics">
                        <div class="td-metric-item">
                            <span class="td-metric-label">Categoria</span>
                            <p class="td-metric-value" id="tripType">-</p>
                        </div>
                        <div class="td-metric-item">
                            <span class="td-metric-label">Duração</span>
                            <p class="td-metric-value" id="durationTrip">-</p>
                        </div>
                        <div class="td-metric-item">
                            <span class="td-metric-label">Valor Final</span>
                            <p class="td-metric-value td-metric-value--price price-trip">-</p>
                        </div>
                    </div>
                </div>

                <!-- Card de Timeline da Rota (Origem, Waypoints, Destino) -->
                <div class="td-card td-card--route">
                    <div class="td-card__header">
                        <i class="material-icons td-card__icon">timeline</i>
                        <div>
                            <h2 class="td-card__title">Itinerário da Viagem</h2>
                            <p class="td-card__desc">Ponto de partida, paradas adicionais e destino final</p>
                        </div>
                    </div>

                    <div class="td-card__body">
                        <ul id="tripRouteDetails" class="td-route-list">
                            <li class="td-route-item td-route-item--origin">
                                <div class="td-route-pin td-route-pin--origin"></div>
                                <div class="td-route-info" id="originTrip">
                                    <span class="td-route-addr">Ponto de Partida</span>
                                    <span class="td-route-time">-</span>
                                </div>
                            </li>
                            <li class="td-route-item td-route-item--dest">
                                <div class="td-route-pin td-route-pin--dest"></div>
                                <div class="td-route-info" id="destinationTrip">
                                    <span class="td-route-addr">Destino Final</span>
                                    <span class="td-route-time">-</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>

            <!-- Coluna Lateral (Direita): Detalhamento Financeiro e Recibo -->
            <div class="td-col-side">
                <div class="td-card td-card--receipt">
                    <div class="td-receipt-header">
                        <div class="td-receipt-logo">
                            <img src="/webfiles/img/logo/logo.png" onerror="this.onerror=null; this.src='/webfiles/img/logo/logo.png';" alt="MOVY">
                        </div>
                        <h3 class="td-receipt-title">Detalhamento do Preço</h3>
                        <p class="td-receipt-sub">Composição da tarifa cobrada</p>
                    </div>

                    <div class="td-receipt-body">
                        <ul class="td-receipt-items">
                            <li class="td-receipt-item">
                                <span class="td-receipt-item__name">Tarifa Base da Viagem</span>
                                <span class="td-receipt-item__value price-trip">-</span>
                            </li>
                            <li class="td-receipt-item">
                                <span class="td-receipt-item__name">Subtotal do Percurso</span>
                                <span class="td-receipt-item__value price-trip">-</span>
                            </li>
                            <li class="td-receipt-item">
                                <span class="td-receipt-item__name">Taxa de Serviço da Central</span>
                                <span class="td-receipt-item__value">Inclusa</span>
                            </li>
                            <li class="td-receipt-item">
                                <span class="td-receipt-item__name">Pedágios & Encargos Extras</span>
                                <span class="td-receipt-item__value">$0.00</span>
                            </li>
                        </ul>

                        <div class="td-receipt-total">
                            <div class="td-receipt-total__label">
                                <strong>Total Pago</strong>
                                <small>Valor liquidado pelo passageiro</small>
                            </div>
                            <span class="td-receipt-total__amount price-trip">-</span>
                        </div>
                    </div>

                    <div class="td-receipt-footer">
                        <i class="material-icons">verified</i>
                        <span>Viagem auditada pelo sistema operacional MOVY Central.</span>
                    </div>
                </div>
            </div>

        </div>

    </div>
</div>
