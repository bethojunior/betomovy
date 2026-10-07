<?php

namespace app\validator;

use app\validator\contracts\Validator;
use Exception;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 03/12/2019
 * Time: 10:00
 */
class RouteValidator extends Validator
{
    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateFindRoute($request)
    {
        $this->requestIsNotEmpty($request);

        $this->latitudeIsValid($request->lat ?? '');
        $this->longitudeIsValid($request->lng ?? '');

        return true;
    }

    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateUseRoute($request)
    {
        $this->requestIsNotEmpty($request);

        $this->isNumber($request->routeId ?? '',
            'Rota não é válida ou não foi enviada');

        return true;
    }

    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateRequestRide($request)
    {
        $this->requestIsNotEmpty($request);

        $this->stringIsValid($request->tripReference ?? '',
            'tripReference');

        if (!isset($request->riderTripCustomers) || !is_array($request->riderTripCustomers))
            throw new Exception("O campo riderTripCustomers deve ser um array");

        return true;
    }
}