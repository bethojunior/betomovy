<div class="container-login">

    <!-- Banner: bg-image injetado via PHP para garantir URL absoluta -->
    <aside class="login-banner"
           style="background-image: url('<?php echo Host::getLocal(); ?>webfiles/img/icon/banner.jpg')">
        <div class="login-banner__overlay">
            <div class="login-banner__content">
                <h1 class="login-banner__headline">
                    Simplifique e gerencie o transporte urbano de seus clientes.
                </h1>
                <p class="login-banner__desc">
                    Controle total da sua central em um único painel.
                </p>
            </div>
        </div>
    </aside>

    <!-- Painel do formulário -->
    <main class="login-panel">

        <div class="login-card">

            <img src="<?php echo Host::getCentral(); ?>default.jpg"
                 onerror="this.onerror=null; this.src='/webfiles/img/logo/logo.png';"
                 alt="Logo da central"
                 class="logo-company">

            <h2 class="login-title">Bem-vindo de volta</h2>
            <p class="login-subtitle">Acesse o painel de controle</p>

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
