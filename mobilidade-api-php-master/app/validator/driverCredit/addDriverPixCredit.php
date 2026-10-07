<?php

namespace app\validator\driverCredit;

use app\validator\contracts\Validator;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 31/10/2019
 * Time: 10:59.
 */
class addDriverPixCredit extends Validator
{
    /**
     * @return bool
     *
     * @throws \Exception
     */
    public function validatePixData(object $request)
    {
        $this->requestIsNotEmpty($request);

        $this->isNumber($request->amount);

        return true;
    }
}
