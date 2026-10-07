<?php

namespace app\validator;

use app\validator\contracts\Validator;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/10/2019
 * Time: 10:59
 */
class AdvertisingValidator extends Validator
{
    /**
     * @param object $request
     * @return bool
     * @throws Exception
     */
    public function validateGetAds(object $request)
    {
        $this->requestIsNotEmpty($request);

        $this->latitudeIsValid($request->lat ?? '');
        $this->longitudeIsValid($request->lng ?? '');

        return true;
    }
}