<?php

namespace app\validator;

use app\validator\contracts\Validator;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 09/09/2019
 * Time: 11:24
 */
class DriverFreightValidator extends Validator
{
    public function validateAccept($request)
    {
        $this->requestIsNotEmpty($request);


        return true;
    }
}