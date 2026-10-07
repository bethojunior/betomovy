<?php

namespace app\commands;

use app\utils\Command;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/01/2019
 * Time: 14:15
 */
class TesteCommand extends Command
{
    public function handle(): void
    {
        $this->response = "Funcionou!";
    }
}