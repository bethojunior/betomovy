<?php

namespace app\validator;

use app\validator\contracts\Validator;

use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 17/06/2019
 * Time: 18:53
 */
class UserIndicationValidator extends Validator
{
    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateInsert($request)
    {
        $this->requestIsNotEmpty($request);

        $this->stringIsValid(
            $request->whoIndicatedId ?? '',
            "O id de quem indicou não está válido");
        $this->isNumber(
            $request->driverId ?? '',
            "O id do motorista não está válido");

        return true;
    }
}