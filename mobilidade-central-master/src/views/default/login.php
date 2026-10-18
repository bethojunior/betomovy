<div class="container-login movy-login-v2">

    <div class="login-wrapper">

        <!-- Formulário com FUNDO BRANCO PURO centralizado com fundo escuro vidro de mobilidade -->
        <aside class="login-card-container">
            <div class="login-card-header">
                <div class="card-logo-container">
                    <img src="/webfiles/img/logo/logo-movy-transparent.png"
                         alt="MOVY"
                         class="logo-company">
                </div>
                <h2>Acesse sua central</h2>
                <p>Insira suas credenciais de gestor corporativo</p>
            </div>

            <form class="form-login" novalidate>
                <div class="input-group">
                    <label for="email">E-mail de acesso</label>
                    <div class="input-field-wrap">
                        <i class="material-icons" aria-hidden="true">mail_outline</i>
                        <input type="email"
                               id="email"
                               placeholder="nome@empresa.com"
                               autocomplete="email"
                               required>
                    </div>
                </div>

                <div class="input-group">
                    <label for="password">Senha</label>
                    <div class="input-field-wrap">
                        <i class="material-icons" aria-hidden="true">lock_outline</i>
                        <input type="password"
                               id="password"
                               placeholder="••••••••"
                               autocomplete="current-password"
                               required>
                    </div>
                </div>

                <button type="submit" class="authenticate-user">
                    <span>ENTRAR NO PAINEL</span>
                    <i class="material-icons">arrow_forward</i>
                </button>
            </form>

            <a href="/register" class="register-link">
                Não possui conta empresarial? <strong>Cadastre sua central</strong>
            </a>

            <div class="security-footer">
                <div class="security-notice">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <span>Conexão Segura &bull; Auditoria de Acesso e IP</span>
                </div>
                <small class="rights-text">&copy; <?php echo date('Y'); ?> MOVY Global Technologies &bull; Todos os direitos reservados</small>
            </div>
        </aside>

    </div>

</div>
