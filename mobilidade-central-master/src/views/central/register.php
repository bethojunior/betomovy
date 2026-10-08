<?php
    $appPartner = getenv('APP_PARTNER') === "false" ? null : getenv('APP_PARTNER');
?>

<div class="register-page">

    <!-- ── Banner (esquerda) ── -->
    <aside class="reg-banner"
           style="background-image: url('<?php echo Host::getLocal(); ?>webfiles/img/icon/banner.jpg')">
        <div class="reg-banner__overlay">
            <div class="reg-banner__content">
                <img src="<?php echo Host::getCentral(); ?>default.jpg"
                     onerror="this.onerror=null; this.src='/webfiles/img/logo/logo.png';"
                     alt="Logo da central"
                     class="reg-banner__logo">
                <h2 class="reg-banner__title">Comece agora</h2>
                <p class="reg-banner__desc">
                    Cadastre sua central e tenha controle total das operações de transporte em tempo real.
                </p>
            </div>
        </div>
    </aside>

    <!-- ── Painel direito ── -->
    <main class="reg-panel">

        <div class="reg-wrap">

            <!-- Navegação de volta -->
            <a href="/" class="reg-back">
                <i class="material-icons" aria-hidden="true">arrow_back</i>
                Voltar ao login
            </a>

            <!-- Cabeçalho da página -->
            <header class="reg-header">
                <h1 class="reg-title">Cadastre sua central</h1>
                <p class="reg-subtitle">Preencha os dados abaixo para criar sua conta</p>
            </header>

            <form id="formRegister" novalidate>

                <div id="listErrors"></div>

                <label class="reg-toggle" for="register-international">
                    <input type="checkbox" id="register-international" role="switch">
                    Cadastro internacional
                </label>

                <!-- Seção 1: Responsável -->
                <section class="reg-section">
                    <h2 class="reg-section__title">Responsável</h2>

                    <div class="reg-field">
                        <label for="userName">Nome completo</label>
                        <input type="text" id="userName" name="user[name]"
                               class="form-control"
                               placeholder="Ex.: Fulano de Tal"
                               autocomplete="off" required>
                    </div>

                    <div class="reg-field">
                        <label for="userEmail">E-mail</label>
                        <input type="email" id="userEmail" name="user[email]"
                               class="form-control"
                               placeholder="fulano@exemplo.com"
                               autocomplete="off" required>
                    </div>

                    <div class="reg-field">
                        <label for="userPhone">Telefone</label>
                        <input type="tel" id="userPhone" name="user[phone]"
                               class="form-control mask-phone"
                               placeholder="(85) 99999-9999"
                               autocomplete="off" required>
                        <span class="invalid-feedback">Telefone inválido</span>
                    </div>

                    <div class="reg-row">
                        <div class="reg-field">
                            <label for="userPassword">Senha</label>
                            <input type="password" id="userPassword" name="user[password]"
                                   class="form-control"
                                   placeholder="Mínimo 8 caracteres" required>
                            <span class="invalid-feedback">Senha não confere</span>
                        </div>
                        <div class="reg-field">
                            <label for="rePassword">Confirmar senha</label>
                            <input type="password" id="rePassword"
                                   class="form-control"
                                   placeholder="Repita a senha" required>
                        </div>
                    </div>
                </section>

                <!-- Seção 2: Central -->
                <section class="reg-section">
                    <h2 class="reg-section__title">Central</h2>

                    <div class="reg-field">
                        <label for="name">Nome da central</label>
                        <input type="text" id="name" name="name"
                               class="form-control"
                               placeholder="Ex.: Central do José"
                               autocomplete="off" required>
                    </div>

                    <div class="reg-field container-autocomplete">
                        <label for="address">Endereço</label>
                        <input type="text" id="address" name="address"
                               class="form-control"
                               placeholder="Ex.: Av. José da Silva, 759 — Fortaleza/CE"
                               autocomplete="off" required>
                        <ul id="listAddressSuggestion"></ul>
                        <span class="invalid-feedback">Selecione o endereço da central</span>
                    </div>

                    <?php if ($appPartner): ?>
                    <div class="reg-field">
                        <label for="apps-partners">Aplicativo parceiro</label>
                        <select id="apps-partners" name="apps-partners" class="form-control">
                            <option value="">Selecione</option>
                        </select>
                    </div>
                    <?php endif; ?>

                    <div class="reg-field">
                        <label>Logo da central</label>
                        <div class="custom-file reg-file">
                            <input type="file" class="custom-file-input"
                                   id="logo" name="logo"
                                   accept="image/*" required>
                            <label class="custom-file-label" for="logo">
                                Escolher imagem
                            </label>
                        </div>
                    </div>
                </section>

                <button type="submit" id="btnRegister" class="reg-btn">
                    Criar conta
                </button>

            </form>

            <a href="/" class="reg-login-link">
                Já tem uma conta? <strong>Faça login</strong>
            </a>

            <p class="reg-panel__footer">&copy; <?php echo date('Y'); ?> Central de Mobilidade</p>

        </div>

    </main>

</div>
