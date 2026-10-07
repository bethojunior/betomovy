<?php

namespace app\validator;

use app\validator\contracts\Validator;
use Exception;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 05/09/2019
 * Time: 14:47
 */
class FreightValidator extends Validator
{
    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateInsert($request)
    {
        $this->requestIsNotEmpty($request);

        $this->tripTypeIdIsValid($request->tripTypeId ?? '');
        $this->isNumber($request->price ?? '', 'Valor está inválido');
        $this->isNumber($request->tripPaymentFormId ?? '', 'Forma de pagamento está inválida');

        return true;
    }

    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateAccept($request)
    {
        $this->requestIsNotEmpty($request);

        $this->stringIsValid($request->tripReference ?? '', 'tripReference');
        $this->isNumber($request->driverId ?? '', 'O driverId deve ser válido');

        return true;
    }
}