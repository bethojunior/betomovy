<?php

namespace app\dao;

use app\model\TurbochargedPrice;
use app\utils\BaseDao;

class TurbochargedPriceDao extends BaseDao
{
  protected $table = "turbochargedPrice";

    public function createTurbocharged($trip) {
      $turbochargedPrice = new TurbochargedPrice;
      return $turbochargedPrice
        ->setIdTrip($trip->getIdTrip())
        ->setOldPrice($trip->getOldPrice())
        ->setTurbochargedPrice($trip->getPrice())
        ->setId(
          $this->sqlInsert($turbochargedPrice)
        );
    }
}