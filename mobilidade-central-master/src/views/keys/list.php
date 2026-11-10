<div class="container-main">
    <div class="keys-page">

        <!-- ── Cabeçalho ── -->
        <div class="keys-header">
            <div class="keys-header__titles">
                <span class="keys-header__badge">Partner Integrations</span>
                <h1 class="keys-title">API Keys & External Integrations</h1>
                <p class="keys-subtitle">Manage secure authentication credentials for delivery integrations and third-party services.</p>
            </div>
            <div class="keys-header__actions">
                <button type="button" class="keys-btn-save" id="save-ifood-keys">
                    <i class="material-icons">save</i>
                    <span>Save Keys</span>
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
                            <h2 class="keys-partner__name">Delivery API</h2>
                            <span class="keys-badge keys-badge--active">Active</span>
                        </div>
                        <p class="keys-partner__desc">Automated dispatch integration for deliveries and logistics services.</p>
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
                            <input type="text" class="keys-input" id="clientId" placeholder="Enter Client ID">
                            <button type="button" class="keys-copy-btn" onclick="copyToClipboard('clientId')" title="Copy Client ID">
                                <i class="material-icons">content_copy</i>
                            </button>
                        </div>
                        <span class="keys-help">Public application identifier registered in Developer Portal.</span>
                    </div>

                    <!-- Client Secret -->
                    <div class="keys-field">
                        <label class="keys-label" for="clientSecret">
                            Client Secret <span class="keys-required">*</span>
                        </label>
                        <div class="keys-input-wrap">
                            <i class="material-icons keys-input-icon">lock</i>
                            <input type="password" class="keys-input" id="clientSecret" placeholder="Enter secure Client Secret">
                            <button type="button" class="keys-toggle-btn" onclick="toggleSecretVisibility('clientSecret', this)" title="Show / Hide">
                                <i class="material-icons">visibility_off</i>
                            </button>
                            <button type="button" class="keys-copy-btn" onclick="copyToClipboard('clientSecret')" title="Copy Secret">
                                <i class="material-icons">content_copy</i>
                            </button>
                        </div>
                        <span class="keys-help">Private secret key. Keep confidential to prevent unauthorized access.</span>
                    </div>

                </div>

                <!-- Callout de Segurança -->
                <div class="keys-security-notice">
                    <i class="material-icons">security</i>
                    <div>
                        <strong>Encrypted Storage</strong>
                        <p>All API credentials are securely stored and utilized strictly by MOVY dispatch engines.</p>
                    </div>
                </div>
            </div>

            <div class="keys-card__footer">
                <span class="keys-card__status-hint">
                    <i class="material-icons">info</i>
                    After saving, test synchronization in the order panel to verify authentication.
                </span>
                <button type="button" class="keys-btn-save keys-btn-save--secondary" onclick="document.getElementById('save-ifood-keys').click()">
                    <i class="material-icons">check_circle</i>
                    <span>Confirm Changes</span>
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
                toastr.success('Copied to clipboard!');
            } else if (window.SwalCustom) {
                SwalCustom.messageDialog('', 'Copied to clipboard!', undefined, 'success');
            } else {
                alert('Copied!');
            }
        });
    }
</script>
