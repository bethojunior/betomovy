<div class="container-main">
    <div class="rate-page">

        <!-- ── Cabeçalho ── -->
        <div class="rate-header">
            <div class="rate-header__titles">
                <span class="rate-header__badge">Configuração Operacional</span>
                <h1 class="rate-title">Tarifas da Central</h1>
                <p class="rate-subtitle">Defina a precificação dinâmica, bandeirada inicial, quilometragem e taxas por categoria de veículo.</p>
            </div>
            <div class="rate-header__actions">
                <button type="button" class="rate-btn-save" id="saveRate">
                    <i class="material-icons">check_circle</i>
                    <span>Salvar Tarifa</span>
                </button>
            </div>
        </div>

        <form class="rate-form" onsubmit="return false;">
            <!-- ── Grid de Configuração ── -->
            <div class="rate-grid">

                <!-- Card 1: Categoria e Identidade Visual -->
                <div class="rate-card rate-card--full">
                    <div class="rate-card__header">
                        <div class="rate-card__icon"><i class="material-icons">category</i></div>
                        <div>
                            <h2 class="rate-card__title">Categoria & Identidade Visual</h2>
                            <p class="rate-card__desc">Selecione o tipo de corrida e personalize como o passageiro visualiza a categoria no aplicativo.</p>
                        </div>
                    </div>
                    <div class="rate-card__body">
                        <div class="rate-form-row">
                            <div class="rate-field rate-field--grow">
                                <label class="rate-label" for="tripTypeId">
                                    Tipo de Tarifa / Categoria <span class="rate-required">*</span>
                                </label>
                                <div class="rate-select-wrap">
                                    <select class="rate-select" id="tripTypeId">
                                        <option value="" disabled selected>Selecione o tipo de tarifa...</option>
                                    </select>
                                    <i class="material-icons rate-select-arrow">expand_more</i>
                                </div>
                                <span class="rate-help">Ao selecionar uma categoria, os valores atuais serão preenchidos automaticamente.</span>
                            </div>

                            <div class="rate-field rate-field--grow">
                                <label class="rate-label" for="tag">
                                    Descrição da Tag <span class="rate-required">*</span>
                                </label>
                                <input type="text" class="rate-input" maxlength="20" id="tag" placeholder="Ex: Econômico, Conforto, Moto...">
                                <span class="rate-help">Texto exibido em destaque no card da categoria (máx. 20 caracteres).</span>
                            </div>

                            <div class="rate-field rate-field--color">
                                <label class="rate-label" for="color">Cor da Tag</label>
                                <div class="rate-color-picker-wrap">
                                    <input type="color" class="rate-color-input" id="color" value="#000000">
                                    <span class="rate-color-hex" id="colorHexText">#000000</span>
                                </div>
                                <span class="rate-help">Cor do selo da categoria.</span>
                            </div>
                        </div>

                        <!-- Live Preview Badge -->
                        <div class="rate-preview-box">
                            <span class="rate-preview-label">Pré-visualização no App:</span>
                            <div class="rate-preview-badge" id="rateTagPreview" style="background-color: #000000; color: #ffffff;">
                                <i class="material-icons">directions_car</i>
                                <span id="rateTagPreviewText">Categoria de Viagem</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card 2: Composição de Preço Principal -->
                <div class="rate-card">
                    <div class="rate-card__header">
                        <div class="rate-card__icon"><i class="material-icons">payments</i></div>
                        <div>
                            <h2 class="rate-card__title">Composição Tarifária Principal</h2>
                            <p class="rate-card__desc">Cálculo de partida, valor por distância e tempo de corrida.</p>
                        </div>
                    </div>
                    <div class="rate-card__body">
                        <div class="rate-form-grid-2">
                            <div class="rate-field">
                                <label class="rate-label" for="min_price">
                                    Preço Mínimo <span class="rate-required">*</span>
                                </label>
                                <div class="rate-input-prefix-wrap">
                                    <span class="rate-currency-prefix">$</span>
                                    <input type="tel" class="rate-input input-value-price" id="min_price" placeholder="0,00">
                                </div>
                                <span class="rate-help">Cobrança mínima por qualquer corrida realizada.</span>
                            </div>

                            <div class="rate-field">
                                <label class="rate-label" for="base_price">
                                    Preço Base (Bandeirada) <span class="rate-required">*</span>
                                </label>
                                <div class="rate-input-prefix-wrap">
                                    <span class="rate-currency-prefix">$</span>
                                    <input type="tel" class="rate-input input-value-price" id="base_price" placeholder="0,00">
                                </div>
                                <span class="rate-help">Valor de partida adicionado no início da viagem.</span>
                            </div>

                            <div class="rate-field">
                                <label class="rate-label" for="km_price">
                                    Preço por KM <span class="rate-required">*</span>
                                </label>
                                <div class="rate-input-prefix-wrap">
                                    <span class="rate-currency-prefix">$</span>
                                    <input type="tel" class="rate-input input-value-price" id="km_price" placeholder="0,00">
                                </div>
                                <span class="rate-help">Valor adicionado por cada quilômetro rodado.</span>
                            </div>

                            <div class="rate-field">
                                <label class="rate-label" for="minute_price">
                                    Preço por Minuto <span class="rate-required">*</span>
                                </label>
                                <div class="rate-input-prefix-wrap">
                                    <span class="rate-currency-prefix">$</span>
                                    <input type="tel" class="rate-input input-value-price" id="minute_price" placeholder="0,00">
                                </div>
                                <span class="rate-help">Valor somado para cada minuto de duração.</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card 3: Taxas Extras e Paradas -->
                <div class="rate-card">
                    <div class="rate-card__header">
                        <div class="rate-card__icon"><i class="material-icons">toll</i></div>
                        <div>
                            <h2 class="rate-card__title">Taxas Extras & Waypoints</h2>
                            <p class="rate-card__desc">Adicionais operacionais e cobrança por múltiplas paradas.</p>
                        </div>
                    </div>
                    <div class="rate-card__body">
                        <div class="rate-form-grid-2">
                            <div class="rate-field">
                                <label class="rate-label" for="tax_price">Taxa Adicional 1</label>
                                <div class="rate-input-prefix-wrap">
                                    <span class="rate-currency-prefix">$</span>
                                    <input type="tel" class="rate-input input-value-price" id="tax_price" placeholder="0,00">
                                </div>
                                <span class="rate-help">Taxa fixa operacional ou de embarque.</span>
                            </div>

                            <div class="rate-field">
                                <label class="rate-label" for="another_fee">Taxa Adicional 2</label>
                                <div class="rate-input-prefix-wrap">
                                    <span class="rate-currency-prefix">$</span>
                                    <input type="tel" class="rate-input input-value-price" id="another_fee" placeholder="0,00">
                                </div>
                                <span class="rate-help">Taxa de retorno, pedágio base ou contingência.</span>
                            </div>

                            <div class="rate-field rate-field--full-span">
                                <label class="rate-label" for="waypoint_price">Taxa por Parada Intermediária</label>
                                <div class="rate-input-prefix-wrap">
                                    <span class="rate-currency-prefix">$</span>
                                    <input type="tel" class="rate-input input-value-price" id="waypoint_price" placeholder="0,00">
                                </div>
                                <span class="rate-help">Valor fixo cobrado por cada ponto de parada adicional inserido pelo passageiro.</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- ── Barra Inferior de Ações ── -->
            <div class="rate-footer-bar">
                <div class="rate-footer-bar__info">
                    <i class="material-icons">info</i>
                    <span>As alterações de tarifas passam a vigorar imediatamente em todas as novas solicitações de viagens.</span>
                </div>
                <button type="button" class="rate-btn-save rate-btn-save--lg" id="saveRateSecondary">
                    <i class="material-icons">check_circle</i>
                    <span>Salvar Tarifa</span>
                </button>
            </div>
        </form>

    </div>
</div>

<script>
    (function() {
        // Vincula botão secundário ao principal se clicado
        const saveSecondary = document.getElementById('saveRateSecondary');
        const savePrimary = document.getElementById('saveRate');
        if (saveSecondary && savePrimary) {
            saveSecondary.addEventListener('click', function() {
                savePrimary.click();
            });
        }

        // Live preview do Tag e Cor
        const tagInput = document.getElementById('tag');
        const colorInput = document.getElementById('color');
        const previewBadge = document.getElementById('rateTagPreview');
        const previewText = document.getElementById('rateTagPreviewText');
        const colorHexText = document.getElementById('colorHexText');

        function updatePreview() {
            if (previewText && tagInput) {
                previewText.textContent = tagInput.value.trim() || 'Categoria de Viagem';
            }
            if (previewBadge && colorInput) {
                const colorVal = colorInput.value || '#000000';
                previewBadge.style.backgroundColor = colorVal;
                if (colorHexText) colorHexText.textContent = colorVal.toUpperCase();
                // Ajusta cor do texto para contraste
                const rgb = parseInt(colorVal.replace('#', ''), 16);
                const r = (rgb >> 16) & 0xff;
                const g = (rgb >>  8) & 0xff;
                const b = (rgb >>  0) & 0xff;
                const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                previewBadge.style.color = luma < 128 ? '#ffffff' : '#000000';
            }
        }

        if (tagInput) tagInput.addEventListener('input', updatePreview);
        if (colorInput) colorInput.addEventListener('input', updatePreview);

        // Observer para quando o JS de tarifas preencher o form
        const observer = new MutationObserver(updatePreview);
        if (tagInput) {
            tagInput.addEventListener('change', updatePreview);
        }
        setInterval(updatePreview, 600);
    })();
</script>