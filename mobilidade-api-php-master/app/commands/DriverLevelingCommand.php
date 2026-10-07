<?php

namespace app\commands;

use app\dao\DriverDao;
use app\model\Config;
use app\utils\Command;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/06/2019
 * Time: 19:02
 */
class DriverLevelingCommand extends Command
{
    private $driverDao;

    public function __construct($params = null)
    {
        parent::__construct($params);
        $this->driverDao = new DriverDao;
    }

    public function handle(): void
    {
        $this->response .= writeLn("Nivelando motoristas ..");

        if ((bool)Config::get('enable_driver_leveling'))
            $this->driverDao->levelDrivers();

        $this->response .= writeLn("Motoristas nivelados .. ");
    }
}