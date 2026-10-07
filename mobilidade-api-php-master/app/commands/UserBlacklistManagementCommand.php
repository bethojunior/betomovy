<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 16/01/2019
 * Time: 11:21
 */

namespace app\commands;

use app\dao\LogDao;
use app\services\BlacklistUserCommandService;
use app\utils\Command;
use Exception;

/**
 * Class UserBlacklistManagementCommand
 * Comando para
 */
class UserBlacklistManagementCommand extends Command
{
    private $service;

    public function __construct()
    {
        parent::__construct();
        $this->service = new BlacklistUserCommandService;
    }

    public function handle(): void
    {
        try {
            $this->conn->beginTransaction();

            $this->response = $this->service
                ->removeUsersOnExpiredTime();

            $this->conn
                ->commit();
        } catch (Exception $e) {
            (new LogDao)->logException($e);
            $this->conn
                ->rollBack();

            $this->response = $e->getMessage();
        }
    }
}