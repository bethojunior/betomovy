<?php

namespace app\commands;

use app\utils\Command;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/01/2019
 * Time: 14:18
 */
class HashApiTokenCommand extends Command
{
    public function __construct($params = null)
    {
        parent::__construct($params);
    }

    public function handle(): void
    {
        $apiToken = $this->params[2] ?? null;

        $this->response = $this->params;

        $this->response = "ApiToken não enviado";

        if ($apiToken)
            $this->response = password_hash($apiToken, PASSWORD_BCRYPT);
    }
}