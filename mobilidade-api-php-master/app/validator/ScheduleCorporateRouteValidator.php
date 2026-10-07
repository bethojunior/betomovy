<?php


namespace app\validator;

use app\validator\contracts\Validator;
use Exception;
class ScheduleCorporateRouteValidator extends Validator
{

    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateInsert($request)
    {
        $this->requestIsNotEmpty($request);

        $this->isNumber($request->scheduleCorporateRouteId ?? "", "Rota corporativo não informado");
        $this->stringIsValid($request->schedule ?? '', 'Data da viagem não informado');

        return true;
    }
}