<div class="container-menu-mobile" id="navbar-home">
    
    <div class="logo">
        <div class='brand-icon'>
            <a href="<?= Host::getLocal() ?>"><img id='home-logo' src="<?= Host::getLocal(); ?>webfiles/img/logo/logo_conceito.png" class='brand-logo left'/></a>
        </div>
    </div>
    <div class="menu-close" id="optionMenu">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    </div>

    <div class="container-menu-options">
        <a href="<?= Host::getLocal() ?>"><img class="logo-white-return"
            src="<?php echo Host::getLocal() ?>webfiles/img/logo/logo.png"></a>
        
        <ul id="menuOptionUser">
            <li><a href='<?= Host::getLocal(); ?>Plus/plus'>PLUS</a></li>
            <li><a href='<?= Host::getLocal(); ?>Cliente/client'>Para você</a></li>
            <li><a href='<?=Host::getLinkAppDrivers()?>' >Quero Dirigir</a></li>
        </ul>
    </div>
</div>
