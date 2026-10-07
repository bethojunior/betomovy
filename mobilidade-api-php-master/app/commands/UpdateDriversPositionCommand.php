<?php

namespace app\commands;

use app\utils\Command;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 27/01/2020
 * Time: 12:29
 */
class UpdateDriversPositionCommand extends Command
{
    public function handle(): void
    {
        $dir = array_diff(scandir('../public/locations/'), array('..', '.'));
//        $dir = scandir('../public/locations/', SCANDIR_SORT_ASCENDING);

        dd($dir);
    }
}