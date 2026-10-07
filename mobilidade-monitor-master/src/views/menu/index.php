<nav class="navbar navbar-light bg-light nav-horizontal-title monitor-default-nav">
    <i class="material-icons" id="openMenu">menu</i>
    <span class="navbar-brand mb-0 h1"><?php echo $this->nameView ?> <small id="lastVersionMonitor"></small></span>
    <div class="d-flex">
        <select class="custom-select" id="citySelectedMonitor"></select>
        <button type="button" class="btn-notification-floating" id="btnNotificationFloatingView" title="Notificações">
            <span class="material-icons">
                notification_important
            </span>
        </button>
    </div>
</nav>
<nav class="navbar navbar-light bg-light nav-horizontal-title hidden-mobile">
    <span class="navbar-brand mb-0 h1"><?php echo $this->nameView ?> <small><?php echo Host::getVersion() ?></small></span>
</nav>
<nav class="container-nav-menu" id="nav-main">
    <div class="info-user description-option-menu">
        <div class="image-profile-user" style='background-image: url(<?php
                                                                        $photo = Session::get("user")->profilePhoto ?? null;
                                                                        echo $photo ? Host::getImageAdmin() . $photo : "/webfiles/img/svg/user.svg"; ?>)'></div>
        <div class="d-flex flex-column">
            <span class="name-user">Usuário: <?php echo Session::get("user")->nickname ?></span>
            <span class="profile-user">Perfil: <?php echo Session::get("nameRole") ?></span>
            <span><?php echo (new DateTime("now", new DateTimeZone(Session::get(('timezone')))))->format('d/m/Y H:i:s') ?></span>
            <button type="submit" class="mt-1 payment-btn text-white d-none p-1">Faturas</button>
        </div>
    </div>
    <ul>
        <?php if ($this->dashboardBIEnabled()) { ?>
            <li>
                <a href="<?= Host::getLocal() ?>dashboard/bi">
                    <p>
                        <i class="material-icons">pie_chart</i>
                        <span class="description-option-menu">Power BI</span>
                    </p>
                </a>
            </li>
        <?php } ?>

        <li>
            <a href="<?php echo Host::getLocal() ?>">
                <p>
                    <i class="material-icons">dashboard</i>
                    <span class="description-option-menu">Dashboard</span>
                </p>
            </a>
        </li>

        <?php if ($this->hasPermissionGroup(GroupConst::MONITORAMENTO)) { ?>
            <li><a href="<?= Host::getLocal() ?>monitor/monitoring/">
                    <p>
                        <i class="material-icons">
                            timeline
                        </i>
                        <span class="description-option-menu">Monitoramento</span>
                    </p>
                </a>
            </li>
        <?php } ?>

        <?php if ($this->hasPermissionGroup(GroupConst::CLIENTE)) { ?>
            <li>
                <a class="menu-option">
                    <p>
                        <i class="material-icons">account_circle</i>
                        <span class="description-option-menu">Clientes</span>
                        <span id="badge-client" class="badge badge-pill badge-info"></span>
                    </p>
                </a>
                <ul>
                    <?php if (
                        $this->hasPermission(GroupConst::CLIENTE, "listar") ||
                        $this->hasPermission(GroupConst::CLIENTE, "listar_basico")
                    ) { ?>
                        <li><a href="<?= Host::getLocal() ?>client/list">Lista de Pessoa física</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CLIENTE, "listar_pj")) { ?>
                        <li><a href="<?= Host::getLocal() ?>client/insertLegal">Cadastro de Pessoa Jurídica / Parceiro Delivery</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CLIENTE, "listar_pj")) { ?>
                        <li><a href="<?= Host::getLocal() ?>client/legal">Lista de Pessoa Jurídica</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CLIENTE, "solicitacao_exclusao_conta")) { ?>
                        <li><a href="<?= Host::getLocal() ?>client/removeAccountRequest">Solicitação de Exclusão da Conta</a></li>
                    <?php } ?>
                </ul>
            </li>
        <?php } ?>

        <?php if ($this->hasPermissionGroup(GroupConst::MOTORISTA)) { ?>
            <li>
                <a class="menu-option">
                    <p>
                        <i class="material-icons">
                            directions_car
                        </i>
                        <span class="description-option-menu">Motoristas</span>
                        <span id="badge-driver" class="badge badge-pill badge-info"></span>
                    </p>
                </a>
                <ul>
                    <?php if ($this->hasPermission(GroupConst::MOTORISTA, 'cadastro')) { ?>
                        <li><a href="<?= Host::getLocal() ?>driver/signup">CADASTRAR</a></li>
                    <?php } ?>
                    <?php if (
                        $this->hasPermission(GroupConst::MOTORISTA, 'listar') ||
                        $this->hasPermission(GroupConst::MOTORISTA, "listar_basico")
                    ) { ?>
                        <li><a href="<?= Host::getLocal() ?>driver/list">Lista</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::MOTORISTA, 'change_vehicle')) { ?>
                        <li><a href="<?= Host::getLocal() ?>car/pending">Solicitação de mudança de veículo</a></li>
                    <?php } ?>
                </ul>
            </li>
        <?php } ?>

        <?php if ($this->hasPermissionGroup(GroupConst::VIAGEM)) { ?>
            <li>
                <a class="menu-option">
                    <p>
                        <i class="material-icons">commute</i>
                        <span class="description-option-menu">Viagens</span>
                        <span id="badge-trips" class="badge badge-pill badge-info"></span>
                    </p>
                </a>
                <ul>
                    <?php if (
                        $this->hasPermission(GroupConst::VIAGEM, 'listar') ||
                        $this->hasPermission(GroupConst::VIAGEM, "listar_basico")
                    ) { ?>
                        <li><a href="<?= Host::getLocal() ?>trip/list">Lista</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::VIAGEM, 'listar_analise')) { ?>
                        <li><a href="<?= Host::getLocal() ?>trip/analysis">Em analise</a></li>
                    <?php } ?>
                </ul>
            </li>
        <?php } ?>
        <?php if ($this->hasPermissionGroup(GroupConst::DELIVERY)) { ?>
            <li>
                <a class="menu-option">
                    <p>
                        <i class="material-icons">
                            directions_bike
                        </i>
                        <span class="description-option-menu">Delivery</span>
                    </p>
                </a>
                <ul>
                    <?php if ($this->hasPermission(GroupConst::DELIVERY, 'liberar_empresa')) { ?>
                        <li><a href="<?= Host::getLocal() ?>delivery/Register">Estabelecimentos</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::DELIVERY, 'liberar_empresa')) { ?>
                        <li><a href="<?= Host::getLocal() ?>delivery/Monitoring">Monitoramento</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermissionGroup(GroupConst::DELIVERY)) { ?>
                        <li><a href="<?= Host::getLocal() ?>delivery/registerCategoryEstablishment">Categorias de estabelecimentos</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::DELIVERY, 'gerenciar_secao_delivery')) { ?>
                        <li><a href="<?= Host::getLocal() ?>delivery/sections">Seções</a></li>
                        <li><a href="<?= Host::getLocal() ?>delivery/deliveryConfiguration">Configuração Delivery</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::DELIVERY, 'gestao_financeira')) { ?>
                        <li><a href="<?= Host::getLocal() ?>delivery/financial">Gestão financeira</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::DELIVERY, 'gerenciar_zona')) { ?>
                        <li><a href="<?= Host::getLocal() ?>delivery/acquirerDelivery">Adquirentes</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::DELIVERY, 'gerenciar_zona')) { ?>
                        <li><a href="<?= Host::getLocal() ?>delivery/zone">Gerenciar Zona de entrega</a></li>
                    <?php } ?>
                    <li><a href="<?= Host::getLocal() ?>delivery/settingCalled">Configuração do chamado</a></li>
                    <?php if ($this->hasPermission(GroupConst::DELIVERY, 'gerenciar_cobranca')) { ?>
                        <li><a href="<?= Host::getLocal() ?>delivery/AcquirerConfiguration">Configuração do Token ASAAS</a> </li>
                    <?php } ?>
                    <li><a href="<?= Host::getLocal() ?>delivery/config">Configurações gerais</a>
                    <li><a href="<?= Host::getLocal() ?>delivery/driverattachmenttype">Acessórios de entrega</a></li>
                    <li><a href="<?= Host::getLocal() ?>delivery/rate">Taxas e tempo</a></li>
                    <li><a href="<?= Host::getLocal() ?>delivery/rateDobby">Taxa de devolução da maquineta</a></li>
                    <?php if ($this->hasPermission(GroupConst::DELIVERY, 'gerenciar_cobranca')) { ?>
                        <li><a href="<?= Host::getLocal() ?>delivery/Charge">Cobranças</a></li>
                    <?php } ?>
                </ul>
            </li>
        <?php } ?>

        <?php if ($this->hasPermissionGroup(GroupConst::FINANCEIRO)) { ?>
            <li>
                <a class="menu-option">
                    <p>
                        <i class="material-icons">bar_chart</i>
                        <span class="description-option-menu">Financeiro</span>
                        <span id="badge-financial" class="badge badge-pill badge-info"></span>
                    </p>
                </a>
                <ul>
                    <?php if ($this->hasPermission(GroupConst::FINANCEIRO, 'relatorio_ganhos_motorista')) { ?>
                        <li><a href="<?= Host::getLocal() ?>financial/driverProduction">Produção do motorista</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::FINANCEIRO, 'taxa_cancelamento')) { ?>
                        <li><a href="<?= Host::getLocal() ?>financial/cancellationFee">Taxa de cancelamento</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::FINANCEIRO, 'gestao_monetizacao')) { ?>
                        <li><a href="/financial/comission">Gestão de comissão</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::FINANCEIRO, 'solicitacoes_transferencia')) { ?>
                        <li><a href="<?= Host::getLocal() ?>financial/list">Solicitações de Transferências</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::FINANCEIRO, 'relatorio_geral_sintetico')) { ?>
                        <li><a href="<?= Host::getLocal() ?>financial/relatorios">Relatórios</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::FINANCEIRO, 'lancamento_financeiro')) { ?>
                        <li><a href="/financial/charge">LANÇAMENTO FINANCEIRO</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::FINANCEIRO, 'gerenciar_prepago')) { ?>
                        <li><a href="/financial/prepaid">Compra de crédito</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::FINANCEIRO, 'relatorio_ganhos_motorista') && Session::get('show_boleto_asaas') == 1) { ?>
                        <li><a href="<?= Host::getLocal() ?>financial/boleto">Boleto</a></li>
                    <?php } ?>
                </ul>
            </li>
        <?php } ?>

        <?php if ($this->hasPermissionGroup(GroupConst::MENSAGEM)) { ?>
            <li>
                <a class="menu-option">
                    <p>
                        <i class="material-icons">chat</i>
                        <span class="description-option-menu">Mensagem</span>
                    </p>
                </a>
                <ul>
                    <?php if ($this->hasPermission(GroupConst::MENSAGEM, "mensagem_usuario")) { ?>
                        <li>
                            <a href="<?= Host::getLocal() ?>notify">Notificações</a>
                        </li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::MENSAGEM, "notification_birthday")) { ?>
                        <li>
                            <a href="<?= Host::getLocal() ?>notify/NotifyBirthday">Notificações de aniversário</a>
                        </li>
                    <?php } ?>
                </ul>
            </li>
        <?php } ?>

        <?php if ($this->hasPermissionGroup(GroupConst::CONTATO)) { ?>
            <li>
                <a class="menu-option">
                    <p>
                        <i class="material-icons">announcement</i>
                        <span class="description-option-menu">Fale conosco</span>
                        <span id="badge-help" class="badge badge-pill badge-info"></span>
                    </p>
                </a>
                <ul>
                    <?php if ($this->hasPermission(GroupConst::CONTATO, 'listar')) { ?>
                        <li><a href="<?= Host::getLocal() ?>contact/list">Cliente</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CONTATO, 'listar_reports')) { ?>
                        <li><a href="<?= Host::getLocal() ?>contact/report">Viagens</a></li>
                    <?php } ?>
                </ul>
            </li>
        <?php } ?>
        <?php if ($this->hasPermissionGroup(GroupConst::RELATORIO)) { ?>
            <li>
                <a class="menu-option">
                    <p>
                        <i class="material-icons">assignment</i>
                        <span class="description-option-menu">Relatórios</span>
                    </p>
                </a>
                <ul>
                    <li><a href="<?= Host::getLocal() ?>report">Relatórios</a></li>
                    <li><a href="<?= Host::getLocal() ?>report/reportNew">Relatórios(NOVO)</a></li>
                    <li><a href="<?= Host::getLocal() ?>report/reportList">Listagem de relatórios</a></li>
                </ul>
            </li>
        <?php } ?>
        <?php if ($this->hasPermissionGroup(GroupConst::CONFIGURACAO)) { ?>
            <li>
                <a href="<?= Host::getLocal() ?>setting/notification">
                    <p>
                        <i class="material-icons">notifications_none</i>
                        <span class="description-option-menu">Notificações Admins.</span>
                        <span id="badge-notification" class="badge badge-pill badge-info"></span>
                    </p>
                </a>
            </li>
        <?php } ?>

        <li class="advanced-menu">
            <a class="menu-option">
                <p>
                    <i class="material-icons">settings</i>
                    <span class="description-option-menu">Avançadas</span>
                </p>
            </a>
        </li>
        <?php if ($this->hasPermissionGroup(GroupConst::CONFIGURACAO)) { ?>
            <li>
                <a class="menu-option">
                    <p>
                        <i class="material-icons">settings</i>
                        <span class="description-option-menu">Configurações</span>
                        <span id="badge-config" class="badge badge-pill badge-info"></span>
                    </p>
                </a>
                <ul>
                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'gerenciar_perfil')) { ?>
                        <li>
                            <a class="menu-option-item">
                                <span class="description-option-menu submenu">Administrador</span>
                            </a>
                            <ul>
                                <li><a href="<?= Host::getLocal() ?>setting/password">Alterar senha</a></li>
                                <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'admin_listar')) { ?>
                                    <li><a href="<?php echo Host::getLocal() ?>setting/admin">Cadastro de usuário</a></li>
                                <?php } ?>
                                <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'gerenciar_perfil')) { ?>
                                    <li><a href="<?php echo Host::getLocal() ?>setting/profile">Perfil de usuário</a></li>
                                <?php } ?>
                            </ul>
                        </li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CIDADE, 'editar_area')) { ?>
                        <li>
                            <a class="menu-option-item">
                                <span class="description-option-menu submenu">Área de cidade</span>
                            </a>
                            <ul>
                                <?php if ($this->hasPermission(GroupConst::CIDADE, "editar_area")) { ?>
                                    <li><a href="<?= Host::getLocal() ?>city/add">Adicionar cidade</a></li>
                                <?php } ?>
                                <?php if ($this->hasPermission(GroupConst::CIDADE, "editar_area")) { ?>
                                    <li><a href="<?= Host::getLocal() ?>city/editArea">Editar área</a></li>
                                <?php } ?>
                            </ul>
                        </li>
                    <?php } ?>


                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'gerenciar_adquirentes')) { ?>
                        <li><a href="<?php echo Host::getLocal() ?>setting/acquirer">Adquirentes</a></li>
                    <?php } ?>

                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'gerenciar_adquirentes')) { ?>
                        <li><a href="<?php echo Host::getLocal() ?>setting/acquirerByCity">Adquirentes por cidade</a></li>
                    <?php } ?>

                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'gerenciar_chamado')) { ?>
                        <li><a href="<?php echo Host::getLocal() ?>setting/called">Configurações do chamado</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'config_app')) { ?>
                        <li><a href="<?php echo Host::getLocal() ?>setting/keys">Chaves</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'config_app')) { ?>
                        <li><a href="<?php echo Host::getLocal() ?>setting/modulesActive">Modulos Ativos</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'gerenciar_codigos_confirmacao')) { ?>
                        <li><a href="<?php echo Host::getLocal() ?>setting/confirmationCode">Código de confirmação</a>
                        </li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'gerenciar_formas_pagamento')) { ?>
                        <li><a href="<?= Host::getLocal() ?>setting/paymentform">Formas de pagamento</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, "raio_de_chamado")) { ?>
                        <li><a href="<?= Host::getLocal() ?>setting/radius">Raio de chamada por cidade</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'cidade')) { ?>
                        <li><a href="<?= Host::getLocal() ?>setting/cities">Por cidade</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'gerenciar_pedagios')) { ?>
                        <li><a href="<?= Host::getLocal() ?>setting/toll">Gerenciar pedágio</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'politica_uso_app')) { ?>
                        <li><a href="<?= Host::getLocal() ?>termsusepolicy/list">Política de Uso do Aplicativo</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'gerenciar_chatbot')) { ?>
                        <li><a href="<?= Host::getLocal() ?>setting/chatbot">Mensagens do chat - motorista</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'gerenciar_tipos_cancelamento')) { ?>
                        <li><a href="<?= Host::getLocal() ?>setting/reasonCancellation">Motivos de cancelamento</a></li>
                    <?php } ?>

                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'additional_config')) { ?>
                        <li><a href="<?= Host::getLocal() ?>setting/additionalsettings">Configurações adicionais</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'external_services')) { ?>
                        <li><a href="<?= Host::getLocal() ?>setting/ExternalServicesGlobals">Serviços externos globais</a></li>
                        <li><a href="<?= Host::getLocal() ?>setting/ExternalServicesByCity">Serviços externos por cidade</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'firebase_verification')) { ?>
                        <li><a href="<?= Host::getLocal() ?>setting">Verificação Firebase</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'config_service_smtp')) { ?>
                        <li><a href="<?= Host::getLocal() ?>setting/smtp">Configuração de serviço SMTP</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'configuracao_app')) { ?>
                        <li><a href="<?= Host::getLocal() ?>setting/appConfig">Configurações de apps</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'config_app')) { ?>
                        <li><a href="<?= Host::getLocal() ?>setting/requiredField">Obrigatoriedade de campos</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'gerenciar_cadastro_app')) { ?>
                        <li>
                            <a class="menu-option-item">
                                <span class="description-option-menu submenu">Configuração do cadastro</span>
                            </a>
                            <ul>
                                <li>
                                    <a href="<?php echo Host::getLocal() ?>setting/signup/driver">
                                        Config. tela de cadastro motorista
                                    </a>
                                </li>
                                <?php if ($this->hasPermission(GroupConst::MOTORISTA, 'adicionar_documento')) { ?>
                                    <li><a href="<?= Host::getLocal() ?>driver/document">Adicionar documentos por
                                            categoria</a></li>
                                <?php } ?>
                                <li><a href="<?= Host::getLocal() ?>customer/documents">Vincular documento no cadastro do cliente</a></li>
                                <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'gerenciar_documento')) { ?>
                                    <li><a href="<?= Host::getLocal() ?>setting/document">Documentos do app</a></li>
                                <?php } ?>
                            </ul>
                        </li>
                    <?php } ?>

                    <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'importar_cliente')) { ?>
                        <li>
                            <a class="menu-option-item">
                                <span class="description-option-menu submenu">Importações e definições</span>
                            </a>
                            <ul>
                                <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'importar_cliente')) { ?>
                                    <li>
                                        <a href="<?php echo Host::getLocal() ?>setting/importClient">
                                            Clientes
                                        </a>
                                    </li>
                                <?php } ?>
                                <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'importar_cliente')) { ?>
                                    <li>
                                        <a href="<?php echo Host::getLocal() ?>setting/importDriver">
                                            Motoristas
                                        </a>
                                    </li>
                                <?php } ?>
                                <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'zerar_saldo_motorista')) { ?>
                                    <li>
                                        <a href="#" id="reset-balance-drivers">
                                            Zerar saldo dos motoristas
                                        </a>
                                    </li>
                                <?php } ?>
                                <?php if ($this->hasPermission(GroupConst::CONFIGURACAO, 'zerar_saldo_motorista')) { ?>
                                    <li>
                                        <a href="#" id="reset-note-drivers">
                                            Zerar nota dos motoristas
                                        </a>
                                    </li>
                                <?php } ?>
                            </ul>
                        </li>
                    <?php } ?>
                </ul>
            </li>
        <?php } ?>

        <?php if ($this->hasPermissionGroup(GroupConst::MAPA)) { ?>
            <li>
                <a class="menu-option">
                    <p>
                        <i class="material-icons">
                            map
                        </i>
                        <span class="description-option-menu">Mapa</span>
                    </p>
                </a>
                <ul>
                    <?php if ($this->hasPermission(GroupConst::MAPA, 'gerenciar_enderecos_mapas')) { ?>
                        <li>
                            <a class="menu-option-item">
                                <span class="description-option-menu submenu">Gerenciar endereços</span>
                            </a>
                            <ul>
                                <?php if ($this->hasPermission(GroupConst::MAPA, 'gerenciar_enderecos_mapas')) { ?>
                                    <li><a href="<?php echo Host::getLocal() ?>setting/address">Cadastrar locais</a>
                                    </li>
                                <?php } ?>
                                <li><a href="<?php echo Host::getLocal() ?>setting/addressblacklist">Endereços
                                        irregulares</a></li>
                                <li><a href="<?php echo Host::getLocal() ?>setting/cacheaddress">Endereços
                                        em cache</a></li>
                            </ul>
                        </li>

                        <?php if ($this->hasPermission(GroupConst::MAPA, "visualizar_configuracoes_gerais")) { ?>
                            <li><a href="<?php echo Host::getLocal() ?>mapSetting/configMaps">Configurações gerais</a></li>
                        <?php } ?>

                        <?php if ($this->hasPermission(GroupConst::MAPA, "visualizar_conf_credenciais_cidade")) { ?>
                            <li><a href="<?php echo Host::getLocal() ?>mapSetting/configbycity">Configurações por cidade</a></li>
                        <?php } ?>

                        <?php if ($this->hasPermission(GroupConst::MAPA, "sequenciador_mapas")) { ?>
                            <li><a href="<?php echo Host::getLocal() ?>mapSetting">Sequenciador de mapas</a></li>
                        <?php } ?>

                        <?php if ($this->hasPermission(GroupConst::MAPA, "teste_servico_mapas")) { ?>
                            <li><a href="<?php echo Host::getLocal() ?>mapSetting/test">Teste serviço de mapa</a></li>
                        <?php } ?>

                        <?php if ($this->hasPermission(GroupConst::MAPA, "areas_de_calor")) { ?>
                            <li><a href="<?php echo Host::getLocal() ?>mapsetting/heatmap">Áreas de calor do mapa</a></li>
                        <?php } ?>

                        <?php if ($this->hasPermission(GroupConst::MAPA, "visualizar_otimizacao_rotas")) { ?>
                            <li><a href="<?php echo Host::getLocal() ?>mapSetting/routeOptimization">Otimização de rota</a></li>
                        <?php } ?>

                        <?php if ($this->hasPermission(GroupConst::MAPA, "visualzar_gerenciar_chaves_web")) { ?>
                            <li><a href="<?php echo Host::getLocal() ?>mapSetting/keys">Gerenciar chaves de mapa web</a></li>
                        <?php } ?>

                        <?php if ($this->hasPermission(GroupConst::MAPA, 'areas_riscos_visualizar')) { ?>
                            <li><a href="<?php echo Host::getLocal() ?>riskArea">Áreas de risco</a></li>
                        <?php } ?>
                    <?php } ?>
                </ul>
            </li>
        <?php } ?>
        <?php if ($this->hasPermissionGroup(GroupConst::ENTREGA)) { ?>
            <li>
                <a class="menu-option">
                    <p>
                        <i class="material-icons">
                            shopping_basket
                        </i>
                        <span class="description-option-menu">Entrega</span>
                    </p>
                </a>
                <ul>
                    <?php if ($this->hasPermission(GroupConst::ENTREGA, 'gerenciar_item')) { ?>
                        <li><a href="<?= Host::getLocal() ?>simpledelivery/items">Gerenciar itens</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::ENTREGA, 'sugestao_texto')) { ?>
                        <li><a href="<?= Host::getLocal() ?>simpledelivery/suggestion-text">Sugestão de texto</a></li>
                    <?php } ?>
                </ul>
            </li>
        <?php } ?>
        <?php if (
            $this->hasPermission(GroupConst::CENTRAL, 'central_listagem') ||
            $this->hasPermission(GroupConst::CENTRAL, 'central_usuarios') ||
            $this->hasPermission(GroupConst::CENTRAL, 'central_bairros') ||
            $this->hasPermission(GroupConst::CENTRAL, 'central_configuracoes')
        ) { ?>
            <li>
                <a class="menu-option">
                    <p>
                        <i class="material-icons">
                            place
                        </i>
                        <span class="description-option-menu">Central</span>
                    </p>
                </a>
                <ul>
                    <?php if ($this->hasPermission(GroupConst::CENTRAL, 'central_listagem')) { ?>
                        <li><a href="<?php echo Host::getLocal() ?>central/">Listagem</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CENTRAL, 'central_usuarios')) { ?>
                        <li><a href="<?php echo Host::getLocal() ?>central/listCustomer">Listagem de Usuários</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CENTRAL, 'central_bairros')) { ?>
                        <li><a href="<?php echo Host::getLocal() ?>central/neighborhoods">Bairros</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::CENTRAL, 'central_configuracoes')) { ?>
                        <li><a href="<?php echo Host::getLocal() ?>central/setting">Configurações</a></li>
                    <?php } ?>
                </ul>
            </li>
        <?php } ?>
        <?php if ($this->hasPermissionGroup(GroupConst::FRETE)) { ?>
            <li>
                <a class="menu-option">
                    <p>
                        <i class="material-icons">
                            local_shipping
                        </i>
                        <span class="description-option-menu">Frete</span>
                    </p>
                </a>
                <ul>
                    <?php if ($this->hasPermission(GroupConst::FRETE, 'cadastro_item')) { ?>
                        <li><a href="<?= Host::getLocal() ?>item/index">Cadastro de item</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::FRETE, 'listagem_item')) { ?>
                        <li><a href="<?= Host::getLocal() ?>item/list">Lista de itens</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::FRETE, 'acessibilidade_carga')) { ?>
                        <li><a href="<?= Host::getLocal() ?>item/accessibility">Serviços extras</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::FRETE, 'acessibilidade_viagem')) { ?>
                        <li><a href="<?= Host::getLocal() ?>item/Obstacles">Acessibilidade carga</a></li>
                    <?php } ?>
                </ul>
            </li>
        <?php } ?>
        <?php if ($this->hasPermissionGroup(GroupConst::PUBLICIDADE)) { ?>
            <li>
                <a class="menu-option">
                    <p>
                        <i class="material-icons">
                            public
                        </i>
                        <span class="description-option-menu">Publicidade</span>
                        <span id="badge-marketing" class="badge badge-pill badge-info"></span>
                    </p>
                </a>
                <ul>
                    <?php if ($this->hasPermission(GroupConst::PUBLICIDADE, "inserir_publicidade")) { ?>
                        <li>
                            <a href="<?= Host::getLocal() ?>marketing/Publicidade">Inserir Publicidade</a>
                        </li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::PUBLICIDADE, "listar_publicidade")) { ?>
                        <li>
                            <a href="<?= Host::getLocal() ?>marketing/ListPublicidade">Listar Publicidade</a>
                        </li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::PUBLICIDADE, "link_menu_externo")) { ?>
                        <li>
                            <a href="<?= Host::getLocal() ?>marketing/menuLinkExternal">Link para menu externo</a>
                        </li>
                    <?php } ?>
                </ul>
            </li>
        <?php } ?>

        <?php if ($this->hasPermissionGroup(GroupConst::PROMOCAO)) { ?>
            <li>
                <a class="menu-option">
                    <p>
                        <i class="material-icons">local_activity</i>
                        <span class="description-option-menu">Promoções</span>
                    </p>
                </a>
                <ul>
                    <?php if ($this->hasPermission(GroupConst::PROMOCAO, "cupom")) { ?>
                        <?php if ($this->hasPermission(GroupConst::PROMOCAO, "inserir_cupom")) { ?>
                            <li>
                                <a href="<?= Host::getLocal() ?>voucher/voucherList">Inserir voucher</a>
                            </li>
                        <?php } ?>
                        <?php if ($this->hasPermission(GroupConst::PROMOCAO, "listar_cupom")) { ?>
                            <li>
                                <a href="<?= Host::getLocal() ?>marketing/listCupom">Cupons</a>
                            </li>
                        <?php } ?>
                        <li><a href="<?= Host::getLocal() ?>saletrip/list">Promoções por viagem</a></li>
                    <?php } ?>
                </ul>
            </li>
        <?php } ?>

        <?php if ($this->hasPermissionGroup(GroupConst::TARIFAS)) { ?>
            <li>
                <a class="menu-option">
                    <p>
                        <i class="material-icons">bar_chart</i>
                        <span class="description-option-menu">Tarifas</span>
                        <span id="badge-fee" class="badge badge-pill badge-info"></span>
                    </p>
                </a>
                <ul>
                    <?php if ($this->hasPermission(GroupConst::TARIFAS, 'tarifa_listar')) { ?>
                        <li><a href="<?php echo Host::getLocal() ?>setting/rates">Tipos de viagem</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::TARIFAS, "listar_gatilho")) { ?>
                        <li><a href="<?php echo Host::getLocal() ?>setting/trigger">Gatilho de tarifa</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::TARIFAS, "listar_gatilho_dinamico")) { ?>
                        <li><a href="<?php echo Host::getLocal() ?>setting/triggerLabel">Bandeira de tarifa </a></li>
                    <?php } ?>

                    <?php if ($this->hasPermission(GroupConst::TARIFAS, "gerenciar_dinamica_area")) { ?>
                        <li><a href="<?php echo Host::getLocal() ?>setting/dynamicByArea">Dinâmica por área</a></li>
                    <?php } ?>
                </ul>
            </li>
        <?php } ?>

        <?php if ($this->hasPermissionGroup(GroupConst::PARCEIRO)) { ?>
            <li>
                <a class="menu-option">
                    <p>
                        <i class="material-icons">thumb_up</i>
                        <span class="description-option-menu">Parceiros</span>
                    </p>
                </a>
                <ul>
                    <li>
                        <a href="<?php echo Host::getLocal() ?>partner/listPartner">
                            Listagem
                        </a>
                        <a href="<?php echo Host::getLocal() ?>partner/messagePartner">
                            Mensagens da ouvidoria
                        </a>
                    </li>
                </ul>
            </li>
        <?php } ?>

        <?php if ($this->hasPermissionGroup(GroupConst::GESTOR)) { ?>
            <li>
                <a class="menu-option">
                    <p>
                        <i class="material-icons">
                            how_to_reg
                        </i>
                        <span class="description-option-menu">Gestor</span>
                    </p>
                </a>
                <ul>
                    <li>
                        <a href="<?= Host::getLocal() ?>manager">Lista de gestores</a>
                    </li>
                    <li><a href="<?php echo Host::getLocal() ?>manager/drivers">Motoristas por gestor</a></li>
                </ul>
            </li>
        <?php } ?>

        <?php if ($this->hasPermissionGroup(GroupConst::ROTA)) { ?>
            <li>
                <a class="menu-option">
                    <p>
                        <i class="material-icons">map</i>
                        <span class="description-option-menu">Rotas</span>
                        <span id="badge-route" class="badge badge-pill badge-info"></span>
                    </p>
                </a>
                <ul>
                    <?php if ($this->hasPermission(GroupConst::ROTA, 'gerenciar_item_rotas')) { ?>
                        <li><a href="<?= Host::getLocal() ?>simpledelivery/items">Gerenciar itens</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::ROTA, 'inserir')) { ?>
                        <li><a href="<?php echo Host::getLocal() ?>route/route">Cadastrar</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::ROTA, 'listar')) { ?>
                        <li><a href="<?php echo Host::getLocal() ?>route/routeList">Listagem</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermission(GroupConst::ROTA, 'liberar')) { ?>
                        <li><a href="<?php echo Host::getLocal() ?>route/releaseDrivers">Liberar motoristas</a></li>
                    <?php } ?>
                    <?php if ($this->hasPermissionGroup(GroupConst::ROTA)) { ?>
                        <li><a href="<?php echo Host::getLocal() ?>route/promotionalBanner">Banners</a></li>
                    <?php } ?>
                </ul>
            </li>
        <?php } ?>

        <?php if ($this->hasPermissionGroup(GroupConst::MILITAR)) { ?>
            <li>
                <a class="menu-option">
                    <p>
                        <i class="material-icons">security</i>
                        <span class="description-option-menu">Militar</span>
                        <span id="badge-route" class="badge badge-pill badge-info"></span>
                    </p>
                </a>
                <ul>
                    <li><a href="<?php echo Host::getLocal() ?>militaryForce/list">Adicionar Órgão Militar</a></li>
                    <li><a href="<?php echo Host::getLocal() ?>militaryForceGraduation/list">Adicionar Patente</a></li>
                </ul>
            </li>
        <?php } ?>

        <?php if ($this->hasPermissionGroup(GroupConst::VERSAO)) { ?>
            <li>
                <a href="<?= Host::getLocal() ?>setting/version">
                    <p>
                        <i class="material-icons">settings</i>
                        <span class="description-option-menu">Versões</span>
                    </p>
                </a>
            </li>
        <?php } ?>

        <?php if ($this->hasPermissionGroup(GroupConst::SUPORTE)) { ?>
            <li>
                <a href="<?= Host::getLocal() ?>support">
                    <p>
                        <i class="material-icons">help_outline</i>
                        <span class="description-option-menu">Suporte</span>
                        <span id="badge-support" class="badge badge-pill badge-info"></span>
                    </p>
                </a>
            </li>
        <?php } ?>

        <!--        <li class="menu-tips">
                    <a href="tips">
                        <p>
                            <i class="material-icons">
                                help_outline
                            </i>
                            <span class="description-option-menu">Assistente virtual</span>
                        </p>
                    </a>
                </li>-->

        <li class="menu-logout">
            <?php if (Session::get('enable_operation_manual_and_youtube_channel') == 1) { ?>
                <a href="https://suporte.fb704.com.br/solucoes" target="_blank">
                    <p>
                        <i class="material-icons">
                            description
                        </i>
                        <span class="description-option-menu">Manual de operação do sistema</span>
                    </p>
                </a>
                <a href="https://www.youtube.com/Fabrica704" target="_blank">
                    <p>
                        <i class="material-icons">
                            live_tv
                        </i>
                        <span class="description-option-menu">Canal Youtube (manual em vídeos)</span>
                    </p>
                </a>
            <?php } ?>
            <?php if ($this->hasPermissionGroup(GroupConst::VERSAO)) { ?>
                <a href="<?= Host::getLocal() ?>versioning/applications">
                    <p>
                        <i class="material-icons">
                            code
                        </i>
                        <span class="description-option-menu">Versionamento - Aplicações</span>
                    </p>
                </a>
            <?php } ?>
            <a class="clear-cache">
                <p>
                    <i class="material-icons">
                        brush
                    </i>
                    <span class="description-option-menu">Limpar cache</span>
                </p>
            </a>

            <a id="logoutMenu">
                <p>
                    <i class="material-icons">
                        exit_to_app
                    </i>
                    <span class="description-option-menu">Sair</span>
                </p>
            </a>
        </li>
        <?php if (Session::get('enable_social_networks_on_monitor') == 1) { ?>
            <div class="d-flex w-100 justify-content-center align-items-center" style="height: 10%">
                <a href="https://www.facebook.com/fabrica704/" target="_blank">
                    <img src="/webfiles/img/icon/facebook.png" alt="icone do facebook" width='25px' height='25px' />
                </a>
                <a href="https://www.instagram.com/fabrica704/" target="_blank" class="mr-3 ml-3">
                    <img src="/webfiles/img/icon/instagram.png" alt="icone do instagram" width='25px' height='25px' />
                </a>
                <a href="https://www.youtube.com/channel/UCujopWG5lctS7EOWWkjNftQ" target="_blank">
                    <img src="/webfiles/img/icon/youtube.png" alt="icone do facebook" width='25px' height='25px' />
                </a>
            </div>
        <?php } ?>
    </ul>
</nav>

<div id="modal-charge" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Adcionar cobrança mensal em <br> todos os motoristas</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="value-charge">Valor da cobrança</label>
                    <input class="form-control" id="value-charge">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary">Salvar</button>
            </div>
        </div>
    </div>
</div>
<div class="space-default-menu"></div>
<div class="modal fade" id="notificationAdminModal" tabindex="-1" role="dialog" aria-labelledby="notificationAdminModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Notificações</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <ul class="list-group" id="listNotificationAdmin"></ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#filterNotification">
                    <span class="material-icons">tune</span>
                </button>
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="filterNotification" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Filtro de notificação</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="groupNotificationAdmin">Grupo</label>
                    <select class="form-control" id="groupNotificationAdmin">
                        <option value="" selected>Todos os grupos</option>
                    </select>
                </div>
                <hr />
                <h5>Mostra: </h5>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="typeStatusReadNotification" value="" checked>
                    <label class="form-check-label" for="typeStatusReadNotification">
                        Todas
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="typeStatusReadNotification" value="0" checked>
                    <label class="form-check-label" for="typeStatusReadNotification">
                        Apenas não lida
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="typeStatusReadNotification" value="1">
                    <label class="form-check-label" for="typeStatusReadNotification">
                        Apenas lida
                    </label>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="applyFilterNotificationAdmin">Aplicar</button>
            </div>
        </div>
    </div>
</div>

<?php if ($this->hasPermission(GroupConst::CONTATO, "access_crisp")) { ?>
    <!-- implementação do novo chat-bot, teve que ser usado a atribuição da função aqui pois não estava sendo atribuida no arquivo js referente a este index. -->
    <!-- <script src="https://clever-chat.ai/chatbot/1.0.0/index.js"></script> -->
<?php } ?>