<?php

namespace app\validator;

use app\validator\contracts\Validator;
use Exception;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 20/12/2019
 * Time: 20:31
 */
class RideValidator extends Validator
{
    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateInsert($request)
    {
        $this->requestIsNotEmpty($request);

        $this->isNumber($request->routeId ?? '', 'Rota está inválida');
        $this->isNumber($request->seatsAvailable ?? '', 'Quantidade de vagas');
        $this->stringIsValid($request->schedule ?? '', 'schedule');

        return true;
    }
}