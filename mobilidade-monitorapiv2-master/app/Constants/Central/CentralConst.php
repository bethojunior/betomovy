<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/06/2020
 * Time: 14:08
 */

namespace App\Constants\Central;


class CentralConst
{
    const LOGO_DIR = 'customer/profile/compressed/central/';
    const DIR_NAME_IMAGE = 'central/';

    const INSERT = 1;
    const REMOVE = 2;

    const LOGO_DIR_ROOT = 'customer/profile/compressed/';

    const CENTRAL_CALLS = [
        'only_central_drivers' => 'Chamar apenas motoristas da central',
        'only_app' => 'Chamar apenas motoristas da plataforma',
        'all' => 'Chamar todos os motoristas',
    ];
}
