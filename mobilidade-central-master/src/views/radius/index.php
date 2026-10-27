<div class="container-main">
    <div class="rad-page">

        <!-- ── Cabeçalho ── -->
        <div class="rad-header">
            <div class="rad-header__titles">
                <span class="rad-header__badge">Geolocalização & Despacho</span>
                <h1 class="rad-title">Raio de Atendimento</h1>
                <p class="rad-subtitle">Configure os perímetros geográficos de busca para alocação direta e escalonada de motoristas parceiros.</p>
            </div>
            <div class="rad-header__actions">
                <button type="button" class="rad-btn-save" id="saveRadius">
                    <i class="material-icons">radar</i>
                    <span>Salvar Raio</span>
                </button>
            </div>
        </div>

        <form class="rad-form" onsubmit="return false;">
            <!-- ── Grid de Configuração de Cobertura ── -->
            <div class="rad-grid">

                <!-- Card 1: Raio Nominal -->
                <div class="rad-card">
                    <div class="rad-card__header">
                        <div class="rad-card__icon rad-card__icon--primary">
                            <i class="material-icons">my_location</i>
                        </div>
                        <div>
                            <span class="rad-badge rad-badge--blue">Raio Primário</span>
                            <h2 class="rad-card__title">Raio Nominal</h2>
                        </div>
                    </div>

                    <div class="rad-card__body">
                        <p class="rad-card__desc">
                            Distância padrão percorrida pelo algoritmo para localizar e despachar condutores prioritários mais próximos ao passageiro.
                        </p>

                        <div class="rad-field">
                            <label class="rad-label" for="radius">
                                Distância de Cobertura <span class="rad-required">*</span>
                            </label>
                            <div class="rad-input-wrap">
                                <i class="material-icons rad-input-icon">trip_origin</i>
                                <input type="number" min="1" max="150" step="1" class="rad-input input-value-price" id="radius" placeholder="Ex: 5">
                                <span class="rad-unit">KM</span>
                            </div>
                            <span class="rad-help">Recomendado entre 3 km e 10 km para centros urbanos.</span>
                        </div>
                    </div>
                </div>

                <!-- Card 2: Raio Bloco -->
                <div class="rad-card">
                    <div class="rad-card__header">
                        <div class="rad-card__icon rad-card__icon--accent">
                            <i class="material-icons">explore</i>
                        </div>
                        <div>
                            <span class="rad-badge rad-badge--orange">Raio Estendido</span>
                            <h2 class="rad-card__title">Raio Bloco</h2>
                        </div>
                    </div>

                    <div class="rad-card__body">
                        <p class="rad-card__desc">
                            Perímetro expandido ativado automaticamente quando nenhum motorista dentro do raio nominal aceita a solicitação de corrida.
                        </p>

                        <div class="rad-field">
                            <label class="rad-label" for="greaterRadius">
                                Distância Máxima Expandida <span class="rad-required">*</span>
                            </label>
                            <div class="rad-input-wrap">
                                <i class="material-icons rad-input-icon">radio_button_unchecked</i>
                                <input type="number" min="1" max="300" step="1" class="rad-input input-value-price" id="greaterRadius" placeholder="Ex: 15">
                                <span class="rad-unit">KM</span>
                            </div>
                            <span class="rad-help">Deve ser sempre maior ou igual ao raio nominal.</span>
                        </div>
                    </div>
                </div>

            </div>

            <!-- ── Card Informativo de Funcionamento ── -->
            <div class="rad-info-card">
                <div class="rad-info-card__visual">
                    <div class="rad-radar-visual">
                        <div class="rad-radar-ring rad-radar-ring--outer"></div>
                        <div class="rad-radar-ring rad-radar-ring--inner"></div>
                        <div class="rad-radar-center">
                            <i class="material-icons">directions_car</i>
                        </div>
                    </div>
                </div>
                <div class="rad-info-card__text">
                    <h3 class="rad-info-title">Como o Despacho Georreferenciado Funciona?</h3>
                    <p class="rad-info-desc">
                        Quando um passageiro solicita uma viagem na Central ou pelo aplicativo, o sistema cria ondas concêntricas de chamada:
                    </p>
                    <ul class="rad-steps">
                        <li>
                            <strong class="rad-step-num">1</strong>
                            <span>Os motoristas disponíveis dentro do <strong>Raio Nominal</strong> recebem o chamado em tela com alerta sonoro.</span>
                        </li>
                        <li>
                            <strong class="rad-step-num">2</strong>
                            <span>Se nenhum condutor aceitar no tempo limite, o sistema expande a chamada para o <strong>Raio Bloco</strong>.</span>
                        </li>
                        <li>
                            <strong class="rad-step-num">3</strong>
                            <span>Garante que passageiros em áreas periféricas não fiquem sem atendimento enquanto houver condutores na região.</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- ── Barra de Ações Inferior ── -->
            <div class="rad-footer-bar">
                <span class="rad-footer-bar__hint">
                    <i class="material-icons">check_circle</i>
                    Configurações aplicadas em tempo real em todas as estações de atendimento.
                </span>
                <button type="button" class="rad-btn-save rad-btn-save--lg" onclick="document.getElementById('saveRadius').click()">
                    <i class="material-icons">save</i>
                    <span>Confirmar Configurações</span>
                </button>
            </div>
        </form>

    </div>
</div>
