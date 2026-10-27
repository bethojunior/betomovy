<div class="container-main">
    <div class="keys-page">

        <!-- ── Cabeçalho ── -->
        <div class="keys-header">
            <div class="keys-header__titles">
                <span class="keys-header__badge">Integrações de Parceiros</span>
                <h1 class="keys-title">Chaves de API & Conexões Externas</h1>
                <p class="keys-subtitle">Gerencie as credenciais de autenticação seguras para integração de entregas com iFood e serviços de terceiros.</p>
            </div>
            <div class="keys-header__actions">
                <button type="button" class="keys-btn-save" id="save-ifood-keys">
                    <i class="material-icons">save</i>
                    <span>Salvar Chaves</span>
                </button>
            </div>
        </div>

        <div id="div-put-keys"></div>

        <!-- ── Card iFood ── -->
        <div class="keys-card">
            <div class="keys-card__top">
                <div class="keys-partner">
                    <div class="keys-partner__logo-wrap">
                        <i class="material-icons keys-partner__icon">restaurant</i>
                    </div>
                    <div class="keys-partner__info">
                        <div class="keys-partner__name-row">
                            <h2 class="keys-partner__name">iFood Delivery API</h2>
                            <span class="keys-badge keys-badge--active">Ativo</span>
                        </div>
                        <p class="keys-partner__desc">Integração para despacho automático de pedidos de alimentação e logística rápida de encomendas.</p>
                    </div>
                </div>
            </div>

            <div class="keys-card__body">
                <div class="keys-form-grid">
                    
                    <!-- Client ID -->
                    <div class="keys-field">
                        <label class="keys-label" for="clientId">
                            Client ID <span class="keys-required">*</span>
                        </label>
                        <div class="keys-input-wrap">
                            <i class="material-icons keys-input-icon">vpn_key</i>
                            <input type="text" class="keys-input" id="clientId" placeholder="Insira o Client ID fornecido pelo portal iFood">
                            <button type="button" class="keys-copy-btn" onclick="copyToClipboard('clientId')" title="Copiar Client ID">
                                <i class="material-icons">content_copy</i>
                            </button>
                        </div>
                        <span class="keys-help">Identificador público do aplicativo registrado no Portal do Desenvolvedor iFood.</span>
                    </div>

                    <!-- Client Secret -->
                    <div class="keys-field">
                        <label class="keys-label" for="clientSecret">
                            Client Secret <span class="keys-required">*</span>
                        </label>
                        <div class="keys-input-wrap">
                            <i class="material-icons keys-input-icon">lock</i>
                            <input type="password" class="keys-input" id="clientSecret" placeholder="Insira o Client Secret seguro">
                            <button type="button" class="keys-toggle-btn" onclick="toggleSecretVisibility('clientSecret', this)" title="Exibir / Ocultar">
                                <i class="material-icons">visibility_off</i>
                            </button>
                            <button type="button" class="keys-copy-btn" onclick="copyToClipboard('clientSecret')" title="Copiar Secret">
                                <i class="material-icons">content_copy</i>
                            </button>
                        </div>
                        <span class="keys-help">Chave secreta privada. Mantenha em sigilo para evitar acesso não autorizado.</span>
                    </div>

                </div>

                <!-- Callout de Segurança -->
                <div class="keys-security-notice">
                    <i class="material-icons">security</i>
                    <div>
                        <strong>Armazenamento Criptografado</strong>
                        <p>Todas as credenciais de API são protegidas em banco de dados seguro e utilizadas exclusivamente pelo motor de despacho de pedidos do MOVY.</p>
                    </div>
                </div>
            </div>

            <div class="keys-card__footer">
                <span class="keys-card__status-hint">
                    <i class="material-icons">info</i>
                    Após salvar, teste a sincronização no painel de pedidos para confirmar a autenticação.
                </span>
                <button type="button" class="keys-btn-save keys-btn-save--secondary" onclick="document.getElementById('save-ifood-keys').click()">
                    <i class="material-icons">check_circle</i>
                    <span>Confirmar Alterações</span>
                </button>
            </div>
        </div>

    </div>
</div>

<script>
    function toggleSecretVisibility(inputId, btn) {
        const input = document.getElementById(inputId);
        if (!input) return;
        const icon = btn.querySelector('.material-icons');
        if (input.type === 'password') {
            input.type = 'text';
            if (icon) icon.textContent = 'visibility';
        } else {
            input.type = 'password';
            if (icon) icon.textContent = 'visibility_off';
        }
    }

    function copyToClipboard(inputId) {
        const input = document.getElementById(inputId);
        if (!input || !input.value) return;
        navigator.clipboard.writeText(input.value).then(() => {
            if (window.toastr) {
                toastr.success('Copiado para a área de transferência!');
            } else if (window.SwalCustom) {
                SwalCustom.messageDialog('', 'Copiado para a área de transferência!', undefined, 'success');
            } else {
                alert('Copiado!');
            }
        });
    }
</script>
