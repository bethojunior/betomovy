<?php

namespace app\commands;

use app\utils\Command;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 29/01/2019
 * Time: 10:14
 */
class WebSocketPresenceCommand extends Command
{
    public function handle(): void
    {
        $this->response = require '../ratchet.php';
    }
}