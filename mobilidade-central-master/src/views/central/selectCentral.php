<div class="sc-page" style="background-image: url('<?php echo Host::getLocal(); ?>webfiles/img/icon/banner.jpg');">
    <div class="sc-container">

        <div class="sc-header">
            <h1 class="sc-title">Selecione a central</h1>
            <p class="sc-subtitle">Escolha a central que deseja gerenciar</p>
        </div>

        <ul class="sc-list">
            <?php
            $pathImage = Host::getCentral();
            foreach (Session::get("centrals") as $userCentral) {
                $json    = htmlspecialchars(json_encode($userCentral->central), ENT_QUOTES, 'UTF-8');
                $name    = htmlspecialchars($userCentral->central->name,    ENT_QUOTES, 'UTF-8');
                $address = htmlspecialchars($userCentral->central->address, ENT_QUOTES, 'UTF-8');
                $logo    = htmlspecialchars($pathImage . $userCentral->central->logo, ENT_QUOTES, 'UTF-8');
                echo "
                <li class='central-select sc-item' value='{$json}'>
                    <div class='sc-item__logo' style='background-image: url({$logo})'></div>
                    <div class='sc-item__info'>
                        <p class='sc-item__name'>{$name}</p>
                        <p class='sc-item__address'>{$address}</p>
                    </div>
                    <i class='sc-item__arrow material-icons' aria-hidden='true'>chevron_right</i>
                </li>";
            }
            ?>
        </ul>

    </div>
</div>
