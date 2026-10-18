<div class="container-login">

    <!-- Banner: bg-image injetado via PHP para garantir URL absoluta -->
    <aside class="login-banner"
           style="background-image: url('<?php echo Host::getLocal(); ?>webfiles/img/icon/banner.jpg')">
        <div class="login-banner__overlay">
            <div class="login-banner__content">
                <h1 class="login-banner__headline">
                    MOVY Central de Despacho & Mobilidade Inteligente
                </h1>
                <p class="login-banner__desc">
                    Plataforma internacional de despacho rápido e monitoramento de corridas.
                </p>
            </div>
        </div>
    </aside>

    <!-- Painel do formulário -->
    <main class="login-panel">

        <div class="login-card">

            <img src="/webfiles/img/logo/logo.png"
                 alt="MOVY"
                 class="logo-company"
                 style="max-height: 60px; object-fit: contain; margin-bottom: 16px;">

            <h2 class="login-title">Central MOVY</h2>
            <p class="login-subtitle">Acesse o painel de despacho</p>

            <form class="form-login" novalidate>

                <div class="input-group">
                    <i class="material-icons" aria-hidden="true">person</i>
                    <input type="email"
                           id="email"
                           placeholder="E-mail"
                           autocomplete="email"
                           required>
                </div>

                <div class="input-group">
                    <i class="material-icons" aria-hidden="true">lock</i>
                    <input type="password"
                           id="password"
                           placeholder="Senha"
                           autocomplete="current-password"
                           required>
                </div>

                <input type="submit" class="authenticate-user" value="ENTRAR">

            </form>

            <a href="/register" class="register-link">
                Não tem conta? <strong>Faça seu cadastro</strong>
            </a>

        </div>

        <p class="login-panel__footer">
            &copy; <?php echo date('Y'); ?> Central de Mobilidade
        </p>

    </main>

</div>
