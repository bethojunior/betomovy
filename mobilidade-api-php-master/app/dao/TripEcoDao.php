<?php

namespace app\dao;

use app\services\EcoService;
use app\utils\BaseDao;
use app\model\TripEco;
use Exception;
use stdClass;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 07/11/2018
 * Time: 10:11
 */
class TripEcoDao extends BaseDao
{
    protected $table = "tripEco";

    /**
     * @param $tripReference
     * @return array|mixed|stdClass
     * @throws Exception
     */
    public function find($tripReference)
    {
        $eco = $this->sqlSelect([],
            [['tripReference', '=', ':tripReference']],
            [], 1
        )
            ->bind(['tripReference' => $tripReference])
            ->get(false);

        if (!$eco)
            $eco = $this->calculateEco($tripReference);

        return isset($eco->ecoKm) ? $eco : null;
    }

    /**
     * @param string $tripReference
     * @return stdClass
     * @throws Exception
     */
    public function calculateEco(string $tripReference): stdClass
    {
        $eco = (new EcoService)
            ->calculateTripEco($tripReference);

        $eco = new TripEco($eco);
        $eco
            ->setTripReference($tripReference)
            ->setIdTripEco((new TripEcoDao)
                ->sqlInsert($eco));

        return $eco->toStdClass();
    }
}