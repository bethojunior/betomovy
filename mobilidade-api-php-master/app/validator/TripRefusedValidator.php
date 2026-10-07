<?php

namespace app\validator;

use app\validator\contracts\Validator;

use Exception;

class TripRefusedValidator extends Validator
{
    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateInsert($request)
    {
        $this->requestIsNotEmpty($request);

        $this->isNumber($request->driverId,
            'O campo driverId está inválido');

        $this->isNumber($request->tripId,
            'O campo tripId está inválido');

        return true;
    }
}