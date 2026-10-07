<div class="whatsapp-management">
    <div class="container-fluid">
        <div class="simple-tabs">
            <div class="tab-buttons">
                <button class="tab-btn active" id="groups-tab" data-tab="groups-tabs">
                    <i class="fas fa-users"></i>
                    Notificações
                </button>
                <button class="tab-btn " id="configs-tab" data-tab="configs">
                    <i class="fas fa-cog"></i>
                    Configurações do Chamado
                </button>
                <button class="tab-btn" id="connect-wpp-tab" data-tab="connect-wpp">
                    <svg class="tab-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                        <path fill="currentColor" d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                    </svg>
                    Conexão
                </button>
            </div>
            <div class="tab-content">
                <div class="tab-panel" id="configs">
                    <div class="simple-card">
                        <div class="card-header-simple">
                            <h4>
                                <i class="fas fa-cog card-icon-wpp"></i>
                                Configurações do Chamado
                            </h4>
                        </div>
                        <div class="configs-form-body">
                            <div class="form-group-simple">
                                <label class="config-label" for="name-contact">
                                    <i class="fab fa-whatsapp"></i>
                                    Nome para exibir no WhatsApp
                                </label>
                                <div class="name-input-wrapper">
                                    <div id="name-skeleton" class="skeleton-container">
                                        <div class="skeleton-input"></div>
                                        <i class="fas fa-user skeleton-icon"></i>
                                    </div>
                                    <div id="name-input-container">
                                        <input
                                            id="name-contact"
                                            type="text"
                                            class="form-input-simple"
                                            placeholder="Nome que aparecerá no WhatsApp…">
                                        <i class="fas fa-user"></i>
                                    </div>
                                </div>
                                <small class="form-hint">
                                    <i class="fas fa-info-circle"></i> Este nome identifica sua central no WhatsApp
                                </small>
                            </div>
                            <div class="form-group-simple">
                                <label class="config-label">
                                    <i class="fas fa-car"></i>
                                    Tipos de viagem disponíveis
                                </label>
                                <small class="form-hint">
                                    <i class="fas fa-check-circle"></i> Selecione os tipos que estarão disponíveis no chamado pelo WhatsApp
                                </small>
                                <div id="activeTripTypes" class="trip-types-container checkbox-container">
                                    <div class="loading-checkbox">Carregando tipos…</div>
                                </div>
                            </div>
                            <div class="form-save-row">
                                <button type="button" class="btn-wpp-action" id="btn-saveAllConfigs">
                                    <i class="fas fa-save"></i> Salvar Configurações
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tab-panel" id="connect-wpp">
                    <div class="simple-card">
                        <div class="card-header-simple card-header-wpp">
                            <h4>
                                <svg class="header-icon-wpp" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                                    <path fill="currentColor" d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                                </svg>
                                Conectar WhatsApp
                            </h4>
                        </div>
                        <div class="qr-wrapper">
                            <div class="qr-instructions">
                                <div class="qr-step">
                                    <span class="qr-step-num">1</span>
                                    Abra o <strong>WhatsApp</strong> no celular
                                </div>
                                <div class="qr-step">
                                    <span class="qr-step-num">2</span>
                                    Toque em <strong>Dispositivos Vinculados</strong>
                                </div>
                                <div class="qr-step">
                                    <span class="qr-step-num">3</span>
                                    Aponte a câmera para o <strong>QR Code</strong> abaixo
                                </div>
                            </div>
                            <div class="qr-container">
                                <div class="spinner-simple" id="spinner-connect-wpp"></div>
                                <iframe id="show-qr-code-whatsapp" class="qr-frame" frameborder="0" scrolling="no"></iframe>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tab-panel active" id="groups-tabs">
                    <?php require 'groups.php' ?>
                </div>
            </div>
        </div>
    </div>
</div>
