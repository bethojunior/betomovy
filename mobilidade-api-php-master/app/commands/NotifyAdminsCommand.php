<?php

namespace app\commands;

use app\dao\UserDao;
use app\utils\Command;
use app\utils\Email;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 18/11/2019
 * Time: 18:18
 */
class NotifyAdminsCommand extends Command
{
    private $userDao;

    public function __construct($params = null)
    {
        parent::__construct($params);
        $this->userDao = new UserDao;
    }

    public function handle(): void
    {
        $body = $this->params[2] ?? null;
        $subject = $this->params[3] ?? null;

        $admins = $this->userDao
            ->findAdminUsers();

        if (!$body || !$subject) {
            echo "parametros inválidos";
            exit;
        }

        $email = new Email;
        $email
            ->addValue('title', $subject)
            ->addValue('message', $body);

        foreach ($admins as $admin) {
            if (isset($admin->email)) {
                $email
                    ->send($admin->email, $subject);

                echo "Enviado para: " . $admin->email . PHP_EOL;
            }
        }
    }
}