<div class="container-login movy-login-v2">

    <!-- Banner Cinematográfico com Glassmorphism e Grid Futurista -->
    <aside class="login-banner">
        <div class="login-banner__overlay">
            <div class="login-banner__brand-glow"></div>
            <div class="login-banner__content">
                <div class="brand-pill">
                    <span class="pulse-dot"></span>
                    <span>SISTEMA DE DESPACHO GLOBAL</span>
                </div>
                <h1 class="login-banner__headline">
                    Mobilidade Urbana Inteligente de Próxima Geração
                </h1>
                <p class="login-banner__desc">
                    Controle de frota em tempo real, monitoramento de viagens, leilão de corridas e despacho ultra-rápido para motoristas nos EUA e Brasil.
                </p>
                <div class="login-banner__features">
                    <div class="feat-badge">
                        <i class="material-icons">speed</i>
                        <span>Despacho em < 1s</span>
                    </div>
                    <div class="feat-badge">
                        <i class="material-icons">public</i>
                        <span>Operação Multimoeda (USD / BRL)</span>
                    </div>
                    <div class="feat-badge">
                        <i class="material-icons">security</i>
                        <span>Telemetria & Segurança SOS</span>
                    </div>
                </div>
            </div>
        </div>
    </aside>

    <!-- Painel do formulário estilizado -->
    <main class="login-panel">

        <div class="login-card">

            <div class="login-logo-container">
                <img src="/webfiles/img/logo/logo.png"
                     alt="MOVY"
                     class="logo-company">
            </div>

            <h2 class="login-title">Central MOVY</h2>
            <p class="login-subtitle">Acesse o painel de despacho executivo</p>

            <form class="form-login" novalidate>

                <div class="input-group">
                    <i class="material-icons" aria-hidden="true">mail_outline</i>
                    <input type="email"
                           id="email"
                           placeholder="E-mail de acesso"
                           autocomplete="email"
                           required>
                </div>

                <div class="input-group">
                    <i class="material-icons" aria-hidden="true">lock_outline</i>
                    <input type="password"
                           id="password"
                           placeholder="Sua senha secreta"
                           autocomplete="current-password"
                           required>
                </div>

                <button type="submit" class="authenticate-user">
                    <span>ACESSAR PLATAFORMA</span>
                    <i class="material-icons">arrow_forward</i>
                </button>

            </form>

            <a href="/register" class="register-link">
                Não possui conta empresarial? <strong>Cadastre sua central</strong>
            </a>

        </div>

        <p class="login-panel__footer">
            &copy; <?php echo date('Y'); ?> MOVY Global Technologies &bull; Todos os direitos reservados
        </p>

    </main>

</div>
