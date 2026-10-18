<?php
$central = Session::get("centralSelected");
$centrals_user = Session::get("centrals");

if (!$central || (is_object($central) && empty($central->id)) || (is_array($central) && empty($central['id']))) {
    if (is_array($centrals_user) && count($centrals_user) > 0) {
        $firstItem = $centrals_user[0];
        $c = null;
        if (is_array($firstItem) && isset($firstItem['central'])) {
            $c = $firstItem['central'];
        } elseif (is_object($firstItem) && isset($firstItem->central)) {
            $c = $firstItem->central;
        } else {
            $c = $firstItem;
        }
        $central = $c;
        Session::set("centralSelected", $central);
    }
}

if (is_array($central)) {
    $central = (object) $central;
}
if (!is_object($central)) {
    $central = (object) [
        'id' => null,
        'name' => 'Central',
        'logo' => 'default.jpg',
    ];
}
if (!isset($central->name) || empty($central->name)) {
    $central->name = 'Central';
}
if (!isset($central->logo) || empty($central->logo)) {
    $central->logo = 'default.jpg';
}
if (!isset($central->id)) {
    $central->id = null;
}
$currentUri = $_SERVER['REQUEST_URI'] ?? '';
$isOnWhatsappRoute = strpos($currentUri, 'whatsapp') !== false;
$showWhatsappMenuItem = $isOnWhatsappRoute;
?>
<nav class="app-header" style="z-index: 100">

    <div class="menu-close" id="optionMenu" aria-label="Abrir menu">
        <span></span>
        <span></span>
        <span></span>
    </div>

    <a class="app-header__brand" href="<?php echo Host::getLocal(); ?>">
        <img src="/webfiles/img/logo/logo.png"
             onerror="this.onerror=null; this.src='/webfiles/img/logo/logo.png';"
             alt="MOVY Central"
             class="app-header__logo"
             style="max-height: 38px; object-fit: contain;">
        <span class="app-header__name">MOVY</span>
    </a>

    <select class="app-header__select" id="selectCentralChange">
        <?php
        $centrals_user = Session::get("centrals");
        if (is_array($centrals_user)) {
            foreach ($centrals_user as $item) {
                if (is_array($item)) {
                    $item = (object) $item;
                }
                $c = null;
                if (isset($item->central)) {
                    $c = is_array($item->central) ? (object)$item->central : $item->central;
                } else {
                    $c = $item;
                }
                if (!is_object($c)) continue;
                $cId = $c->id ?? null;
                $cName = $c->name ?? 'Central';
                $selected = ($central->id !== null && $central->id == $cId) ? "selected" : "";
                $value = htmlspecialchars(json_encode($c), ENT_QUOTES, 'UTF-8');
                $name  = htmlspecialchars($cName, ENT_QUOTES, 'UTF-8');
                echo "<option value='{$value}' {$selected}>{$name}</option>";
            }
        }
        ?>
    </select>

</nav>
<div class="container-menu-options">
    <div id="containerMenuOptions">
        <nav class="navbar navbar-dark bg-dark menu-drawer-navbar" aria-label="Menu lateral">
            <div class="menu-close" id="btnCloseMenuDrawer" role="button" tabindex="0" aria-label="Fechar menu">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>

        <?php
        $centralInitial = mb_strtoupper(mb_substr($central->name, 0, 1, 'UTF-8'), 'UTF-8');
        ?>
        <div class="info-user">
            <div id="imageUserMenu"
                 style="background-image: url('<?php echo Host::getCentral() . htmlspecialchars($central->logo ?? '', ENT_QUOTES, 'UTF-8'); ?>');"
                 data-initial="<?php echo $centralInitial; ?>"></div>
            <div class="info-user__text">
                <h4 id="nameUser"></h4>
                <p id="occupation"><?php echo htmlspecialchars($central->name, ENT_QUOTES, 'UTF-8'); ?></p>
            </div>
        </div>

        <p id="appPartnerName" class="app-partner-name"></p>

        <ul id="menuOptionUser">
            <li>
                <div>
                    <a href="<?php echo Host::getLocal() ?>">
                        <i class="material-icons nav-icon">home</i>
                        Início
                    </a>
                </div>
            </li>
            <li>
                <div>
                    <a href="<?php echo Host::getLocal() ?>trip/list">
                        <i class="material-icons nav-icon">directions_car</i>
                        Viagens
                    </a>
                </div>
            </li>
            <li>
                <div>
                    <a href="<?php echo Host::getLocal() ?>district/list">
                        <i class="material-icons nav-icon">location_on</i>
                        Bairros
                    </a>
                </div>
            </li>
            <li>
                <div>
                    <a href="<?php echo Host::getLocal() ?>neighborhoodRides/list">
                        <i class="material-icons nav-icon">swap_horiz</i>
                        Bairro para bairro
                    </a>
                </div>
            </li>
            <li class="menu-option">
                <div>
                    <a>
                        <i class="material-icons nav-icon">people</i>
                        Clientes
                    </a>
                    <p class="menu-accordion-btn"><span class="material-icons">expand_more</span></p>
                </div>
                <ul>
                    <li id="registerClient"><a>Cadastro</a></li>
                    <li><a href="<?php echo Host::getLocal() ?>customer/list">Listagem</a></li>
                </ul>
            </li>
            <li>
                <div>
                    <a href="<?php echo Host::getLocal() ?>voucher/list">
                        <i class="material-icons nav-icon">card_giftcard</i>
                        Voucher
                    </a>
                </div>
            </li>
            <li id="menuItemDriver"></li>
            <li>
                <div>
                    <a href="<?php echo Host::getLocal() ?>dynamicfields/list">
                        <i class="material-icons nav-icon">settings</i>
                        Campos dinâmicos
                    </a>
                </div>
            </li>
            <li>
                <div>
                    <a href="<?php echo Host::getLocal() ?>language/management">
                        <i class="material-icons nav-icon">language</i>
                        Idiomas da Plataforma
                    </a>
                </div>
            </li>
            <li id="cleanCache">
                <div>
                    <a onclick="modal()">
                        <i class="material-icons nav-icon">cached</i>
                        Limpar cache
                    </a>
                </div>
            </li>
            <li class="menu-option" id="menuItemWhatsapp" style="<?php echo $showWhatsappMenuItem ? '' : 'display: none'; ?>" data-whatsapp-enabled="<?php echo $isOnWhatsappRoute ? '1' : '0'; ?>">
                <div>
                    <a>
                        <svg class="nav-icon nav-icon-svg nav-icon-svg--whatsapp" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                            <path fill="currentColor" d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                        </svg>
                        WhatsApp
                    </a>
                    <p class="menu-accordion-btn"><span class="material-icons">expand_more</span></p>
                </div>
                <ul>
                    <li>
                        <a href="<?php echo Host::getLocal() ?>whatsapp/management">Configurações</a>
                    </li>
                </ul>
            </li>

            <li id="logout">
                <div>
                    <a href="<?php echo Host::getLocal() ?>logout">
                        <i class="material-icons nav-icon">exit_to_app</i>
                        Sair
                    </a>
                </div>
            </li>
        </ul>
        <div id='version-content'>
            <span id='version'></span>
        </div>
    </div>
</div>

<!-- Modal: Limpar cache -->
<div class="modal fade" id="myModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered cache-modal__dialog">
        <div class="modal-content cache-modal">

            <div class="cache-modal__head">
                <span class="cache-modal__title">Limpar cache</span>
                <button type="button" class="cache-modal__close" data-dismiss="modal">&times;</button>
            </div>

            <p class="cache-modal__text">
                Ao confirmar, você será deslogado do sistema automaticamente.
            </p>

            <div class="cache-modal__footer">
                <button type="button" class="cache-modal__cancel" data-dismiss="modal">Cancelar</button>
                <button type="button" class="cache-modal__confirm" onclick="clearCache()">Sim, limpar</button>
            </div>

        </div>
    </div>
</div>

<script>
    function clearCache() {
        $('#myModal').modal('hide');
        setTimeout(function() {
            localStorage.clear();
            sessionStorage.clear();
            document.cookie.split(";").forEach(cookie => {
                const name = cookie.split("=")[0].trim();
                if (name) $.removeCookie(name, {path: '/'});
            });
            window.location.reload(true);
        }, 2000);
    }

    function modal() {
        $('#myModal').modal('show');
    }

    // Fallback: se a logo da central não carregar, exibe a inicial
    (function() {
        var avatar = document.getElementById('imageUserMenu');
        if (!avatar) return;
        var url = (avatar.style.backgroundImage || '').replace(/url\(['"]?|['"]?\)/g, '');
        if (!url) { avatar.textContent = avatar.dataset.initial || ''; return; }
        var img = new Image();
        img.onload = function() { /* logo carregou, mantém background */ };
        img.onerror = function() {
            avatar.style.backgroundImage = 'none';
            avatar.textContent = avatar.dataset.initial || '';
        };
        img.src = url;
    })();
</script>
