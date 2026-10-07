<?php

namespace app\validator;

use app\validator\contracts\Validator;
use Exception;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 10/05/2019
 * Time: 09:24
 */
class PricePartnerValidator extends Validator
{
    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateCalculatePrice($request)
    {
        $this->requestIsNotEmpty($request);

        $this->latitudeIsValid($request->origin->latitude ?? '', 'origin.latitude');
        $this->longitudeIsValid($request->origin->longitude ?? '', 'origin.longitude');
        $this->latitudeIsValid($request->destination->latitude ?? '', 'destination.latitude');
        $this->longitudeIsValid($request->destination->longitude ?? '', 'destination.longitude');

        return true;
    }
}