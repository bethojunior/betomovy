<!-- Movy Central Deploy: 2026-10-28 02:36 UTC - Uber Layout Avançar & Modal Dados Fix -->
<div class="container-main-map">
    <div class="list-trips-active-partner">
        <div class="container-trips">
            <div class="header-trips">
                <i class="material-icons close-trip-actives">arrow_back</i>
                <svg class="header-trips__whatsapp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <path fill="currentColor" d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                </svg>
                <p style="display: none">Viagens Ativas</p>
                <button type="button" class="header-trips__scheduled-toggle active" id="toggleScheduledTrips" style="display: none">
                    <span class="header-trips__scheduled-count" id="scheduledTripsCount">0</span>
                    Agendadas
                    <i class="material-icons">visibility_off</i>
                </button>
                <button type="button" class="header-trips__filter-toggle" id="toggleActiveTripsFilter" aria-label="Filtrar viagens">
                    <i class="material-icons">tune</i>
                </button>
                <div class="header-trips__filter-dropdown" id="activeTripsFilterDropdown">
                    <label class="header-trips__filter-label">Cliente</label>
                    <input type="text" class="header-trips__filter-text-input" id="activeTripsFilterCustomerName" placeholder="Nome do cliente">

                    <label class="header-trips__filter-label">Motorista</label>
                    <input type="text" class="header-trips__filter-text-input" id="activeTripsFilterDriverName" placeholder="Nome do motorista">

                    <label class="header-trips__filter-label">Status</label>
                    <select class="header-trips__filter-select" id="activeTripsFilterStatus">
                        <option value="">Todos os status</option>
                        <option value="searching">Buscando motorista</option>
                        <option value="pre_accepted">Aceita (em espera)</option>
                        <option value="accepted">Aceita</option>
                        <option value="boarding">Embarcando</option>
                        <option value="in_progress">Em viagem</option>
                    </select>

                    <div class="header-trips__filter-actions">
                        <button type="button" class="header-trips__filter-clear" id="btnClearActiveTripsFilter">Limpar</button>
                        <button type="button" class="header-trips__filter-apply" id="btnApplyActiveTripsFilter">Filtrar</button>
                    </div>
                </div>
            </div>
            <div class="body-trips">
                <div class="mt-4 list-trip-message-wrap">
                    <p class="text-center" id="listTripMessage"></p>
                    <svg class="list-trip-message__whatsapp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                        <path fill="currentColor" d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                    </svg>
                </div>
                <ul class="border-0" id="listTripPartner"></ul>
            </div>
        </div>
        <div class="nav-drawer">
            <i class="material-icons">
                arrow_forward_ios
            </i>
        </div>
    </div>
    <div id="mapWrapper" class="map-client">
        <div class="container-trip-active">
            <button type="button" class="btn btn-primary" id="showMessageTripActive">Viagens Ativas</button>
            <button type="button" class="btn btn-success btn-whatsapp-call" id="showWhatsappTripActive">
                <svg class="trip-active-map-btn__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <path fill="currentColor" d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                </svg>
                <span class="trip-active-map-btn__label">Chamados WhatsApp</span>
            </button>
        </div>
        <div class="container-chat-map">
            <div class="box-chat">
                <img class="img-chattrip" src="<?php echo Host::getLocal() ?>webfiles/img/icon/chat.png">
            </div>
            <div class="container-box-chat">
                <i class="material-icons close-chat">arrow_back</i>
                <ul class="list-chat"></ul>
                <div class="container-chat-open">
                    <div class="title-chat">
                        <span id="nameDriverChat"></span>
                        <i class="material-icons close-box-chat">arrow_back</i>
                    </div>
                    <div class="container-chat">
                        <ul id="centralMessages"></ul>
                        <div>
                            <input type="text" placeholder="Digite uma mensagem..." id="sendMessageByCentral" />
                            <button type="button" class="btn-send-messaga" id="btnSendMessage">Enviar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="mapClient" class="map-client map-loading"></div>
        <div class="btn-call-trip">
            <button type="button" class="option-selected-customer-trip" id="openModalFindCustomer">PROCURAR CLIENTE</button>
            <button type="button" class="option-selected-customer-trip" id="openModalFindDriver">PROCURAR MOTORISTA</button>
            <button type="button" class="option-selected-customer-trip" id="callToCentral">CHAMAR PARA CENTRAL</button>
        </div>
        <!-- MOVY SEARCH DRIVER — UBER-STYLE BOTTOM SHEET -->
        <div class="search-driver-in-trip">
            <!-- Overlay escuro atrás do sheet -->
            <div class="sdit-overlay"></div>

            <!-- Bottom Sheet principal -->
            <div class="sdit-sheet">

                <!-- Handle bar -->
                <div class="sdit-handle"></div>

                <!-- Linear Indeterminate Progress Bar (Uber Style) -->
                <div class="sdit-progress-bar">
                    <div class="sdit-progress-indeterminate"></div>
                </div>

                <!-- ══════ STATE: SEARCHING ══════ -->
                <div class="sdit-state sdit-state-searching">

                    <!-- Header com Título e Subtítulo -->
                    <div class="sdit-header">
                        <span class="sdit-category-badge" id="searchTripCategoryPill">
                            <span id="searchTripCategoryName">Movy</span>
                        </span>
                        <h3 class="sdit-title" id="pharseTrip">Procurando motoristas por perto...</h3>
                        <p class="sdit-subtitle">Aguarde, estamos conectando você ao motorista mais próximo</p>
                    </div>

                    <!-- Animação do carro + radar -->
                    <div class="sdit-anim-wrap">
                        <!-- Radar rings -->
                        <div class="radar-ring radar-ring-1"></div>
                        <div class="radar-ring radar-ring-2"></div>
                        <div class="radar-ring radar-ring-3"></div>
                        <!-- Estrada -->
                        <div class="road-track">
                            <div class="road-dashes">
                                <span class="road-dash"></span>
                                <span class="road-dash"></span>
                                <span class="road-dash"></span>
                                <span class="road-dash"></span>
                                <span class="road-dash"></span>
                            </div>
                        </div>
                        <!-- Carro animado -->
                        <div class="car-anim-container">
                            <img id="searchTripVehicleImg" src="webfiles/img/icon/carro_eco.png" alt="Veículo" class="car-anim-img" />
                        </div>
                    </div>

                    <!-- Meta row: Preço / Duração / Pagamento -->
                    <div class="sdit-meta-row">
                        <div class="sdit-meta-item">
                            <span class="sdit-meta-label">Valor</span>
                            <b class="sdit-meta-val sdit-price" id="searchTripPriceValue">—</b>
                        </div>
                        <div class="sdit-meta-sep"></div>
                        <div class="sdit-meta-item">
                            <span class="sdit-meta-label">Duração</span>
                            <span class="sdit-meta-val" id="searchTripEta">—</span>
                        </div>
                        <div class="sdit-meta-sep"></div>
                        <div class="sdit-meta-item">
                            <span class="sdit-meta-label">Pagamento</span>
                            <span class="sdit-meta-val" id="searchTripPayment">—</span>
                        </div>
                    </div>

                    <!-- Rota de Origem e Destino -->
                    <div class="sdit-route">
                        <div class="sdit-route-item">
                            <span class="sdit-route-dot sdit-route-dot-origin"></span>
                            <p class="sdit-route-text" id="searchTripOriginText">Local de embarque</p>
                        </div>
                        <div class="sdit-route-line-wrap"><div class="sdit-route-line"></div></div>
                        <div class="sdit-route-item">
                            <span class="sdit-route-dot sdit-route-dot-dest"></span>
                            <p class="sdit-route-text sdit-route-dest" id="searchTripDestText">Destino final</p>
                        </div>
                    </div>

                    <!-- Botão cancelar busca -->
                    <button type="button" class="sdit-cancel-btn cancel-search-trip">
                        <i class="material-icons">close</i>
                        <span>Cancelar busca</span>
                    </button>
                </div>

            </div><!-- /sdit-sheet -->
        </div><!-- /search-driver-in-trip -->

        <div class="trip-client">
            <div class="info-trip">
                <div class="info-option-trip">
                    <p>Alguma informação sobre o ponto seu embarque ou compartilhar sua viagem?</p>
                    <a><i class="material-icons" id="optionTrip">
                            arrow_drop_down
                        </i></a>
                </div>
                <ul class="options-trip">
                    <li>
                        <i class="material-icons">
                            place
                        </i>
                        <p>Mudar local</p>
                    </li>
                    <li id="shareTripApp">
                        <i class="material-icons">
                            share
                        </i>
                        <p>Compartilhar viagem</p>
                    </li>
                </ul>
            </div>
            <footer>
                <div id="zoomInRoute" class="option-gps-route">
                    <i class="material-icons">
                        gps_fixed
                    </i>
                </div>
                <div class="data-trip">
                    <div id="dataTripInfo">
                        <div class="image-profile-driver">
                            <div id="nameDriver" class="name-driver-trip"></div>
                        </div>
                        <div class="info-data-driver">
                            <div>
                                <b id="carPlateDriver" class="car-plate-driver"></b>
                                <p id="carBrandDriver" class="car-brand-driver"></p>
                            </div>
                            <div class="description-title">MOVY &bull; Central de Mobilidade Inteligente</div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    </div>
    <div class="container-menu" id="containerMenu">
        <div class="container-logo" id="callRunning">
            <header class="trip-panel-header" id="tripPanelHeader">
                <button type="button" class="trip-panel-dismiss" id="btnCloseTripPanel" aria-label="Fechar painel">
                    <i class="material-icons" aria-hidden="true">close</i>
                </button>
                <h2 class="trip-panel-title">Endereços da viagem</h2>
            </header>
            <div class="row form-trip" id="formPassenger">
                <div class="form-data-passenger">
                    <div class="address-fields">
                        <div>
                            <input type="text" id="originSelected" class="col s12 input-custom select-type-place origin-place" readonly place="origin" placeholder="Insira o local de partida" autocomplete="off">
                            <i class="material-icons clear-input" for="origin">close</i>
                        </div>
                        <div id="containerInputDestination">
                            <input type="text" id="destinationSelected" class="col s12 input-custom select-type-place destination-place" readonly place="destination" autocomplete="off" placeholder="Para onde ?">
                            <i class="material-icons clear-input" for="destination">close</i>
                            <!--                        <i class="material-icons ">add</i>-->
                        </div>
                    </div>
                    <button type="button" id="swapAddressBtn" class="swap-address-btn" aria-label="Inverter origem e destino">
                        <i class="material-icons">swap_vert</i>
                        <span class="app-tooltip app-tooltip--left">Inverte origem e destino</span>
                    </button>
                </div>
            </div>
            <div class="container-footer-local">
                <a href="#" class="small add-place-stop">Adicionar parada</a>
                <button type="button" id="optimized" class="btn btn-primary w-100 mt-2">Sugestão de melhor rota</button>
                <button type="button" id="btnCalculatePriceByPlaces" class="btn btn-primary w-100 mt-2">Avançar</button>
            </div>
            <div class="container-search-local">
                <i class="material-icons back-address">arrow_back</i>
                <div class="content-search-local">
                    <input type="text" class="search-address-location" />
                </div>
                <div class="history-trips">

                    <div class="places-save">
                        <ul id="containerCustomerPlaces"></ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="footer-container-trip">
        <!-- Uber Drag Handle -->
        <div class="uber-sheet-handle"></div>

        <!-- Uber Header -->
        <div class="uber-sheet-header">
            <h3 class="uber-sheet-title">Opções de viagem</h3>
            <span class="uber-sheet-subtitle">Selecione uma categoria para confirmar</span>
        </div>

        <div class="container-box-price">
            <div class="type-cars"></div>
            <div class="indication-list-prices" style="display: none;"></div>
            <div class="arrows-indication-list" style="display: none;">
                <div class="prev-container-price">
                    <i class="material-icons">keyboard_arrow_left</i>
                </div>
                <div class="next-container-price">
                    <i class="material-icons">keyboard_arrow_right</i>
                </div>
            </div>
        </div>

        <!-- Uber-Style Bottom Action Bar (2 Rows) -->
        <div class="uber-bottom-action-bar">
            <!-- Row 1: Payment Method Pill -->
            <div class="uber-payment-row">
                <div class="payment-trip" id="choicePaymentTrip" role="button" tabindex="0" title="Forma de pagamento">
                    <div class="uber-payment-pill-left">
                        <i class="material-icons payment-pill-icon">credit_card</i>  
                        <p id="namePaymentForm">Dinheiro</p>
                    </div>
                    <i class="material-icons payment-pill-chevron">chevron_right</i>
                </div>
                <div id="cardSelectedPayTrip" style="display: none;"></div>
            </div>

            <!-- Row 2: Confirm Primary Button + Schedule + QR -->
            <div class="uber-confirm-row">
                <div class="switch-type-trip">
                    <button type="button" class="btn-qrcode-driver-trip" title="Escanear QR Code"><i class="material-icons">qr_code_scanner</i></button>
                    <button type="button" class="btn-search-trip btn-search" style="display: none" id="list-active-drivers">
                        Personalizada
                    </button>
                    <button type="button" class="btn-search-trip btn-search">AVANÇAR</button>
                </div>
                <div class="schedule-trip" id="choiceScheduleTrip" role="button" tabindex="0" title="Agendar viagem">
                    <i class="material-icons">event</i>
                    <p id="nameScheduleTrip" style="display: none;">Agendar</p>
                </div>
            </div>
        </div>

        <div id="container-anti-uber" style="display: none">
            <hr class="anti-uber-section-sep">
            <div class="title-anti-uber">
                <h4>Analisador de concorrente</h4>
                <div id="div-get-cookies" class="anti-uber-cookie-row">
                    <input class="form-control" type="text" id="cookie-anti-uber" autocomplete="off" placeholder="Cole o JSON do cookie aqui">
                    <button type="button" class="btn btn-info anti-uber-search-btn" id="generate-value-au" aria-label="Pesquisar preços do concorrente">
                        <span class="anti-uber-search-label">Pesquisar</span>
                        <i class="material-icons anti-uber-search-icon" aria-hidden="true">search</i>
                    </button>
                </div>
            </div>
            <hr class="anti-uber-section-sep">
            <div class="anti-uber-items" id="can-show-antiuber">
                <p id="anti-uber-placeholder" class="anti-uber-placeholder">
                    Cole o cookie no campo acima.
                </p>
                <div class="anti-uber-results-wrap anti-uber-results-wrap--hidden">
                    <button type="button" class="anti-uber-scroll-btn anti-uber-scroll-btn--prev" id="antiUberScrollPrev" aria-label="Ver opções anteriores">
                        <i class="material-icons" aria-hidden="true">chevron_left</i>
                    </button>
                    <div class="anti-uber-results-inner">
                        <div id="anti-uber-results" class="anti-uber-results" aria-live="polite"></div>
                        <div id="spinner-antiuber" class="anti-uber-spinner" role="status" style="display: none;" aria-hidden="true">
                            <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        </div>
                    </div>
                    <button type="button" class="anti-uber-scroll-btn anti-uber-scroll-btn--next" id="antiUberScrollNext" aria-label="Ver próximas opções">
                        <i class="material-icons" aria-hidden="true">chevron_right</i>
                    </button>
                </div>
            </div>
        </div>

        <div class="list-drivers-favorite">
            <h4>Motoristas favoritos disponíveis</h4>
            <ul id="listDriversFavorites"></ul>
        </div>
    </div>
    <div class="footer-payment-form">
        <div class="title-footer">
            <p>Opções de pagamento</p>
            <i class="material-icons close-payment-form">close</i>
        </div>
        <p>Forma de pagamento</p>
        <ul class="list-payment-forms"></ul>
        <!--<a id="addPaymentForm" class="add-payment-form">Adicionar cartão de credito</a>-->
    </div>
    <div class="footer-schedule-form" id="footerScheduleForm">
        <div class="title-footer">
            <p>Agendar viagem</p>
            <i class="material-icons close-schedule-form">close</i>
        </div>
        <div class="schedule-picker-panel" id="schedulePickerPanel">
            <label for="schedulePickerTime" class="schedule-picker-section-label">Horário</label>
            <div class="schedule-picker-time-row">
                <input type="time" id="schedulePickerTime" class="form-control" />
            </div>
            <div class="schedule-picker-time-chips" id="schedulePickerTimeChips"></div>

            <p class="schedule-picker-section-label">Data</p>
            <div class="schedule-picker-calendar">
                <div class="schedule-picker-calendar__header">
                    <button type="button" class="schedule-picker-calendar__nav" id="schedulePickerPrevMonth" aria-label="Mês anterior">
                        <i class="material-icons">chevron_left</i>
                    </button>
                    <span id="schedulePickerMonthLabel"></span>
                    <button type="button" class="schedule-picker-calendar__nav" id="schedulePickerNextMonth" aria-label="Próximo mês">
                        <i class="material-icons">chevron_right</i>
                    </button>
                </div>
                <div class="schedule-picker-calendar__weekdays">
                    <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
                </div>
                <div class="schedule-picker-calendar__days" id="schedulePickerCalendarDays"></div>
            </div>

            <div class="schedule-picker-summary">
                <span id="schedulePickerCount">0 datas selecionadas</span>
                <button type="button" class="schedule-picker-clear" id="schedulePickerClear">Limpar</button>
            </div>

            <p class="schedule-picker-section-label">Motoristas</p>
            <label class="schedule-picker-toggle" for="scheduleDriverPoolToggle">
                <input type="checkbox" id="scheduleDriverPoolToggle">
                <span>Restringir a motoristas específicos</span>
            </label>
            <button type="button" class="schedule-picker-driver-pool-btn" id="scheduleDriverPoolOpen" style="display: none;">
                <i class="material-icons">group</i>
                <span id="scheduleDriverPoolSummary">Selecionar motoristas</span>
            </button>
        </div>

        <button type="button" class="schedule-picker-apply" id="btnApplyScheduleForm">APLICAR</button>
    </div>
</div>
    <div class="map-zoom-controls" id="mapZoomControls" role="group" aria-label="Controles de zoom do mapa">
        <button type="button" class="map-zoom-btn map-zoom-btn-in" id="mapZoomIn" aria-label="Aumentar zoom" title="Aumentar zoom">
            <svg class="map-zoom-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        </button>
        <div class="map-zoom-divider" aria-hidden="true"></div>
        <button type="button" class="map-zoom-btn map-zoom-btn-out" id="mapZoomOut" aria-label="Diminuir zoom" title="Diminuir zoom">
            <svg class="map-zoom-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        </button>
    </div>
<div class="container-cancel-request-trip">
    <div>
        <h4>Cancelar viagem</h4>
        <p id="messageCancelTrip">Estamos quase encontrando sua viagem.</p>
        <div>
            <button type="button" id="btnCancelTripRequest">SIM, CANCELAR</button>
            <button type="button" id="btnCancelModalTripRequest">NÃO</button>
        </div>
    </div>
</div>
<div class="preloader-search-trip">
    <div>
        <img class="setas-return" src="webfiles/img/icon/setas-return.png">
        <img class="car-return" src="<?php echo Host::getCentral(); ?>default.jpg">
    </div>
    <p>Chamando seu transporte</p>
    <h3 class="time-search-trip"></h3>
    <i class="fa fa-times-circle cancel-search-trip"></i>
</div>
<div class="container-point-local-map">
    <div class="point-local-handle" aria-hidden="true"></div>
    <p class="point-local-hint">
        <i class="material-icons">open_with</i>
        Mova o mapa para ajustar o ponto
    </p>
    <div class="point-local-address">
        <i class="material-icons">place</i>
        <span id="namePointUser"></span>
    </div>
    <button type="button" id="btnConfirmationPointLocalUser">Confirmar local</button>
</div>

<div aria-live="polite" aria-atomic="true" style="position: absolute;top: 100px; right: 10px;z-index: 10">
    <!-- Position it -->
    <div id="toastAlert"></div>
</div>

<footer class="footer-monitoring-trip" id="footerMonitoring">

    <button class="footer-toggle-btn default-blue hidden" id="toggleMonitoringBtn">
        <span class="footer-toggle-label">Exibir detalhes</span>
        <i class="material-icons footer-toggle-icon">expand_less</i>
    </button>

    <div class="monitoring-content hidden" id="monitoringContent">

        <div class="monitoring-header hidden" id="monitoringHeader">
            <div class="monitoring-status-left">
                <span class="status-text">
                    <span class="mon-dot mon-dot--on"></span>
                    Disponíveis <strong id="infoAvailable">0</strong>
                </span>
                <span class="status-text">
                    <span class="mon-dot mon-dot--off"></span>
                    Ocupados <strong id="infoOccupied">0</strong>
                </span>
                <span class="status-text mon-time">
                    <span id="infoUpdatedAt">-</span>
                    <button class="reload-btn" id="reloadBtn" title="Atualizar">
                        <i class="material-icons" style="font-size:14px;font-family:'Material Icons'">refresh</i>
                    </button>
                </span>
            </div>
        </div>

        <div class="monitoring-cards">

            <div class="stat-card monitoring-clickable" id="tripsCard">
                <p class="sc-title">Viagens <span id="totalTrips">0</span></p>
                <div class="stat-details">
                    <p>Aceitas <span id="acceptedTrips">0</span></p>
                    <p>Finalizadas <span id="finishedTrips">0</span></p>
                </div>
            </div>

            <div class="stat-card monitoring-clickable" id="showCancelledTrips">
                <p class="sc-title sc-title--red">Canceladas <span id="cancelledTrips">0</span></p>
                <div class="stat-details">
                    <p>Motorista <span id="cancelledByDriver">0</span></p>
                    <p>Cliente <span id="cancelledByCustomer">0</span></p>
                </div>
            </div>

            <div class="stat-card" id="ridesCard">
                <p class="sc-title">Corridas</p>
                <div class="stat-details stat-details--3">
                    <p>Dinheiro <span id="cashTrips">0</span></p>
                    <p>Voucher <span id="voucherTrips">0</span></p>
                    <p>Cartão <span id="cardTrips">0</span></p>
                </div>
            </div>

            <div class="stat-card monitoring-clickable" id="showUnattendedTrips">
                <p class="sc-title">Não atendidas</p>
                <p class="sc-big" id="unattendedTrips">0</p>
            </div>

            <div class="stat-card" id="revenueCard">
                <p class="sc-title">Faturamento</p>
                <div class="stat-details stat-details--1">
                    <p>Total <span id="totalRevenue">R$ 0,00</span></p>
                    <p>Líquido <span id="netRevenue">R$ 0,00</span></p>
                </div>
            </div>

        </div>
    </div>

    <div class="stat-card-dropdown" id="cancelledDropdown"></div>
    <div class="stat-card-dropdown" id="unattendedDropdown"></div>
    <div class="stat-card-dropdown" id="tripsDropdown"></div>

</footer>

<div class="trip-details-modal" id="tripDetailsModal">
    <div class="trip-details-content">
        <div class="trip-details-header">
            <h3 id="tripDetailsTitle">Viagens</h3>
            <i class="material-icons close-modal" id="closeTripDetails">close</i>
        </div>
        <div class="trip-details-body" id="tripDetailsBody">
            <!-- Conteúdo será preenchido via JavaScript -->
        </div>
    </div>
</div>

<div class="driver-not-found-modal" id="driverNotFoundDetailsModal" tabindex="-1" aria-hidden="true">
    <div class="driver-not-found-modal__card">

        <button type="button" class="driver-not-found-modal-dismiss" id="btnCloseDriverNotFoundModal" aria-label="Fechar">
            <i class="material-icons" aria-hidden="true">close</i>
        </button>

        <div class="driver-not-found-modal__body">
            <h5 class="driver-not-found-modal__title">
                Nenhum parceiro atendeu ao chamado, qual ação desejada?
            </h5>

            <div id="container-whatsapp-group" class="driver-not-found-modal__group" style="display: none">
                <select id="select-group-list" class="driver-not-found-modal__select">
                    <option selected disabled>Escolha um grupo</option>
                </select>

                <label class="driver-not-found-modal__check" for="sendToWhatsappGroup">
                    <input type="checkbox" id="sendToWhatsappGroup">
                    <span>Disparar para grupo de WhatsApp</span>
                </label>
            </div>
        </div>

        <div class="driver-not-found-modal__footer">
            <button
                type="button"
                class="driver-not-found-modal__btn"
                id="send-message-to-group-trip-not-found">
                Refazer chamado
            </button>
        </div>

    </div>
</div>
