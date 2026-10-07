<?php

namespace app\validator;

use app\constant\AppSharingConst;
use app\exceptions\AppSharingException;
use app\validator\contracts\Validator;
use Exception;

/**
 * Created by PhpStorm.
 * User: Eduardo Roseo
 * Date: 21/05/2019
 * Time: 13:43
 */
class AppSharingValidator extends Validator
{
    /**
     * @param $request
     * @return bool
     * @throws Exception
     */
    public function validateInsert($request)
    {
        $this->requestIsNotEmpty($request);

        $this->isNumber(
            $request->userId ?? '',
            "userId deve ser um inteiro");

        if (isset($request->phone))
            $this->stringIsValid(
                $request->phone ?? '',
                'phone');

        if (isset($request->formOfSharing))
            $this->formOfSharingIsValid(
                $request->formOfSharing ?? '');

        $this->isNumber(
            $request->appId ?? '',
            "appId deve ser um inteiro");

        $this->latitudeIsValid(
            $request->location->latitude ?? '',
            "location.latitude");

        $this->longitudeIsValid(
            $request->location->longitude ?? '',
            'location.longitude'
        );

        return true;
    }

    /**
     * @param $formOfSharing
     * @throws AppSharingException
     * @throws Exception
     */
    private function formOfSharingIsValid($formOfSharing)
    {
        $this->stringIsValid($formOfSharing ?? '', 'formOfSharing');

        if (!in_array($formOfSharing, AppSharingConst::FORM_OF_SHARING))
            throw new AppSharingException(1480, ['formsOfSharing' => AppSharingConst::FORM_OF_SHARING]);
    }
}