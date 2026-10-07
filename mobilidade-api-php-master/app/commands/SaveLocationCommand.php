<?php

namespace app\commands;

use app\dao\LocationDao;
use app\model\Location;
use app\utils\Command;
use Exception;

/**
 * Created by PhpStorm.
 * Date: 27/01/2020
 * Time: 09:01
 */
class SaveLocationCommand extends Command
{
    /**
     * @var LocationDao
     */
    private $dao;

    public function __construct($params = null)
    {
        parent::__construct($params);
        $this->dao = new LocationDao;
    }

    /**
     * @throws Exception
     */
    public function handle(): void
    {
        $location = $this->params[2] ?? null;

        if (!$location)
            exit;

        //        $this->createFolderIfNotExists();

        $location = new Location(json_decode($location));

        //        exec("echo ".json_encode($location->toStdClass())." > locations/{$location->getDriverId()}.loc");

        $this->dao->insertWithoutValidation($location);
    }

    private function createFolderIfNotExists()
    {
        $dir = 'locations';

        if (!is_dir($dir))
            mkdir($dir, 0777, true);
    }
}
