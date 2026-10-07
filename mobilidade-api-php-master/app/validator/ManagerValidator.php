<?php

namespace app\validator;

use app\validator\contracts\Validator;
use Exception;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 19/06/2019
 * Time: 20:53
 */
class ManagerValidator extends Validator
{
    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateLogin($request)
    {
        $this->requestIsNotEmpty($request);

        $this->emailIsValid($request->email ?? '');
        $this->stringIsValid(
            $request->password ?? '',
            'password');

        return true;
    }

    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateQueryBilling($request)
    {
        if (isset($request['date']) && !empty($request['date']))
            $this->dateIsValid($request['date']);

        if (isset($request['cityId']) && !empty($request['cityId']))
            $this->cityIdIsValid($request['cityId']);

        if (isset($request['driverId']) && !empty($request['driverId']))
            $this->isNumber($request['driverId'],
                'O campo driverId está inválido');

        if (isset($request['customerUserId']) && !empty($request['customerUserId']))
            $this->isNumber($request['customerUserId'],
                'O campo customerUserId está inválido');

        return true;
    }

    /**
     * @param $date
     * @throws Exception
     */
    private function dateIsValid($date)
    {
        $this->stringIsValid($date, 'date');

        $dates = explode(',', $date);

        if (count($dates) < 2)
            throw new Exception("O campo date está inválido");
    }

}