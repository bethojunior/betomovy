<?php
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/03/2019
 * Time: 12:00
 */

namespace app\commands;

use app\constant\PushActionConst;
use app\constant\PushConst;
use app\dao\PushConfigDao;
use app\dao\UpdateDriverPositionDao;
use app\model\Driver;
use app\services\DriverOnlineTimeService;
use app\utils\Command;
use app\utils\Push;
use Exception;

/**
 * Class UpdateDriverPositionCommand
 * Verifica os motoristas que estão há muito tempo ligado
 * porém sem atualização de posição.
 * Motoristas ociosos terão o status de desativado
 *
 * Serviço executado de hora em hora
 * Command: sync-drivers-active
 */
class UpdateDriverPositionCommand extends Command
{
    private $dao;
    private $pushConfigDao;
    private $driverOnlineTimeService;

    public function __construct($params = null)
    {
        parent::__construct($params);
        $this->dao = new UpdateDriverPositionDao;
        $this->pushConfigDao = new PushConfigDao;
        $this->driverOnlineTimeService = new DriverOnlineTimeService;
    }

    /**
     * @throws Exception
     */
    public function handle(): void
    {
        $drivers = $this->dao->getActiveLazyDrivers();

        $deviceTokens = array_map(function ($driver) {
            return $driver->deviceToken;
        }, $drivers);

        $this->turnOffDrivers($drivers);

        $this->notifyLazyDrivers($deviceTokens);

//        $this->turnOnDrivers($driverIds);

        $this->response = 'Posições atualizadas';
    }

    /**
     * @param array $drivers
     * @throws Exception
     */
    private function turnOffDrivers(array $drivers = [])
    {
        $driverIds = array_map(function ($driver) {
            return $driver->idDriver;
        }, $drivers);

        if (!empty($driverIds))
            $this->dao
                ->turnStatus(Driver::OFF, $driverIds);

        foreach ($drivers as $driver) {
            $driver->status = Driver::OFF;

            $this->driverOnlineTimeService
                ->updateStatus(new Driver($driver));
        }
    }

    /**
     * @param array $ids
     * @throws Exception
     */
    private function turnOnDrivers(array $ids = [])
    {
        $this->dao->turnStatus(Driver::AVAILABLE, $ids);
    }

    private function notifyLazyDrivers(array $deviceTokens = [])
    {
        if (empty($deviceTokens))
            return null;

        $config = $this->pushConfigDao->find('lazy_drivers_shutdown');

        $push = new Push;

        $push
            ->setTitle($config->getTitle())
            ->setBody($config->getMessage())
            ->setPriority(PushConst::HIGH_PRIORITY)
            ->setAction(PushActionConst::UPDATE_DRIVER_INFO);

        return $push->notificationAll($deviceTokens);
    }
}