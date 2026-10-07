<?php

namespace app\validator;

use app\validator\contracts\Validator;

class RiskAreaValidator extends Validator
{
    public function validateStore($request)
    {
        $this->requestIsNotEmpty($request);

        $this->isNumber(
            $request->userId ?? '',
            "userId deve ser um inteiro");

        $this->latitudeIsValid(
            $request->latitude ?? '',
            "latitude");

        $this->longitudeIsValid(
            $request->longitude ?? '',
            'longitude'
        );

        $this->stringIsValid(
            $request->address ?? '',
            'address');

        $this->stringIsValid(
            $request->tripReference ?? '',
            'tripReference');
    }
}