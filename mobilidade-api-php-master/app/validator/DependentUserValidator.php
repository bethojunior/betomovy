<?php

namespace app\validator;

use app\validator\contracts\Validator;
use Exception;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 11/12/2019
 * Time: 10:46
 */
class DependentUserValidator extends Validator
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
            $request->relationship ?? '', 'parentesco');

        return true;
    }

    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateDelete($request)
    {
        $this->requestIsNotEmpty($request);

        $this->isNumber(
            $request->dependentUserId ?? '', "O dependente não pôde ser localizado");

        return true;
    }
}