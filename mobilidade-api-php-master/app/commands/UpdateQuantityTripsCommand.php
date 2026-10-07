<?php


namespace app\commands;

use app\dao\DriverDao;
use app\dao\UserDao;
use app\utils\Command;

class UpdateQuantityTripsCommand extends Command
{
    private $driverDao;
    private $userDao;

    public function __construct($params = null)
    {
        parent::__construct($params);
        $this->userDao = new UserDao();
        $this->driverDao = new DriverDao();
    }

    public function handle(): void
    {
        $idUser = $this->params[2];
        $idDriver = $this->params[3];

        $this->userDao->updateQuantityTrips($idUser);
        $this->driverDao->updateQuantityTrips($idDriver);

        $this->response = 'Quantidade de viagens atualizadas';
    }
}