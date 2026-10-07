<?php

namespace app\validator;

use app\validator\contracts\Validator;

use Exception;
/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 12/07/2019
 * Time: 17:26
 */
class CompanyValidator extends Validator
{
    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateRegisterCompany($request)
    {
        $this->requestIsNotEmpty($request);

        $this->stringIsValid($request->fantasyName ?? '',
            'fantasyName');
        $this->stringIsValid($request->address ?? '',
            'address');
        $this->stringIsValid($request->document ?? '',
            'document');
        $this->isNumber($request->cityId ?? '',
            'O campo cityId deve ser válido');
        $this->emailIsValid($request->email ?? '');
        $this->stringIsValid($request->phone ?? '',
            'phone');
        $this->latitudeIsValid($request->latitude ?? '');
        $this->longitudeIsValid($request->longitude ?? '');

        $companyWorker = $request->companyWorker ?? null;

        $this->stringIsValid($companyWorker->name ?? '',
            'companyWorker.name');
        $this->stringIsValid($companyWorker->nickname ?? '',
            'companyWorker.nickname');
        $this->stringIsValid($companyWorker->document ?? '',
            'companyWorker.document');
        $this->stringIsValid($companyWorker->phone ?? '',
            'companyWorker.phone');
        $this->emailIsValid($companyWorker->email ?? '');
        $this->stringIsValid($companyWorker->password ?? '',
            'companyWorker.password');

        return true;
    }

    /**
     * @param $requestQuery
     * @return bool
     * @throws Exception
     */
    public function validateCheckField($requestQuery)
    {
        $this->requestIsNotEmpty($requestQuery);

        $this->stringIsValid($requestQuery->field ?? '', 'field');

        if (!in_array($requestQuery->field, ['document', 'phone', 'email']))
            throw new Exception("O campo " . $requestQuery->field . " não é válido");

        $this->stringIsValid($requestQuery->value ?? '', 'value');

        return true;
    }
}