<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/10/2019
 * Time: 10:21
 */

namespace App\Constants\Central;


class CentralConst
{
    const LOGO_DIR_ROOT = 'customer/profile/compressed/';
    const LOGO_DIR = 'customer/profile/compressed/central/';

    const CENTRAL_CALLS = [
        'only_central_drivers' => 'Chamar apenas motoristas da central',
        'only_app' => 'Chamar apenas motoristas da plataforma',
        'all' => 'Chamar todos os motoristas',
    ];

    const ONLY_CENTRAL_DRIVERS = 'only_central_drivers';
    const ONLY_APP_DRIVERS = 'only_app';
    const ALL_DRIVERS = 'all';
}
