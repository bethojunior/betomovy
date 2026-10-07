<?php

namespace app\validator;

use app\validator\contracts\Validator;

use Exception;

class TripBidValidator extends Validator
{
    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateNewBid($request)
    {
        $this->requestIsNotEmpty($request);

        $this->isNumber($request->driverId,
            'O campo driverId está inválido');

        $this->isNumber($request->tripId,
            'O campo id viagem está inválido');


        $this->isNumber($request->price,
            'O campo price está inválido');


        return true;
    }
}