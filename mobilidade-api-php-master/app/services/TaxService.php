<?php


namespace app\services;
use app\dao\TaxDao;
use app\model\Tax;

class TaxService
{
    private $dao;

    public function __construct()
    {
        $this->dao = new TaxDao();
    }

    public function findActivesByCityAndTripTypePaidByCustomer(int $cityId, int $tripTypeId)
    {
        $taxes = $this->dao->findActivesByCityAndTripTypePaidByCustomer($cityId, $tripTypeId);

        return array_map(function ($tax) {
            return new Tax($tax);
        }, $taxes);
    }

    public function findByTrip($tripId)
    {
        $taxes = (new TaxDao)->findByTrip($tripId);

        return array_map(function ($tax) {
            return new Tax($tax);
        }, $taxes);
    }
}