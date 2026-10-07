<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 04/01/2019
 * Time: 15:18
 */

namespace app\commands;

use app\services\TripManagementService;
use app\utils\Command;

/**
 * Class TripManagementCommand
 * Responsável por atualizar a área de busca das corridas e
 * expirar corridas que não são atendidas
 */
class TripManagementCommand extends Command
{
    private $service;

    public function __construct()
    {
        parent::__construct();
        $this->service = new TripManagementService;
    }

    public function handle(): void
    {
        $this->response = $this->service->getTripsToIncreaseArea();
    }
}