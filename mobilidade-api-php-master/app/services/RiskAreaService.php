<?php

namespace app\services;
use app\dao\RiskAreaDao;
use app\dao\TripDao;
use app\validator\RiskAreaValidator;

class RiskAreaService
{
    public function store($request)
    {
        (new RiskAreaValidator)->validateStore($request);

        $trip = (new TripDao)->find($request->tripReference);

        $request->cityId = $trip->cityId;

        return (new RiskAreaDao)->store($request);
    }
}